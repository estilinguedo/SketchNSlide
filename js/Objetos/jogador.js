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
        this.aceleracaoGravidade = 15; // Opção no menu?
        this.massa = 70; // Opção no menu
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

        this.escorregando = false;
            
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
                if (jogador.vetorY.direcao == -1) {
                    return;
                }

                for (let linha of linhas) {
                    if (jogador.pontoColisao.x < Math.min(linha.xInicial, linha.xFinal) - largura_linha / 2 || jogador.pontoColisao.x > Math.max(linha.xInicial, linha.xFinal) + largura_linha / 2) {
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
                        let cateto_oposto = Math.max(linha.xFinal, linha.xInicial) - Math.min(linha.xFinal, linha.xInicial);
                        let cateto_adjascente = Math.min(linha.yFinal, linha.yInicial) - Math.min(linha.yFinal, linha.yInicial);
                        let direcao_linha = (linha.yFinal - linha.yInicial) * (linha.xFinal - linha.xInicial) / Math.abs(linha.xFinal - linha.xInicial);

                        if (ponto.y + largura_linha < jogador.y + jogador.alturaSprite) {
                            continue;
                        }
                        
                        jogador.pontoColisao.chao = {
                            coordenadas: ponto,
                            seno_inclinacao: cateto_oposto/hipotenusa,
                            cosseno_inclinacao: cateto_adjascente/hipotenusa,
                            direcao: direcao_linha / Math.abs(direcao_linha),
                            lei_formacao: {
                                coeficiente_a: a,
                                coeficiente_b: b

                            },
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
        this.ctx.scale(this.vetorX.direcao, 1);
        this.ctx.drawImage(this.jogadorSprite, -this.larguraSprite / 2, -this.alturaSprite / 2, this.larguraSprite, this.alturaSprite);
        this.ctx.restore();
    }
    gravidade(dt, linhas, largura_linha) {
        this.pontoColisao.atualizaHitbox(this);
        this.pontoColisao.atualizaChao(this, linhas, largura_linha);

        let atravessou_chao_horizontal = false;
        let atravessou_chao_vertical = false;
        if (this.pontoColisao.chao != null) {
            atravessou_chao_vertical = (this.pontoColisao.y + this.vetorY.velocidade + this.aceleracaoGravidade * dt > this.pontoColisao.chao.coordenadas.y - largura_linha / 2);
        }

        if (!atravessou_chao_vertical) {
            this.escorregando = false;
            this.vetorY.velocidade += this.aceleracaoGravidade * this.vetorY.direcao * dt;

            if (this.vetorY.velocidade < 0) {
                this.vetorY.direcao = 1;
                this.vetorY.velocidade *= -1;
            }
        } else {
            let mod_velocidade = (this.pontoColisao.chao.cor == "azul") ? 1 : 2;
            
            if (this.pontoColisao.chao.cor == "verde") {
                this.vetorX.velocidade += this.aceleracaoGravidade * this.pontoColisao.chao.seno_inclinacao * dt;
                this.vetorY.velocidade += this.aceleracaoGravidade * 4 * dt;

                this.vetorY.direcao = -1;
                this.vetorX.direcao = this.pontoColisao.chao.direcao;
            } else {      
                if (atravessou_chao_vertical && !this.escorregando) {
                    this.escorregando = true;

                    this.vetorX.velocidade *= this.pontoColisao.chao.seno_inclinacao;
                    this.vetorY.velocidade *= this.pontoColisao.chao.cosseno_inclinacao;
                }

                if (this.vetorX.direcao * this.pontoColisao.chao.direcao < 0) {
                    atravessou_chao_horizontal = true;
                    this.vetorX.velocidade -= this.aceleracaoGravidade * this.pontoColisao.chao.seno_inclinacao * dt * mod_velocidade;
                } else {
                    this.vetorX.velocidade += this.aceleracaoGravidade * this.pontoColisao.chao.seno_inclinacao * dt * mod_velocidade;
                }

                if (this.vetorX.velocidade < 0) {
                    this.vetorX.direcao *= -1;
                    this.vetorX.velocidade *= -1;
                }

                this.vetorY.velocidade += this.aceleracaoGravidade * this.pontoColisao.chao.cosseno_inclinacao * dt * mod_velocidade;
            }
        }

        this.x += this.vetorX.velocidade * this.vetorX.direcao;

        let linha_atravessada = null;
        for (let linha of linhas) {
            if (this.pontoColisao.y < Math.min(linha.yInicial, linha.yFinal) - largura_linha / 2 || this.pontoColisao.y > Math.max(linha.yInicial, linha.yFinal) + largura_linha / 2) {
                continue;
            }

            let direcao_linha = (linha.yFinal - linha.yInicial) * (linha.xFinal - linha.xInicial) / Math.abs(linha.xFinal - linha.xInicial);
            direcao_linha /= Math.abs(direcao_linha);
            if (direcao_linha == this.vetorX.direcao) {
                continue;
            }

            let a, b;
            if (linha.xFinal - linha.xInicial == 0) {
                continue;
            } else {
                a = (linha.yFinal - linha.yInicial) / (linha.xFinal - linha.xInicial);
                b = (linha.yInicial * linha.xFinal - linha.yFinal * linha.xInicial) / ((linha.xFinal - linha.xInicial));
            }

            let x_interseccao = (this.pontoColisao.y - largura_linha - b) / a;
            if (x_interseccao < Math.min(this.pontoColisao.x, this.x + this.larguraSprite / 2) - largura_linha / 2 || x_interseccao > Math.max(this.pontoColisao.x, this.x + this.larguraSprite / 2) + largura_linha / 2) {
                continue;
            }

            let distancia_interseccao = Math.abs(x_interseccao - this.pontoColisao.x);
            if (linha_atravessada == null || distancia_interseccao < linha_atravessada.distancia) {
                linha_atravessada = {
                    lei_formacao: {
                        coeficiente_a: a,
                        coeficiente_b: b
                    },

                    distancia: distancia_interseccao
                }
            }
        }

        this.y += this.vetorY.velocidade * this.vetorY.direcao;

        console.log(linha_atravessada);
        if (atravessou_chao_horizontal || atravessou_chao_vertical) {
            this.y = this.pontoColisao.chao.lei_formacao.coeficiente_a * (this.x + this.larguraSprite / 2) + this.pontoColisao.chao.lei_formacao.coeficiente_b - this.alturaSprite;
        }
        if (linha_atravessada != null) {
            this.y = linha_atravessada.lei_formacao.coeficiente_a * (this.x + this.larguraSprite / 2) + linha_atravessada.lei_formacao.coeficiente_b - this.alturaSprite;
        }
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
