import React, { Component } from 'react';

class Payment extends Component {
    render() {
        return (
            <div className="Payment">
                <br/>
                {this.props.payment.from} ----{this.props.payment.amount}----> {this.props.payment.to}
            </div>
        )
    }
}

export default Payment;