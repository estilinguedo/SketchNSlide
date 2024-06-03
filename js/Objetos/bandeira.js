class Bandeira{
    constructor(ctx,x,y) { // É chamado quando o objeto é instanciado
        this.ctx = ctx;
      
        // Pos
        this.x = x;
        this.y = y;
        // Tamanho
        this.larguraSprite = 70; 
        this.alturaSprite = 70;
  
        // Sprite
        this.bandeiraSprite= new Image();
        this.bandeiraSprite.src ="img/bandeira/bandeira.png";
        
    }

    desenharBandeira() {
        // Mudar o sprite
        this.ctx.drawImage(this.bandeiraSprite, this.x, this.y, this.larguraSprite, this.alturaSprite);
    }
}