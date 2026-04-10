import React, { useRef } from 'react';
import Payment from './Payment';
import { snapdom } from '@zumer/snapdom';

interface PaymentData {
  from: string;
  to: string;
  amount: number;
}

interface PaymentChainProps {
  paymentChain: PaymentData[];
  className?: string;
}

export default function PaymentChain({ paymentChain, className }: PaymentChainProps): React.JSX.Element {
  const paymentChainRef = useRef<HTMLDivElement>(null);

  let payments: React.JSX.Element[] | undefined;
  if (paymentChain && paymentChain.length > 0) {
    payments = paymentChain.map((payment, index) => {
      return (
        <Payment key={`${payment.from}-${payment.to}-${index}`} payment={payment} />
      );
    });
  }

  const saveAsImage = async (): Promise<void> => {
    if (!paymentChainRef.current) return;

    try {
      const img = await snapdom.toPng(paymentChainRef.current);
      const showSaveFilePicker = (window as Window & {
        showSaveFilePicker?: (...args: unknown[]) => Promise<FileSystemFileHandle>;
      }).showSaveFilePicker;

      if (typeof showSaveFilePicker === 'function') {
        const fileHandle = await showSaveFilePicker({
          suggestedName: 'payment-chain.png',
          types: [
            {
              description: 'PNG Images',
              accept: {
                'image/png': ['.png'],
              },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        const response = await fetch(img.src);
        const blob = await response.blob();

        await writable.write(blob);
        await writable.close();
      } else {
        const link = document.createElement('a');
        link.download = 'payment-chain.png';
        link.href = img.src;
        link.click();
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the save dialog
        return;
      }
      console.error('Failed to save image:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    if (!paymentChain || paymentChain.length === 0) return;

    try {
      const textLines = [
        'Payment Chain by breakups.life',
        '=================================',
        ''
      ];

      paymentChain.forEach((payment, index) => {
        textLines.push(`${index + 1}. ${payment.from} pays ${payment.to}: $${payment.amount.toFixed(2)}`);
      });

      const textContent = textLines.join('\n');
      await navigator.clipboard.writeText(textContent);
      alert('Payment chain copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
  };

  return (
    <>
      <div className={`PaymentChain ${className || ''}`} ref={paymentChainRef}>
        {paymentChain && paymentChain.length > 0 ? (
          <>
            <div className="payments-title">Payment Chain Results</div>
            {payments}
          </>
        ) : (
          <div className="no-payments">
            Enter people and amounts to see payment chain.
          </div>
        )}
      </div>

      {paymentChain && paymentChain.length > 0 && (
        <div className="buttons-container">
          <button
            className="action-button copy-button"
            onClick={copyToClipboard}
            type="button"
          >
            Copy to Clipboard
          </button>
          <button
            className="action-button"
            onClick={saveAsImage}
            type="button"
          >
            Save as Image
          </button>
        </div>
      )}
    </>
  );
}
