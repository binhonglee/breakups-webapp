import React, { Component } from 'react';

class People extends Component {
    render() {
        return (
            <div className="People">
                <p style={{'line-height': '0.5em'}}>Person {this.props.people} <br/></p>
                <form style={{textAlign:'left'}}>
                    Name: <input type = "text" ref="name" onBlur={this.updateProps.bind(this)} style={{float:'right', width: 100}}/><br/>
                    Email: <input type = "text" ref="email" onBlur={this.updateProps.bind(this)} style={{float:'right', width: 100}}/><br/>
                    Amount: <input type = "text" ref="amount" onBlur={this.updateProps.bind(this)} style={{float:'right', width: 100}}/><br/>
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
