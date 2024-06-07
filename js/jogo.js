let jogadores = [];
let bandeiras = [];

function adicionarJogador(x, y) {
    let canvasJogo = document.getElementById("canvas-jogo");
    let ctx = canvasJogo.getContext('2d'); 

    // Cria uma bandeira
    const bandeira = new Bandeira(ctx, x, y); 
    bandeiras.push(bandeira);

    // Cria um jogador 
    const jogador = new Jogador(ctx, x, y);
    jogadores.push(jogador);
}

function canvas() {    
    let canvasJogo = document.getElementById("canvas-jogo");
    let ctx = canvasJogo.getContext('2d'); // Contexto do Canvas
    canvasJogo.height = window.innerHeight; 
    canvasJogo.width = window.innerWidth;

    //provisório
    adicionarJogador(100, 100); // X e o Y devem poder ser escolhidos no menu
    adicionarJogador(300, 300);

    const desenho = new Desenho(ctx);
    canvasJogo.addEventListener('mousedown', (event) => desenho.mouseClick(event));
    canvasJogo.addEventListener('mousemove', (event) => desenho.mousePressionado(event, ferramentaAtual));
    canvasJogo.addEventListener('mouseup', (event) => desenho.mouseLevantado());
    const game=()=>{ // Limpa e desenha a cada frame
        canvasJogo.height = window.innerHeight;// O tamanho deve ser atualizado para manter o site funcionando
        canvasJogo.width = window.innerWidth;
        ctx.clearRect(0, 0, canvasJogo.width, canvasJogo.height);
        for (const bandeira of bandeiras) {
            bandeira.desenharBandeira();
        }
        for (const jogador of jogadores) { // Pausa o jogo
            if(statusTempo === 'play' ){
                jogador.jogando = true;
            }else{
                jogador.jogando = false;
            }
            jogador.desenharJogador();
           
        }
        
        desenho.desenharLinhasExistentes();
        desenho.desenharBorracha();   
        if (desenho.desenhando) {
            desenho.desenharLinhaTemporaria();
        }
       
        requestAnimationFrame(game);
    }
    requestAnimationFrame(game);
}

//A fazer
let ferramentaAtual;
let corAtual;
let statusTempo;
function inicializa_selecionados() {
    ferramentaAtual = document.querySelector("input[name='ferramenta']:checked").value;
    corAtual = document.querySelector("input[name='cor']:checked").value;
    statusTempo = document.querySelector("input[name='status']:checked").value;
}

function atualiza(variavel) {
    let valor_novo = document.querySelector(`input[name='${variavel}']:checked`).value;

    switch (variavel) {
        case "ferramenta":
            ferramentaAtual = valor_novo;

            document.getElementById("botoes-cor").style.display = (["lapis", "linha"].includes(ferramentaAtual)) ? "" : "none";
            break;
        case "cor":
            corAtual = valor_novo;
            console.log("a");
            break;
        case "status":
            let status_mudou = (statusTempo != valor_novo);

            statusTempo = valor_novo;
            if (status_mudou) {
                aplica_status_novo();
            }
    }
}

//Feito
function aplica_status_novo() {
    switch (statusTempo) {
        case "play":
            for (const jogador of jogadores) {
                jogador.start();  
            }
            break;
        case "stop":
            for (const jogador of jogadores) {
                jogador.stop();  
            }
        case "pause":
            console.log("jogo pausado");
            break;
    }
}