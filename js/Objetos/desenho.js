class Desenho {
    constructor(ctx) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.linhas = [];
        this.areaSelecionada = {
            x: 0,
            y: 0,
            largura: 0,
            altura: 0
        };
        this.linhasSelecionadas = [];
        this.desenhando = false;
        this.movendoAreaSelecionada = false;
        this.larguraLinha = 4;
        this.tamanhoMinimoLinha = 1.5;
        this.anguloLinha = NaN;
        this.larguraBorracha = 40;
        this.posicaoMouse = { x: 0, y: 0 }; 
        this.mouseNaTela = false;
    }

    colisaoBorracha(linha) {
        const raio = this.larguraBorracha / (window.devicePixelRatio * 2);

        for (let x = this.xFinal - raio; x <= this.xFinal + raio; x++) {
            for (let y = this.yFinal - raio; y <= this.yFinal + raio; y++) {
                if((Math.sqrt(Math.pow(x - this.xFinal, 2) + Math.pow(y - this.yFinal, 2)) > raio)) {
                    continue;
                } else if (x < Math.min(linha.xInicial, linha.xFinal) - this.larguraLinha / 2 || x > Math.max(linha.xInicial, linha.xFinal) + this.larguraLinha / 2) {
                    continue;
                } else if (y < Math.min(linha.yInicial, linha.yFinal) - this.larguraLinha / 2 || y > Math.max(linha.yInicial, linha.yFinal) + this.larguraLinha / 2) {
                    continue;
                }
                /*
                y = ax + b

                y1 = ax1 + b
                y2 = ax2 + b
                    y2 - y1 = a(x2 - x1)
                a = (y2 - y1) / (x2 - x1)

                y1 = (y2 - y1)x1 / (x2 - x1) + b
                    y1(x2 - x1) = (y2 - y1)x1 + b(x2 - x1)
                b(x2 - x1) = y1x2 - y1x1 - x1y2 + y1x1
                b(x2 - x1) = y1x2 - x1y2
                b = (y1x2 - x1y2) / (x2 - x1)

                |
                |
                |
                |
                */

                let a, b;
                if (linha.xFinal - linha.xInicial == 0) {
                    a = y/x;
                    b = 0;
                } else {
                    a = (linha.yFinal - linha.yInicial) / (linha.xFinal - linha.xInicial);
                    b = (linha.yInicial * linha.xFinal - linha.yFinal * linha.xInicial) / ((linha.xFinal - linha.xInicial));
                }

                if (y - this.larguraLinha / 2 < a * x + b && a * x + b < y + this.larguraLinha / 2) {
                    return true;
                }
            }
        }

        return false;
    }
    
    desenharBorracha() {
        if (!this.mouseNaTela) {
            return;
        }
        
        let x = this.posicaoMouse.x;
        let y = this.posicaoMouse.y;
        this.ctx.fillStyle = `rgba(128, 128, 128, 0.5)`; 
        const raio = this.larguraBorracha / (window.devicePixelRatio * 2);
        this.ctx.beginPath();
        this.ctx.arc(x, y, raio, (Math.PI / 180)*0, (Math.PI / 180)*360);
        this.ctx.fill();
    }

    mouseClick(event, ferramentaAtual, canvasJogo) {
        if(!(event.button === 0 && this.mouseNaTela)){
            return;
        }

        this.ferramentaAtual = ferramentaAtual;
        const retangulo = canvasJogo.getBoundingClientRect(); 
        const posX = event.clientX - retangulo.left; 
        const posY = event.clientY - retangulo.top;
        this.desenhando = true;
        this.mouseNaTela = true;
    

        if (this.ferramentaAtual == 'borracha') {
            this.linhas = this.linhas.filter(linha => !this.colisaoBorracha(linha));
            return;
        }

        this.xInicial = posX;
        this.yInicial = posY;
        this.xFinal = posX;
        this.yFinal = posY;
        
        if (this.ferramentaAtual = "cursor") {
            let area_min_x = Math.min(this.areaSelecionada.x, this.areaSelecionada.x + this.areaSelecionada.largura);
            let area_max_x = Math.max(this.areaSelecionada.x, this.areaSelecionada.x + this.areaSelecionada.largura);
            let area_min_y = Math.min(this.areaSelecionada.y, this.areaSelecionada.y + this.areaSelecionada.altura);
            let area_max_y = Math.max(this.areaSelecionada.y, this.areaSelecionada.y + this.areaSelecionada.altura);

            let projecao_area_x = [area_min_x, area_max_x];
            let projecao_area_y = [area_min_y, area_max_y];

            let mouse_dentro_area_x = (posX >= projecao_area_x[0] && posX <= projecao_area_x[1]);
            let mouse_dentro_area_y = (posY >= projecao_area_y[0] && posY <= projecao_area_y[1]);

            this.movendoAreaSelecionada = (mouse_dentro_area_x && mouse_dentro_area_y);
        }
    }

    mousePressionado(event, ferramentaAtual, corAtual, canvasJogo) {
        if(!(this.mouseNaTela)) {
            return;
        }

        const retangulo = canvasJogo.getBoundingClientRect(); 
        this.posicaoMouse = { 
            x: event.clientX - retangulo.left, 
            y: event.clientY - retangulo.top 
        };

        this.ferramentaAtual = ferramentaAtual;    
        this.xFinal = this.posicaoMouse.x;
        this.yFinal = this.posicaoMouse.y;

        if (!this.desenhando) {
            return;
        }

        if(this.ferramentaAtual == "lapis") {
            const distancia = Math.sqrt(Math.pow(this.xFinal - this.xInicial, 2) + Math.pow(this.yFinal - this.yInicial, 2));
            let angulo_novo = 0;
            if (distancia >= this.tamanhoMinimoLinha) {
                const cateto_oposto = Math.abs(this.xFinal - this.xInicial);
                angulo_novo = Math.asin(cateto_oposto/distancia) * 180/Math.PI;

                if (isNaN(this.anguloLinha)) {
                    this.anguloLinha = angulo_novo;
                }   
            }

            if (Math.abs(angulo_novo - this.anguloLinha) > 1 && this.anguloLinha != NaN) {
                this.novaLinha(corAtual);
                this.anguloLinha = NaN;
            }
        } else if (this.ferramentaAtual == 'borracha') {
            this.linhas = this.linhas.filter(linha => !this.colisaoBorracha(linha));    // filter -> remove as linhas que não atenderam a condição
        } else if (this.ferramentaAtual == "mover") {
            window.scrollBy(this.xInicial - this.xFinal, this.yInicial - this.yFinal);
        } else if (this.ferramentaAtual == "cursor" && this.movendoAreaSelecionada) {
            let offset_x = this.xFinal - this.xInicial;
            let offset_y = this.yFinal - this.yInicial;

            this.areaSelecionada.x += offset_x;
            this.areaSelecionada.y += offset_y;

            for (let i of this.linhasSelecionadas) {
                this.linhas[i].xInicial += offset_x;
                this.linhas[i].yInicial += offset_y;
                this.linhas[i].xFinal += offset_x;
                this.linhas[i].yFinal += offset_y;
            }

            this.xInicial = this.xFinal;
            this.yInicial = this.yFinal;
        }
    }

    mouseLevantado(event, corAtual) {
        if(event.button === 0) {
            if (this.desenhando) {
                if (["lapis", "linha"].includes(this.ferramentaAtual)) {
                    this.novaLinha(corAtual);
                } else if (this.ferramentaAtual == "cursor") {
                    this.criaAreaSelecao();
                }
            }

            this.desenhando = false;
        }
    }

    mouseSaiu() {
        if(this.ferramentaAtual == "linha" && this.desenhando){
            this.novaLinha(corAtual);
        }

        this.desenhando = false;
        this.movendoAreaSelecionada = false;  
        this.mouseNaTela = false;
    }

    mouseEntrou() {
        this.mouseNaTela = true;
    }

    desenharLinhaTemporaria(corAtual) {     
        this.ctx.lineWidth = this.larguraLinha;
        this.ctx.lineCap = 'round';
        
        let cor_linha = "rgb(";
        for (let cor of ["vermelho", "verde", "azul"]) {
            cor_linha += (cor == corAtual) ? "128," : "64,";
        }
        this.ctx.strokeStyle = cor_linha.substring(0, cor_linha.length - 1) + ")";
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.xInicial, this.yInicial);
        this.ctx.lineTo(this.xFinal, this.yFinal);
        this.ctx.stroke();
    }

    desenharLinhasExistentes() {
        for (const linha of this.linhas) {
            this.ctx.lineWidth = this.larguraLinha;
            this.ctx.lineCap = 'round';

            let cor_linha = "rgb(";
            for (let cor of ["vermelho", "verde", "azul"]) {
                cor_linha += (cor == linha.corLinha) ? "128," : "0,";
            }
            this.ctx.strokeStyle = cor_linha.substring(0, cor_linha.length - 1) + ")";
          
            this.ctx.beginPath();
            this.ctx.moveTo(linha.xInicial, linha.yInicial);
            this.ctx.lineTo(linha.xFinal, linha.yFinal);
            this.ctx.stroke();
            
        }
    }

    novaLinha(corAtual) {
        const distancia = Math.sqrt(Math.pow(this.xFinal - this.xInicial, 2) + Math.pow(this.yFinal - this.yInicial, 2));
        if (distancia >= this.tamanhoMinimoLinha) {
            this.linhas.push({
                xInicial: this.xInicial,
                yInicial: this.yInicial,
                xFinal: this.xFinal,
                yFinal: this.yFinal,
                corLinha: corAtual
            });

            if (this.ferramentaAtual == "lapis") {
                this.xInicial = this.xFinal;
                this.yInicial = this.yFinal;
            }
        }
    }

    desenharRetanguloTemporario() {
        if (this.movendoAreaSelecionada) {
            return;
        }

        this.ctx.lineWidth = this.larguraLinha;
        let largura_retangulo = this.xFinal - this.xInicial;
        let altura_retangulo = this.yFinal - this.yInicial;

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(64, 64, 64)";
        this.ctx.rect(this.xInicial, this.yInicial, largura_retangulo, altura_retangulo);
        this.ctx.stroke();
    }

    criaAreaSelecao() {
        this.areaSelecionada = {
            x: this.xInicial,
            y: this.yInicial,
            largura: this.xFinal - this.xInicial,
            altura: this.yFinal - this.yInicial
        }

        while (this.linhasSelecionadas.length > 0) {
            this.linhasSelecionadas.pop();
        }

        for (let i = 0; i < this.linhas.length; i++) {
            let area_min_x = Math.min(this.areaSelecionada.x, this.areaSelecionada.x + this.areaSelecionada.largura);
            let area_max_x = Math.max(this.areaSelecionada.x, this.areaSelecionada.x + this.areaSelecionada.largura);
            let area_min_y = Math.min(this.areaSelecionada.y, this.areaSelecionada.y + this.areaSelecionada.altura);
            let area_max_y = Math.max(this.areaSelecionada.y, this.areaSelecionada.y + this.areaSelecionada.altura);

            let projecao_area_x = [area_min_x, area_max_x];
            let projecao_area_y = [area_min_y, area_max_y];

            let linha_min_x = Math.min(this.linhas[i].xInicial, this.linhas[i].xFinal);
            let linha_max_x = Math.max(this.linhas[i].xInicial, this.linhas[i].xFinal);
            let linha_min_y = Math.min(this.linhas[i].yInicial, this.linhas[i].yFinal);
            let linha_max_y = Math.max(this.linhas[i].yInicial, this.linhas[i].yFinal);

            let projecao_linha_x = [linha_min_x, linha_max_x];
            let projecao_linha_y = [linha_min_y, linha_max_y];

            let linha_dentro_area_x = ((projecao_linha_x[0] >= projecao_area_x[0] && projecao_linha_x[0] <= projecao_area_x[1]) && (projecao_linha_x[1] >= projecao_area_x[0] && projecao_linha_x[1] <= projecao_area_x[1]));
            let linha_dentro_area_y = ((projecao_linha_y[0] >= projecao_area_y[0] && projecao_linha_y[0] <= projecao_area_y[1]) && (projecao_linha_y[1] >= projecao_area_y[0] && projecao_linha_y[1] <= projecao_area_y[1]));

            if (linha_dentro_area_x && linha_dentro_area_y) {
                this.linhasSelecionadas.push(i);
            }
        }
    }

    desenharAreaSelecao() {
        if (this.ferramentaAtual != "cursor") {
            this.areaSelecionada = {
                x: 0,
                y: 0,
                largura: 0,
                altura: 0
            }
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(0, 0, 0)";
        this.ctx.rect(this.areaSelecionada.x, this.areaSelecionada.y, this.areaSelecionada.largura, this.areaSelecionada.altura);
        this.ctx.stroke();
    }
}