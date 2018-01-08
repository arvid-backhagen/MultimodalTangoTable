/* //<>// //<>// //<>// //<>//
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
 included in all copies or splayer1.player1.currentEffectubstantial portions of the Software.
 
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


final int songFiducial = 12;
final int bpmFiducial = 13;
final int echoFiducial = 14;
final int filterFiducial = 15;
final int flangerFiducial = 16;


// Player stuff
Player player1;
String player1String;


// GUI stuff
float object_size = 60;
PFont font;

PImage flangeimg;
PImage lpfimg;
PImage echoimg;
PImage songimg;
PImage bpmimg;

// Values to check against last value
float flangerAngle;
float echoAngle;
float bpmY;

// Arrays for keeping track of keys pressed
boolean [] arrows = new boolean [4];

// --------------------------------------------------------------
// Processing functions
// --------------------------------------------------------------
void setup()
{
  // GUI setup
  size(800, 1000, P3D);
  //fullScreen();
  font = createFont("Arial", 12);
  textFont(font);
  noStroke();
  fill(0);
  
  flangeimg = loadImage("flange.jpg");
  lpfimg = loadImage("filter_lowpass.jpg");
  songimg = loadImage("music.jpg");
  echoimg = loadImage("echo.png");
  bpmimg = loadImage("bpm.png");
  
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
  
  if (frameCount % 3 == 0) {
    thread("sendMessageToClients");
  }
  
  //for keyboard controls
  if (frameCount % 3 == 0) {
    update();
  }
  
  ArrayList<TuioObject> tuioObjectList = tuioClient.getTuioObjectList();
  for (int i=0;i<tuioObjectList.size();i++) {
     TuioObject tobj = tuioObjectList.get(i);
     
     pushMatrix();
     translate(tobj.getScreenX(width), tobj.getScreenY(height));
     rotate(tobj.getAngle());
     
     // set image of tuio objects
     if (tobj.getSymbolID() == flangerFiducial){
       image(flangeimg, -object_size, -object_size, 2*object_size, 2*object_size);
     } else if (tobj.getSymbolID() == filterFiducial){
       image(lpfimg, -object_size, -object_size, 2*object_size, 2*object_size);
     } else if (tobj.getSymbolID() == echoFiducial){
       image(echoimg, -object_size, -object_size, 2*object_size, 2*object_size);
     } else if (tobj.getSymbolID() == songFiducial){
       image(songimg, -object_size, -object_size, 2*object_size, 2*object_size);
     } else if (tobj.getSymbolID() == bpmFiducial){
       image(bpmimg, -object_size, -object_size, 2*object_size, 2*object_size);
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
  // Player1 toggle
  if (tobj.getSymbolID() == songFiducial){
    player1.play();
  }
  
  // Toggle filter
  if (tobj.getSymbolID() == filterFiducial){
    player1.toggleFilter();
  }
  
  // Toggle flanger
  if (tobj.getSymbolID() == flangerFiducial){
    player1.toggleFlanger();
  }
  
  // Toggle echo
  if (tobj.getSymbolID() == echoFiducial){
    player1.toggleEcho();
  }
  
  // Reset BPM
  if (tobj.getSymbolID() == bpmFiducial){
    player1.toggleBpm();
  }
  
  
  if (verbose) println("add obj "+tobj.getSymbolID()+" ("+tobj.getSessionID()+") "+tobj.getX()+" "+tobj.getY()+" "+tobj.getAngle()); 
}

// called when an object is moved
void updateTuioObject (TuioObject tobj) {
  if (verbose) println("set obj "+tobj.getSymbolID()+" ("+tobj.getSessionID()+") "+tobj.getX()+" "+tobj.getY()+" "+tobj.getAngle()
          +" "+tobj.getMotionSpeed()+" "+tobj.getRotationSpeed()+" "+tobj.getMotionAccel()+" "+tobj.getRotationAccel());

  // Volume control
  if (tobj.getSymbolID() == songFiducial){
    float inverseY = map(tobj.getY(), 0.05, 0.90, 1, 0);
    player1.setVolume(inverseY);
    player1.songFiducial.setFloat("x", tobj.getX());
    player1.songFiducial.setFloat("y", tobj.getY());
  }
  
  // Filter control
  if (tobj.getSymbolID() == filterFiducial){
    float mapVal = map(tobj.getX(), 0.05, 0.95, 0, 1);
    player1.setFilter(mapVal);
    player1.filterFiducial.setFloat("x", tobj.getX());
    player1.filterFiducial.setFloat("y", tobj.getY());
  }
  
  // Flanger control
  if (tobj.getSymbolID() == flangerFiducial){
    float mapVal = map(tobj.getY(), 0.05, 0.90, 1, 0);
    player1.setFlangeDepth(mapVal);
    
    if(flangerAngle < tobj.getAngle()){
      player1.increaseFlangeRate();
    } else if (flangerAngle > tobj.getAngle()){
      player1.decreaseFlangeRate();
    }
    flangerAngle = tobj.getAngle();
    player1.flangeFiducial.setFloat("x", tobj.getX());
    player1.flangeFiducial.setFloat("y", tobj.getY());
  }
  
  // Echo control
  if (tobj.getSymbolID() == echoFiducial){
    if(echoAngle < tobj.getAngle()){
      player1.increaseEcho();
    } else if (echoAngle > tobj.getAngle()){
      player1.decreaseEcho();
    }
    echoAngle = tobj.getAngle();
    player1.echoFiducial.setFloat("x", tobj.getX());
    player1.echoFiducial.setFloat("y", tobj.getY());
  }
  
  //BPM control
  if (tobj.getSymbolID() == bpmFiducial){
    float inverseY = map(tobj.getY(), 0.05, 0.90, 1, 0);
    if(bpmY < inverseY){
      player1.increaseBpm();
    } else if (bpmY > inverseY){
      player1.decreaseBpm();
    }
    bpmY = inverseY;
    player1.bpmFiducial.setFloat("x", tobj.getX());
    player1.bpmFiducial.setFloat("y", tobj.getY());
  }
}

// called when an object is removed from the scene
void removeTuioObject(TuioObject tobj) {
  if (tobj.getSymbolID() == songFiducial){
    player1.pause();
  }
  
  if (tobj.getSymbolID() == filterFiducial){
    player1.toggleFilter();
  }
  
  if (tobj.getSymbolID() == flangerFiducial){
    player1.toggleFlanger();
  }
  
  if (tobj.getSymbolID() == echoFiducial){
    player1.toggleEcho();
  }
  
  // Reset BPM
  if (tobj.getSymbolID() == bpmFiducial){
    player1.toggleBpm();
  }
  
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
    case "play":
      player1.setSong(value);
    break;
      
    default:
    break;
  }
}

// --------------------------------------------------------------
// Keyboard functions(not needed, only used to debug)
// --------------------------------------------------------------
void update(){
  //Volume
  if (player1.currentEffect == "volume" && arrows[1]) player1.increaseVolume();
  else if (player1.currentEffect == "volume" && arrows[2]) player1.decreaseVolume();

  //Bpm
  if (player1.currentEffect == "bpm" && arrows[1]) player1.increaseBpm();
  else if (player1.currentEffect == "bpm" && arrows[2]) player1.decreaseBpm(); 
  
  //Echo
  if (player1.currentEffect == "echo" && arrows[1]) player1.increaseEcho();
  else if (player1.currentEffect == "echo" && arrows[2]) player1.decreaseEcho();

  //Filter
  if (player1.currentEffect == "filter" && arrows[1]) player1.increaseFilter();
  else if (player1.currentEffect == "filter" && arrows[2]) player1.decreaseFilter();
  
  //Flanger
  if (player1.currentEffect == "flanger" && arrows[1]) player1.increaseFlangeRate();
  else if (player1.currentEffect == "flanger" && arrows[2]) player1.decreaseFlangeRate();
  if (player1.currentEffect == "flanger" && arrows[3]) player1.increaseFlangeDepth();
  else if (player1.currentEffect == "flanger" && arrows[0]) player1.decreaseFlangeDepth();
}

void keyPressed(){ 
  if (key != CODED){    
    //Play/pause
    if (key == ' ') {
      player1.togglePlay();
    }
    //Volume
    if (key == 'v'){
      player1.setEffect("volume");
    }
    //Bpm
    if (key == 't'){
      player1.toggleBpm();
    }
    //Echo
    if (key == 'e') {
      player1.toggleEcho();
    }
    //Filter
    if (key == 'd'){
      player1.toggleFilter();
    }
    //Flanger
    if (key == 'f'){ 
      player1.toggleFlanger();
    }
  }
  if (key == CODED){
    if (keyCode == LEFT) {
      arrows[0] = true;
    }
    if (keyCode == UP) {
      arrows[1] = true;
    }
    if (keyCode == DOWN) {
      arrows[2] = true;
    }
    if (keyCode == RIGHT) {
      arrows[3] = true;
    }
  }
}

void keyReleased(){  
  if (key == CODED){
    if (keyCode == LEFT) {
      arrows[0] = false;
    }
    if (keyCode == UP) {
      arrows[1] = false;
    }
    if (keyCode == DOWN) {
      arrows[2] = false;
    }
    if (keyCode == RIGHT) {
      arrows[3] = false;
    }
  }
}