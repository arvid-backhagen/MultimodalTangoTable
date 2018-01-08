import React, { Component } from 'react';

import { WS_SERVER } from '../../data/constants';
import { TRACKS } from '../../data/tracks';

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

    this.state = {
      activeTrackID : -1,
      input: 'fiducial',
      currentEffect: '',
    }

    this.specLowList = [];
    this.specMiddleList = [];
    this.specHighList = [];
  }
  
  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyPress.bind(this));

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
        let { activeTrackID, currentEffect, input } = this.state;
        let { id, length, position, playing, current_effect, fiducial, filter, echo, flange, bpm, volume, waveform } = JSON.parse(evt.data);

        if (activeTrackID !== id) {
          this.setState({ activeTrackID : id });
        }

        if (input === 'keyboard' && (currentEffect !== current_effect)) {
          console.log('changed to', current_effect)
          this.setState({ currentEffect : current_effect });
        }

        this.phoneFiducial.style.top = `${ fiducial.y *100 }%`;
        this.phoneFiducial.style.left = `${ fiducial.x *100 }%`;

        this.bpmFiducial.style.top = `${ bpm.fiducial.y *100 }%`;
        this.bpmFiducial.style.left = `${ bpm.fiducial.x *100 }%`;

        this.echoFiducial.style.top = `${ echo.fiducial.y *100 }%`;
        this.echoFiducial.style.left = `${ echo.fiducial.x *100 }%`;

        this.filterFiducial.style.top = `${ filter.fiducial.y *100 }%`;
        this.filterFiducial.style.left = `${ filter.fiducial.x *100 }%`;

        this.flangerFiducial.style.top = `${ flange.fiducial.y *100 }%`;
        this.flangerFiducial.style.left = `${ flange.fiducial.x *100 }%`;


        this.phoneFiducial.dataset.active = !!playing;
        this.bpmFiducial.dataset.active = !!bpm.active;
        this.echoFiducial.dataset.active = !!echo.active;
        this.filterFiducial.dataset.active = !!filter.active;
        this.flangerFiducial.dataset.active = !!flange.active;


        this.volumeBar.style.height = `${ volume * 100 }%`;
        this.bpmBar.style.strokeDasharray = `${ bpm.tempo * LARGE_BAR_DASH_WIDTH }, 502.65`;
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

  handleKeyPress(event) {
    if(event.code == 'Space'){
      let { input } = this.state;

      let newInput = (input === 'fiducial') ? 'keyboard' : 'fiducial';

      this.setState({ input : newInput })
    }
  }

  render() {
    let { activeTrackID, input, currentEffect } = this.state;


    let activeTrack = TRACKS[0];
    if (activeTrackID > 0) {
      activeTrack = TRACKS[activeTrackID]
    }


    let specList = [];
    for (var i = 0; i < 20; i++) {
      specList[i] = <div key={ i } className="spec-container">
        <div className="high spec"></div>
        <div className="middle spec"></div>
        <div className="low spec"></div>
      </div>
    }

    let echoInteractionIcon = (
      <figure className="large interaction-icon">
        <img src={ turnArrow } />
      </figure>
    )

    if (input === 'keyboard') {
      echoInteractionIcon = (
        <figure className="large interaction-icon">
          <img src={ verticalArrow } />
        </figure>
      )
    }

    let filterInteractionIcon = (
      <figure className="large interaction-icon">
       <img src={ horizontalArrow } />
      </figure>
    )

    if (input === 'keyboard') {
      filterInteractionIcon = (
        <figure className="large interaction-icon">
          <img src={ verticalArrow } />
        </figure>
      )
    }

    let flangerRateInteractionIcon = (
      <figure className="small interaction-icon">
       <img src={ turnArrow } />
      </figure>
    )

    if (input === 'keyboard') {
      flangerRateInteractionIcon = (
        <figure className="small interaction-icon">
          <img src={ verticalArrow } />
        </figure>
      )
    }

    let flangerDepthInteractionIcon = (
      <figure className="small interaction-icon">
       <img src={ verticalArrow } />
      </figure>
    )

    if (input === 'keyboard') {
      flangerDepthInteractionIcon = (
        <figure className="small interaction-icon">
          <img src={ horizontalArrow } />
        </figure>
      )
    }


    return (
      <div id="desktop" data-input={ input }>
        <div id="music-player">
          <figure className="cover-bg">
            <img src={ activeTrack.image_large } />
          </figure>

          <main className="flex-content">
            <div ref={ (waveform) => { this.waveform = waveform; } } id="waveform">{ specList }</div>

            <div ref={ (fiducial) => { this.phoneFiducial = fiducial; } } id="mobile" className="fiducial" data-active="false">
              <figure className="bg">
                  <img src={ activeTrack.image_small } />
              </figure>

              <figure className="volume">
                <figure ref={ (bar) => { this.volumeBar = bar; } } className="fill">
                </figure>

                <figure className="icon">
                  <img src={ speakerIcon } />
                </figure>
              </figure>
            </div>

            <div ref={ (fiducial) => { this.bpmFiducial = fiducial; } } id="bpm" className="fiducial" data-selected={ !!(currentEffect === 'bpm') }>
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
            
            <div ref={ (fiducial) => { this.echoFiducial = fiducial; } } id="echo" className="fiducial" data-active="false" data-selected={ !!(currentEffect === 'echo') }>
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

              { echoInteractionIcon }

              <div className="info">
                <h3>Echo</h3>
                <p>Controls the tempo of the song</p>
              </div>
            </div>
            
            <div ref={ (fiducial) => { this.filterFiducial = fiducial; } } id="low-pass" className="fiducial" data-active="false" data-selected={ !!(currentEffect === 'filter') }>
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

              { filterInteractionIcon }

              <div className="info">
                <h3>Low Pass</h3>
                <p>Controls the tempo of the song</p>
              </div>
            </div>
            
            <div ref={ (fiducial) => { this.flangerFiducial = fiducial; } } id="flanger" className="fiducial" data-active="false"  data-selected={ !!(currentEffect === 'flanger') }>
              <figure id="flanger-rate-fiducial" className="small-fiducial-value">
                <svg className="bar" width="84px" height="84px" viewBox="0 0 84 84">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="201.06">
                      <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="4" transform="translate(42.000000, 42.000000) translate(-42.000000, -42.000000) " cx="42" cy="42" r="40"></circle>
                  </g>
                </svg>

                <svg className="fill" width="84px" height="84px" viewBox="0 0 84 84">
                  <g ref={ (bar) => { this.flangerRateBar = bar; } } className="stroke" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.0, 251.33">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="4" transform="translate(42.000000, 42.000000) translate(-42.000000, -42.000000) " cx="42" cy="42" r="40"></circle>
                  </g>
                </svg>

                { flangerRateInteractionIcon }

                <h5>Rate</h5>
              </figure>

              <figure id="flanger-depth-fiducial" className="small-fiducial-value">
                <svg className="bar" width="84px" height="84px" viewBox="0 0 84 84">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="201.06">
                      <circle id="Oval-2" stroke="#F6B0BF" strokeWidth="4" transform="translate(42.000000, 42.000000) translate(-42.000000, -42.000000) " cx="42" cy="42" r="40"></circle>
                  </g>
                </svg>

                <svg className="fill" width="84px" height="84px" viewBox="0 0 84 84">
                  <g ref={ (bar) => { this.flangerDepthBar = bar; } } className="stroke" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="0.0, 251.33">
                      <circle id="Oval-2" stroke="#E77D95" strokeWidth="4" transform="translate(42.000000, 42.000000) translate(-42.000000, -42.000000) " cx="42" cy="42" r="40"></circle>
                  </g>
                </svg>

                { flangerDepthInteractionIcon }

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
                  <img src={ activeTrack.image_small } />
                </figure>

                <div className="track-info">
                  <h1>{ activeTrack.name }</h1>
                  <h4>{ activeTrack.artist }</h4>
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

        <div id="waiting" data-fade-out={ activeTrackID >= 0 }>
          <div className="content">
            <h1>TangoTable</h1>
            <p>Waiting for client to select track</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Desktop;
