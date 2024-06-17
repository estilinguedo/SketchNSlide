class Jogador{
    constructor(ctx,x,y) { // É chamado quando o objeto é instanciado
        this.ctx = ctx;
      
        // Pos
        this.xInicial = x;
        this.yInicial =y;
        this.x = this.xInicial;
        this.y = this.yInicial;

        // Velocidade
        this.velocidade = 2; // Opção no menu?

        // Tamanho
        this.larguraSprite = 70; // Opção no menu?
        this.alturaSprite = 70;

        // Hitbox
        this.pontosColisao = [
            { x: this.x + 17 , y: this.y + this.alturaSprite - 32, lugar:'BaseEsq' },                        
            { x: this.x + this.larguraSprite - 49, y: this.y + this.alturaSprite - 32, lugar:'BaseDir'},    
            { x: this.x + this.larguraSprite / 2 - 31, y: this.y + 73, lugar:'Cabeca'} 
        ];
        // Sprite
        this.jogadorSprite = new Image();
        this.jogadorSprite.src ="img/JogadorSprites/cinza.png";

     
    }


    desenharJogador() {   
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
    colisao(){
        
        const distPontoLinha = (x0, y0, x1, y1, px, py) => {
              /*
            //https://www.basic-mathematics.com/distance-between-a-point-and-a-line.html
            A = y1 - y0
            B = x0 - x1
            C = x1.y0 - y1.x0
            numerador= A.px + B.py +C
            denominador = √ A^2 + B^2
            */
            const numerador = Math.abs((y1 - y0) * px - (x1 - x0) * py + x1 * y0 - y1 * x0);
            const denominador = Math.sqrt(Math.pow(y1 - y0, 2) + Math.pow(x1 - x0, 2));
            return numerador / denominador;
        };
        const distancia = distPontoLinha(xInicial, yInicial, xFinal, yFinal, posX, posY);
        
    }
    start() {
        this.jogando = true;
        this.x = this.xInicial;
        this.y = this.yInicial;
    }
    stop() {
        this.jogando = false;
        this.x = this.xInicial;
        this.y = this.yInicial;
    }

}