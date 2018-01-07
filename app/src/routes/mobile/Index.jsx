import React, { Component } from 'react';

import daftPunkSmall from '../../img/small/daft-punk.jpg';

import tangoTable from '../../img/tango-table.svg';
import phone from '../../img/phone.svg';

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
    let specList = [];

    for (var i = 0; i < 12; i++) {
      specList[i] = <div key={ i } className="spec-container">
        <div className="high spec"></div>
        <div className="middle spec"></div>
        <div className="low spec"></div>
      </div>
    }

    return (
      <div id="mobile">
        <main>
          <div id="welcome" className="view">
            <figure className="cover-bg"></figure>

            <figure className="circle left"></figure>
            <figure className="circle right"></figure>

            <div className="content">
              <h3>Welcome to TangoTable</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <a className="rounded-button">Let's start</a>
            </div>
          </div>

          <div id="library" className="view">
            <header>
              <h1>Library</h1>
              <p>Select a track from the list below. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.</p>
            </header>

            <div className="track-group">
              <div className="track">
                <figure className="cover">
                  <img src={ daftPunkSmall } />
                </figure>

                <div className="info">
                  <h5>All Night</h5>
                  <p>Chance The Rapper</p>
                </div>
              </div>
              
              <div className="track">
                <figure className="cover">
                  <img src={ daftPunkSmall } />
                </figure>

                <div className="info">
                  <h5>All Night</h5>
                  <p>Chance The Rapper</p>
                </div>
              </div>

              <div className="track">
                <figure className="cover">
                  <img src={ daftPunkSmall } />
                </figure>

                <div className="info">
                  <h5>All Night</h5>
                  <p>Chance The Rapper</p>
                </div>
              </div>
            </div>
          </div>

          <div id="waiting" className="view">
            <figure className="cover">
            </figure>

            <figure className="circle left"></figure>
            <figure className="circle right"></figure>

            <div className="content">
              <div className="info">
                <h3>Start playing music</h3>
                <p>Place your phone on the table to start playing music, move your phone vertically to adjust the volume and lift your phone to pause the music.</p>
              </div>
            </div>

            <figure className="illustration">
              <img className="phone" src={ phone } />
              <img src={ tangoTable } />
            </figure>
          </div>

          <div id="music-player" className="view">
            <figure className="cover">
              <div ref={ (waveform) => { this.waveform = waveform; } } id="waveform">{ specList }</div>
            </figure>

            <div className="content">
              <div className="info">
                <h1>Around the World</h1>
                <h4>Daft punk</h4>

                <a class="rounded-button">Change SONG</a>
              </div>

              <h5>Lift your phone to pause the music</h5>

              <h5 ref={ (timestamp) => { this.timestampCurrent = timestamp; } } className="time-stamp current">02:50</h5>
              <h5 ref={ (timestamp) => { this.timestampEnd = timestamp; } } className="time-stamp end">02:50</h5>

              <div className="progress-bar">
                <div ref={ (bar) => { this.progressBar = bar; } } className="progress-fill"></div>
              </div>
            </div>

            <figure className="illustration">
              <img src={ daftPunkSmall } />
            </figure>
          </div>
        </main>
      </div>
    );
  }
}

export default Mobile;
