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
    canvasJogo.addEventListener('mousemove', (event) => desenho.mousePressionado(event, ferramentaAtual, corAtual));
    canvasJogo.addEventListener('mouseup', (event) => desenho.mouseLevantado(event, corAtual));
    canvasJogo.addEventListener('mouseleave', (event) => desenho.mouseSaiu(corAtual)); 
    const game = () => { // Limpa e desenha a cada frame
        canvasJogo.height = window.innerHeight;// O tamanho deve ser atualizado para manter o site funcionando
        canvasJogo.width = window.innerWidth;
        ctx.clearRect(0, 0, canvasJogo.width, canvasJogo.height);
        for (const bandeira of bandeiras) {
            bandeira.desenharBandeira();
        }
        for (const jogador of jogadores) { // Pausa o jogo
            if (statusTempo === 'play') {
                jogador.jogando = true;
            } else {
                jogador.jogando = false;
            }
            jogador.desenharJogador();
        }
        desenho.desenharLinhasExistentes();
        desenho.desenharBorracha();   
        desenho.desenharLinhaTemporaria(corAtual);
        if (desenho.desenhando) {
            desenho.desenharLinhaTemporaria();
        }
       
        requestAnimationFrame(game);
    }
    requestAnimationFrame(game);
}

let ferramentaAtual;
let corAtual;
let statusTempo;
function inicializa_selecionados() {
    ferramentaAtual = document.querySelector("input[name='ferramenta']:checked").value;
    corAtual = document.querySelector("input[name='cor']:checked").value;
    atualiza('status'); // Aplique o status inicial
}

function atualiza(variavel) {
    let valor_novo = document.querySelector(`input[name='${variavel}']:checked`).value;
    switch (variavel) {
        case "ferramenta":
            ferramentaAtual = valor_novo;
            console.log(ferramentaAtual);
            document.getElementById("botoes-cor").style.display = (["lapis", "linha"].includes(ferramentaAtual)) ? "" : "none";
            break;
        case "cor":
            corAtual = valor_novo;
            break;
        case "status":        
            aplica_status_novo(valor_novo);     
            break;
    }
}

function aplica_status_novo(valor_novo) {
    const novoStatus = valor_novo;

    if (statusTempo !== 'pause' && novoStatus === 'play') { // Reinicia o jogo caso o jogador não tenha pausado o jogo(se o jogador pausar o jogo ele não irá ser reiniciado, continuando de onde parou)
        console.log("boom");
        for (const jogador of jogadores) {
            jogador.start();  
        }
    } else {
        if (novoStatus === 'stop') {
            for (const jogador of jogadores) {
                jogador.stop();  
            }
            
        } 
    }
    statusTempo = novoStatus;
}
