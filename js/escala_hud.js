let tags = [];
let razao_anterior;

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
    for (let tag of tags) {
        tag.referencia.style.height = `${tag.altura_fixa / window.devicePixelRatio}px`;
        tag.referencia.style.width = `${tag.largura_fixa / window.devicePixelRatio}px`;
    }

    razao_anterior = window.devicePixelRatio;
    setTimeout(escala_hud, 500);
}