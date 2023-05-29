function comprobar_visualizacion_elementos(){
    var elementos_personalizar = document.getElementById("elementos_personalizar");
    var id_config_personalizar_barra = document.getElementById("id_config_personalizar_barra");

    // (id_config_personalizar_barra.value == 1) ? elementos_personalizar.style.display = "block" : elementos_personalizar.style.display = "none";
    if(id_config_personalizar_barra.value == 1){
        elementos_personalizar.style.display = "block";
        for (let i = 0; i < document.getElementsByClassName('input_config_instancia_bloque').length; i++) {
            document.getElementsByClassName('input_config_instancia_bloque')[i].getElementsByClassName("custom-select")[0].disabled = false;   
        }
    }else{
        elementos_personalizar.style.display = "none";
        for (let i = 0; i < document.getElementsByClassName('input_config_instancia_bloque').length; i++) {
            document.getElementsByClassName('input_config_instancia_bloque')[i].getElementsByClassName("custom-select")[0].disabled = true;   
        }
    }
}

function comprobar_tipo_imagen_modulo(event){
    const img_tick = document.getElementById("img_tick");
    const img_cross = document.getElementById("img_cross");

    var imagen_a_cambiar = event.target.parentNode.parentNode.parentNode.getElementsByClassName("imagenes_estado")[0];

    if(event.target.value == 1){
        imagen_a_cambiar.src = img_tick.src;
    }else{
        imagen_a_cambiar.src = img_cross.src;
    }
}

function comprobacion_general_tipo_imagen_modulo(){
    const img_tick = document.getElementById("img_tick");
    const img_cross = document.getElementById("img_cross");

    var list_wrapper_cm = document.getElementsByClassName("wrapper_cm");

    for (let i = 0; i < list_wrapper_cm.length; i++) {
        
        let select_target = list_wrapper_cm[i].getElementsByClassName("custom-select")[0];
        let img_target = list_wrapper_cm[i].getElementsByClassName("imagenes_estado")[0];

        if(select_target.value == 1){
            img_target.src = img_tick.src;
        }else{
            img_target.src = img_cross.src;

        }        
    }

}

if(document.getElementById("elementos_personalizar")){
    window.addEventListener("load", function(event) {
            comprobar_visualizacion_elementos();
            comprobacion_general_tipo_imagen_modulo();
    });
}