import React, { Component } from 'react';

import { WS_SERVER } from '../../data/constants';

import daftPunkLarge from '../../img/large/daft-punk.jpg';
import daftPunkSmall from '../../img/small/daft-punk.jpg';

import horizontalArrow from '../../img/horizontal-arrow.svg';
import verticalArrow from '../../img/vertical-arrow.svg';
import turnArrow from '../../img/turn-arrow.svg';
import speakerIcon from '../../img/speaker-icon.svg';

import desktopFooter from '../../img/desktop-footer.svg';

import '../../css/desktop.css';

const LARGE_BAR_DASH_WIDTH = 402.12;
const SMALL_BAR_DASH_WIDTH = 201.06;

class Desktop extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.specLowList = [];
    this.specMiddleList = [];
    this.specHighList = [];
  }
  
  componentDidMount() {
    let specList = this.waveform.children    

    for (var i = 0; i < specList.length; i++) {
      let specChildren = specList[i].children;

      this.specHighList[i] = specChildren[0];
      this.specMiddleList[i] = specChildren[1];
      this.specLowList[i] = specChildren[2];
    }



    var ws = null;
    if('WebSocket' in window) {
      ws = new WebSocket(WS_SERVER);
        
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
        let { id, length, position, playing, filter, echo, flange, tempo, volume, waveform } = JSON.parse(evt.data);

        this.phoneFiducial.dataset.active = !!playing;
        this.echoFiducial.dataset.active = !!echo.active;
        this.filterFiducial.dataset.active = !!filter.active;
        this.flangerFiducial.dataset.active = !!flange.active;

        this.volumeBar.style.height = `${ volume * 100 }%`;

        this.bpmBar.style.strokeDasharray = `${ tempo * LARGE_BAR_DASH_WIDTH }, 502.65`;
        this.filterBar.style.strokeDasharray = `${ filter.frequency_value * LARGE_BAR_DASH_WIDTH }, 502.65`;
        this.echoBar.style.strokeDasharray = `${ echo.delay_value * LARGE_BAR_DASH_WIDTH }, 502.65`;
        this.flangerRateBar.style.strokeDasharray = `${ flange.rate_value * SMALL_BAR_DASH_WIDTH }, 251.33`;
        this.flangerDepthBar.style.strokeDasharray = `${ flange.depth_value * SMALL_BAR_DASH_WIDTH }, 251.33`;

        this.progressBar.style.width = `${ position * 100 }%`;

        this.timestampCurrent.innerHTML = this.formatTimeString(Math.ceil(position * length));
        this.timestampEnd.innerHTML = this.formatTimeString(length);

        
        for (var i = 0; i < this.specHighList.length; i++) {
          this.specLowList[i].style.height = `${ waveform[i] * 3 }px`;
          this.specMiddleList[i].style.height = `${ waveform[i + 20] * 10 }px`;
          this.specHighList[i].style.height = `${ waveform[i + 40] * 15 }px`;
        }

      }.bind(this);
      
    } else {
      alert("Your browser does not support the WebSockets API");
    }
  }

  formatTimeString(time) {
    time = Math.ceil(time/1000);

    let minutes = Math.floor(time/60);
    let seconds = time%60;

    return (seconds > 9) ? `0${ minutes }:${ seconds }` : `0${ minutes }:0${ seconds }`;
  }

  render() {
    let specList = [];

    for (var i = 0; i < 20; i++) {
      specList[i] = <div key={ i } className="spec-container">
        <div className="high spec"></div>
        <div className="middle spec"></div>
        <div className="low spec"></div>
      </div>
    }

    return (
      <div id="desktop">
        <figure className="cover-bg">
          <img src={ daftPunkLarge } />
        </figure>

        <main className="flex-content">
          <div ref={ (waveform) => { this.waveform = waveform; } } id="waveform">{ specList }</div>

          <div ref={ (fiducial) => { this.phoneFiducial = fiducial; } } id="mobile" className="fiducial" data-active="false">
            <figure className="bg">
                <img src={ daftPunkSmall } />
            </figure>

            <figure className="volume">
              <figure ref={ (bar) => { this.volumeBar = bar; } } className="fill">
              </figure>

              <figure className="icon">
                <img src={ speakerIcon } />
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
                  <g ref={ (bar) => { this.bpmBar = bar; } } className="stroke" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.0, 502.65">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>
            </figure>

            <figure className="large interaction-icon">
              <img src={ verticalArrow } />
            </figure>

            <div className="info">
              <h3>BPM</h3>
              <p>Controls the tempo of the song</p>
            </div>
          </div>
          
          <div ref={ (fiducial) => { this.echoFiducial = fiducial; } } id="echo" className="fiducial" data-active="false">
            <figure className="fiducial-value">
              <svg className="bar" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="402.12">
                      <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>

              <svg className="fill" width="166px" height="166px" viewBox="0 0 166 166">
                  <g ref={ (bar) => { this.echoBar = bar; } } className="stroke" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.0, 502.65">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>
            </figure>

            <figure className="large interaction-icon">
              <img src={ turnArrow } />
            </figure>

            <div className="info">
              <h3>Echo</h3>
              <p>Controls the tempo of the song</p>
            </div>
          </div>
          
          <div ref={ (fiducial) => { this.filterFiducial = fiducial; } } id="low-pass" className="fiducial" data-active="false">
            <figure className="fiducial-value">
              <svg className="bar" width="166px" height="166px" viewBox="0 0 166 166">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="402.12">
                      <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>

              <svg className="fill" width="166px" height="166px" viewBox="0 0 166 166">
                  <g ref={ (bar) => { this.filterBar = bar; } } className="stroke" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.0, 502.65">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="6" transform="translate(83.000000, 83.000000) translate(-83.000000, -83.000000) " cx="83" cy="83" r="80"></circle>
                  </g>
              </svg>
            </figure>

            <figure className="large interaction-icon">
              <img src={ horizontalArrow } />
            </figure>

            <div className="info">
              <h3>Low Pass</h3>
              <p>Controls the tempo of the song</p>
            </div>
          </div>
          
          <div ref={ (fiducial) => { this.flangerFiducial = fiducial; } } id="flanger" className="fiducial" data-active="false">
            <figure id="flanger-rate-fiducial" className="small-fiducial-value">
              <svg className="bar" width="84px" height="84px" viewBox="0 0 84px 84px">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="201.06">
                    <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="4" transform="translate(42.000000, 42.000000) translate(-42.000000, -42.000000) " cx="42" cy="42" r="40"></circle>
                </g>
              </svg>

              <svg className="fill" width="84px" height="84px" viewBox="0 0 84px 84px">
                <g ref={ (bar) => { this.flangerRateBar = bar; } } className="stroke" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.0, 251.33">
                    <circle id="Oval-2" stroke="#E77D95" strokeWidth="4" transform="translate(42.000000, 42.000000) translate(-42.000000, -42.000000) " cx="42" cy="42" r="40"></circle>
                </g>
              </svg>

              <figure className="small interaction-icon">
                <img src={ turnArrow } />
              </figure>

              <h5>Rate</h5>
            </figure>

            <figure id="flanger-depth-fiducial" className="small-fiducial-value">
              <svg className="bar" width="84px" height="84px" viewBox="0 0 84px 84px">
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="201.06">
                    <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="4" transform="translate(42.000000, 42.000000) translate(-42.000000, -42.000000) " cx="42" cy="42" r="40"></circle>
                </g>
              </svg>

              <svg className="fill" width="84px" height="84px" viewBox="0 0 84px 84px">
                <g ref={ (bar) => { this.flangerDepthBar = bar; } } className="stroke" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.0, 251.33">
                    <circle id="Oval-2" stroke="#E77D95" strokeWidth="4" transform="translate(42.000000, 42.000000) translate(-42.000000, -42.000000) " cx="42" cy="42" r="40"></circle>
                </g>
              </svg>

              <figure className="small interaction-icon">
                <img src={ verticalArrow } />
              </figure>

              <h5>Depth</h5>
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

              <h4 ref={ (timestamp) => { this.timestampCurrent = timestamp; } } className="time-stamp current"></h4>
              <h4 ref={ (timestamp) => { this.timestampEnd = timestamp; } } className="time-stamp end"></h4>
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
