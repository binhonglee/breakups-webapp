import React, { Component } from 'react';

class People extends Component {
    constructor() {
        super();
        this.state = {
            space: `\t`
        }
    }

    render() {
        return (
            <div className="People">
                Person {this.props.people}<br/>
                <form style={{textAlign:'left'}}>
                    Name:{this.state.space}<input type = "text" ref="name" onBlur={this.updateProps.bind(this)} style={{float:'right'}}/><br/>
                    Email:{this.state.space}<input type = "text" ref="email" onBlur={this.updateProps.bind(this)} style={{float:'right'}}/><br/>
                    Amount:{this.state.space}<input type = "text" ref="amount" onBlur={this.updateProps.bind(this)} style={{float:'right'}}/><br/>
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