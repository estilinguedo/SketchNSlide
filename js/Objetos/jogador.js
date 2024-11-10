class Jogador{
    constructor(ctx,x,y) { // É chamado quando o objeto é instanciado
        this.ctx = ctx;
      
        // Pos
        this.xInicial = x;
        this.yInicial =y;
        this.x = this.xInicial;
        this.y = this.yInicial;

        // Peso
        this.aceleracaoGravidade = 10; // Opção no menu?
        this.massa = 5; // Opção no menu
        this.peso = this.massa * this.aceleracaoGravidade;

        // Aceleração horizontal
        this.vetorX = {
            aceleracao: 2,
            direcao: 1
        }

        // Aceleração vertical
        this.vetorY = {
            aceleracao: 0,
            direcao: 1
        }
            
        // Tamanho
        this.larguraSprite = 70; // Opção no menu?
        this.alturaSprite = 70;

        // Hitbox
        this.pontosColisao = [
            { x: this.x + 5 , y: this.y + this.alturaSprite -10, lugar:'BaseEsq' },                        
            { x: this.x + this.larguraSprite - 10, y: this.y + this.alturaSprite -10, lugar:'BaseDir'},    
            { x: this.x + 25, y: this.y + 20, lugar:'Cabeca'} 
        ];

        // Sprite
        this.jogadorSprite = new Image();
        this.jogadorSprite.src ="img/JogadorSprites/cinza.png";

     
    }


    desenharJogador(dt) {   
        // O jogador é redesenhado todo frame
        if (this.jogando) {
            this.gravidade(dt);
        }
        this.ctx.save();
        this.ctx.translate(this.x + this.larguraSprite / 2, this.y + this.alturaSprite / 2);
        this.ctx.rotate(this.rotacao);
        this.ctx.drawImage(this.jogadorSprite, -this.larguraSprite / 2, -this.alturaSprite / 2, this.larguraSprite, this.alturaSprite);
        this.ctx.restore();

        //Remover
        // Hitbox temporário
        this.ctx.strokeStyle = 'red'; 
        this.ctx.lineWidth = 2;  
        this.ctx.strokeRect(this.x, this.y, this.larguraSprite, this.alturaSprite);

        for (const ponto of this.pontosColisao) {
            this.ctx.fillStyle = 'blue';  
            this.ctx.beginPath();
            this.ctx.arc(ponto.x, ponto.y, 5, 0, Math.PI * 2);  
            this.ctx.fill();
        }
    }
    gravidade(dt) {
        
        this.aceleracaoY += (this.peso - this.normal) * dt;      
        this.y += this.aceleracaoY;
    }
    verificarColisao(desenho){
        let colisoes = [];
        for (const linha of desenho.linhas) {
            const colidiu = this.colisao(linha.xInicial, linha.yInicial, linha.xFinal, linha.yFinal);
            if (colidiu) {
                colisoes.push(linha);  
            }
        }
        
        if (colisoes.length > 0) {
            const linhaColidida = colisoes[0]; 
            
            // ângulo da linha
            const anguloLinha = Math.atan2(
                linhaColidida.yFinal - linhaColidida.yInicial, 
                linhaColidida.xFinal - linhaColidida.xInicial
            );            
            this.normal = this.peso + this.aceleracaoY;
            // Aceleração no eixo da linha
            if(anguloLinha < 1.5){    
                this.aceleracaoX = this.aceleracaoY * Math.sin(anguloLinha);
             
            }
            else{
                this.aceleracaoX = this.aceleracaoY * Math.sin(anguloLinha) *-1;
              
            }
          
            //this.rotacao = anguloLinha;
           
         
        } else {
            this.normal = 0;
            this.aceleracaoX  = 0;
            this.rotacao = 0;  
        }    
    }
    atualizarHitbox() {
        this.pontosColisao = [
            { x: this.x + 5 , y: this.y + this.alturaSprite -10, lugar:'BaseEsq' },                        
            { x: this.x + this.larguraSprite - 10, y: this.y + this.alturaSprite -10, lugar:'BaseDir'},    
            { x: this.x + 25, y: this.y + 20, lugar:'Cabeca'} 
        ];
    }

    colisao(xInicial, yInicial, xFinal, yFinal, limiteColisao = 2) {
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
        const dentroSegmento = (px, py, x0, y0, x1, y1) => {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            return px >= minX - limiteColisao && px <= maxX + limiteColisao && py >= minY - limiteColisao && py <= maxY + limiteColisao;
        };
    
        // Verificar hitbox 
        for (let ponto of this.pontosColisao) {
            const distancia = distPontoLinha(xInicial, yInicial, xFinal, yFinal, ponto.x, ponto.y);
            if (distancia <= limiteColisao && dentroSegmento(ponto.x, ponto.y, xInicial, yInicial, xFinal, yFinal)) {
                return true;
            }
        }
        return false;
    }
    start() {
        this.jogando = true;
        this.x = this.xInicial;
        this.y = this.yInicial;
        this.aceleracaoX = 0;
        this.aceleracaoY = 0;
    }
    stop() {
        this.jogando = false;
        this.x = this.xInicial;
        this.y = this.yInicial;
        this.aceleracaoX = 0;
        this.aceleracaoY = 0;
    }

}