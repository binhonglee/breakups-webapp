import React, { Component } from 'react';
import People from './Components/People';
import PaymentChain from './Components/PaymentChain';
import './App.css';
var https = require('https');
class App extends Component {
  constructor() {
    super();
    this.state = {
      peoples: [],
      info: [],
      paymentChain: [],
      actionButtons:[]
    }
  }

  render() {
    return (
      <div className="App">
        <h3>Easy way to split bills among multiple people.</h3>
        <div className="Forms">
          <form className="Main-form" onSubmit={this.populatePeople.bind(this)}>
            Number of people: <input type="text" ref="noOfPeople"/> <input type="submit" value="Submit" />
          </form>
          <br/>
          <div className="Peoples">
            {this.state.peoples}
          </div>
        </div>
        {this.state.actionButtons}
        <PaymentChain className="PaymentChain" paymentChain={this.state.paymentChain} />
      </div>
    );
  }

  getPaymentChain() {
    let request = {};
    let users = [];
    for (var key in this.state.info) {
      if (isNaN(this.state.info[key].amount)) {
        alert('Amount must be number!');
        return;
      }
      let user = {};
      user.name = this.state.info[key].name;
      user.email = this.state.info[key].email;
      user.amount = parseInt(this.state.info[key].amount, 10);
      users.push(user);
    }
    request.users = users;

    this.httpsPost(request, result => {
      let existingState = this.state;
      existingState.paymentChain = JSON.parse("[" + result + "]")[0];
      this.setState(existingState);
    })
  }

  populatePeople(e) {
    let peoples = []
    let info = []

    if (isNaN(this.refs.noOfPeople.value) || this.refs.noOfPeople.value <= 2) {
      alert('Please input number larger than 2!');
    } else {
      for (var i = 0; i < this.refs.noOfPeople.value; i++) {
        info.push({});
        peoples.push(<People key={i} id={i} people={(i+1)} info={this.updateInfo.bind(this)} />);
      }

      let actionButtons = []
      actionButtons.push(<input key="paymentChain" type="submit" value="Get Payment Chain" onClick={this.getPaymentChain.bind(this)}/>);
      actionButtons.push(<input key="email" type="submit" value="Send email reminder (non-functional yet)"/>);
      this.setState({peoples:peoples, info:info, actionButtons:actionButtons});
    }
    
    e.preventDefault();
  }

  updateInfo(e) {
    let existingState = this.state;
    existingState.info[e.id] = e.info;
    this.setState(existingState);
  }

  httpsPost(data, callback) {
    var post_options = {
      host:  'breakups.herokuapp.com',
      path: '/paymentChain',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    };
    
    var post_req = https.request(post_options, res => {
      res.setEncoding('utf8');
      var returnData = "";
      res.on('data', chunk =>  {
        returnData += chunk;
      });
      res.on('end', () => {
        console.log(returnData)
        callback(returnData);
      });
    });
    post_req.write(JSON.stringify(data));
    post_req.end();
  }
}

export default App;
