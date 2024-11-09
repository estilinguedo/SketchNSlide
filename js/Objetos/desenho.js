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
        this.tamanhoMinimoLapis = 10;
        this.larguraBorracha = 40;
        this.posicaoMouse = { x: 0, y: 0 }; 
        this.mouseNaTela = false;
    }

    linhaColisao(xInicial, yInicial, xFinal, yFinal, posX, posY) {
        const buffer = this.larguraBorracha / (window.devicePixelRatio * 2);
        const dentroSegmento = (px, py, x0, y0, x1, y1) => {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            return px >= minX - buffer  && px <= maxX + buffer && py >= minY - buffer && py <= maxY + buffer; // Se a posição do mouse estiver dentro da linha
        };

        return dentroSegmento(posX, posY, xInicial, yInicial, xFinal, yFinal);
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
            this.linhas = this.linhas.filter(linha => !this.linhaColisao(linha.xInicial, linha.yInicial, linha.xFinal, linha.yFinal, posX, posY));
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
        if(!this.mouseNaTela) {
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

        if (this.desenhando) {        
            if(this.ferramentaAtual == "lapis") {
                this.novaLinha(corAtual);
            } else if (this.ferramentaAtual == 'borracha') {
                this.linhas = this.linhas.filter(linha => !this.linhaColisao(linha.xInicial, linha.yInicial, linha.xFinal, linha.yFinal, this.xFinal, this.yFinal));    // filter -> remove as linhas que não atenderam a condição
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
            cor_linha += (cor == corAtual) ? "128," : "0,";
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
    desenharBorracha() {
        if (!this.mouseNaTela) {
            return;
        }
        
        let x = this.posicaoMouse.x;
        let y = this.posicaoMouse.y;
        this.ctx.fillStyle = `rgba(128, 128, 128, 0.5)`; 
        this.raio = this.larguraBorracha / (window.devicePixelRatio * 2);
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.raio, (Math.PI / 180)*0, (Math.PI / 180)*360);
        this.ctx.fill();
    }

    novaLinha(corAtual) {
        let tamanho_minimo = (this.ferramentaAtual == "lapis") ? this.tamanhoMinimoLapis : this.tamanhoMinimoLinha; 

        const distancia = Math.sqrt(Math.pow(this.xFinal - this.xInicial, 2) + Math.pow(this.yFinal - this.yInicial, 2));
        if (distancia >= tamanho_minimo) {
            this.linhas.push({
                xInicial: this.xInicial,
                yInicial: this.yInicial,
                xFinal: this.xFinal,
                yFinal: this.yFinal,
                corLinha: corAtual
            });
        }

        if (this.ferramentaAtual == "lapis") {
            this.xInicial = this.xFinal;
            this.yInicial = this.yFinal;
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
        this.ctx.strokeStyle = "rgb(0, 0, 0)";
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