import React, { Component } from 'react';

import { WS_SERVER } from '../../data/constants';
import { TRACKS } from '../../data/tracks';

import tangoTable from '../../img/tango-table.svg';
import phone from '../../img/phone.svg';

import rightArrow from '../../img/right-arrow.svg';

import '../../css/mobile.css';

const PAGE_TRANSITION_DURATION = 250;

class Mobile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTrackID : -1,
      activeView : null,
      fadeInView : null,
      fadeOutView : null,
    }

    this.navigating = false;

    this.specLowList = [];
    this.specMiddleList = [];
    this.specHighList = [];

    this.handleWelcomeClick = this.handleWelcomeClick.bind(this);
    this.handleLibraryClick = this.handleLibraryClick.bind(this);
    this.handleChangeSongClick = this.handleChangeSongClick.bind(this);

    this.animRequestId = null;

    this.ws = null;
  }
  
  componentDidMount() {
    setTimeout(function() {
      this.setState({ fadeInView : 'welcome' })
    }.bind(this), 100);

    let specList = this.waveform.children    

    for (var i = 0; i < specList.length; i++) {
      let specChildren = specList[i].children;

      this.specHighList[i] = specChildren[0];
      this.specMiddleList[i] = specChildren[1];
      this.specLowList[i] = specChildren[2];
    }

    if('WebSocket' in window) {
      this.ws = new WebSocket(WS_SERVER);
        
      this.ws.onopen = function() {
        console.log("connection established");
      };
      
      this.ws.onclose = function(evt) {
       console.log("Connection closed");
      };
      
      this.ws.onerror = function(evt) {
        if(this.ws) console.log("Error: " + evt.data);
        else console.log("Cannot connect to server");
      };
      
      this.ws.onmessage = function(evt) {
        let { activeTrackID, fadeInView } = this.state;

        let { id, length, position, playing, filter, echo, flange, tempo, volume, waveform } = JSON.parse(evt.data);

        if (activeTrackID !== id) {
          this.setState({ activeTrackID : id });
        }

        if (!this.navigating) {
          if (!playing && fadeInView === 'music-player') {
            this.navigate('waiting');
          }

          if (playing && fadeInView === 'waiting') {
            this.navigate('music-player');
          }
        }

        this.timestampCurrent.innerHTML = this.formatTimeString(Math.ceil(position * length));
        this.timestampEnd.innerHTML = this.formatTimeString(length);

        this.currentTimesampHeading.innerHTML = this.formatTimeString(Math.ceil(position * length));
        this.endTimestampHeading.innerHTML = this.formatTimeString(length);

        this.progressBar.style.width = `${ position * 100 }%`;
        this.headerProgressBarFill.style.width = `${ position * 100 }%`;

        
        for (var i = 0; i < Math.min(this.specHighList.length, waveform.length); i++) {
          this.specLowList[i].style.height = `${ waveform[i] * 0.5 }px`;
          this.specMiddleList[i].style.height = `${ waveform[i + 20] * 2 }px`;
          this.specHighList[i].style.height = `${ waveform[i + 40] * 3 }px`;
        }

      }.bind(this);
      
    } else {
      alert("Your browser does not support the WebSockets API");
    }
  }

  componentWillUnmount() {
    this.removeScrollHandler();
  }

  bindScrollHandler() {
    if( !this.animRequestId ) {
      this.animRequestId = window.requestAnimationFrame(this.scrollFunction.bind(this));
    }
  }

  removeScrollHandler() { 
    if (this.animRequestId ) {
      window.cancelAnimationFrame( this.animRequestId );
      this.animRequestId = null;
    }
  }

  scrollFunction() {
    this.animRequestId = window.requestAnimationFrame(this.scrollFunction.bind(this));

    this.trackCover.style.transform = `translate3d(-50%, 0, 0) scale3d(${ this.interpolate(this.musicPlayer.scrollTop, 0, 100, 1, 0.4) }, ${ this.interpolate(this.musicPlayer.scrollTop, 0, 100, 1, 0.4) }, 1)`;


    this.tiltedTriangle.style.transform = `rotate(${ this.interpolate(this.musicPlayer.scrollTop, 90, 160, 0, 16) }deg)`;

    this.fixedHeader.style.opacity = `${ this.interpolate(this.musicPlayer.scrollTop, 125, 155, 0, 1) }`;

    this.trackHeading.style.opacity = `${ this.interpolate(this.musicPlayer.scrollTop, 255, 295, 0, 1) }`;
    this.playingHeading.style.opacity = `${ this.interpolate(this.musicPlayer.scrollTop, 255, 295, 0, 0.5) }`;

    this.currentTimesampHeading.style.opacity = `${ this.interpolate(this.musicPlayer.scrollTop, 505, 535, 0, 1) }`;
    this.endTimestampHeading.style.opacity = `${ this.interpolate(this.musicPlayer.scrollTop, 505, 535, 0, 1) }`;

    this.headerProgressBar.style.opacity = `${ this.interpolate(this.musicPlayer.scrollTop, 520, 530, 0, 1) }`;
  }

  formatTimeString(time) {
    time = Math.ceil(time/1000);

    let minutes = Math.floor(time/60);
    let seconds = time%60;

    return (seconds > 9) ? `0${ minutes }:${ seconds }` : `0${ minutes }:0${ seconds }`;
  }

  interpolate(value, inMin, inMax, outMin, outMax) {
    value = Math.min(value, inMax);
    value = Math.max(value, inMin);
    let percentage = (value - inMin)/(inMax - inMin);

    return (outMax - outMin) * percentage + outMin;
  }

  // main function
  scrollToY(scrollTargetY, speed, easing) {
      // scrollTargetY: the target scrollY property of the window
      // speed: time in pixels per second
      // easing: easing equation to use

      var scrollY = this.musicPlayer.scrollTop,
          scrollTargetY = scrollTargetY || 0,
          speed = speed || 2000,
          easing = easing || 'easeOutSine',
          currentTime = 0;

      // min time .1, max time .8 seconds
      var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

      // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
      var easingEquations = {
              easeOutSine: function (pos) {
                  return Math.sin(pos * (Math.PI / 2));
              },
              easeInOutSine: function (pos) {
                  return (-0.5 * (Math.cos(Math.PI * pos) - 1));
              }
          };

      // add animation loop
      function tick() {
          currentTime += 1 / 60;

          var p = currentTime / time;
          var t = easingEquations[easing](p);

          if (p < 1) {
              window.requestAnimationFrame(tick.bind(this));

              this.musicPlayer.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
          } else {
              this.musicPlayer.scrollTo(0, scrollTargetY);
          }
      }

      // call it once to get started
      tick.call(this);
  }

  navigate(to) {
    this.navigating = true;

    let { fadeInView } = this.state;

    //Currently on music player
    if(to === "music-player") {
      this.bindScrollHandler();
    }

    if(fadeInView === "music-player") {
      this.removeScrollHandler();
    }

    this.setState({ fadeOutView : fadeInView })
    this.animBg.className = to;

    setTimeout(function() {
      this.setState({ 
        fadeOutView : null, fadeInView : to,
      })

      this.navigating = false;
    }.bind(this), PAGE_TRANSITION_DURATION * 2);
  }

  changeSong(index) {
    this.scrollToY.call(this, 0, 2000, 'easeOutSine')
    this.ws.send(`play:${ index }`);
  }

  handleWelcomeClick() {
    this.navigate('library');
  }

  handleLibraryClick(index) {
    this.ws.send(`play:${ index }`);
    this.navigate('waiting');
  }

  handleChangeSongClick() {
    this.scrollToY(this.musicPlayer.clientHeight - this.fixedHeader.clientHeight + 15, 2000, 'easeOutSine');
  }

  render() {
    let { activeTrackID, activeView, fadeInView, fadeOutView } = this.state;


    let activeTrack = TRACKS[0];
    if (activeTrackID > 0) {
      activeTrack = TRACKS[activeTrackID];
    }


    let specList = [];
    for (var i = 0; i < 12; i++) {
      specList[i] = <div key={ i } className="spec-container">
        <div className="high spec"></div>
        <div className="middle spec"></div>
        <div className="low spec"></div>
      </div>
    }


    let libaryList = TRACKS.map(function(track, i) {
      return (
        <div key={ i } className="track" onClick={ this.handleLibraryClick.bind(this, i) }>
          <figure className="track-cover">
            <img src={ track.image_small } />
          </figure>

          <div className="info">
            <h5>{ track.name }</h5>
            <p>{ track.artist }</p>
          </div>
        </div>
      )
    }.bind(this))


    let musicPlayerList = TRACKS.map(function(track, i) {
      return (
        <div key={ i } className="track" onClick={ this.changeSong.bind(this, i) }>
          <figure className="track-cover">
            <img src={ track.image_small } />
          </figure>

          <div className="info">
            <h5>{ track.name }</h5>
            <p>{ track.artist }</p>
          </div>
        </div>
      )
    }.bind(this))

    return (
      <div id="mobile">
        <main data-active-tab={ activeView }>
          <div ref={ (bg) => { this.animBg = bg; } } id="big-bad-bg">
          </div>

          <div id="welcome" className="view" data-fade-in={ fadeInView === 'welcome' } data-fade-out={ fadeOutView === 'welcome' }>
            <figure className="cover-bg"></figure>

            <figure className="circle left"></figure>
            <figure className="circle right"></figure>

            <div className="content">
              <h3>Welcome to TangoTable</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <a className="rounded-button" onClick={ this.handleWelcomeClick }>Let's start</a>
            </div>
          </div>

          <div id="library" className="view" data-fade-in={ fadeInView === 'library' } data-fade-out={ fadeOutView === 'library' }>
            <header>
              <h1>Library</h1>
              <p>Select a track from the list below. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.</p>
            </header>

            <div className="track-group">{ libaryList }</div>
          </div>

          <div id="waiting" className="view" data-fade-in={ fadeInView === 'waiting' } data-fade-out={ fadeOutView === 'waiting' }>
            <figure className="cover">
            </figure>

            <figure className="circle left"></figure>
            <figure className="circle right"></figure>

            <div className="content">
              <div className="info">
                <h3>Start playing music</h3>
                <p>Place your phone on the table to start playing <span>{ activeTrack.name }</span>, move your phone vertically to adjust the volume and lift your phone to pause the music.</p>

                <a className="rounded-button" onClick={ this.navigate.bind(this, 'library') }>Change Song</a>
              </div>
            </div>

            <figure className="illustration">
              <img className="phone" src={ phone } />
              <img src={ tangoTable } />
            </figure>
          </div>

          <div ref={ (view) => { this.musicPlayer = view; } } id="music-player" className="view" data-fade-in={ fadeInView === 'music-player' } data-fade-out={ fadeOutView === 'music-player' }>
            <figure className="cover">
              <div ref={ (waveform) => { this.waveform = waveform; } } id="waveform">{ specList }</div>
            </figure>

            <div className="content">
              <div className="player-container">
                <span className="triangle-container"><span ref={ (triangle) => { this.tiltedTriangle = triangle; } } className="triangle"></span></span>

                <div className="info">
                  <h1>{ activeTrack.name }</h1>
                  <h4>{ activeTrack.artist }</h4>

                  <a className="rounded-button" onClick={ this.handleChangeSongClick }>Change Song</a>
                </div>

                <h5>Lift your phone to pause the music</h5>

                <h5 ref={ (timestamp) => { this.timestampCurrent = timestamp; } } className="time-stamp current">02:50</h5>
                <h5 ref={ (timestamp) => { this.timestampEnd = timestamp; } } className="time-stamp end">02:50</h5>

                <div className="progress-bar">
                  <div ref={ (bar) => { this.progressBar = bar; } } className="progress-fill"></div>
                </div>
              </div>

              <div className="playlist-container">
                <h2>Songs</h2>
                <div className="track-group">{ musicPlayerList }</div>
              </div>
            </div>

            <header ref={ (header) => { this.fixedHeader = header; } } >
              <a className="scroll-top" onClick={ this.scrollToY.bind(this, 0, 4000, 'easeOutSine') }>
                <img src={ rightArrow } />
              </a>

              <h5 ref={ (heading) => { this.playingHeading = heading; } } className="playing-header">PLAYING</h5>
              <h4 ref={ (heading) => { this.trackHeading = heading; } } className="song-title">{ activeTrack.name }</h4>

              <h5 ref={ (heading) => { this.currentTimesampHeading = heading; } } className="time-stamp current">02:50</h5>
              <h5 ref={ (heading) => { this.endTimestampHeading = heading; } } className="time-stamp end">02:50</h5>

              <div ref={ (bar) => { this.headerProgressBar = bar; } } className="progress-bar">
                <div ref={ (bar) => { this.headerProgressBarFill = bar; } } className="progress-fill"></div>
              </div>
            </header>

            <figure ref={ (illustration) => { this.trackCover = illustration; } } className="illustration">
              <img src={ activeTrack.image_small } />
            </figure>
          </div>
        </main>
      </div>
    );
  }
}

export default Mobile;
