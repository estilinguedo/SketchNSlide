class Jogador{
    constructor(ctx,x,y){ // É chamado quando o objeto é instanciado
        this.ctx = ctx;
      
        // Pos
        this.xIncial = x;
        this.yInical =y;
        this.x = this.xIncial;
        this.y = this.yInical;

        // Velocidade
        this.velocidade = 2; // Opção no menu?

        // Tamanho
        this.larguraSprite = 70; // Opção no menu?
        this.alturaSprite = 70;

        // Sprite
        this.jogadorSprite = new Image();
        this.jogadorSprite.src ="img/JogadorSprites/jogador.png";


    }


    desenharJogador(){   
        // O jogador é redesenhado todo frame
        // Mudar o sprite
        if (this.jogando) {
            this.gravidade();
        }
        this.ctx.drawImage(this.jogadorSprite,this.x,this.y, this.larguraSprite, this.alturaSprite);
  
    }
    gravidade() {
        this.y += this.velocidade;
    }
    start() {
        this.jogando = true;
        this.x = this.xIncial;
        this.y = this.yInical;
    }
    stop() {
        this.jogando = false;
        this.x = this.xIncial;
        this.y = this.yInical;
    }

}