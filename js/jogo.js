let jogadores = [];
let bandeiras = [];

let hora_anterior = Date.now();
let delta_time = 0;
setInterval(function() {
    let hora_atual = Date.now()
    delta_time = (hora_atual - hora_anterior) / 1000;
    hora_anterior = hora_atual;

    //console.log(delta_time);
}, 0);


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
    canvasJogo.height = 5000; 
    canvasJogo.width = 10000;
    const retangulo = canvasJogo.getBoundingClientRect();

    //provisório
    adicionarJogador(100 - retangulo.left, 100 - retangulo.top); // X e o Y devem poder ser escolhidos no menu
    adicionarJogador(300 - retangulo.left, 300 - retangulo.top);

    const desenho = new Desenho(ctx);
    canvasJogo.addEventListener('mousedown', (event) => desenho.mouseClick(event, ferramentaAtual, canvasJogo));
    canvasJogo.addEventListener('mousemove', (event) => desenho.mousePressionado(event, ferramentaAtual, corAtual, canvasJogo));
    canvasJogo.addEventListener('mouseup', (event) => desenho.mouseLevantado(event, corAtual));
    canvasJogo.addEventListener('mouseleave', () => desenho.mouseSaiu(corAtual)); 
    
    canvasJogo.addEventListener('mouseenter', () => desenho.mouseEntrou());
    
    const game = () => { // Limpa e desenha a cada frame
        canvasJogo.height = 5000;// O tamanho deve ser atualizado para manter o site funcionando
        canvasJogo.width = 10000;
        ctx.clearRect(0, 0, canvasJogo.width, canvasJogo.height);
        for (const bandeira of bandeiras) {
            bandeira.desenharBandeira();
        }
        for (const jogador of jogadores) { // Pausa o jogo
            if (statusTempo === 'play') {
                jogador.jogando = true;
                jogador.atualizarHitbox();
            } else {
                jogador.jogando = false;
            }
            jogador.verificarColisao(desenho);
            jogador.desenharJogador(delta_time);
        }
        desenho.desenharLinhasExistentes();
        desenho.desenharAreaSelecao();

        if (desenho.ferramentaAtual == "borracha") {
            desenho.desenharBorracha();
        }

        if (desenho.desenhando) {
            if (desenho.ferramentaAtual == "lapis") {
                desenho.desenharLinhaTemporaria("preto");
            }
            if (desenho.ferramentaAtual == "linha") {
                desenho.desenharLinhaTemporaria(corAtual);
            } else if (desenho.ferramentaAtual == "cursor") {
                desenho.desenharRetanguloTemporario();
            }
        }
       
        requestAnimationFrame(game);
    }
    requestAnimationFrame(game);
}

let ferramentaAtual;
let corAtual;
let statusTempo;
function inicializa_hud() {
    ferramentaAtual = document.querySelector("input[name='ferramenta']:checked").value;
    corAtual = document.querySelector("input[name='cor']:checked").value;
    atualiza('status'); // Aplique o status inicial
    atualiza("ferramenta");
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
