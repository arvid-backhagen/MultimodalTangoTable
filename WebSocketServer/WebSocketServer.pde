import websockets.*;

WebsocketServer ws;
int serverPort = 1234;

int now;
int playing;

Player player1;

PFont font;

void setup() {
  size(800, 1200, P3D);
  font = createFont("Arial", 16);
  textFont(font);
  
  player1 = new Player(this);
  
  ws = new WebsocketServer(this, 1234, "/");
  now = millis();
}

void draw() {
  background(0);
  fill(255);
  text("Server running", 10, 20);
  
  String jsonString = player1.toJsonString();
  text(jsonString, 10, 40);  
  
  //Send message to all clients very 5 seconds
  if(millis() > now + 33) {
    ws.sendMessage(jsonString);
    now = millis();
  }
}


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
}


void webSocketServerEvent(String msg){
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