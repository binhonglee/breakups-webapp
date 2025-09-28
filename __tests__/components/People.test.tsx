import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import People from '../../components/People'

describe('People', () => {
  it('renders person input fields', () => {
    const mockUpdateInfo = vi.fn()

    render(<People id={0} updateInfo={mockUpdateInfo} />)

    expect(screen.getByText('Person 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument()
  })

  it('displays correct person number', () => {
    const mockUpdateInfo = vi.fn()

    render(<People id={2} updateInfo={mockUpdateInfo} />)

    expect(screen.getByText('Person 3')).toBeInTheDocument()
  })

  it('calls updateInfo when name is changed', async () => {
    const user = userEvent.setup()
    const mockUpdateInfo = vi.fn()

    render(<People id={0} updateInfo={mockUpdateInfo} />)

    const nameInput = screen.getByPlaceholderText('Name')
    await user.type(nameInput, 'Alice')

    expect(mockUpdateInfo).toHaveBeenCalledWith({
      id: 0,
      info: { name: 'Alice', amount: '' }
    })
  })

  it('calls updateInfo when amount is changed', async () => {
    const user = userEvent.setup()
    const mockUpdateInfo = vi.fn()

    render(<People id={0} updateInfo={mockUpdateInfo} />)

    const amountInput = screen.getByPlaceholderText('Amount')
    await user.type(amountInput, '100')

    expect(mockUpdateInfo).toHaveBeenCalledWith({
      id: 0,
      info: { name: '', amount: '100' }
    })
  })

  it('updates both fields correctly', async () => {
    const user = userEvent.setup()
    const mockUpdateInfo = vi.fn()

    render(<People id={1} updateInfo={mockUpdateInfo} />)

    const nameInput = screen.getByPlaceholderText('Name')
    const amountInput = screen.getByPlaceholderText('Amount')

    await user.type(nameInput, 'Bob')
    await user.type(amountInput, '50.25')

    expect(mockUpdateInfo).toHaveBeenLastCalledWith({
      id: 1,
      info: { name: 'Bob', amount: '50.25' }
    })
  })

  it('handles empty inputs', async () => {
    const user = userEvent.setup()
    const mockUpdateInfo = vi.fn()

    render(<People id={0} updateInfo={mockUpdateInfo} />)

    const nameInput = screen.getByPlaceholderText('Name')
    await user.type(nameInput, 'Test')
    await user.clear(nameInput)

    expect(mockUpdateInfo).toHaveBeenLastCalledWith({
      id: 0,
      info: { name: '', amount: '' }
    })
  })

  it('has correct input types', () => {
    const mockUpdateInfo = vi.fn()

    render(<People id={0} updateInfo={mockUpdateInfo} />)

    const nameInput = screen.getByPlaceholderText('Name')
    const amountInput = screen.getByPlaceholderText('Amount')

    expect(nameInput).toHaveAttribute('type', 'text')
    expect(amountInput).toHaveAttribute('type', 'number')
    expect(amountInput).toHaveAttribute('step', '0.01')
  })
})