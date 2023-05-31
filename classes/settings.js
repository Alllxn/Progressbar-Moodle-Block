class Settings {
    datos_lista_plantillas = (document.getElementById("id_s_block_barra_progreso_json_string").value != "") ? JSON.parse(document.getElementById("id_s_block_barra_progreso_json_string").value) : [];

    actualizar_lista_plantillas(){
        document.getElementById("lista_plantillas").innerHTML = "";

        if(this.datos_lista_plantillas.length == 0){
            document.getElementById("lista_plantillas").innerHTML = "<li><span>Aun no existen plantillas.</span></li>";
        }

        for (let i = 0; i < this.datos_lista_plantillas.length; i++) {
            let value_esta_plantilla = Object.values(this.datos_lista_plantillas[i])[0];
            // let key_esta_plantilla = Object.keys(this.datos_lista_plantillas[i])[0];
            
            let li_elemento = document.createElement("li");
            li_elemento.className = "elemento_plantillas";
            li_elemento.id = "elemento_" + value_esta_plantilla.nombre_plantilla.replaceAll(" ","_");
            li_elemento.innerHTML = value_esta_plantilla.nombre_plantilla; 

            let editar_button_plantilla = document.createElement("button");
            editar_button_plantilla.className = "editar_plantilla";
            editar_button_plantilla.type = "button";
            editar_button_plantilla.innerHTML = '<i class="icon fa fa-pencil fa-fw" aria-hidden="true"></i>';
            editar_button_plantilla.addEventListener("click", function(){
                console.log('editando');
            });
            
            let borrar_button_plantilla = document.createElement("button");
            borrar_button_plantilla.className = "borrar_plantilla";
            borrar_button_plantilla.type = "button";
            borrar_button_plantilla.innerHTML = '<i class="icon fa fa-trash fa-fw" aria-hidden="true"></i>';
            borrar_button_plantilla.addEventListener("click", function(){
                console.log('borrando');
            });

            let campo_oculto_ponderacion = document.createElement("input");
            campo_oculto_ponderacion.type = "hidden";
            campo_oculto_ponderacion.className = "campo_oculto_plantilla";
            campo_oculto_ponderacion.value = JSON.stringify(this.datos_lista_plantillas[i]);

            li_elemento.appendChild(editar_button_plantilla);
            li_elemento.appendChild(borrar_button_plantilla);
            li_elemento.appendChild(campo_oculto_ponderacion);

            document.getElementById("lista_plantillas").appendChild(li_elemento);
        }
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
            for (let i = 0; i < this.datos_lista_plantillas.length; i++) {
                let nombre_id = Object.keys(this.datos_lista_plantillas[i])[0];
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
        
        this.datos_lista_plantillas.push(objPlantilla);
        document.getElementById("id_s_block_barra_progreso_json_string").value = JSON.stringify(this.datos_lista_plantillas);
        this.actualizar_lista_plantillas();
        this.limpiar_crear_plantilla();
    }

    limpiar_crear_plantilla(){
        let ventana_crear = document.getElementById("ventana_crear");
        let crear_plantilla = document.getElementById("crear_plantilla");
        let input_nombre_plantilla = document.getElementById("input_nombre_plantilla");
        let total_ponderaciones = document.getElementById("total_ponderaciones");
        let lista_ponderaciones = document.getElementById("lista_ponderaciones");
        let array_item_checkbox_categorias = document.getElementsByClassName("item_checkbox_categorias");
        // let input_porcentaje_ponderacion = document.getElementById("input_porcentaje_ponderacion");

        crear_plantilla.style.display = "block";
        ventana_crear.style.display = "none";
        input_nombre_plantilla.value = "";
        total_ponderaciones.innerHTML = "0%";
        lista_ponderaciones.innerHTML = '<li id="item_lista_vacia_ponderaciones">Ninguna</li>';
        // input_porcentaje_ponderacion.value = 0;
        // // let input_porcentaje_ponderacion = document.getElementById("input_porcentaje_ponderacion");
        for (let i = 0; i < array_item_checkbox_categorias.length; i++) {
            if(array_item_checkbox_categorias[i].id == "todas_categorias"){
                array_item_checkbox_categorias[i].checked = true;
            }else{
                array_item_checkbox_categorias[i].checked = false;
            } 
        }
        this.limpiar_crear_ponderacion();
    }

    limpiar_crear_ponderacion(){
        let contenedor_crear_editar_ponderaciones = document.getElementById("contenedor_crear_editar_ponderaciones");
        let boton_aniadir_ponderacion = document.getElementById("boton_aniadir_ponderacion");
        let input_palabra_clave = document.getElementById("input_palabra_clave");
        let input_porcentaje_ponderacion = document.getElementById("input_porcentaje_ponderacion");
        let array_item_checkbox_modulos = document.getElementsByClassName("item_checkbox_modulos");

        contenedor_crear_editar_ponderaciones.style.display = "none";
        boton_aniadir_ponderacion.style.display = "inline-block";
        input_palabra_clave.value = "";
        input_porcentaje_ponderacion.value = 0;
        for (let i = 0; i < array_item_checkbox_modulos.length; i++) {
            if(array_item_checkbox_modulos[i].id == "todos_modulos"){
                array_item_checkbox_modulos[i].checked = true;
            }else{
                array_item_checkbox_modulos[i].checked = false;
            } 
        }
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
        this.limpiar_crear_ponderacion();
    }

    abrir_crear_ponderacion(){
        let contenedor_crear_editar_ponderaciones = document.getElementById("contenedor_crear_editar_ponderaciones");
        let boton_aniadir_ponderacion = document.getElementById("boton_aniadir_ponderacion");

        contenedor_crear_editar_ponderaciones.style.display = "flex";
        boton_aniadir_ponderacion.style.display = "none";
    }

    inicializar_settings(){
        this.actualizar_lista_plantillas();

        document.getElementById("boton_crear_plantilla").addEventListener("click", function(){
            this.crear_plantilla();
        }.bind(this));

        // document.getElementById("boton_gestionar_plantillas").addEventListener("click", function(){
        //     this.abrir_gestionar_plantilla();
        // }.bind(this));
        
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