import './App.css';
import React from 'react';

class App extends React.Component {

  intervals = [{
    name: 'Training',
    duration: 30,
    restDuration: 10,
    rounds: 3
  }];

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      currentName: '',
      nextTimeStamp: null,
      resting: false,
      currentRound: 0,
      displayTime: ''
    };

    this.tick();
  }

  render() {
    const { running, currentName, nextTimeStamp, currentRound } = this.state;

    if(!running){
      return <>
        <button onClick={() => this.start()}>start</button>
      </>;
    }
    else {
      return <>
        <h2>{ currentName }</h2>
        <p>{this.timerDiff(nextTimeStamp)}</p>
      </>;
    }
  }

  tick() {
    if(this.state.running){

      const diff = this.timerDiff(this.state.nextTimeStamp);

      if(diff <= 0){
        this.next();
      }

      this.setState({
        displayTime: diff
      });
    }
    requestAnimationFrame(() => this.tick());
  }

  next(){
    const { currentRound, resting } = this.state;
    const interval = this.intervals[0];

    if(resting){
      this.setState({
        currentName: interval.name,
        nextTimeStamp: Date.now() + interval.duration * 1000,
        resting: false
      });
    }
    else if(currentRound < interval.rounds - 1){
      this.setState({
        currentName: 'Rest',
        nextTimeStamp: Date.now() + interval.restDuration * 1000,
        resting: true,
        currentRound: currentRound + 1
      });
    }
    else {
      this.setState({
        running: false
      });
    }
  }

  start() {
    const interval = this.intervals[0]

    this.setState({
      running: true,
      currentName: interval.name,
      nextTimeStamp: Date.now() + interval.duration * 1000,
      currentRound: 0
    });
  }

  // return remaining time in seconds
  timerDiff(nextTimeStamp) {
    return Math.round((nextTimeStamp - Date.now()) / 1000);
  }
}

export default App;
