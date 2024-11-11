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
            velocidade: 2,
            direcao: 1
        }

        // Aceleração vertical
        this.vetorY = {
            velocidade: 0,
            direcao: 1
        }

        this.rotacao = 0;
            
        // Tamanho
        this.larguraSprite = 70; // Opção no menu?
        this.alturaSprite = 70;

        // Hitbox
        this.pontosColisao = {
            pontos: [{
                x: this.x + 5 ,
                y: this.y + this.alturaSprite -10,
                lugar:'BaseEsq',
                chao: null
            }, {
                x: this.x + this.larguraSprite - 10,
                y: this.y + this.alturaSprite -10,
                lugar:'BaseDir',
                chao: null
            }],

            atualizaChao: function(jogador, linhas, largura_linha) {
                for (let ponto_colisao of jogador.pontosColisao.pontos) {
                    let achou_chao = false;

                    for (let mod_y = 0; mod_y <= jogador.vetorY.velocidade; mod_y++) {
                        const ponto = {
                            x: jogador.x,
                            y: jogador.y + (mod_y * jogador.vetorY.sentido)
                        };
    
                        for (let linha of linhas) {
                            if (ponto.x < Math.min(linha.xInicial, linha.xFinal) - largura_linha / 2 || ponto.x > Math.max(linha.xInicial, linha.xFinal) + largura_linha / 2) {
                                continue;
                            } else if (ponto.y < Math.min(linha.yInicial, linha.yFinal) - largura_linha / 2 || ponto.y > Math.max(linha.yInicial, linha.yFinal) + largura_linha / 2) {
                                continue;
                            }
    
                            let a, b;
                            if (linha.xFinal - linha.xInicial == 0) {
                                a = y/x;
                                b = 0;
                            } else {
                                a = (linha.yFinal - linha.yInicial) / (linha.xFinal - linha.xInicial);
                                b = (linha.yInicial * linha.xFinal - linha.yFinal * linha.xInicial) / ((linha.xFinal - linha.xInicial));
                            }
    
                            if (y - largura_linha / 2 < a * x + b && a * x + b < y + largura_linha / 2) {
                                let hipotenusa = Math.sqrt(Math.pow(linha.xFinal - linha.xInicial, 2) + Math.pow(linha.yFinal - linha.yInicial, 2));
                                let cateto_oposto = Math.abs(linha.xFinal - linha.xInicial);
                                let cateto_adjascente = Math.abs(linha.yFinal - linha.yInicial);
                                let rotacao_linha = linha.yInicial - linha.yFinal; 

                                ponto_colisao.chao = {
                                    coordenadas: ponto,
                                    seno_inclinacao: cateto_oposto/hipotenusa,
                                    cosseno_inclinacao: cateto_adjascente/hipotenusa,
                                    rotacao: rotacao_linha,
                                    cor: linha.corLinha
                                };
                                achou_chao = true;
                                break;
                            }
                        }

                        if (achou_chao) {
                            break;
                        }
                    }

                    if (!achou_chao) {
                        ponto_colisao.chao = null;
                    }
                }    
            },

            atualizaHitboxes: function(jogador) {
                for (let i = 0; i < jogador.pontosColisao.pontos.length; i++) {
                    let ladoQ = jogador.larguraSprite * (Math.sin(jogador.rotacao) + Math.cos(jogador.rotacao));
                    let coordenadasQ = {
                        x: jogador.x + (jogador.larguraSprite - ladoQ) / 2,
                        y: jogador.y + (jogador.larguraSprite - ladoQ) / 2
                    }

                    if (jogador.pontosColisao.pontos[i].lugar == "BaseEsq") {
                        jogador.pontosColisao.pontos[i].x = coordenadasQ.x + 5 ;
                        jogador.pontosColisao.pontos[i].y = coordenadasQ.y + jogador.alturaSprite * Math.cos(jogador.rotacao) - 10;
                    } else if (jogador.pontosColisao.pontos[i].lugar == "BaseDir") {
                        jogador.pontosColisao.pontos[i].x = coordenadasQ.x + jogador.larguraSprite * Math.cos(jogador.rotacao) - 10;
                        jogador.pontosColisao.pontos[i].y = coordenadasQ.y + ladoQ - 10;
                    }
                }
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

        for (const ponto of this.pontosColisao.pontos) {
            this.ctx.fillStyle = 'blue';  
            this.ctx.beginPath();
            this.ctx.arc(ponto.x, ponto.y, 5, 0, Math.PI * 2);  
            this.ctx.fill();
        }
    }
    gravidade(dt, linhas, largura_linha) {
        this.pontosColisao.atualizaHitboxes(this);
        this.pontosColisao.atualizaChao(this, linhas, largura_linha);
        
        let colisao = null;
        let eixo_rotacao = "nenhum";
        let menor_y = 5000;
        let cont_pontos_tocando_chao = 0;
        for (let ponto_colisao of this.pontosColisao.pontos) {
            if (ponto_colisao.chao == null) {
                continue;
            }

            if (this.y + this.vetorY.velocidade >= ponto_colisao.chao.coordenadas.y) {
                cont_pontos_tocando_chao++;
                if (ponto_colisao.chao.coordenadas.y < menor_y) {
                    colisao = ponto_colisao.chao;
                    eixo_rotacao = ponto_colisao.lugar;
                    menor_y = ponto_colisao.chao.coordenadas.y;
                }
            }
        }

        this.y = colisao.coordenadas.y;

        switch (cont_pontos_tocando_chao) {
            case 0:
                this.vetorY.velocidade += this.aceleracaoGravidade * this.vetorY.sentido * dt;

                if (this.vetorY.velocidade <= 0) {
                    this.vetorY.sentido = 1;
                    this.vetorY.velocidade *= -1;
                }  
                break;
            case 1:
                let sentido_rotacao;
                if (eixo_rotacao == "BaseEsq") {
                    sentido_rotacao = 1;
                } else if (eixo_rotacao == "BaseDir") {
                    sentido_rotacao = -1;
                }

                let diferenca_inicial = this.pontosColisao.pontos[0].y - this.pontosColisao.pontos[1].y;

                let angulo_rotacao = this.vetorY.velocidade * 180/Math.PI;
                this.rotacao += angulo_rotacao * sentido_rotacao * dt;
                this.pontosColisao.atualizaHitboxes(this);

                let diferenca_final = this.pontosColisao.pontos[0].y - this.pontosColisao.pontos[1].y;
                if (colisao.rotacao >= Math.min(diferenca_inicial, diferenca_final) && colisao.rotacao <= Math.max(diferenca_inicial, diferenca_final)) {
                    this.rotacao = Math.asin(colisao.seno_inclinacao) * 180/Math.PI;
                }
                /*
                t = delta_L / delta_t

                delta_L = Lf - Li
                Li = largura_player * peso_player * sen(linha)
                lf = largura_player * peso_player * sen(0) = 0
                delta_L = Li = largura_player * peso_player * sen(linha)
                delta_t = inclinacao / velocidade
    
                s = m/1 / m/s = s
                */
            case 2:
                if (colisao.cor == "verde") {
                    this.vetorX.velocidade += this.aceleracaoGravidade * colisao.seno_inclinacao * dt;
                    this.vetorY.velocidade += this.aceleracaoGravidade * colisao.cosseno_inclinacao * dt * 4;
                    this.vetorY.sentido = -1;
                } else {
                    let mod_velocidade = (colisao.cor == "azul") ? 1 : 2;

                    if (this.vetorX.sentido * this.vetorX.velocidade > 0) {
                        this.vetorX.velocidade += this.aceleracaoGravidade * colisao.seno_inclinacao * dt * mod_velocidade;
                    } else {
                        this.vetorX.velocidade -= this.aceleracaoGravidade * colisao.seno_inclinacao * dt * mod_velocidade;
                    }

                    if (this.vetorX.velocidade <= 0) {
                        this.vetorX.sentido *= -1;
                        this.vetorX.velocidade *= -1;
                    } 

                    this.vetorY.velocidade += this.aceleracaoGravidade * colisao.cosseno_inclinacao * dt * mod_velocidade;
                }
                break;

                /*
                sentindo = 1:
                \
                 \
                  \
                   \
                    \

                sentido = -1:
                    /
                   /
                  /
                 /
                */
        }

        if (colisao.rotacao > 0) {
            this.vetorX.sentido = 1;
        } else if (colisao.rotacao < 0) {
            this.vetorX.sentido = -1;
        }

        this.x += this.vetorX.velocidade * this.vetorX.sentido * dt;
        this.y += this.vetorY.velocidade * this.vetorY.sentido * dt;
    }
    /* verificarColisao(desenho){
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
    } */

    start() {
        this.jogando = true;
        this.x = this.xInicial;
        this.y = this.yInicial;

        this.vetorX = {
            velocidade: 2,
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

        this.vetorX = {
            velocidade: 2,
            direcao: 1
        }
        this.vetorY = {
            velocidade: 0,
            direcao: 1
        }
    }

}