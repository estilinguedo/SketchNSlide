function mostra_opcoes() {
    let menu_opcoes = document.getElementById("menu-opcoes");

    menu_opcoes.style.left = (menu_opcoes.style.left == "") ? "0px" : "";
}

function carrega_input(){
    const musiquinha = document.getElementById("musica");
    musiquinha.addEventListener("change", puxa_musica, false);
}
function puxa_musica() {
    var musica = this.files[0];
    console.log(musica);
    const musica_URL = URL.createObjectURL(musica);
    var audio = new Audio(musica_URL);
}
function toca_musica(){
    audio.play();
}