import React, { Component } from 'react';

class People extends Component {
    render() {
        return (
            <div className="People">
                <form className="form">
                    Person {this.props.people}<br/>
                    Name: <input type = "text" ref="name" onBlur={this.updateProps.bind(this)}/><br/>
                    Email: <input type = "text" ref="email" onBlur={this.updateProps.bind(this)}/><br/>
                    Amount: <input type = "text" ref="amount" onBlur={this.updateProps.bind(this)}/><br/>
                </form>
                <br/>
            </div>
        );
    }

    updateProps() {
        let req = {
            name: this.refs.name.value,
            email: this.refs.email.value,
            amount: this.refs.amount.value
        };
        let infoToSend = {
            id: this.props.id,
            info: req
        }
        this.props.info(infoToSend);
    }
}

export default People;