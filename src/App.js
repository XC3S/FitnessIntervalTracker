import './App.css';
import React from 'react';
import audio from './sounds/440.mp3';
import audio_hight from './sounds/760.mp3';

class App extends React.Component {

  intervals = [{
    name: 'Training',
    duration: 30,
    restDuration: 10,
    rounds: 1000
  }];

  constructor(props) {
    super(props);
    this.state = {
      running: false,
      currentName: '',
      nextTimeStamp: null,
      resting: false,
      currentRound: 0,
      displayTime: '',
      beepStage: 0
    };

    this.tick();
  }

  render() {
    const { running, currentName, nextTimeStamp, currentRound } = this.state;

    if(!running){
      return <>
        <button className='start-btn' onClick={() => this.start()}>Start</button>
      </>;
    }
    else {
      return <>
        <div className='training'>
          <h2 className='title'>{ currentName }</h2>
          <p className='time'>{this.timerDiff(nextTimeStamp)}</p>
          <h4 className='set'>Set: {currentRound + 1}</h4>
        </div>
        <button className='stop-btn' onClick={ () => this.stop()}>Stop</button>
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

      // first beep
      if(diff == 3 && this.state.beepStage == 0 && this.state.resting){
        this.playAudio();
        this.setState({
          beepStage: 1
        });
      }

      // second beep
      if(diff == 2 && this.state.beepStage == 1 && this.state.resting){
        this.playAudio();
        this.setState({
          beepStage: 2
        });
      }

      // third beep
      if(diff == 1 && this.state.beepStage == 2 && this.state.resting){
        this.playAudio();
        this.setState({
          beepStage: 3
        });
      }

      // final beep
      if(diff == 0 && this.state.beepStage == 3 && this.state.resting){
        this.playAudioHight();
        this.setState({
          beepStage: 4
        });
      }      

      // end training beep
      if(diff == 0 && this.state.beepStage == 4 && !this.state.resting){
        this.playAudio();
        this.setState({
          beepStage: 0
        });
      }      



    }
    requestAnimationFrame(() => this.tick());
  }

  playAudio = () => {
    new Audio(audio).play();
  }

  playAudioHight = () => {
    new Audio(audio_hight).play();
  }

  next(){
    const { currentRound, resting } = this.state;
    const interval = this.intervals[0];

    if(resting){
      this.setState({
        currentName: interval.name,
        nextTimeStamp: Date.now() + interval.duration * 1000 + 500,
        resting: false
      });
    }
    else if(currentRound < interval.rounds - 1){
      const name = currentRound < 0 ? 'Ready?' : 'Rest';

      this.setState({
        currentName: name,
        nextTimeStamp: Date.now() + interval.restDuration * 1000 + 500,
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

  stop(){
    this.setState({
      running: false
    });
  }

  start() {
    this.setState({
      running: true,
      currentName: '',
      nextTimeStamp: Date.now(),
      currentRound: -1
    });
  }

  // return remaining time in seconds
  timerDiff(nextTimeStamp) {
    return Math.round((nextTimeStamp - Date.now()) / 1000);
  }
}

export default App;
