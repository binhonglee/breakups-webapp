import { describe, it, expect } from 'vitest'
import { calculateOptimalPaymentChain } from '../../lib/calculator'

describe('calculateOptimalPaymentChain', () => {
  it('calculates payment chain for simple case', () => {
    const users = [
      { name: 'Alice', amount: 100 },
      { name: 'Bob', amount: 0 },
      { name: 'Charlie', amount: 50 }
    ]

    const result = calculateOptimalPaymentChain(users)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      from: 'Bob',
      to: 'Alice',
      amount: 50
    })
  })

  it('handles equal amounts', () => {
    const users = [
      { name: 'Alice', amount: 50 },
      { name: 'Bob', amount: 50 },
      { name: 'Charlie', amount: 50 }
    ]

    const result = calculateOptimalPaymentChain(users)

    expect(result).toHaveLength(0)
  })

  it('handles complex multiple payments', () => {
    const users = [
      { name: 'Alice', amount: 100 },
      { name: 'Bob', amount: 20 },
      { name: 'Charlie', amount: 30 },
      { name: 'David', amount: 10 }
    ]

    const result = calculateOptimalPaymentChain(users)

    expect(result.length).toBeGreaterThan(0)

    const totalPayments = result.reduce((sum, payment) => sum + payment.amount, 0)
    expect(totalPayments).toBeCloseTo(60, 2)
  })

  it('handles rounding correctly', () => {
    const users = [
      { name: 'Alice', amount: 10.33 },
      { name: 'Bob', amount: 10.34 },
      { name: 'Charlie', amount: 10.33 }
    ]

    const result = calculateOptimalPaymentChain(users)

    expect(result).toHaveLength(0)
  })

  it('handles single user', () => {
    const users = [{ name: 'Alice', amount: 100 }]

    const result = calculateOptimalPaymentChain(users)

    expect(result).toHaveLength(0)
  })

  it('handles zero amounts', () => {
    const users = [
      { name: 'Alice', amount: 0 },
      { name: 'Bob', amount: 0 }
    ]

    const result = calculateOptimalPaymentChain(users)

    expect(result).toHaveLength(0)
  })

  it('handles large amounts', () => {
    const users = [
      { name: 'Alice', amount: 1000.00 },
      { name: 'Bob', amount: 500.00 },
      { name: 'Charlie', amount: 1500.00 }
    ]

    const result = calculateOptimalPaymentChain(users)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      from: 'Bob',
      to: 'Charlie',
      amount: 500
    })
  })

  it('filters out very small balances', () => {
    const users = [
      { name: 'Alice', amount: 10.001 },
      { name: 'Bob', amount: 10.003 },
      { name: 'Charlie', amount: 10.001 }
    ]

    const result = calculateOptimalPaymentChain(users)

    expect(result).toHaveLength(0)
  })
})