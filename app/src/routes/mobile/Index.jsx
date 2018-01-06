import React, { Component } from 'react';

import '../../css/mobile.css';

class Mobile extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  
  componentDidMount() {
    var wsAdress = "ws://localhost:1234";
    //number of decimal places wanted, used with Number.toFixed(x) for Javascrip 1.5+
    var decPlaces = 2;

    //interval in millsec for how quickly the measurements get sent
    var timer = timer;
    var interval = 100;

    //the event handler for MotionEvent
    var playing = 0;

    var ws = null;
    
    if('WebSocket' in window) {
      ws = new WebSocket(wsAdress);
        
      ws.onopen = function() {
        console.log("connection established");
      };
      
      ws.onclose = function(evt) {
       console.log("Connection closed");
       clearInterval(timer);
       timer = null;
      };
      
      ws.onerror = function(evt) {
        if(ws) console.log("Error: " + evt.data);
        else console.log("Cannot connect to server");
      };
      
      ws.onmessage = function(evt) {
        var msg = JSON.parse(evt.data);
        this.setState(msg);
      }.bind(this);
      
    } else {
      alert("Your browser does not support the WebSockets API");
    }
  }

  render() {
    let { position, waveform } = this.state;

    let waveformList = null;
    if (waveform) {
      waveformList = [];

      for (var i = 0; i <= Math.min(64, waveform.length); i++) {
        let wave = waveform[i]
        waveformList[i] = <div style={{ width: '10px', borderRadius: '5px 5px 0px 0px', height: wave, background:'#222' }}></div>

      }
    }

    return (
      <div id="mobile">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <div className="waveform" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '300px', paddingLeft: '30px', paddingRight: '30px' }}>
          { waveformList }
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ width: '100%', height: '10px', background: '#f0f1f5' }}>
            <div style={{ width: `${position * 100}%`, height: '100%', background:'#222' }}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Mobile;
