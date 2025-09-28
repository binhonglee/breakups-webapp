import React from 'react';

interface PaymentData {
  from: string;
  to: string;
  amount: number;
}

interface PaymentProps {
  payment: PaymentData;
}

export default function Payment({ payment }: PaymentProps): React.JSX.Element {
  return (
    <div className="Payment">
      {payment && (
        <p className="payment-text">
          <strong>{payment.from}</strong> pays <strong>{payment.to}</strong>: <span className="amount">${payment.amount.toFixed(2)}</span>
        </p>
      )}
    </div>
  );
}