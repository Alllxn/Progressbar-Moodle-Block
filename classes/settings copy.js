var estado_ventana_crear_plantilla = false;

function mostrar_ocultar_gestion_plantillas(event){
    event.preventDefault();
    let ventana_modal_settings = document.getElementById("ventana_modal_settings");
    let boton_gestionar_plantillas = document.getElementById("boton_gestionar_plantillas");

    boton_gestionar_plantillas.style.display = "none";
    ventana_modal_settings.style.display = "block";
}

function mostrar_ocultar_crear_nueva_plantilla(event){
    event.preventDefault();

    let crear_plantilla = document.getElementById("crear_plantilla");
    let elemento_mostrar = document.getElementById("ventana_crear");

    if(!estado_ventana_crear_plantilla){
        crear_plantilla.style.display = "none";
        elemento_mostrar.style.display = "block";
        estado_ventana_crear_plantilla = true;
    }else{
        crear_plantilla.style.display = "inline-block";
        elemento_mostrar.style.display = "none";
        estado_ventana_crear_plantilla = false;        
    }
}

function aniadir_nueva_palabra_clave(event){
    event.preventDefault();

    let input_valor = event.target.previousElementSibling.value;
    let nueva_palabra_clave = document.createElement('li');
    nueva_palabra_clave.className = 'nueva_palabra_clave';
    nueva_palabra_clave.innerHTML = input_valor;

    let mensaje_error_palabra_clave = event.target.parentNode.getElementsByClassName('mensaje_error_palabra_clave')[0];

    let elemento_donde_se_inserta = event.target.parentNode.previousElementSibling.children[1];
    let elemento_ninguno = event.target.parentNode.previousElementSibling.children[1].getElementsByClassName('ninguna_por_defecto');

    if(input_valor != ""){

        if(elemento_ninguno.length > 0){
            elemento_ninguno[0].remove();
        }

        elemento_donde_se_inserta.appendChild(nueva_palabra_clave);

        if(event.target.parentNode.getElementsByClassName('mensaje_error_palabra_clave').length > 0){
            event.target.parentNode.getElementsByClassName('mensaje_error_palabra_clave')[0].innerHTML = "";
            mensaje_error_palabra_clave.style.display = "none";
            event.target.previousElementSibling.value = "";
        }        
    }else{
        mensaje_error_palabra_clave.style.display = "block";
        mensaje_error_palabra_clave.innerHTML = '⚠️ Este campo no puede quedar vacío.';
    }
}

async function formatear_resultados_nueva_plantilla(event){
    event.preventDefault();
    
    let nombre_plantilla = document.getElementById("nombre_plantilla");
    let categoria_plantilla = document.getElementById("contenedor_checkbox_categoria");
    let contenedor_todos_modulos = document.getElementById("contenedor_todos_modulos");
    let mensaje_error_crear_plantilla = document.getElementById("mensaje_error_crear_plantilla");
    let input_hidden = document.getElementById("id_s_block_barra_progreso_json_string");
    const old_input_hidden = document.getElementById("id_s_block_barra_progreso_json_string").value;
    let valido = false;

    let nueva_plantilla = {};

    if(!nombre_plantilla.value == ""){
        mensaje_error_crear_plantilla.style.display = 'none';
        valido = true;
    }else{
        mensaje_error_crear_plantilla.style.display = 'block';
        mensaje_error_crear_plantilla.innerHTML = '⚠️ Este campo no puede quedar vacío.';
        document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
    }
    
    if(valido){
        let info_interior_plantilla = {
            categoria: [],
            modulos : []
        };

        nueva_plantilla[nombre_plantilla.value] = info_interior_plantilla;
        
        for (let i = 0; i < categoria_plantilla.children.length; i++) {
            let contenedor_checkbox = categoria_plantilla.children[i];
            let checkbox = contenedor_checkbox.getElementsByClassName("checkbox_categoria")[0];

            if(checkbox.checked){
                nueva_plantilla[nombre_plantilla.value].categoria.push(checkbox.value);
            }
        }
        
        for (let i = 0; i < contenedor_todos_modulos.children.length; i++) {
            let modulo = contenedor_todos_modulos.children[i];
            let input_check_modulo = modulo.getElementsByClassName("input_check_modulo")[0];
            let lista_elementos_palabras_clave = modulo.getElementsByClassName("lista_palabras_clave")[0].children;
            let lista_palabras_clave = [];
            
            for (let i = 0; i < lista_elementos_palabras_clave.length; i++) {
                lista_palabras_clave.push(lista_elementos_palabras_clave[i].innerHTML);
            }

            if(input_check_modulo.checked){
                nueva_plantilla[nombre_plantilla.value].modulos.push({modulo : input_check_modulo.classList[0].slice(4), palabras_clave: lista_palabras_clave});
            }
        }

        let promesa = new Promise(function(myResolve, myReject){
            let valor_input_hidden = "";

            if(input_hidden.value !== ""){
                let valor_anterior = JSON.parse(input_hidden.value);
                let nuevo_valor = nueva_plantilla;
                let valor_final = Object.assign(valor_anterior, nuevo_valor);
                valor_input_hidden = valor_final;
            }else{
                valor_input_hidden = nueva_plantilla;
            }

            input_hidden.value = JSON.stringify(valor_input_hidden);
            
            myResolve('todo_ok');
            myReject('error');
        });

        promesa.then(
            function(value){
                if(input_hidden.value === old_input_hidden){
                    // console.log('no cambió');
                }else{
                    // console.log('cambió');
                    actualizar_select_plantilla_por_defecto();
                }
            }
        );

        mostrar_ocultar_crear_nueva_plantilla(event);
    }
}

function actualizar_listas_plantillas(){
    let input_hidden = document.getElementById("id_s_block_barra_progreso_json_string");
    let datos_transformados = JSON.parse(input_hidden.value);

    let input_select_plantilla_default = document.getElementById("id_s_block_barra_progreso_plantilla");
    let lista_gestionar_plantillas = document.getElementById("lista_gestionar_plantillas");
    

    input_select_plantilla_default.innerHTML = '<option value="-" selected>-</option>';
    lista_gestionar_plantillas.innerHTML = '';
    for (let clave in datos_transformados){
        input_select_plantilla_default.innerHTML += '<option value="'+clave+'">'+clave+'</option>';
        lista_gestionar_plantillas.innerHTML += '<li class="plantilla_item">'+clave+'</li>';
    }
}

/**
 * Añadimos los eventos
 */
let input_palabra_clave = document.getElementsByClassName('input_palabra_clave');
for (let i = 0; i < input_palabra_clave.length; i++) {
    input_palabra_clave[i].addEventListener("keypress", (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            input_palabra_clave[i].nextElementSibling.click();
        }
    });
}

document.getElementById("boton_gestionar_plantillas").addEventListener("click", function(event){
    mostrar_ocultar_gestion_plantillas(event);
});

document.getElementById("crear_plantilla").addEventListener("click", function(event){
    mostrar_ocultar_crear_nueva_plantilla(event);
});

var lista_botones_aniadir_palabra_clave = document.getElementsByClassName("boton_aniadir_palabra_clave");
for (let i = 0; i < lista_botones_aniadir_palabra_clave.length; i++) {
    lista_botones_aniadir_palabra_clave[i].addEventListener("click", function(event){
        aniadir_nueva_palabra_clave(event);
    });
}

document.getElementById("botton_crear").addEventListener("click", function(event){
    formatear_resultados_nueva_plantilla(event);
});

window.onload = function(){
    actualizar_listas_plantillas();
}