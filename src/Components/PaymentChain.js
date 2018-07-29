import React, { Component } from 'react';
import Payment from './Payment';

class PaymentChain extends Component {
    render() {
        let payments;
        if (this.props.paymentChain) {
            payments = this.props.paymentChain.map(payment => {
                return (
                    <Payment key={payment.from} payment={payment} />
                );
            });
        }

        return (
            <div className="PaymentChain">
                {payments}
                <br/>
            </div>
        );
    }
}

export default PaymentChain;
