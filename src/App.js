import React, { Component } from 'react';
import People from './Components/People';
import PaymentChain from './Components/PaymentChain';
import Message from './Components/Message';
import './App.css';
var https = require('https');
class App extends Component {
  constructor() {
    super();
    this.state = {
      peoples: [],
      info: [],
      paymentChain: [],
      actionButtons:[],
      showResults:false
    }
  }

  render() {
    return (
      <div className="App">
        <div className="Forms">
          <form className="Main-form" onSubmit={this.populatePeople.bind(this)} style={{height: '30px'}}>
            Number of people: <input type="text" ref="noOfPeople" style={{width: 30}}/> <input type="submit" value="Submit"/>
          </form>
          <div className="Peoples">
            {this.state.peoples}
          </div>
        </div>
        <br/>
        {this.state.actionButtons}
        {this.state.showResults ? <Message /> : <PaymentChain className="PaymentChain" paymentChain={this.state.paymentChain} /> }
        <br/>
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
    let existingState = this.state;
    existingState.showResults = true;
    this.setState(existingState);

    this.httpsPost(request, result => {
      let existingState = this.state;
      existingState.paymentChain = JSON.parse("[" + result + "]")[0];
      existingState.showResults = false;
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
      host:  'api.breakups.life',
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
