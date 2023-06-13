class Settings {
    /** Todos los datos de las plantillas existentes transformados en JSON */
    datos_lista_plantillas = (document.getElementById("id_s_block_barra_progreso_json_string").value != "") ? JSON.parse(document.getElementById("id_s_block_barra_progreso_json_string").value) : [];

    /**
     * 
     * Actualiza la lista con los datos de las plantillas
     * @returns {Void}
     */
    actualizar_lista_plantillas(){
        document.getElementById("lista_plantillas").innerHTML = "";

        for (let i = 0; i < this.datos_lista_plantillas.length; i++) {
            let value_esta_plantilla = this.datos_lista_plantillas[i];
            
            let li_elemento = document.createElement("li");
            li_elemento.className = "elemento_plantillas";
            li_elemento.id = "elemento_" + value_esta_plantilla.nombre_plantilla.replaceAll(" ","_");

            let editar_button_plantilla = document.createElement("button");
            editar_button_plantilla.className = "editar_plantilla";
            editar_button_plantilla.type = "button";
            editar_button_plantilla.innerHTML = '<i class="icon fa fa-pencil fa-fw" aria-hidden="true"></i>';
            editar_button_plantilla.addEventListener("click", function(){
                this.montar_editar_plantilla(this.datos_lista_plantillas[i]);
            }.bind(this));
            
            let borrar_button_plantilla = document.createElement("button");
            borrar_button_plantilla.className = "borrar_plantilla";
            borrar_button_plantilla.type = "button";
            borrar_button_plantilla.innerHTML = '<i class="icon fa fa-trash fa-fw" aria-hidden="true"></i>';
            borrar_button_plantilla.addEventListener("click", function(){
                this.borrar_plantilla(this.datos_lista_plantillas[i]);
            }.bind(this));

            let contenedor_botones_plantilla = document.createElement("div");
            contenedor_botones_plantilla.className = "contenedor_botones_plantilla";

            let texto_plantilla = document.createElement("span");
            texto_plantilla.innerHTML = value_esta_plantilla.nombre_plantilla;

            contenedor_botones_plantilla.appendChild(editar_button_plantilla);
            contenedor_botones_plantilla.appendChild(borrar_button_plantilla);
            li_elemento.appendChild(texto_plantilla);
            li_elemento.appendChild(contenedor_botones_plantilla);

            document.getElementById("lista_plantillas").appendChild(li_elemento);
        }
        
        if(this.datos_lista_plantillas.length == 0){
            document.getElementById("lista_plantillas").innerHTML = "<li><span>Aun no existen plantillas.</span></li>";
        }

        document.getElementById("id_s_block_barra_progreso_json_string").value = JSON.stringify(this.datos_lista_plantillas);
    }    

    /**
     * 
     * Abre y monta el formulario para crear una nueva plantilla
     * @returns {Void}
     */
    abrir_crear_plantilla(){
        this.limpiar_crear_plantilla();
        document.getElementById("titulo_crear_editar_plantilla").innerHTML = "Crear nueva plantilla";

        let ventana_crear = document.getElementById("ventana_crear");
        ventana_crear.style.display = "flex";
        
        document.getElementById("titulo_crear_editar_plantilla").innerHTML = "Crear nueva plantilla";
        
        if(document.getElementById("boton_editar_plantilla")){
            document.getElementById("boton_editar_plantilla").remove();
            let boton_crear_plantilla = document.createElement("button");
                boton_crear_plantilla.type = "button";
                boton_crear_plantilla.id = "boton_crear_plantilla";
                boton_crear_plantilla.innerHTML = "Crear plantilla";
                boton_crear_plantilla.addEventListener("click", function(){
                    this.crear_plantilla();
                }.bind(this));

            document.getElementById("contenedor_boton_crear_editar_plantilla").appendChild(boton_crear_plantilla);
        }
    }

    /**
     * 
     * Valida los datos introducidos en el formulario de crear plantilla e introduce esa nueva plantilla a la lista
     * @returns {Void}
     */
    crear_plantilla(){
        let plantilla = {
            nombre_plantilla: document.getElementById("input_nombre_plantilla").value,
            categorias : [],
            ponderaciones: [],
            total_ponderaciones : parseInt(document.getElementById("total_ponderaciones").innerHTML)
        }

        for (let i = 0; i < document.getElementsByClassName("item_checkbox_categorias").length; i++) {
            if(document.getElementsByClassName("item_checkbox_categorias")[i].checked){
                plantilla.categorias.push(document.getElementsByClassName("item_checkbox_categorias")[i].value)
            }
        }

        for (let i = 0; i < document.getElementsByClassName("campo_oculto_ponderacion").length; i++) {
            plantilla.ponderaciones.push(JSON.parse(document.getElementsByClassName("campo_oculto_ponderacion")[i].value))
        }

        if(this.validar_plantilla(plantilla)){
            this.datos_lista_plantillas.push(plantilla);
            this.actualizar_lista_plantillas();
            this.limpiar_crear_plantilla();
        }
    }

    /**
     * 
     * Monta el formulario con los datos de la platanilla a editar
     * @param {Object} valores_esta_plantilla Los datos de la plantilla que se quiere comenzar a editar
     * @returns {Void}
     */
    montar_editar_plantilla(valores_esta_plantilla){
        this.abrir_crear_plantilla();
        
        document.getElementById("titulo_crear_editar_plantilla").innerHTML = "Editar plantilla "+valores_esta_plantilla.nombre_plantilla;
        document.getElementById("input_nombre_plantilla").value = valores_esta_plantilla.nombre_plantilla;
        let suma_porcentajes_ponderaciones = 0;

        for (let i = 0; i < document.getElementsByClassName("item_checkbox_categorias").length; i++) {
            document.getElementsByClassName("item_checkbox_categorias")[i].checked = valores_esta_plantilla.categorias.includes(document.getElementsByClassName("item_checkbox_categorias")[i].value);
        }

        for (let i = 0; i < valores_esta_plantilla.ponderaciones.length; i++) {            
            this.montar_ponderacion(valores_esta_plantilla.ponderaciones[i]);
            suma_porcentajes_ponderaciones += valores_esta_plantilla.ponderaciones[i].porcentaje;
        }

        document.getElementById("total_ponderaciones").innerHTML = suma_porcentajes_ponderaciones + "%";

        if(document.getElementById("boton_crear_plantilla")){
            document.getElementById("boton_crear_plantilla").remove();
            let boton_editar_plantilla = document.createElement("button");
                boton_editar_plantilla.type = "button";
                boton_editar_plantilla.id = "boton_editar_plantilla";
                boton_editar_plantilla.innerHTML = "Editar plantilla "+valores_esta_plantilla.nombre_plantilla;
                boton_editar_plantilla.addEventListener("click", function(){
                    this.editar_plantilla(valores_esta_plantilla);
                }.bind(this));

            document.getElementById("contenedor_boton_crear_editar_plantilla").appendChild(boton_editar_plantilla);
        }
    }

    /**
     * 
     * Edita la plantilla pasada como argumento
     * @param {Object} plantilla_editar objeto con los datos de la plantilla a editar
     * @returns {Void}
     */
    editar_plantilla(plantilla_editar){
        let objetoBuscado = this.datos_lista_plantillas.find(elemento => elemento == plantilla_editar);
        let input_nombre_plantilla = document.getElementById("input_nombre_plantilla");
        let total_ponderaciones = document.getElementById("total_ponderaciones");
        
        let array_categorias = [];
        for (let i = 0; i < document.getElementsByClassName("item_checkbox_categorias").length; i++) {
            if(document.getElementsByClassName("item_checkbox_categorias")[i].checked){
                array_categorias.push(document.getElementsByClassName("item_checkbox_categorias")[i].value)
            }
        }

        let array_ponderaciones = [];
        for (let i = 0; i < document.getElementsByClassName("campo_oculto_ponderacion").length; i++) {
            array_ponderaciones.push(JSON.parse(document.getElementsByClassName("campo_oculto_ponderacion")[i].value))
        }

        let objectoPonderacion = {
            nombre_plantilla : input_nombre_plantilla.value,
            categorias : array_categorias,
            ponderaciones : array_ponderaciones,
            total_ponderaciones : parseInt(total_ponderaciones.innerHTML)
        };
        
        if(this.validar_plantilla(objectoPonderacion, 'editar')){
            objetoBuscado.nombre_plantilla = objectoPonderacion.nombre_plantilla;
            objetoBuscado.categorias = objectoPonderacion.categorias;
            objetoBuscado.ponderaciones = objectoPonderacion.ponderaciones;
            objetoBuscado.total_ponderaciones = objectoPonderacion.total_ponderaciones;
    
            this.actualizar_lista_plantillas();
            this.limpiar_crear_plantilla();
        }
    }

    /**
     * 
     * Borra la plantilla y actualiza la lista de plantillas
     * @param {Object} plantilla_editar objeto con los datos de la plantilla a editar
     * @returns {Void}
     */
    borrar_plantilla(plantilla_editar){
        if (confirm("¿Está seguro de querer borrar la plantilla " + plantilla_editar.nombre_plantilla + "? no podrá recuperar los datos de esta plantilla.")) {
            let objetoBuscado = this.datos_lista_plantillas.find(elemento => elemento == plantilla_editar);
            let index = this.datos_lista_plantillas.indexOf(objetoBuscado);

            if (index > -1) { // Si el objeto buscado se encuentra dentro del array de plantillas
                this.datos_lista_plantillas.splice(index, 1);
            }

            this.actualizar_lista_plantillas();
            this.limpiar_crear_plantilla();
        }
    }

    /**
     * 
     * Valida los datos introducidos en el formulario
     * @param {Object} plantilla todos los datos de la plantilla a validar
     * @param {String} tipo_validacion puede ser 'editar' o 'crear'
     * @returns {Boolean}
     */
    validar_plantilla(plantilla, tipo_validacion = ""){
        let error_mensaje_nombre_plantilla = document.getElementById("error_mensaje_nombre_plantilla");
        let error_mensaje_categorias = document.getElementById("error_mensaje_categorias");
        let error_mensaje_ponderaciones_plantilla = document.getElementById("error_mensaje_ponderaciones_plantilla");

        if(plantilla.nombre_plantilla == ""){
            error_mensaje_nombre_plantilla.style.display = "block";
            error_mensaje_nombre_plantilla.innerHTML = "⚠️ Este campo no puede quedar vacío";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else if (tipo_validacion !== 'editar' && this.datos_lista_plantillas.some(e => e.nombre_plantilla === plantilla.nombre_plantilla)) {
            error_mensaje_nombre_plantilla.style.display = "block";
            error_mensaje_nombre_plantilla.innerHTML = "⚠️ Ya existe una plantilla con este nombre";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else{
            error_mensaje_nombre_plantilla.style.display = "none";
            error_mensaje_nombre_plantilla.innerHTML = "";
        }

        if(plantilla.categorias.length == 0){
            error_mensaje_categorias.style.display = "block";
            error_mensaje_categorias.innerHTML = "⚠️ Debe seleccionar al menos una opción";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else{
            error_mensaje_categorias.style.display = "none";
            error_mensaje_categorias.innerHTML = "";
        }

        if(plantilla.total_ponderaciones < 100){
            error_mensaje_ponderaciones_plantilla.style.display = "block";
            error_mensaje_ponderaciones_plantilla.innerHTML = "⚠️ Debe determinar los porcentajes de las ponderaciones para que sea 100%";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else{
            error_mensaje_ponderaciones_plantilla.style.display = "none";
            error_mensaje_ponderaciones_plantilla.innerHTML = "";
        }

        return true;
    }

    /**
     * 
     * Limpia el formulario de editar plantilla, el formulario de las ponderaciones y limpia los errores
     * @returns {void} 
     */
    limpiar_crear_plantilla(){
        let ventana_crear = document.getElementById("ventana_crear");
        let crear_plantilla = document.getElementById("crear_plantilla");
        let input_nombre_plantilla = document.getElementById("input_nombre_plantilla");
        let total_ponderaciones = document.getElementById("total_ponderaciones");
        let lista_ponderaciones = document.getElementById("lista_ponderaciones");
        let array_item_checkbox_categorias = document.getElementsByClassName("item_checkbox_categorias");

        crear_plantilla.style.display = "block";
        ventana_crear.style.display = "none";
        input_nombre_plantilla.value = "";
        total_ponderaciones.innerHTML = "0%";
        lista_ponderaciones.innerHTML = '<li id="item_lista_vacia_ponderaciones">Ninguna</li>';
        
        for (let i = 0; i < array_item_checkbox_categorias.length; i++) {
            if(array_item_checkbox_categorias[i].id == "todas_categorias"){
                array_item_checkbox_categorias[i].checked = true;
            }else{
                array_item_checkbox_categorias[i].checked = false;
            } 
        }

        this.limpiar_todos_errores();
        this.limpiar_crear_ponderacion();
    }

    /**
     * 
     * Monta en la lista de ponderaciones la nueva ponderación
     * @param {Object} valores_esta_ponderación objeto con los datos introducidos en el formulario al crear una ponderación
     * @returns {void} 
     */
    montar_ponderacion(valores_esta_ponderación){
        let li_elemento = document.createElement("li");
            li_elemento.id = "elemento_ponderacion_"+valores_esta_ponderación.palabra_clave.replace(/ /g, "_");
            li_elemento.className = "elemento_ponderacion";
            li_elemento.innerHTML = '<span class="contenedor_elementos_ponderacion"><span class="elemento_ponderacion_porcentaje">['+valores_esta_ponderación.porcentaje+'%]</span> '+
            '<span class="elemento_ponderacion_palabra_clave">'+valores_esta_ponderación.palabra_clave+'</span></span>';

        let boton_editar_ponderacion = document.createElement("button");
            boton_editar_ponderacion.type = "button";
            boton_editar_ponderacion.className = "boton_editar_ponderacion";
            boton_editar_ponderacion.innerHTML = '<i class="icon fa fa-pencil fa-fw" aria-hidden="true"></i>';
            boton_editar_ponderacion.addEventListener("click", function(event){
                this.montar_editar_ponderacion(event);
                // this.montar_editar_ponderacion(event, valores_esta_ponderación);
            }.bind(this));

        let boton_borrar_ponderacion = document.createElement("button");
            boton_borrar_ponderacion.type = "button";
            boton_borrar_ponderacion.className = "boton_borrar_ponderacion";
            boton_borrar_ponderacion.innerHTML = '<i class="icon fa fa-trash fa-fw" aria-hidden="true"></i>';
            boton_borrar_ponderacion.addEventListener("click", function(event){
                // this.borrar_ponderacion(valores_esta_ponderación);
                this.borrar_ponderacion(event, valores_esta_ponderación);
            }.bind(this));

        let campo_oculto_ponderacion = document.createElement("input");
            campo_oculto_ponderacion.type = "hidden";
            campo_oculto_ponderacion.value = JSON.stringify(valores_esta_ponderación);
            campo_oculto_ponderacion.className = "campo_oculto_ponderacion";

        let contenedor_botones_ponderaciones = document.createElement("div");
            contenedor_botones_ponderaciones.className = "contenedor_botones_plantilla";

        contenedor_botones_ponderaciones.appendChild(boton_editar_ponderacion);
        contenedor_botones_ponderaciones.appendChild(boton_borrar_ponderacion);
        contenedor_botones_ponderaciones.appendChild(campo_oculto_ponderacion);
        li_elemento.appendChild(contenedor_botones_ponderaciones);

        document.getElementById("lista_ponderaciones").appendChild(li_elemento);
        
        if(document.getElementsByClassName("elemento_ponderacion").length != 0 && document.getElementById("item_lista_vacia_ponderaciones")){
            document.getElementById("item_lista_vacia_ponderaciones").remove();
        }
    }

    /**
     * 
     * Abre y monta el formulario vacio para empezar a introducir los datos de una nueva ponderación
     * @returns {void}
     */
    abrir_crear_ponderacion(){
        this.limpiar_crear_ponderacion();
        document.getElementById("contenedor_boton_crear_editar_plantilla").getElementsByTagName("BUTTON")[0].disabled = true;
        let contenedor_crear_editar_ponderaciones = document.getElementById("contenedor_crear_editar_ponderaciones");
        let titulo_crear_editar_ponderacion = document.getElementById("titulo_crear_editar_ponderacion");

        contenedor_crear_editar_ponderaciones.style.display = "flex";
        titulo_crear_editar_ponderacion.innerHTML = "Crear ponderación";
        
        if(document.getElementById("boton_editar_ponderacion")){
            document.getElementById("boton_editar_ponderacion").remove();
            let boton_crear_ponderacion = document.createElement("button");
                boton_crear_ponderacion.type = "button";
                boton_crear_ponderacion.id = "boton_crear_ponderacion";
                boton_crear_ponderacion.innerHTML = 'Crear ponderación';
                boton_crear_ponderacion.addEventListener("click", function(){
                    this.crear_ponderacion();
                }.bind(this));

            document.getElementById("contenedor_boton_crear_editar_ponderacion").appendChild(boton_crear_ponderacion);
        }
    }

    /**
     * 
     * Monta el formulario con los datos para editar una ponderación 
     * @param {Object} event objeto evento
     * @returns {void} 
     */
    montar_editar_ponderacion(event){
        this.abrir_crear_ponderacion();
        document.getElementById("contenedor_boton_crear_editar_plantilla").getElementsByTagName("BUTTON")[0].disabled = true;
        let evento_objetivo = event.currentTarget;
        let ponderacion = JSON.parse(event.currentTarget.parentNode.getElementsByClassName("campo_oculto_ponderacion")[0].value);
        let titulo_crear_editar_ponderacion = document.getElementById("titulo_crear_editar_ponderacion");
        titulo_crear_editar_ponderacion.innerHTML = 'Editar ponderación "'+ponderacion.palabra_clave+'"';

        let input_palabra_clave = document.getElementById("input_palabra_clave");
        let input_porcentaje_ponderacion = document.getElementById("input_porcentaje_ponderacion");
        let array_item_checkbox_modulos = document.getElementsByClassName("item_checkbox_modulos");

        input_palabra_clave.value = ponderacion.palabra_clave;
        input_porcentaje_ponderacion.value = ponderacion.porcentaje;
        for (let i = 0; i < array_item_checkbox_modulos.length; i++) {
            array_item_checkbox_modulos[i].checked = ponderacion.modulos.includes(array_item_checkbox_modulos[i].value);
        }

        if(document.getElementById("boton_crear_ponderacion")){
            document.getElementById("boton_crear_ponderacion").remove();
            let boton_editar_ponderacion = document.createElement("button");
                boton_editar_ponderacion.type = "button";
                boton_editar_ponderacion.id = "boton_editar_ponderacion";
                boton_editar_ponderacion.innerHTML = 'Editar ponderación "'+ponderacion.palabra_clave+'"';
                boton_editar_ponderacion.addEventListener("click", function(){
                    this.editar_ponderacion(evento_objetivo, ponderacion);
                }.bind(this));

            document.getElementById("contenedor_boton_crear_editar_ponderacion").appendChild(boton_editar_ponderacion);
        }
    }

    /**
     * 
     * @param {Object} evento_objetivo currentTarget del objeto evento 
     * @param {Object} ponderacion objeto con los datos de la ponderación que se va a modificar
     * @returns {void} 
     */
    editar_ponderacion(evento_objetivo, ponderacion){
        let objetivo = evento_objetivo.parentNode.parentNode;
        let array_modulos = [];

        for (let i = 0; i < document.getElementsByClassName("item_checkbox_modulos").length; i++) {
            if(document.getElementsByClassName("item_checkbox_modulos")[i].checked){
                array_modulos.push(document.getElementsByClassName("item_checkbox_modulos")[i].value);
            }
        }

        let nuevoObjeto = {
            palabra_clave : document.getElementById("input_palabra_clave").value,
            porcentaje : parseInt(document.getElementById("input_porcentaje_ponderacion").value),
            modulos : array_modulos
        };

        if(this.validar_form_editar_ponderacion(nuevoObjeto, ponderacion)){
            objetivo.getElementsByClassName("elemento_ponderacion_porcentaje")[0].innerHTML = '['+nuevoObjeto.porcentaje+'%]';
            objetivo.getElementsByClassName("elemento_ponderacion_palabra_clave")[0].innerHTML = nuevoObjeto.palabra_clave;
            objetivo.getElementsByClassName("campo_oculto_ponderacion")[0].value = JSON.stringify(nuevoObjeto);
        document.getElementById("contenedor_boton_crear_editar_plantilla").getElementsByTagName("BUTTON")[0].disabled = false;
            this.limpiar_crear_ponderacion();
        }
    }

    /**
     * 
     * Borra de la lista la ponderación elegida
     * @param {Object} event objeto evento
     * @param {Object} ponderacion datos de la ponderación a borrar
     * @returns {void} 
     */
    borrar_ponderacion(event, ponderacion){
        let elemento_a_borrar = event.currentTarget.parentNode.parentNode;

        if (confirm('¿Está seguro de querer borrar la ponderación "'+ponderacion.palabra_clave+'"?')) {
            elemento_a_borrar.remove();
            let arr_elementos_ponderaciones= [].slice.call(document.getElementsByClassName("elemento_ponderacion"));
            if(arr_elementos_ponderaciones.length < 1){
                document.getElementById("lista_ponderaciones").innerHTML = '<li id="item_lista_vacia_ponderaciones">Ninguna</li>';
            }
            
            document.getElementById("total_ponderaciones").innerHTML = (parseInt(document.getElementById("total_ponderaciones").innerHTML) - ponderacion.porcentaje) + "%";
            this.limpiar_crear_ponderacion();
        }
    }

    /**
     * 
     * Si pasa la validación, crea y monta la nueva ponderación
     * @returns {void} 
     */
    crear_ponderacion(){
        let ponderacion = {
            palabra_clave : document.getElementById("input_palabra_clave").value,
            porcentaje : parseInt(document.getElementById("input_porcentaje_ponderacion").value),
            modulos : []
        }

        for (let i = 0; i < document.getElementsByClassName("item_checkbox_modulos").length; i++) {
            if(document.getElementsByClassName("item_checkbox_modulos")[i].checked){
                ponderacion.modulos.push(document.getElementsByClassName("item_checkbox_modulos")[i].value);
            }
        }

        if(this.validar_form_crear_ponderacion(ponderacion)){
            this.montar_ponderacion(ponderacion);
    
            document.getElementById("total_ponderaciones").innerHTML = (parseInt(document.getElementById("total_ponderaciones").innerHTML) + ponderacion.porcentaje) + "%";
            document.getElementById("contenedor_boton_crear_editar_plantilla").getElementsByTagName("BUTTON")[0].disabled = false;
            this.limpiar_crear_ponderacion();
        }
    }

    /**
     * 
     * @param {Object} ponderacion Los cambios a la ponderación anterior
     * @param {Object} ponderacion_anterior Los datos antes de comenzar a editar la ponderación
     * @returns {Boolean} Devuelve false si no pasa la validación o true en el caso contrario
     */
    validar_form_editar_ponderacion(ponderacion, ponderacion_anterior){
        let error_mensaje_palabra_clave = document.getElementById("error_mensaje_palabra_clave");
        let error_mensaje_modulos = document.getElementById("error_mensaje_modulos");
        let error_mensaje_ponderaciones = document.getElementById("error_mensaje_ponderaciones");
        let arr_elemento_ponderacion_palabra_clave = [].slice.call(document.getElementsByClassName("elemento_ponderacion_palabra_clave"));
        let nueva_ponderacion = parseInt(document.getElementById("total_ponderaciones").innerHTML) - ponderacion_anterior.porcentaje;
        
        if(ponderacion.palabra_clave == ""){
            error_mensaje_palabra_clave.style.display = "block";
            error_mensaje_palabra_clave.innerHTML = "⚠️ Este campo no puede quedar vacío";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else if (arr_elemento_ponderacion_palabra_clave.some(e => e.innerHTML === ponderacion.palabra_clave) && ponderacion.palabra_clave !== ponderacion_anterior.palabra_clave) {
            error_mensaje_palabra_clave.style.display = "block";
            error_mensaje_palabra_clave.innerHTML = "⚠️ Esta palabra clave ya existe";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else{
            error_mensaje_palabra_clave.style.display = "none";
            error_mensaje_palabra_clave.innerHTML = "";
        }

        if(ponderacion.modulos.length === 0){
            error_mensaje_modulos.style.display = "block";
            error_mensaje_modulos.innerHTML = "⚠️ Debe seleccionar al menos un módulo";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque"; 
            return false;
        }else{
            error_mensaje_modulos.style.display = "none";
            error_mensaje_modulos.innerHTML = "";
        }        

        if(ponderacion.porcentaje + nueva_ponderacion > 100){
            error_mensaje_ponderaciones.style.display = "block";
            error_mensaje_ponderaciones.innerHTML = "⚠️ La suma de todas las ponderaciones no puede ser superior al 100%";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else{
            error_mensaje_ponderaciones.style.display = "none";
            error_mensaje_ponderaciones.innerHTML = "";
        }
        return true;
    }

    /**
     * 
     * Limpia y restaura el formulario dedicado a la ponderación
     * @returns {Void}
     */
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

    /**
     * 
     * @param {Object} ponderacion 
     * @returns {Boolean} Devuelve false si no pasa la validación o true en el caso contrario
     */
    validar_form_crear_ponderacion(ponderacion){
        let error_mensaje_palabra_clave = document.getElementById("error_mensaje_palabra_clave");
        let error_mensaje_modulos = document.getElementById("error_mensaje_modulos");
        let error_mensaje_ponderaciones = document.getElementById("error_mensaje_ponderaciones");
        let arr_elemento_ponderacion_palabra_clave = [].slice.call(document.getElementsByClassName("elemento_ponderacion_palabra_clave"));

        if(ponderacion.palabra_clave == ""){
            error_mensaje_palabra_clave.style.display = "block";
            error_mensaje_palabra_clave.innerHTML = "⚠️ Este campo no puede quedar vacío";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else if (arr_elemento_ponderacion_palabra_clave.some(e => e.innerHTML === ponderacion.palabra_clave)) {
            error_mensaje_palabra_clave.style.display = "block";
            error_mensaje_palabra_clave.innerHTML = "⚠️ Esta palabra clave ya existe";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else{
            error_mensaje_palabra_clave.style.display = "none";
            error_mensaje_palabra_clave.innerHTML = "";
        }

        if(ponderacion.modulos.length === 0){
            error_mensaje_modulos.style.display = "block";
            error_mensaje_modulos.innerHTML = "⚠️ Debe seleccionar al menos un módulo";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque"; 
            return false;
        }else{
            error_mensaje_modulos.style.display = "none";
            error_mensaje_modulos.innerHTML = "";
        }

        if(ponderacion.porcentaje + parseInt(document.getElementById("total_ponderaciones").innerHTML) > 100){
            error_mensaje_ponderaciones.style.display = "block";
            error_mensaje_ponderaciones.innerHTML = "⚠️ La suma de todas las ponderaciones no puede ser superior al 100%";
            document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
            return false;
        }else{
            error_mensaje_ponderaciones.style.display = "none";
            error_mensaje_ponderaciones.innerHTML = "";
        }

        return true;
    }

    /**
     * 
     * Comprueba y modifica los checkbox de las categorias cuando alguna cambia
     * @returns {void}
     */
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

    /**
     * 
     * Comprueba y modifica los checkbox de los modulos cuando alguno cambia
     * @returns {void}
     */
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

    /**
     * 
     * Limpia y quita los errores
     * @returns {void}
     */
    limpiar_todos_errores(){
        for (let i = 0; i < document.getElementsByClassName("error_mensaje").length; i++) {
            document.getElementsByClassName("error_mensaje")[i].innerHTML = "";
            document.getElementsByClassName("error_mensaje")[i].style.display = "none";
        }
    }

    /**
     * 
     * Inicializa y añade los eventos a los botones
     * @returns {void}
     */
    inicializar_settings(){
        this.actualizar_lista_plantillas();

        document.getElementById("boton_crear_plantilla").addEventListener("click", function(){
            this.crear_plantilla();
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