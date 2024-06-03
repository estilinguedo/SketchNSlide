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
        canvasJogo.addEventListener('mousedown', (event) => desenho.mouseClick(event, ferramentaAtual));
        canvasJogo.addEventListener('mousemove', (event) => desenho.mousePressionado(event));
        canvasJogo.addEventListener('mouseup', (event) => desenho.mouseLevantado());
        desenho.desenharLinha();
        requestAnimationFrame(game);
    }
    requestAnimationFrame(game);
}


//A fazer
let ferramentaAtual = "lapis";
function atualiza_ferramenta() {
    ferramentaAtual = document.getElementById("ferramenta-atual").value;
    console.log(ferramentaAtual);
}
//A fazer
let corAtual = "azul";
function atualiza_cor() {
    corAtual = document.getElementById("cor-atual").value;
    console.log(corAtual);
}

//Feito
let statusTempo = "stop";
function atualiza_status() {
    const novoStatus = document.getElementById("status-atual").value;
    if (statusTempo !== 'pause' && novoStatus === 'play') { // Reinicia o jogo caso o jogador não tenha pausado o jogo(se o jogador pausar o jogo ele não irá ser reiniciado, continuando de onde parou)
        for (const jogador of jogadores) {
            jogador.start();  
        }
        // Animação no botão de start(O botão deve ficar com um círculo azul)

    }else{
        if( novoStatus === 'stop' ){
            for (const jogador of jogadores) {
                jogador.stop();  
            }
            // Animação no botão de stop

        }
        else if (novoStatus === 'play' || novoStatus === 'pause'){ // O jogador clicou para pausar o jogo
            // Animação no botão de pause(O botão deve ficar com um círculo azul)
            console.log("jogo pausado");
        }

    }
    statusTempo = novoStatus;
}