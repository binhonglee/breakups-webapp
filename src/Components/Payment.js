import React, { Component } from 'react';

class Payment extends Component {
    render() {
        return (
            <div className="Payment">
                <br/>
                {this.props.payment.from} -> {this.props.payment.to}<br/>
                Amount: {parseFloat(this.props.payment.amount).toFixed(2)}
            </div>
        )
    }
}

export default Payment;