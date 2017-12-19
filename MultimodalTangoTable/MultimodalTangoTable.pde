/* //<>// //<>//
 TUIO 1.1 Demo for Processing
 Copyright (c) 2005-2014 Martin Kaltenbrunner <martin@tuio.org>

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files
 (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge,
 publish, distribute, sublicense, and/or sell copies of the Software,
 and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:
 
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
 ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import websockets.*;
import TUIO.*;


// TUIO stuff
TuioProcessing tuioClient;
boolean verbose = false; // print console debug messages
boolean callback = true; // updates only after callbacks


// Websocket stuff
WebsocketServer ws;
int serverPort = 1234;


// Player stuff
Player player1;
String player1String;


// GUI stuff
float object_size = 60;
PFont font;

PImage flangeimg;
PImage lpfimg;




// --------------------------------------------------------------
// Processing functions
// --------------------------------------------------------------
void setup()
{
  // GUI setup
  size(800, 1000, P3D);
  font = createFont("Arial", 12);
  textFont(font);
  noCursor();
  noStroke();
  fill(0);
  
  flangeimg = loadImage("flange.jpg");
  lpfimg = loadImage("filter_lowpass.jpg");
  
  //Initialize TuioClient
  tuioClient  = new TuioProcessing(this);
  
  //Initialize player
  player1 = new Player(this);
  
  //Initialize websocket player
  ws = new WebsocketServer(this, 1234, "/");
}


void draw()
{
  background(255);
  fill(0);
  
  if (frameCount % 30 == 0) {
    thread("sendMessageToClients");
  }
   
  ArrayList<TuioObject> tuioObjectList = tuioClient.getTuioObjectList();
  for (int i=0;i<tuioObjectList.size();i++) {
     TuioObject tobj = tuioObjectList.get(i);
     
     pushMatrix();
     translate(tobj.getScreenX(width), tobj.getScreenY(height));
     rotate(tobj.getAngle());
     
     // set image of tuio objects
     if (tobj.getSymbolID() == 60){
       image(flangeimg, -object_size, -object_size, 2*object_size, 2*object_size);
     } else if (tobj.getSymbolID() == 50){
       image(lpfimg, -object_size, -object_size, 2*object_size, 2*object_size);
     } else {
       rect(-object_size/2,-object_size/2,object_size,object_size);
     }
     
     popMatrix();
     text(""+tobj.getSymbolID(), tobj.getScreenX(width), tobj.getScreenY(height));
  }
  
  
  text("Server running", 10, 20);
  
  player1String = player1.toJsonString();
  text(player1String, 10, 40); 
}




// --------------------------------------------------------------
// TUIO functions
// --------------------------------------------------------------

// called when an object is added to the scene
void addTuioObject(TuioObject tobj) {
  /*
  if (tobj.getSymbolID() == 50){
    groove.play();
  }
  if (tobj.getSymbolID() == 2){
    fgroove.play(); 
  }
  */
  
  if (verbose) println("add obj "+tobj.getSymbolID()+" ("+tobj.getSessionID()+") "+tobj.getX()+" "+tobj.getY()+" "+tobj.getAngle()); 
}

// called when an object is moved
void updateTuioObject (TuioObject tobj) {
  if (verbose) println("set obj "+tobj.getSymbolID()+" ("+tobj.getSessionID()+") "+tobj.getX()+" "+tobj.getY()+" "+tobj.getAngle()
          +" "+tobj.getMotionSpeed()+" "+tobj.getRotationSpeed()+" "+tobj.getMotionAccel()+" "+tobj.getRotationAccel());
  /*        
  if (tobj.getSymbolID() == 50){
    freq = map(tobj.getY(), 0, 1, 60, 10000);
    println(freq);
    lpf.setFreq(freq);
  }
  
  if (tobj.getSymbolID() == 2){
    float dl = map( tobj.getX(), 0, 1, 0.01, 5 );
    float dp = map( tobj.getY(), 1, 0, 1.00, 5 );
    println(tobj.getX());
    flange.delay.setLastValue(dl);
    flange.depth.setLastValue( dp );
  }
  */
}

// called when an object is removed from the scene
void removeTuioObject(TuioObject tobj) {
  // fiducial_id = 2 gets through and toggles sound in PureData
  //if (tobj.getSymbolID() == 2){
  //  toggleSound();
  //}
  
  /*
  if (tobj.getSymbolID() == 50){
    groove.pause();
  }
  if (tobj.getSymbolID() == 2){
    fgroove.pause();
  }
  */
  
  if (verbose) println("del obj "+tobj.getSymbolID()+" ("+tobj.getSessionID()+")");
}


// --------------------------------------------------------------
// (UNSUED) TUIO functions
// --------------------------------------------------------------

// called when a cursor is added to the scene
void addTuioCursor(TuioCursor tcur) {
  //redraw();
}

// called when a cursor is moved
void updateTuioCursor (TuioCursor tcur) {
  //redraw();
}

// called when a cursor is removed from the scene
void removeTuioCursor(TuioCursor tcur) {
  //redraw()
}


// called when a blob is added to the scene
void addTuioBlob(TuioBlob tblb) {
  //redraw();
}

// called when a blob is moved
void updateTuioBlob (TuioBlob tblb) {
  //redraw()
}

// called when a blob is removed from the scene
void removeTuioBlob(TuioBlob tblb) {
  //redraw()
}


// called at the end of each TUIO frame
void refresh(TuioTime frameTime) {
  if (verbose) println("frame #"+frameTime.getFrameID()+" ("+frameTime.getTotalMilliseconds()+")");
  if (callback) redraw();
}




// --------------------------------------------------------------
// Websocket functions
// --------------------------------------------------------------
void sendMessageToClients() {
  ws.sendMessage(player1String);
}

//Called when we recieve a websocket event.
void webSocketServerEvent(String msg) {
  println(msg);
  String[] data = split(msg, ':');
  
  String payload = data[0];
  int value = Integer.parseInt(data[1]);
 
  switch(payload) {
    case "playing":
      player1.togglePlay();
    break;
      
    default:
    break;
  }
}




// --------------------------------------------------------------
// Keyboard functions(not needed, only used to debug)
// --------------------------------------------------------------
void keyPressed() {
  //Toggle play/pause
  if ( key == ' ' ) {
    player1.togglePlay();
  }
  
  
  //Volume
  if (key == 'q') {
    player1.resetVolume();
  }
  
  if (key == 'a') {
    player1.increaseVolume();
  }
  
  if (key == 'z') {
    player1.decreaseVolume();
  }
  
  
  //Bpm
  if (key == 'w') {
    player1.resetBpm();
  }
  
  if (key == 's') {
    player1.increaseBpm();
  }
  
  if (key == 'x') {
    player1.decreaseBpm();
  }
  
  
  //Echo
  if (key == 'e') {
    player1.toggleEcho();
  }
  
  if (key == 'd') {
    player1.increaseEcho();
  }
  
  if (key == 'c') {
    player1.decreaseEcho();
  }
  
  
  //Filter
  if (key == 'r') {
    player1.toggleFilter();
  }
  
  if (key == 'f') {
    player1.increaseFilter();
  }
  
  if (key == 'v') {
    player1.decreaseFilter();
  }
  
   //Flanger
  if (key == 't') {
    player1.toggleFlanger();
  }
  
  if (key == 'g') {
    player1.increaseFlangeRate();
  }
  
  if (key == 'b') {
    player1.decreaseFlangeRate();
  }
  if (key == 'h') {
    player1.increaseFlangeDepth();
  }
  
  if (key == 'n') {
    player1.decreaseFlangeDepth();
  }
}