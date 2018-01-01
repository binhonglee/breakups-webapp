import React, { Component } from 'react';

class People extends Component {
    render() {
        return (
            <div className="People">
                <p className="personNum">Person {this.props.people} <br/></p>
                <form style={{textAlign:'left'}}>
                    <p>Name: <input className="personInput" type = "text" ref="name" onBlur={this.updateProps.bind(this)}/><br/></p>
                    <p>Email: <input className="personInput" type = "text" ref="email" onBlur={this.updateProps.bind(this)}/><br/></p>
                    <p>Amount: <input className="personInput" type = "text" ref="amount" onBlur={this.updateProps.bind(this)}/><br/></p>
                </form>
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
