function desliza_slider() {
    let slider = document.getElementById("slider");
    let tema = document.getElementById("tema");
    
    let href = window.location.href;
    let tema_claro = href.substring(0, href.lastIndexOf('/')) + "/css/dia.css";
    
    tema.href = (tema.href == tema_claro) ? "css/noite.css" : "css/dia.css";
    slider.style.left = (slider.style.left == "") ? "66%" : "";
    slider.style.backgroundImage = (slider.style.backgroundImage == "") ? 'url("./img/tema_escuro.svg")' : "";
}