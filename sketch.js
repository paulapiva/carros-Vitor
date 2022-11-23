var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var track, carro1, carro2, car1, car2;
var carros = [];
var gameState;
var allPlayers;
var coinimg, fuelimg, obstaculo1, obstaculo2, lifeImage;
var coins, fuels, obstaculos,explosao;

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  carro1 = loadImage("./assets/car1.png");
  carro2 = loadImage("./assets/car2.png");
  track = loadImage("./assets/PISTA.png");
  coinimg = loadImage("./assets/goldCoin.png");
  fuelimg = loadImage("./assets/fuel.png");
  obstaculo1 = loadImage("./assets/obstacle1.png");
  obstaculo2 = loadImage("./assets/obstacle2.png");
  lifeImage = loadImage("./assets/life.png");
  explosao = loadImage("./assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState()
  game.start();
  
}

function draw() {
  background(backgroundImage);
  if  (playerCount == 2){
    game.update(1);
  }
    if (gameState == 1){
      game.play()
    }
    if (gameState == 2){
      game.showLeaderBoard();
      game.end();
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


/**
 *  playerCount = data.val(); LINHA 15 DE PLAYER.JS
 * randomFuels(index){  if (player.fuel>0&&this.playerMoving){ -tirar ! LINHA248 GAME.JS
 *   playerControl() { acrescentar: this.playerMoving = true; - LINHA 140 GAME.JS
 * handleObstacleCollision(index){ - acrescentar: player.update() - LINHA 320 GAME.JS após if
 */