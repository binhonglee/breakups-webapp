import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PaymentChain from '../../components/PaymentChain'

vi.mock('@zumer/snapdom', () => ({
  snapdom: {
    toPng: vi.fn()
  }
}))

describe('PaymentChain', () => {
  it('renders empty state message when no payments', () => {
    render(<PaymentChain paymentChain={[]} />)

    expect(screen.getByText(/enter people and amounts to see payment chain/i)).toBeInTheDocument()
  })

  it('renders instruction message when empty but initialized', () => {
    render(<PaymentChain paymentChain={[]} />)

    expect(screen.getByText(/enter people and amounts to see payment chain/i)).toBeInTheDocument()
  })

  it('renders payment chain title when payments exist', () => {
    const payments = [
      { from: 'Alice', to: 'Bob', amount: 25.50 }
    ]

    render(<PaymentChain paymentChain={payments} />)

    expect(screen.getByText(/payment chain results/i)).toBeInTheDocument()
  })

  it('renders single payment correctly', () => {
    const payments = [
      { from: 'Alice', to: 'Bob', amount: 25.50 }
    ]

    render(<PaymentChain paymentChain={payments} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('$25.50')).toBeInTheDocument()
  })

  it('renders multiple payments correctly', () => {
    const payments = [
      { from: 'Alice', to: 'Bob', amount: 25.50 },
      { from: 'Charlie', to: 'Bob', amount: 10.00 },
      { from: 'David', to: 'Eve', amount: 15.25 }
    ]

    render(<PaymentChain paymentChain={payments} />)

    expect(screen.getByText(/payment chain results/i)).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getAllByText('Bob')).toHaveLength(2)
    expect(screen.getByText('Charlie')).toBeInTheDocument()
    expect(screen.getByText('David')).toBeInTheDocument()
    expect(screen.getByText('Eve')).toBeInTheDocument()
    expect(screen.getByText('$25.50')).toBeInTheDocument()
    expect(screen.getByText('$10.00')).toBeInTheDocument()
    expect(screen.getByText('$15.25')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    render(<PaymentChain paymentChain={[]} className="custom-class" />)

    const element = screen.getByText(/enter people and amounts/i).closest('.PaymentChain')
    expect(element).toHaveClass('custom-class')
  })

  it('handles payments with same names correctly', () => {
    const payments = [
      { from: 'Alice', to: 'Bob', amount: 25.50 },
      { from: 'Alice', to: 'Charlie', amount: 15.00 }
    ]

    render(<PaymentChain paymentChain={payments} />)

    const aliceElements = screen.getAllByText('Alice')
    expect(aliceElements).toHaveLength(2)
    expect(screen.getByText('$25.50')).toBeInTheDocument()
    expect(screen.getByText('$15.00')).toBeInTheDocument()
  })

  describe('Action Buttons', () => {
    let originalClipboard: Clipboard
    let originalCreateElement: HTMLDocument['createElement']
    let originalAlert: typeof window.alert
    let mockClipboard: { writeText: (data: string) => Promise<void>; }
    let mockDocument: any
    let mockAlert: typeof window.alert
    let mockConsoleError: any

    beforeEach(() => {
      originalClipboard = navigator.clipboard
      originalCreateElement = global.document.createElement
      originalAlert = global.alert

      mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
      Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true
      })

      const originalFunc = global.document.createElement
      mockDocument = vi.fn((tagName: string) => {
        if (tagName === 'a') {
          return {
            click: vi.fn(),
            download: '',
            href: ''
          }
        }
        return originalFunc.call(global.document, tagName)
      })
      global.document.createElement = mockDocument

      mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockAlert = vi.fn()
      global.alert = mockAlert
    })

    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true
      })
      global.document.createElement = originalCreateElement
      global.alert = originalAlert
      mockConsoleError?.mockRestore()
    })

    it('shows action buttons when payments exist', () => {
      const payments = [
        { from: 'Alice', to: 'Bob', amount: 25.50 }
      ]

      render(<PaymentChain paymentChain={payments} />)

      expect(screen.getByText('Save as Image')).toBeInTheDocument()
      expect(screen.getByText('Copy to Clipboard')).toBeInTheDocument()
    })

    it('does not show action buttons when no payments', () => {
      render(<PaymentChain paymentChain={[]} />)

      expect(screen.queryByText('Save as Image')).not.toBeInTheDocument()
      expect(screen.queryByText('Copy to Clipboard')).not.toBeInTheDocument()
    })

    it('calls copy to clipboard with correct text format', async () => {
      const payments = [
        { from: 'Alice', to: 'Bob', amount: 25.50 },
        { from: 'Charlie', to: 'Dave', amount: 10.00 }
      ]

      render(<PaymentChain paymentChain={payments} />)

      const copyButton = screen.getByText('Copy to Clipboard')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(
          'Payment Chain by breakups.life\n' +
          '=================================\n' +
          '\n' +
          '1. Alice pays Bob: $25.50\n' +
          '2. Charlie pays Dave: $10.00'
        )
      })

      expect(mockAlert).toHaveBeenCalledWith('Payment chain copied to clipboard!')
    })

    it('handles copy to clipboard errors gracefully', async () => {
      const payments = [
        { from: 'Alice', to: 'Bob', amount: 25.50 }
      ]

      mockClipboard.writeText = vi.fn().mockRejectedValue(new Error('Clipboard error'))
      render(<PaymentChain paymentChain={payments} />)

      const copyButton = screen.getByText('Copy to Clipboard')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error))
        expect(mockAlert).toHaveBeenCalledWith('Failed to copy to clipboard. Please try again.')
      })
    })

    it('calls save as image functionality', async () => {
      const payments = [
        { from: 'Alice', to: 'Bob', amount: 25.50 }
      ]
      const mockImg = { src: 'data:image/png;base64,mock' } as HTMLImageElement
      const { snapdom } = await import('@zumer/snapdom')
      vi.mocked(snapdom.toPng).mockResolvedValue(mockImg)

      const mockLink = {
        click: vi.fn(),
        download: '',
        href: ''
      }
      mockDocument.mockImplementation((tagName: string) => {
        if (tagName === 'a') {
          return mockLink
        }
        return originalCreateElement.call(global.document, tagName)
      })

      render(<PaymentChain paymentChain={payments} />)

      const saveButton = screen.getByText('Save as Image')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(snapdom.toPng).toHaveBeenCalled()
        expect(mockLink.download).toBe('payment-chain.png')
        expect(mockLink.href).toBe('data:image/png;base64,mock')
        expect(mockLink.click).toHaveBeenCalled()
      })
    })

    it('handles save as image errors gracefully', async () => {
      const payments = [
        { from: 'Alice', to: 'Bob', amount: 25.50 }
      ]
      const { snapdom } = await import('@zumer/snapdom')
      vi.mocked(snapdom.toPng).mockRejectedValue(new Error('Image generation error'))

      render(<PaymentChain paymentChain={payments} />)

      const saveButton = screen.getByText('Save as Image')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Failed to save image:', expect.any(Error))
        expect(mockAlert).toHaveBeenCalledWith('Failed to save image. Please try again.')
      })
    })

    it('formats currency amounts correctly in clipboard text', async () => {
      const payments = [
        { from: 'Alice', to: 'Bob', amount: 25.5 },
        { from: 'Charlie', to: 'Dave', amount: 10 },
        { from: 'Eve', to: 'Frank', amount: 7.333 }
      ]

      render(<PaymentChain paymentChain={payments} />)

      const copyButton = screen.getByText('Copy to Clipboard')
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(
          'Payment Chain by breakups.life\n' +
          '=================================\n' +
          '\n' +
          '1. Alice pays Bob: $25.50\n' +
          '2. Charlie pays Dave: $10.00\n' +
          '3. Eve pays Frank: $7.33'
        )
      })
    })
  })
})