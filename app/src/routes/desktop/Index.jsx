import React, { Component } from 'react';

import daftPunkSmall from '../../img/small/daft-punk.jpg';

import desktopFooter from '../../img/desktop-footer.svg';

import '../../css/desktop.css';

const LARGE_BAR_DASH_WIDTH = 402.12;


const MIN_TEMPO = 0.0;
const MAX_TEMPO = 2;

class Desktop extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.data = {}
  }
  
  componentDidMount() {
    var wsAdress = "ws://localhost:1234";

    var ws = null;
    
    if('WebSocket' in window) {
      ws = new WebSocket(wsAdress);
        
      ws.onopen = function() {
        console.log("connection established");
      };
      
      ws.onclose = function(evt) {
       console.log("Connection closed");
      };
      
      ws.onerror = function(evt) {
        if(ws) console.log("Error: " + evt.data);
        else console.log("Cannot connect to server");
      };
      
      ws.onmessage = function(evt) {
        let { position, tempo, volume, waveform } = JSON.parse(evt.data);

        this.volumeBar.style.height = `${ volume * 100 }%`;

        this.bpmBar.style.strokeDasharray = `${ tempo * LARGE_BAR_DASH_WIDTH / MAX_TEMPO }, 502.65`;

        this.progressBar.style.width = `${ position * 100 }%`;

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
      <div id="desktop">
        <main className="flex-content">
          <div id="mobile" className="fiducial">
            <figure className="bg">
                <img src={ daftPunkSmall } />
            </figure>

            <figure className="volume">
              <figure ref={ (bar) => { this.volumeBar = bar; } } className="fill">
              </figure>
            </figure>
          </div>

          <div id="bpm" className="fiducial">
            <figure className="fiducial-value">
              <svg className="bar" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="402.12">
                      <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>

              <svg className="fill" width="166px" height="166px" viewBox="0 0 166 166">
                  <g ref={ (bar) => { this.bpmBar = bar; } } className="stroke" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="201.06, 502.65">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>
            </figure>

            <div className="info">
              <h3>BPM</h3>
              <p>Controls the tempo of the song</p>
            </div>
          </div>
          
          <div id="low-pass" className="fiducial">
            <figure className="fiducial-value">
              <svg className="bar" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="402.12">
                      <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>

              <svg className="fill" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="201.06, 502.65">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>
            </figure>

            <div className="info">
              <h3>Low Pass</h3>
              <p>Controls the tempo of the song</p>
            </div>
          </div>
          
          <div id="echo" className="fiducial">
            <figure className="fiducial-value">
              <svg className="bar" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="402.12">
                      <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>

              <svg className="fill" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="201.06, 502.65">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>
            </figure>

            <div className="info">
              <h3>Echo</h3>
              <p>Controls the tempo of the song</p>
            </div>
          </div>
          
          <div id="flanger" className="fiducial">
            <figure className="fiducial-value">
              <svg className="bar" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="402.12">
                      <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>

              <svg className="fill" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="201.06, 502.65">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>
            </figure>

            <div className="info">
              <h3>Flanger</h3>
              <p>Controls the tempo of the song</p>
            </div>
          </div>
        </main>

        <footer>
          <figure className="bg">
            <img src={desktopFooter} />
          </figure>

          <div className="flex-container">
            <div className="flex-content">
              <figure className="track-cover">
                <img src={ daftPunkSmall } />
              </figure>

              <div className="track-info">
                <h1>Get Lucky</h1>
                <h4>Daft punk</h4>
              </div>

              <h4 className="time-stamp current">02:50</h4>
              <h4 className="time-stamp end">03:20</h4>
            </div>

            <div className="progress-bar">
              <div ref={ (bar) => { this.progressBar = bar; } } className="progress-fill"></div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Desktop;
