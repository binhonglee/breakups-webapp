import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Payment from '../../components/Payment'

describe('Payment', () => {
  it('renders payment information correctly', () => {
    const payment = {
      from: 'Alice',
      to: 'Bob',
      amount: 25.50
    }

    render(<Payment payment={payment} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('$25.50')).toBeInTheDocument()
    expect(screen.getByText(/pays/)).toBeInTheDocument()
  })

  it('formats amount with two decimal places', () => {
    const payment = {
      from: 'Charlie',
      to: 'David',
      amount: 100
    }

    render(<Payment payment={payment} />)

    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('handles small amounts correctly', () => {
    const payment = {
      from: 'Eve',
      to: 'Frank',
      amount: 0.01
    }

    render(<Payment payment={payment} />)

    expect(screen.getByText('$0.01')).toBeInTheDocument()
  })

  it('displays complete payment sentence', () => {
    const payment = {
      from: 'Alice',
      to: 'Bob',
      amount: 50.75
    }

    render(<Payment payment={payment} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('$50.75')).toBeInTheDocument()
    expect(screen.getByText(/pays/)).toBeInTheDocument()
  })

  it('handles names with spaces', () => {
    const payment = {
      from: 'John Doe',
      to: 'Jane Smith',
      amount: 15.25
    }

    render(<Payment payment={payment} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('$15.25')).toBeInTheDocument()
  })

  it('handles large amounts', () => {
    const payment = {
      from: 'Alex',
      to: 'Sam',
      amount: 9999.99
    }

    render(<Payment payment={payment} />)

    expect(screen.getByText('$9999.99')).toBeInTheDocument()
  })
})