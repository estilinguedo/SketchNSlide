class Desenho {
    constructor(ctx) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.linhas = [];
        this.desenhando = false;
        this.larguraLinha = 4;
        this.tamanhoMinimoLinha = 1.5;
        this.tamanhoMinimoLapis = 10;
        this.larguraBorracha = 40;
        this.posicaoMouse = { x: 0, y: 0 }; 
        this.mouseNaTela = false;
    }

    linhaColisao(xInicial, yInicial, xFinal, yFinal, posX, posY) {
        const buffer = this.larguraBorracha /2;
        const dentroSegmento = (px, py, x0, y0, x1, y1) => {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            return px >= minX - buffer  && px <= maxX + buffer && py >= minY - buffer && py <= maxY + buffer; // Se a posição do mouse estiver dentro da linha
        };
        if (dentroSegmento(posX, posY, xInicial, yInicial, xFinal, yFinal)) {
            console.log("encostou");
            return true;
        }
        return false;
    }

    mouseClick(event, ferramentaAtual) {
        if(event.button === 0 && this.mouseNaTela){    
            this.ferramentaAtual = ferramentaAtual;
            const posX = event.clientX;
            const posY = event.clientY;
            this.desenhando = (["lapis", "linha", "borracha"].includes(ferramentaAtual));
            this.mouseNaTela = true;
        

            if (this.ferramentaAtual != 'borracha') {
                this.xInicial = posX;
                this.yInicial = posY;
                this.xFinal = posX;
                this.yFinal = posY;
            } else {
                this.linhas = this.linhas.filter(linha => !this.linhaColisao(linha.xInicial, linha.yInicial, linha.xFinal, linha.yFinal, posX, posY));
              
            }
        }
    }

    mousePressionado(event, ferramentaAtual, corAtual) {
        if(!this.mouseNaTela) {
            return;
        }

        this.posicaoMouse = { 
            x: event.clientX,
            y: event.clientY 
        };

        this.ferramentaAtual = ferramentaAtual;    
        this.xFinal = event.clientX;
        this.yFinal = event.clientY; 

        if (this.desenhando) {        
            if(this.ferramentaAtual == "lapis") {
                this.novaLinha(corAtual);
            }    
            if (this.ferramentaAtual == 'borracha') {
                this.linhas = this.linhas.filter(linha => !this.linhaColisao(linha.xInicial, linha.yInicial, linha.xFinal, linha.yFinal, this.xFinal, this.yFinal));    // filter -> remove as linhas que não atenderam a condição
            }    
        }   
    }

    mouseLevantado(event, corAtual) {
        if(event.button === 0){
            if (this.desenhando) {
                this.novaLinha(corAtual);
            }

            this.desenhando = false;
        }
    }

    mouseSaiu() {
        if( this.ferramentaAtual == "linha" && this.desenhando){
            this.novaLinha(corAtual);
        }
        this.desenhando = false;   
        this.mouseNaTela = false;
    }

    mouseEntrou() {
        this.mouseNaTela = true;
    }

    desenharLinhaTemporaria(corAtual) {
        if(!(this.ferramentaAtual == "linha" && this.desenhando)){
            return;
        }
           
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
        if (!(this.ferramentaAtual == "borracha" && this.mouseNaTela)) {
            return;
        }
        
        let x = this.posicaoMouse.x;
        let y = this.posicaoMouse.y;
        this.ctx.fillStyle = `rgba(128, 128, 128, 0.5)`; 
        this.raio = this.larguraBorracha / 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.raio, (Math.PI / 180)*0, (Math.PI / 180)*360);
        this.ctx.fill();
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
        }

        if (this.ferramentaAtual == "lapis") {
            this.xInicial = this.xFinal;
            this.yInicial = this.yFinal;
        }
    }
}