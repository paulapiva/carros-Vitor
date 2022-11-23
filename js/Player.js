class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel = 185;
    this.life = 185;
  }
  getCount() {
    var playercountr = database.ref("playerCount");
    playercountr.on("value", data => {
      playerCount = data.val();
    });
  }
  updateCount(count) {
    database.ref("/").update({
      playerCount: count,
    });
  }
  static getPlayerInfo() {
    var playerinfor = database.ref("players");
    playerinfor.on("value",  data => {
      allPlayers = data.val();
    });
  }
  addPlayer() {
    //cria jogadores no BD
    var playerIndex = "players/player" + this.index;
    if (this.index === 1) {
      //posição na metade esquerda
      this.positionX = width / 2 - 100;
    } else {
      //posição na metade direita
      this.positionX = width / 2 + 100;
    } //atualiza o campo no BD
    //ref localiza e set salva
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score
    });
  }
  update() {
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life:this.life
    });
  }
  getDistance() {
    var playerDistancer = database.ref("players/player" + this.index);
    playerDistancer.on("value", data => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }
  getCar(){
    database.ref("carAtEnd").on("value", data => {
      this.rank = data.val();
    })
  }
  static updateCars(rank){
    database.ref("/").update({
      carAtEnd: rank
    })
  }
}
