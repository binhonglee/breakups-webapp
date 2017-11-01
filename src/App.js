import React, { Component } from 'react';
import People from './Components/People';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      peoples: []
    }
  }

  render() {
    return (
      <div className="App">
        Breakups
        <br/>
        <br/>
        <form onSubmit={this.populatePeople.bind(this)}>
          Number of people: <input type="text" ref="noOfPeople"/> <input type="submit" value="Submit" />
        </form>
        <br/>
        <br/>
        {this.state.peoples}
        <input type="submit" value="Get Payment Chain"/>
        <input type="submit" value="Send email reminder"/>
      </div>
    );
  }

  populatePeople(e) {
    let peoples = []

    if (isNaN(this.refs.noOfPeople.value)) {
      alert('Please input number!');
    } else {
      for (var i = 0; i < this.refs.noOfPeople.value; i++) {
        peoples.push (<People key={i} people={(i+1)} />);
        this.setState({peoples:peoples});
      }  
    }
    
    e.preventDefault();
  }
}

export default App;
