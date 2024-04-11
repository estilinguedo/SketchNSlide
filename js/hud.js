function mostra_opcoes() {
    let menu_opcoes = document.getElementById("menu-opcoes");

    menu_opcoes.style.left = (menu_opcoes.style.left == "") ? "0px" : "";
}

function troca_ferramenta(ferramenta) {
    document.getElementById("ferramenta-atual").value = ferramenta;
}

function troca_cor(cor) {
    document.getElementById("cor-atual").value = cor;
}

function troca_status(status) {
    document.getElementById("status-atual").value = status;
}