import React, { Component } from 'react';

class People extends Component {
    render() {
        return (
            <div className="People">
                <form className="form">
                    Person {this.props.people}<br/>
                    Name: <input type = "text" ref="name"/><br/>
                    Email: <input type = "text" ref="email"/><br/>
                    Amount: <input type = "text" ref="amount"/><br/>
                </form>
                <br/>
            </div>
        );
    }
}

export default People;