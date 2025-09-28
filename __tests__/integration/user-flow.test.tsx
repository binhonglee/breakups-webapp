import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../../pages/index'

describe('Complete User Flow', () => {
  it('completes full payment calculation workflow', async () => {
    const user = userEvent.setup()

    render(<Home />)

    const numberOfPeopleInput = screen.getByRole('textbox')
    await user.type(numberOfPeopleInput, '3')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    const nameInputs = screen.getAllByPlaceholderText('Name')
    const amountInputs = screen.getAllByPlaceholderText('Amount')

    await user.type(nameInputs[0], 'Alice')
    await user.type(amountInputs[0], '100')

    await user.type(nameInputs[1], 'Bob')
    await user.type(amountInputs[1], '0')

    await user.type(nameInputs[2], 'Charlie')
    await user.type(amountInputs[2], '50')

    const calculateBtn = screen.getByRole('button', { name: /get payment chain/i })
    await user.click(calculateBtn)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/payment chain results/i)).toBeInTheDocument()
    }, { timeout: 1000 })

    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('handles equal amounts scenario', async () => {
    const user = userEvent.setup()

    render(<Home />)

    const numberOfPeopleInput = screen.getByRole('textbox')
    await user.type(numberOfPeopleInput, '3')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    const nameInputs = screen.getAllByPlaceholderText('Name')
    const amountInputs = screen.getAllByPlaceholderText('Amount')

    await user.type(nameInputs[0], 'Alice')
    await user.type(amountInputs[0], '50')

    await user.type(nameInputs[1], 'Bob')
    await user.type(amountInputs[1], '50')

    await user.type(nameInputs[2], 'Charlie')
    await user.type(amountInputs[2], '50')

    const calculateBtn = screen.getByRole('button', { name: /get payment chain/i })
    await user.click(calculateBtn)

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    }, { timeout: 1000 })

    expect(screen.getByText(/enter people and amounts/i)).toBeInTheDocument()
  })

  it('validates input and shows appropriate errors', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<Home />)

    const numberOfPeopleInput = screen.getByRole('textbox')
    await user.type(numberOfPeopleInput, '3')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    const nameInputs = screen.getAllByPlaceholderText('Name')
    const amountInputs = screen.getAllByPlaceholderText('Amount')

    await user.type(nameInputs[0], 'Alice')
    await user.type(nameInputs[1], 'Bob')
    await user.type(amountInputs[1], '50')
    await user.type(nameInputs[2], 'Charlie')
    await user.type(amountInputs[2], '25')

    const calculateBtn = screen.getByRole('button', { name: /get payment chain/i })
    await user.click(calculateBtn)

    expect(alertSpy).toHaveBeenCalledWith('Please fill in all fields!')

    alertSpy.mockRestore()
  })

  it('allows recalculation with different values', async () => {
    const user = userEvent.setup()

    render(<Home />)

    const numberOfPeopleInput = screen.getByRole('textbox')
    await user.type(numberOfPeopleInput, '3')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    const nameInputs = screen.getAllByPlaceholderText('Name')
    const amountInputs = screen.getAllByPlaceholderText('Amount')

    await user.type(nameInputs[0], 'Alice')
    await user.type(amountInputs[0], '100')
    await user.type(nameInputs[1], 'Bob')
    await user.type(amountInputs[1], '0')
    await user.type(nameInputs[2], 'Charlie')
    await user.type(amountInputs[2], '50')

    let calculateBtn = screen.getByRole('button', { name: /get payment chain/i })
    await user.click(calculateBtn)

    await waitFor(() => {
      expect(screen.getByText(/payment chain results/i)).toBeInTheDocument()
    }, { timeout: 1000 })

    await user.clear(amountInputs[1])
    await user.type(amountInputs[1], '200')

    calculateBtn = screen.getByRole('button', { name: /get payment chain/i })
    await user.click(calculateBtn)

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })
})