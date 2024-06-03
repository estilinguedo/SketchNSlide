class Desenho{
    constructor(ctx) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.linhas = [];
        this.pararLinha = false;
        this.larguraLinha = 4;
    }
    mouseClick(event, ferramentaAtual) {
        this.ferramentaAtual = ferramentaAtual;
        this.pararLinha = false;
        this.xInicial = event.clientX;
        this.yInicial = event.clientY;
    }
    mousePressionado(event) {
       if(this.pararLinha == false){       
            this.xFinal = event.clientX;
            this.yFinal = event.clientY;
            this.novaLinha();
        }
    }
    
    mouseLevantado() {
        this.pararLinha = true;
        this.novaLinha();
    }

    desenharLinha() {
        this.ctx.lineWidth = this.larguraLinha;
        this.ctx.beginPath();
        for (const linha of this.linhas) {
            this.ctx.moveTo(linha.xInicial, linha.yInicial);
            this.ctx.lineTo(linha.xFinal, linha.yFinal);
        }
        this.ctx.stroke();
    }

    novaLinha() {
        this.maxX =2;
        this.maxY =2;
        if(this.ferramentaAtual === "lapis"){
           
            let tamanhoX = this.xFinal - this.xInicial;
            let tamanhoY = this.yFinal - this.yInicial;
            if(tamanhoX >this.maxX){
            tamanhoX = this.maxX;
            }
            if(tamanhoY > this.maxY){
            tamanhoY = this.maxY;
            }
            this.linhas.push({
                xInicial: this.xInicial,
                yInicial: this.yInicial,
                xFinal: this.xFinal,
                yFinal: this.yFinal
            });
            this.xInicial = this.xFinal;
            this.yInicial = this.yFinal;
           
        }else if(this.ferramentaAtual === "linha"){
            
            if(this.pararLinha == true){
                this.linhas.push({
                    xInicial: this.xInicial,
                    yInicial: this.yInicial,
                    xFinal: this.xFinal,
                    yFinal: this.yFinal
                });
                this.xInicial = this.xFinal;
                this.yInicial = this.yFinal;
                
            }else{
                this.ctx.beginPath();
                this.ctx.moveTo(this.xInicial, this.yInicial);
                this.ctx.lineTo(this.xFinal, this.yFinal);
                this.ctx.stroke();
            }
        }
     
    }
} 