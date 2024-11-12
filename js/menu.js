var audio
var pausado = false
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
    audio = new Audio(musica_URL);
}
function toca_musica(){
    if (pausado){
        if (audio.currentTime != audio.duration){
            audio.play();
            pausado = false;
        }
    } else {
        audio.currentTime = 0;
        audio.play();
    }
}
function pausa_musica(){
    audio.pause();
    pausado = true;
}
function reseta_musica(){
    audio.currentTime = 0;
    audio.pause();
}