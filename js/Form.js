class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite seu nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/TITULO.png", "nome do jogo");
    this.greeting = createElement("h2");
  }

  setElementsPosition() {
    this.titleImg.position(120, 50);
    this.input.position(width / 2 - 110, height / 2 - 80);
    this.playButton.position(width / 2 - 90, height / 2 - 20);
    this.greeting.position(width / 2 - 300, height / 2 - 100);
  }

  setElementsStyle() {
    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  display() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.clickmouse();
  }

  clickmouse() {
    this.playButton.mousePressed(() => {
      this.input.hide();
      //esconde a entrada no botão
      this.playButton.hide();
      //esconde o botão
      //exibe a mensagem de boas vindas
      var message = ` Olá, ${this.input.value()} 
          </br>espere o outro jogador entrar...`;
      this.greeting.html(message);
      playerCount += 1;
      //aumentar a contagem
      player.name = this.input.value();
      // objeto jogador adiciona nome jogador ao BD
      player.index = playerCount;
      // criamos matriz com o numero dos jogadores
      player.addPlayer(); //objeto jogador chama o método para add jogadores
      player.updateCount(playerCount);
      player.getDistance();
    });
  }
}
