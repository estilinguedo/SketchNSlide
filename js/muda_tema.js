function desliza_slider() {
    var slider = document.getElementById("slider");
    var tema = document.getElementById("tema");
    
    var href = window.location.href;
    var dir = href.substring(0, href.lastIndexOf('/')) + "/";
    
    if (tema.href == dir + "css/noite.css"){
        tema.href = "css/dia.css";
    } else {
        tema.href = "css/noite.css";
    }

    slider.style.left = (slider.style.left == "") ? "66%" : "";
    slider.style.backgroundImage = (slider.style.backgroundImage == "") ? 'url("./img/tema_escuro.svg")' : "";
}