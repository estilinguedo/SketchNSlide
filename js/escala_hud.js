let tags = [];
let razao_atual;

function inicializa_escala_hud() {
    for (let tag of document.getElementsByClassName("tamanho-fixo")) {
        tags.push({
            referencia: tag,
            altura_fixa: tag.getBoundingClientRect().height,
            largura_fixa: tag.getBoundingClientRect().width,
        });
    }

    escala_hud()
}

function escala_hud() {
    if (window.devicePixelRatio == razao_atual) {
        setTimeout(escala_hud, 50);
        return;
    }

    razao_atual = window.devicePixelRatio;
    for (let tag of tags) {
        tag.referencia.style.height = `${tag.altura_fixa / razao_atual}px`;
        tag.referencia.style.width = `${tag.largura_fixa / razao_atual}px`;
    }

    setTimeout(escala_hud, 50);
}