import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../../pages/index'

vi.mock('../../lib/calculator', () => ({
  calculateOptimalPaymentChain: vi.fn((users) => {
    if (users.length === 3 && users[0].name === 'Alice') {
      return [{ from: 'Bob', to: 'Alice', amount: 50 }]
    }
    return []
  })
}))

describe('Home', () => {
  it('renders main heading', () => {
    render(<Home />)

    expect(screen.getByText('Breakups')).toBeInTheDocument()
  })

  it('renders initial form', () => {
    render(<Home />)

    expect(screen.getByText(/number of people/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('shows error for invalid number of people', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<Home />)

    const input = screen.getByDisplayValue('')
    const submitBtn = screen.getByRole('button', { name: /submit/i })

    await user.type(input, '2')
    await user.click(submitBtn)

    expect(alertSpy).toHaveBeenCalledWith('Please input number larger than 2!')

    alertSpy.mockRestore()
  })

  it('shows error for non-numeric input', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<Home />)

    const input = screen.getByDisplayValue('')
    const submitBtn = screen.getByRole('button', { name: /submit/i })

    await user.type(input, 'abc')
    await user.click(submitBtn)

    expect(alertSpy).toHaveBeenCalledWith('Please input number larger than 2!')

    alertSpy.mockRestore()
  })

  it('creates person forms for valid input', async () => {
    const user = userEvent.setup()

    render(<Home />)

    const input = screen.getByDisplayValue('')

    await user.type(input, '3')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(screen.getByText('Person 1')).toBeInTheDocument()
    expect(screen.getByText('Person 2')).toBeInTheDocument()
    expect(screen.getByText('Person 3')).toBeInTheDocument()
  })

  it('shows payment chain button after adding people', async () => {
    const user = userEvent.setup()

    render(<Home />)

    const input = screen.getByDisplayValue('')
    const submitBtn = screen.getByRole('button', { name: /submit/i })

    await user.type(input, '3')
    await user.click(submitBtn)

    expect(screen.getByRole('button', { name: /get payment chain/i })).toBeInTheDocument()
  })

  it('validates empty fields when calculating payment chain', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<Home />)

    const input = screen.getByDisplayValue('')
    const submitBtn = screen.getByRole('button', { name: /submit/i })

    await user.type(input, '3')
    await user.click(submitBtn)

    const paymentBtn = screen.getByRole('button', { name: /get payment chain/i })
    await user.click(paymentBtn)

    expect(alertSpy).toHaveBeenCalledWith('Please fill in all fields!')

    alertSpy.mockRestore()
  })

  it('validates non-numeric amounts', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<Home />)

    const input = screen.getByDisplayValue('')
    const submitBtn = screen.getByRole('button', { name: /submit/i })

    await user.type(input, '3')
    await user.click(submitBtn)

    const nameInputs = screen.getAllByPlaceholderText('Name')
    const amountInputs = screen.getAllByPlaceholderText('Amount')

    await user.type(nameInputs[0], 'Alice')
    await user.type(nameInputs[1], 'Bob')
    await user.type(amountInputs[1], '50')
    await user.type(nameInputs[2], 'Charlie')
    await user.type(amountInputs[2], '25')

    const paymentBtn = screen.getByRole('button', { name: /get payment chain/i })
    await user.click(paymentBtn)

    expect(alertSpy).toHaveBeenCalledWith('Please fill in all fields!')

    alertSpy.mockRestore()
  })

  it('renders footer with links', () => {
    render(<Home />)

    expect(screen.getByText(/created by/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /@binhonglee/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })
})