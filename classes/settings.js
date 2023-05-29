class Settings {
    // json_general = JSON.parse(document.getElementById("id_s_block_barra_progreso_json_string").value);
    // input_hidden = document.getElementById("id_s_block_barra_progreso_json_string");
    json_general = (document.getElementById("id_s_block_barra_progreso_json_string").value != "") ? JSON.parse(document.getElementById("id_s_block_barra_progreso_json_string").value) : [];

    abrir_gestionar_plantilla(){
        let ventana_modal_settings = document.getElementById("ventana_modal_settings");
        let boton_gestionar_plantillas = document.getElementById("boton_gestionar_plantillas");
        
        ventana_modal_settings.style.display = "flex";
        boton_gestionar_plantillas.style.display = "none";
    }

    abrir_crear_plantilla(){
        let ventana_crear = document.getElementById("ventana_crear");
        let crear_plantilla = document.getElementById("crear_plantilla");

        ventana_crear.style.display = "flex";
        crear_plantilla.style.display = "none";
    }

    crear_plantilla(){
        let objPlantilla = {
            ["plantilla_"+document.getElementById("input_nombre_plantilla").value.replaceAll(" ","_")] : {
                nombre_plantilla: document.getElementById("input_nombre_plantilla").value,
                categorias : [],
                ponderaciones: [],
                total_ponderaciones : parseInt(document.getElementById("total_ponderaciones").innerHTML)
            }
        }

        let plantilla = Object.values(objPlantilla)[0];

        for (let i = 0; i < document.getElementsByClassName("item_checkbox_categorias").length; i++) {
            if(document.getElementsByClassName("item_checkbox_categorias")[i].checked){
                plantilla.categorias.push(document.getElementsByClassName("item_checkbox_categorias")[i].value)
                // plantilla.categorias[]
            }
        }

        for (let i = 0; i < document.getElementsByClassName("campo_oculto_ponderacion").length; i++) {
            plantilla.ponderaciones.push(JSON.parse(document.getElementsByClassName("campo_oculto_ponderacion")[i].value))
        }

        let error_mensaje_nombre_plantilla = document.getElementById("error_mensaje_nombre_plantilla");
        let error_mensaje_categorias = document.getElementById("error_mensaje_categorias");
        let error_mensaje_ponderaciones_plantilla = document.getElementById("error_mensaje_ponderaciones_plantilla");

        if(plantilla.nombre_plantilla == ""){
            error_mensaje_nombre_plantilla.style.display = "block";
            error_mensaje_nombre_plantilla.innerHTML = "⚠️ Este campo no puede quedar vacío";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return;
        }else{
            for (let i = 0; i < this.json_general.length; i++) {
                let nombre_id = Object.keys(this.json_general[i])[0];
                if("plantilla_" + plantilla.nombre_plantilla == nombre_id){
                    error_mensaje_nombre_plantilla.style.display = "block";
                    error_mensaje_nombre_plantilla.innerHTML = "⚠️ Ya existe una plantilla con este nombre";
                    document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
                    return;
                }else{
                    error_mensaje_nombre_plantilla.style.display = "none";
                    error_mensaje_nombre_plantilla.innerHTML = "";
                }
            }
        }

        if(plantilla.categorias.length == 0){
            error_mensaje_categorias.style.display = "block";
            error_mensaje_categorias.innerHTML = "⚠️ Debe seleccionar al menos una opción";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return;
        }else{
            error_mensaje_categorias.style.display = "none";
            error_mensaje_categorias.innerHTML = "";
        }

        if(plantilla.total_ponderaciones < 100){
            error_mensaje_ponderaciones_plantilla.style.display = "block";
            error_mensaje_ponderaciones_plantilla.innerHTML = "⚠️ Debe determinar los porcentajes de las ponderaciones para que sea 100%";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return;
        }else{
            error_mensaje_ponderaciones_plantilla.style.display = "none";
            error_mensaje_ponderaciones_plantilla.innerHTML = "";
        }

        let li_elemento = document.createElement("li");
        li_elemento.className = "elemento_plantillas";
        li_elemento.id = "elemento_" + plantilla.nombre_plantilla.replaceAll(" ","_");
        li_elemento.innerHTML = plantilla.nombre_plantilla; 

        console.log(li_elemento);

        // "plantilla_"+document.getElementById("input_nombre_plantilla").value.replaceAll(" ","_")
        // console.log(plantilla)
        this.json_general.push(objPlantilla);
        // console.log(this.json_general);
    }

    editar_ponderacion(ponderacion){
        console.log(ponderacion);
    }

    borrar_ponderacion(ponderacion){
        console.log(ponderacion);
    }

    comprobar_cambios_categorias(e){
        if(e.target.id == "todas_categorias"){
            for (let i = 0; i < document.getElementsByClassName("item_checkbox_categorias").length; i++) {
                if(document.getElementsByClassName("item_checkbox_categorias")[i].id != "todas_categorias"){
                    document.getElementsByClassName("item_checkbox_categorias")[i].checked = false;
                }
            }
        }else{
            document.getElementById("todas_categorias").checked = false;
        }
    }
    
    comprobar_cambios_modulos(e){
        if(e.target.id == "todos_modulos"){
            for (let i = 0; i < document.getElementsByClassName("item_checkbox_modulos").length; i++) {
                if(document.getElementsByClassName("item_checkbox_modulos")[i].id != "todos_modulos"){
                    document.getElementsByClassName("item_checkbox_modulos")[i].checked = false;
                }
            }
        }else{
            document.getElementById("todos_modulos").checked = false;
        }
    }

    crear_ponderacion(){

        let objPonderacion = {
            ["ponderacion_" + document.getElementById("input_palabra_clave").value.replaceAll(" ","_")] : {
                palabra_clave : document.getElementById("input_palabra_clave").value,
                porcentaje : parseInt(document.getElementById("input_porcentaje_ponderacion").value),
                modulos : []
            }
        };

        let ponderacion = Object.values(objPonderacion)[0];

        for (let i = 0; i < document.getElementsByClassName("item_checkbox_modulos").length; i++) {
            if(document.getElementsByClassName("item_checkbox_modulos")[i].checked){
                ponderacion.modulos.push(document.getElementsByClassName("item_checkbox_modulos")[i].value);
            }
        }

        let error_mensaje_palabra_clave = document.getElementById("error_mensaje_palabra_clave");
        let error_mensaje_modulos = document.getElementById("error_mensaje_modulos");
        let error_mensaje_ponderaciones = document.getElementById("error_mensaje_ponderaciones");
        if(ponderacion.palabra_clave == ""){
            error_mensaje_palabra_clave.style.display = "block";
            error_mensaje_palabra_clave.innerHTML = "⚠️ Este campo no puede quedar vacío";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return;
        }else{
            error_mensaje_palabra_clave.style.display = "none";
            error_mensaje_palabra_clave.innerHTML = "";
        }

        if(ponderacion.modulos.length === 0){
            error_mensaje_modulos.style.display = "block";
            error_mensaje_modulos.innerHTML = "⚠️ Debe seleccionar al menos un módulo";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return;
        }else{
            error_mensaje_modulos.style.display = "none";
            error_mensaje_modulos.innerHTML = "";
        }

        if(ponderacion.porcentaje + parseInt(document.getElementById("total_ponderaciones").innerHTML) > 100){
            error_mensaje_ponderaciones.style.display = "block";
            error_mensaje_ponderaciones.innerHTML = "⚠️ La suma de todas las ponderaciones no puede ser superior al 100%";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return;
        }else{
            error_mensaje_ponderaciones.style.display = "none";
            error_mensaje_ponderaciones.innerHTML = "";
        }

        let li_elemento = document.createElement("li");
        li_elemento.id = "elemento_ponderacion_"+ponderacion.palabra_clave.replace(/ /g, "_");
        li_elemento.className = "elemento_ponderacion";
        li_elemento.innerHTML = '<span class="elemento_ponderacion_porcentaje">['+ponderacion.porcentaje+'%]</span> '+
        '<span class="elemento_ponderacion_palabra_clave">'+ponderacion.palabra_clave+'</span>';

        let boton_editar_ponderacion = document.createElement("button");
        boton_editar_ponderacion.type = "button";
        boton_editar_ponderacion.className = "boton_editar_ponderacion";
        boton_editar_ponderacion.innerHTML = '<i class="icon fa fa-pencil fa-fw" aria-hidden="true"></i>';
        boton_editar_ponderacion.addEventListener("click", function(){
            this.editar_ponderacion(ponderacion);
        }.bind(this));

        let boton_borrar_ponderacion = document.createElement("button");
        boton_borrar_ponderacion.type = "button";
        boton_borrar_ponderacion.className = "boton_borrar_ponderacion";
        boton_borrar_ponderacion.innerHTML = '<i class="icon fa fa-trash fa-fw" aria-hidden="true"></i>';
        boton_borrar_ponderacion.addEventListener("click", function(){
            this.borrar_ponderacion(ponderacion);
        }.bind(this));

        let campo_oculto_ponderacion = document.createElement("input");
        campo_oculto_ponderacion.type = "hidden";
        campo_oculto_ponderacion.className = "campo_oculto_ponderacion";
        campo_oculto_ponderacion.value = JSON.stringify(objPonderacion);

        li_elemento.appendChild(boton_editar_ponderacion);
        li_elemento.appendChild(boton_borrar_ponderacion);
        li_elemento.appendChild(campo_oculto_ponderacion);

        document.getElementById("lista_ponderaciones").appendChild(li_elemento);

        if(document.getElementsByClassName("elemento_ponderacion").length != 0 && document.getElementById("item_lista_vacia_ponderaciones")){
            document.getElementById("item_lista_vacia_ponderaciones").remove();
        }

        document.getElementById("total_ponderaciones").innerHTML = (parseInt(document.getElementById("total_ponderaciones").innerHTML) + ponderacion.porcentaje) + "%";
    }

    abrir_crear_ponderacion(){
        let contenedor_crear_editar_ponderaciones = document.getElementById("contenedor_crear_editar_ponderaciones");
        let boton_aniadir_ponderacion = document.getElementById("boton_aniadir_ponderacion");

        contenedor_crear_editar_ponderaciones.style.display = "flex";
        boton_aniadir_ponderacion.style.display = "none";
    }

    inicializar_settings(){
        document.getElementById("boton_crear_plantilla").addEventListener("click", function(){
            this.crear_plantilla();
        }.bind(this));

        document.getElementById("boton_gestionar_plantillas").addEventListener("click", function(){
            this.abrir_gestionar_plantilla();
        }.bind(this));
        
        document.getElementById("crear_plantilla").addEventListener("click", function(){
            this.abrir_crear_plantilla();
        }.bind(this));

        document.getElementById("boton_aniadir_ponderacion").addEventListener("click", function(){
            this.abrir_crear_ponderacion();
        }.bind(this));

        document.getElementById("boton_crear_ponderacion").addEventListener("click", function(){
            this.crear_ponderacion();
        }.bind(this));

        for (let i = 0; i < document.getElementsByClassName("item_checkbox_modulos").length; i++) {
            document.getElementsByClassName("item_checkbox_modulos")[i].addEventListener("change", function(event){
                this.comprobar_cambios_modulos(event);
            }.bind(this));   
        }
        
        for (let i = 0; i < document.getElementsByClassName("item_checkbox_categorias").length; i++) {
            document.getElementsByClassName("item_checkbox_categorias")[i].addEventListener("change", function(event){
                this.comprobar_cambios_categorias(event);
            }.bind(this));
        }
    }
}