class Jogador{
    constructor(ctx,x,y) { // É chamado quando o objeto é instanciado
        this.ctx = ctx;
        this.jogando = false;
      
        // Pos
        this.xInicial = x;
        this.yInicial =y;
        this.x = this.xInicial;
        this.y = this.yInicial;

        // Peso
        this.aceleracaoGravidade = 50; // Opção no menu?
        this.massa = 5; // Opção no menu
        this.peso = this.massa * this.aceleracaoGravidade;

        // Aceleração horizontal
        this.vetorX = {
            velocidade: 1,
            direcao: 1
        }

        // Aceleração vertical
        this.vetorY = {
            velocidade: 0,
            direcao: 1
        }

        this.rotacao = 0;
        this.velocidade_angular = 0;
            
        // Tamanho
        this.larguraSprite = 70; // Opção no menu?
        this.alturaSprite = 70;

        // Hitbox
        this.pontoColisao = {
            x: this.x + this.larguraSprite / 2,
            y: this.y + this.alturaSprite,
            chao: null,

            atualizaChao: function(jogador, linhas, largura_linha) {
                jogador.pontoColisao.chao = null;

                for (let linha of linhas) {
                    if (jogador.pontoColisao.x < Math.min(linha.xInicial, linha.xFinal) - largura_linha / 2 || jogador.pontoColisao.x > Math.max(linha.xInicial, linha.xFinal) + largura_linha / 2) {
                        continue;
                    } if (jogador.pontoColisao.y > Math.max(linha.yInicial, linha.yFinal) + 2) {
                        continue;
                    }

                    let a, b;
                    if (linha.xFinal - linha.xInicial == 0) {
                        a = jogador.pontoColisao.y/jogador.pontoColisao.x;
                        b = 0;
                    } else {
                        a = (linha.yFinal - linha.yInicial) / (linha.xFinal - linha.xInicial);
                        b = (linha.yInicial * linha.xFinal - linha.yFinal * linha.xInicial) / ((linha.xFinal - linha.xInicial));
                    }

                    const ponto = {
                        x: jogador.pontoColisao.x,
                        y: a * jogador.pontoColisao.x + b
                    };
                    if (jogador.pontoColisao.chao == null || ponto.y < jogador.pontoColisao.chao.coordenadas.y) {
                        let hipotenusa = Math.sqrt(Math.pow(linha.xFinal - linha.xInicial, 2) + Math.pow(linha.yFinal - linha.yInicial, 2));
                        let cateto_oposto = Math.abs(linha.xFinal - linha.xInicial);
                        let cateto_adjascente = Math.abs(linha.yFinal - linha.yInicial);
                        let rotacao_linha = (linha.yFinal - linha.yInicial) * (linha.xFinal - linha.xInicial) / Math.abs(linha.xFinal - linha.xInicial); 

                        jogador.pontoColisao.chao = {
                            coordenadas: ponto,
                            seno_inclinacao: cateto_oposto/hipotenusa,
                            cosseno_inclinacao: cateto_adjascente/hipotenusa,
                            rotacao: rotacao_linha,
                            cor: linha.corLinha
                        };
                    }
                }
            },

            atualizaHitbox: function(jogador) {
                jogador.pontoColisao.x = jogador.x + jogador.larguraSprite / 2;
                jogador.pontoColisao.y = jogador.y + jogador.alturaSprite;
            }
        }

        // Sprite
        this.jogadorSprite = new Image();
        this.jogadorSprite.src ="img/JogadorSprites/cinza.png";
    }

    desenharJogador(dt, linhas, largura_linha) {   
        // O jogador é redesenhado todo frame
        if (this.jogando) {
            this.gravidade(dt, linhas, largura_linha);
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


        this.ctx.fillStyle = 'blue';  
        this.ctx.beginPath();
        this.ctx.arc(this.pontoColisao.x, this.pontoColisao.y, 5, 0, Math.PI * 2);  
        this.ctx.fill();
    }
    gravidade(dt, linhas, largura_linha) {
        this.pontoColisao.atualizaHitbox(this);
        this.pontoColisao.atualizaChao(this, linhas, largura_linha);

        if (this.pontoColisao.chao == null || this.y + this.alturaSprite + this.vetorY.velocidade * this.vetorY.direcao < this.pontoColisao.chao.coordenadas.y) {
            this.vetorY.velocidade += this.aceleracaoGravidade * this.vetorY.direcao * dt;

            if (this.vetorY.velocidade < 0) {
                this.vetorY.direcao = 1;
                this.vetorY.velocidade *= -1;
            }
        } else {
            let mod_velocidade = (this.pontoColisao.chao.cor == "azul") ? 1 : 2;
            if (this.y + this.alturaSprite + this.vetorY.velocidade * this.vetorY.direcao >= this.pontoColisao.chao.coordenadas.y) {
                this.y = this.pontoColisao.chao.coordenadas.y - this.alturaSprite;
                this.vetorX.velocidade += this.vetorY.velocidade * this.pontoColisao.chao.seno_inclinacao * dt * mod_velocidade;
            }
            
            if (this.pontoColisao.chao.cor == "verde") {
                this.vetorX.velocidade += this.aceleracaoGravidade * this.pontoColisao.chao.seno_inclinacao * dt;
                this.vetorY.velocidade += this.aceleracaoGravidade * this.pontoColisao.chao.cosseno_inclinacao * dt * 4;
                this.vetorY.direcao = -1;

                if (this.pontoColisao.chao.rotacao < 0) {
                    this.vetorX.direcao = -1;
                } else {
                    this.vetorX.direcao = 1;
                }
            } else {        
                if (this.vetorX.direcao * this.pontoColisao.chao.rotacao < 0) {
                    this.vetorX.velocidade -= this.aceleracaoGravidade * this.pontoColisao.chao.seno_inclinacao * dt * mod_velocidade;
                } else {
                    this.vetorX.velocidade += this.aceleracaoGravidade * this.pontoColisao.chao.seno_inclinacao * dt * mod_velocidade;
                }

                if (this.vetorX.velocidade < 0) {
                    this.vetorX.direcao *= -1;
                    this.vetorX.velocidade *= -1;
                } 
   
                this.vetorY.velocidade = this.aceleracaoGravidade * this.pontoColisao.chao.cosseno_inclinacao * dt * mod_velocidade;
            }
        }

        this.x += this.vetorX.velocidade * this.vetorX.direcao;
        this.y += this.vetorY.velocidade * this.vetorY.direcao;
    }

    start() {
        this.jogando = true;
        this.x = this.xInicial;
        this.y = this.yInicial;
        this.rotacao = 0;

        this.vetorX = {
            velocidade: 1,
            direcao: 1
        }
        this.vetorY = {
            velocidade: 0,
            direcao: 1
        }
    }

    stop() {
        this.jogando = false;
        this.x = this.xInicial;
        this.y = this.yInicial;
        this.rotacao = 0;

        this.vetorX = {
            velocidade: 1,
            direcao: 1
        }
        this.vetorY = {
            velocidade: 0,
            direcao: 1
        }
    }
}