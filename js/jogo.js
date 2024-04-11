let canvasJogo;
function inicializa_canvas() {
    canvasJogo = document.getElementById("canvas-jogo");
    canvasJogo.height = window.innerHeight;
    canvasJogo.width = window.innerWidth;
}

let ferramentaAtual = "lapis";
function atualiza_ferramenta() {
    ferramentaAtual = document.getElementById("ferramenta-atual").value;
    console.log(ferramentaAtual);
}

let corAtual = "azul";
function atualiza_cor() {
    corAtual = document.getElementById("cor-atual").value;
    console.log(corAtual);
}

let statusTempo = "stop";
function atualiza_status() {
    statusTempo = document.getElementById("status-atual").value;
}