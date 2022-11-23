class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    //argumento vazio para 'caber' a imagem
    this.leadeboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.lfa = false;
    this.fogo = false;
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();
    car1 = createSprite(width / 2 - 50, height - 100);
    car2 = createSprite(width / 2 + 100, height - 100);
    car1.scale = 0.07
    car2.scale = 0.07
    car1.addImage("c1",carro1);
    car2.addImage("c2",carro2);
    car1.addImage("explo",explosao);
    car2.addImage("explo",explosao);
    carros = [car1, car2];
    fuels = new Group();
    coins = new Group();
    obstaculos = new Group();
    this.addSprites(coins, 12, coinimg, 0.012);
    this.addSprites(fuels, 5, fuelimg, 0.012);
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstaculo2 },
      { x: width / 2 - 150, y: height - 1300, image: obstaculo1 },
      { x: width / 2 + 250, y: height - 1800, image: obstaculo1 },
      { x: width / 2 - 180, y: height - 2300, image: obstaculo2 },
      { x: width / 2, y: height - 2800, image: obstaculo2 },
      { x: width / 2 - 180, y: height - 3300, image: obstaculo1 },
      { x: width / 2 + 180, y: height - 3300, image: obstaculo2 },
      { x: width / 2 + 250, y: height - 3800, image: obstaculo2 },
      { x: width / 2 - 150, y: height - 4300, image: obstaculo1 },
      { x: width / 2 + 250, y: height - 4800, image: obstaculo2 },
      { x: width / 2, y: height - 5300, image: obstaculo1 },
      { x: width / 2 - 180, y: height - 5500, image: obstaculo2 }
    ];
    this.addSprites(obstaculos, obstaclesPositions.length, obstaculo1, 0.04, obstaclesPositions);
  }

  getState() {
    var gamestater = database.ref("gameState");
    gamestater.on("value", function (data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state,
    });
  }
  play() {
    Player.getPlayerInfo();
    this.resetb();
    this.handleElement();
    player.getCar();
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderboard();
      this.showLife()
      this.showFuelBar()
      var index = 0;
      for (var ply in allPlayers) {
        index += 1;
        var x = allPlayers[ply].positionX;
        var y = height - allPlayers[ply].positionY;
        var playlife = allPlayers[ply].life;
        if  (playlife<=0){
          carros[index-1].changeImage("explo")
          carros[index-1].scale = 0.6
        }
        carros[index - 1].position.x = x;
        carros[index - 1].position.y = y;
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          this.randomFuels(index)
          this.randomCoins(index)
          this.handleObstacleCollision(index)
          this.colissaoC1(index)
          if (player.life<=0){
            this.fogo = true;
            this.playerMoving = false;
          }
          camera.position.y = carros[index - 1].position.y
        }
      }
      drawSprites();
      this.playerControl();
      const finishLine = height*6 - 100;
      if (player.positionY >finishLine){
        gameState = 2
        player.rank +=1
        Player.updateCars(player.rank)
        player.update()
        this.showRank()

      }
      if (this.playerMoving){
        player.positionY +=5;
        player.update();
      }
    }
  }
  handleElement() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    //criação dos botões de maneira 'tradicional'
    this.resetTitle.html("Reinicar Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Placar");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }
  playerControl() {
    if  (!this.fogo){
    if (keyIsDown(UP_ARROW)) {
      this.playerMoving = true;
      player.positionY += 10;
      player.update();
    }
    if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      this.lfa = true;
      player.positionX -= 5;
      player.update();
    }
    if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
      this.lfa = false;
      player.positionX += 5;
      player.update();
    }
  }
  }
  showLeaderboard() {
    var leader1, leader2;
    //retorna matriz de valores enumeraveis dos objetos
    var players = Object.values(allPlayers);
    //verifica se o jogador 1 está no rank 1
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      //exibe o texto na tela por ordem de jogador
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    //verifica se o jogador 2 está no rank 1
    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    //passar lideres como elementos html
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  resetb() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carAtEnd: 0,
      });
      window.location.reload();
    });
  }
    //c40
    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
      for (var i = 0; i < numberOfSprites; i++) {
        var x, y;
  
        //Se a matriz NÃO  estiver vazia
        // adicionar as posições da matriz à x e y
        if (positions.length > 0) {
          x = positions[i].x;
          y = positions[i].y;
          spriteImage = positions[i].image;
  
        } else {
  
          //aleatório para as metades da tela em x e y
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
  
        }
  
        //criar sprite nas posições aleatórias
        var sprite = createSprite(x, y);
        sprite.addImage("sprite", spriteImage);
  
        sprite.scale = scale;
        spriteGroup.add(sprite);
  
      }
    } 
    randomFuels(index){
      carros[index-1].overlap(fuels, function(collector, collected){
        player.fuel = 185
        collected.remove()
      })
      if (player.fuel>0&&this.playerMoving){
        player.fuel-=0.3
      }
      if (player.fuel<=0){
        gameState = 2
        this.gameOver()
      }
    } 
    randomCoins(index){
      carros[index-1].overlap(coins, function(collector, collected){
        player.score += 1.2
        player.update()
        collected.remove()
      })
    } 
    showRank() {
      swal({
        //title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
        title: `Incrível!${"\n"}${player.rank}º lugar`,
        text: "Você alcançou a linha de chegada com sucesso!",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok"
      });
      
    }
    //barra de vida
  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#C2331D");
    rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
    noStroke();
    pop();
  }

  //barra combustivel
  showFuelBar() {
    push();
    image(fuelimg, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  //final de jogo
  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
  handleObstacleCollision(index){
    if  (carros[index - 1].collide(obstaculos)){
      if   (player.life>0){
        player.life-= 185/4
      }
      if  (this.lfa){
        player.positionX += 100
      }else{
        player.positionX -= 100
      }
      player.update();
    }
  }
  colissaoC1(index){
    if  (index===1){
      if (carros[index-1].collide(carros[1])){
        if  (this.lfa){
          player.positionX += 100
        }else{
          player.positionX -= 100
        }
        if   (player.life>0){
          player.life-= 185/4
        }
        player.update()
      }
    }
    if  (index===2){
      if (carros[index-1].collide(carros[0])){
        if  (this.lfa){
          player.positionX += 100
        }else{
          player.positionX -= 100
        }
        if   (player.life>0){
          player.life-= 185/4
        }
        player.update()
      }
    }
  }
  end(){
    console.log("fim de jogo")
  }
}

