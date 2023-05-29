class Settings {
    input_hidden = document.getElementById("id_s_block_barra_progreso_json_string");
    plantillas = (this.input_hidden.value != "") ? JSON.parse(this.input_hidden.value) : {};

    boton_gestionar_plantillas = document.getElementById("boton_gestionar_plantillas");
    ventana_gestion_plantillas = document.getElementById("ventana_modal_settings");

    boton_crear_plantilla = document.getElementById("crear_plantilla");
    ventana_crear = document.getElementById("ventana_crear");

    estado_ventana_crear_plantilla = false;

    input_select_plantilla_default = document.getElementById("id_s_block_barra_progreso_plantilla");
    lista_gestionar_plantillas = document.getElementById("lista_gestionar_plantillas");

    // plantilla_abierta = '';

    constructor(modulos, categorias) {
        this.modulos = modulos;
        this.categorias = categorias;
    }
    
    abrir_gestion_plantillas(event){
        event.preventDefault();
        this.boton_gestionar_plantillas.style.display = "none";
        this.ventana_gestion_plantillas.style.display = "block";
    }
    
    actualizar_listas_plantillas(){    
        // let datos_transformados = (this.input_hidden.value !== "") ? JSON.parse(this.input_hidden.value) : "";

        // if(this.input_hidden.value !== "" && this.input_hidden.value !== "{}"){
        //     this.input_select_plantilla_default.innerHTML = '<option value="0">-</option>';
        //     this.lista_gestionar_plantillas.innerHTML = '';

        //     for (let clave in datos_transformados){
        //         let selected = (clave == this.plantilla_elegida) ? "selected" : "";
        //         let li_plantilla_item = document.createElement('li');
        //         li_plantilla_item.className = 'plantilla_item';
        //         this.lista_gestionar_plantillas.appendChild(li_plantilla_item);
                
        //         let div = document.createElement('div');
        //         li_plantilla_item.appendChild(div);

        //         let span = document.createElement('span');
        //         span.innerHTML = datos_transformados[clave].nombre;
        //         div.appendChild(span);

        //         let div_gestionar_plantilla = document.createElement('div');
        //         div_gestionar_plantilla.className = 'gestionar_plantilla';

        //         div.appendChild(div_gestionar_plantilla);

        //         let boton_editar_esta_plantilla = document.createElement('button');
        //         boton_editar_esta_plantilla.className = "boton_editar_esta_plantilla";
        //         boton_editar_esta_plantilla.type = "button";
        //         boton_editar_esta_plantilla.innerHTML = '<input class="datos_esta_plantilla" type="hidden" value='+"'"+JSON.stringify({ [clave] : datos_transformados[clave]})+"'"+'</input><i class="icon fa fa-pencil fa-fw " aria-hidden="true"></i>';
        //         boton_editar_esta_plantilla.onclick = function(event){
        //             this.montar_formulario_plantilla(event, 'editar');
        //         }.bind(this);

                
        //         let boton_eliminar_esta_plantilla = document.createElement('button');
        //         boton_eliminar_esta_plantilla.className = "boton_eliminar_esta_plantilla";
        //         boton_eliminar_esta_plantilla.type = "button";
        //         boton_eliminar_esta_plantilla.innerHTML = '<input class="datos_esta_plantilla" type="hidden" value='+"'"+JSON.stringify({ [clave] : datos_transformados[clave]})+"'"+'</input><i class="icon fa fa-trash fa-fw " aria-hidden="true"></i>';
        //         boton_eliminar_esta_plantilla.onclick = function(event){
        //             this.eliminar_plantilla(event);
        //         }.bind(this);

        //         div_gestionar_plantilla.append(boton_editar_esta_plantilla);
        //         div_gestionar_plantilla.append(boton_eliminar_esta_plantilla);
                
        //         this.input_select_plantilla_default.innerHTML += '<option value="'+clave+'" '+selected+'>'+datos_transformados[clave].nombre+'</option>';
        //     }
        // }else{
        //     this.input_select_plantilla_default.innerHTML = '<option value="-" selected>-</option>';
        //     this.lista_gestionar_plantillas.innerHTML = '<li>Ninguna</li>';
        // }
    }

    crear_nueva_plantilla(){        
        let input_nombre_plantilla = document.getElementById("input_nombre_plantilla");
        let error_mensaje_nombre_plantilla = document.getElementById("error_mensaje_nombre_plantilla");
        let items_checkbox_categorias = document.getElementsByClassName("item_checkbox_categorias");
        let nueva_plantilla = {};

        if (input_nombre_plantilla.value == "") {
            error_mensaje_nombre_plantilla.innerHTML = "⚠️ Este campo no puede quedar vacío";  
            document.location.href = "#input_nombre_plantilla";
            // console.log('ah')
        }else{
            let categorias = [];

            for (let i = 0; i < document.getElementsByClassName("item_checkbox_categorias").length; i++) {
                if(document.getElementsByClassName("item_checkbox_categorias")[i].checked){
                    categorias.push(document.getElementsByClassName("item_checkbox_categorias")[i].value);
                }
                
            }

            nueva_plantilla[Object.keys(this.plantillas).length + 1] = {
                nombre: input_nombre_plantilla.value,
                categorias: categorias
            };
        }

        // console.log(Object.keys(this.plantillas).length);
        console.log(nueva_plantilla);
        
    }

    crear_ponderacion(){
        let input_palabra_clave = document.getElementById("input_palabra_clave");
        let input_ponderacion = document.getElementById("input_ponderacion");
        let item_checkbox_modulos = document.getElementsByClassName("item_checkbox_modulos");
        let error_mensaje_palabra_clave = document.getElementById("error_mensaje_palabra_clave");
        let error_mensaje_modulos = document.getElementById("error_mensaje_modulos");
        let error_mensaje_ponderaciones = document.getElementById("error_mensaje_ponderaciones");
        let total_ponderaciones = parseInt(document.getElementById("total_ponderaciones").innerHTML);
        let validado = false;
        let palabra_encontrada = false;
        let palabra_clave_ponderaciones = document.getElementsByClassName("palabra_clave_ponderaciones");
        let ponderacion = {};

        ponderacion.palabra_clave = input_palabra_clave.value;
        ponderacion.porcentaje_ponderacion = input_ponderacion.value;
        ponderacion.modulos = [];

        for (let i = 0; i < item_checkbox_modulos.length; i++) {
            if (item_checkbox_modulos[i].checked) {
                ponderacion.modulos.push(item_checkbox_modulos[i].value);
            }
        }

        for (let i = 0; i < palabra_clave_ponderaciones.length; i++) {
            if(palabra_clave_ponderaciones[i].innerHTML == ponderacion.palabra_clave){
                palabra_encontrada = true;
            }
        }

        if(palabra_encontrada){
            error_mensaje_palabra_clave.innerHTML = "⚠️ Esta palabra ya está definida, por favor elija otra"; 
            document.location.href = "#contenedor_categorias_plantilla";
        }else if(ponderacion.modulos.length == 0){
            error_mensaje_modulos.innerHTML = "⚠️ Debe elegir al menos un módulo"; 
            document.location.href = "#contenedor_categorias_plantilla";
            error_mensaje_palabra_clave.innerHTML = "";
        }else if(total_ponderaciones + parseInt(ponderacion.porcentaje_ponderacion) > 100){
            error_mensaje_ponderaciones.innerHTML = "⚠️ La suma de ponderaciones no puede superar el 100%"; 
            document.location.href = "#contenedor_categorias_plantilla";
            error_mensaje_palabra_clave.innerHTML = "";
            error_mensaje_modulos.innerHTML = "";
        }else{
            validado = true;
            error_mensaje_palabra_clave.innerHTML = "";
            error_mensaje_modulos.innerHTML = "";
            error_mensaje_ponderaciones.innerHTML = "";
        }

        if(validado){
            let modulos_li = "";
    
            for (let i = 0; i < ponderacion.modulos.length; i++){
                if((i == 0 && i == ponderacion.modulos.length - 1) || (i == ponderacion.modulos.length - 1)){
                    modulos_li += this.traducir_nombre_modulos(ponderacion.modulos[i]);
                }else if(i == 0 && i != ponderacion.modulos.length - 1){
                    modulos_li += this.traducir_nombre_modulos(ponderacion.modulos[i]) + ", ";
                }else{
                    modulos_li += this.traducir_nombre_modulos(ponderacion.modulos[i]) + ", ";
                }
            }

            
            let editar_item_ponderaciones = document.createElement('button');
            editar_item_ponderaciones.type = "button";
            editar_item_ponderaciones.innerHTML = '<i class="icon fa fa-pencil fa-fw" aria-hidden="true"></i>';
            editar_item_ponderaciones.addEventListener("click", function(){
                this.montar_edicion_ponderacion(ponderacion);
            }.bind(this));
    
            document.getElementById("lista_ponderaciones").innerHTML += '<li class="item_lista_ponderaciones">'+
                '<p class="titulo_item_ponderaciones">'+
                    '<span class="porcentaje_ponderaciones">[' + ponderacion.porcentaje_ponderacion + ']</span> '+
                    '<span class="palabra_clave_ponderaciones">' + ponderacion.palabra_clave + '</span> '+
                    '<span class="modulos_ponderaciones">(' + modulos_li + ')</span>'+
                '</p>'+
                '<div>'+
                    '<button type="button" class="editar_item_ponderaciones"><i class="icon fa fa-pencil fa-fw" aria-hidden="true"></i></button>'+
                '</div>'+
                '<div>'+
                    '<button type="button" class="borrar_item_ponderaciones"><i class="icon fa fa-trash fa-fw" aria-hidden="true"></i></button>'+
                '</div>'+
            '</li>';

            document.getElementById('editar_ponderacion_'+ponderacion.palabra_clave.replace(/ /g, "_")).appendChild(editar_item_ponderaciones);

    
            // if(document.getElementById("lista_ponderaciones").getElementsByClassName("item_lista_ponderaciones").length != 0 && document.getElementById("item_lista_vacia_ponderaciones")){
            //     document.getElementById("item_lista_vacia_ponderaciones").remove();
            // }

            document.getElementById("input_palabra_clave").value = "";
            input_ponderacion.value = "0%";
            for (let i = 0; i < item_checkbox_modulos.length; i++) {
                item_checkbox_modulos[i].checked = false;
            }

            let nuevo_total_ponderaciones = parseInt(ponderacion.porcentaje_ponderacion) + total_ponderaciones;
            document.getElementById("total_ponderaciones").innerHTML = nuevo_total_ponderaciones+"%";
            
            document.getElementById("contenedor_palabra_clave_ponderaciones").style.display = "none";
            document.location.href = "#contenedor_categorias_plantilla";

            let id_ponderacion = ponderacion.palabra_clave.replace(/ /g, "_");

            // document.getElementById("editar_ponderacion_"+id_ponderacion).addEventListener("click", function(){
            //     this.montar_edicion_ponderacion(ponderacion);
            // }.bind(this));

            // document.getElementById("ponderacion_"+id_ponderacion).addEventListener("click", function(){
            //     this.montar_edicion_ponderacion(ponderacion);
            // }.bind(this));

            // for (let i = 0; i < document.getElementsByClassName("editar_item_ponderaciones").length; i++) {
            //     document.getElementsByClassName("editar_item_ponderaciones")[i].addEventListener("click", function(){
            //         this.montar_edicion_ponderacion(ponderacion);
            //     }.bind(this));
            // }
            
        }
    }

    montar_edicion_ponderacion(datos){
        console.log(datos)
    }

    montar_formulario_plantilla(){

        let contenedor_ventana_crear_editar = document.getElementById("contenedor_ventana_crear_editar");
        contenedor_ventana_crear_editar.style.display = "flex";
        // let contenido_categorias = '';
        // let contenido_modulos = '';

        // for(let valor in this.categorias){
        //     let checked_categoria = '';

        //     contenido_categorias += '<li>'+
        //         '<label>'+
        //             '<input type="checkbox" name="'+this.categorias[valor]+'" value="'+this.categorias[valor]+'" class="item_checkbox_categorias" '+checked_categoria+'>'+
        //             '<span>'+this.categorias[valor]+''+'<span>'+
        //         '</label>'+
        //     '</li>';
        // }

        // let select_ponderaciones = "";
        // for (let i = 0; i <= 100; i++) {
        //     select_ponderaciones += '<option value="'+i+'%">'+i+'%</option>';
        // }

        // for(let valor in this.modulos){            
        //     contenido_modulos += '<li>'+
        //         '<label>'+
        //             '<input class="item_checkbox_modulos" type="checkbox" value="'+valor+'">'+
        //             '<span>'+                        
        //                 '<img src="'+this.modulos[valor]+'"/>'+
        //                 this.traducir_nombre_modulos(valor)[0].toUpperCase()+ this.traducir_nombre_modulos(valor).substring(1)+
        //             '</span>'+
        //         '</label>'+
        //     '</li>';
        // }

        // this.ventana_crear.innerHTML = '<div id="contenedor_ventana_crear_editar">'+
        //     '<div id="contenedor_nombre_plantilla">'+
        //         '<label for="input_nombre_plantilla">'+
        //             'Nombre de la plantilla: '+
        //             '<input type="text" id="input_nombre_plantilla" name="input_nombre_plantilla" value="">'+
        //             '<p class="error_mensaje" id="error_mensaje_nombre_plantilla"></p>'+
        //         '</label>'+
        //     '</div>'+
        //     '<ul id="contenedor_categorias_plantilla">'+
        //         '<li>'+
        //             '<label>'+
        //                 '<input type="checkbox" id="todas_categorias" value="todas_categorias" class="item_checkbox_categorias">'+
        //                 '<span>Categorias:</span> '+
        //             '</label>'+
        //         '</li>'+
        //         contenido_categorias+
        //     '</ul>'+
        //     '<div id="contenedor_ponderaciones_plantilla">'+
        //         '<div id="contenedor_ponderaciones">'+
        //             '<p>Ponderaciones: <span id="total_ponderaciones">0%</span></p>'+
        //             '<ul id="lista_ponderaciones">'+
        //                 '<li id="item_lista_vacia_ponderaciones">Ninguna</li>'+
        //             '</ul>'+
        //             '<button id="boton_aniadir_ponderacion" type="button">+</button>'+
        //         '</div>'+ 
        //         '<div id="contenedor_palabra_clave_ponderaciones">'+
        //             '<label for="input_palabra_clave">'+
        //                 'Palabra clave: '+
        //                 '<input type="text" id="input_palabra_clave" name="input_palabra_clave">'+
        //                 '<p class="error_mensaje" id="error_mensaje_palabra_clave"></p>'+
        //             '</label>'+
        //             '<label for="input_ponderacion">'+
        //                 'Ponderación: '+
        //                 '<select name="input_ponderacion" id="input_ponderacion">'+
        //                     select_ponderaciones+
        //                 '</select>'+
        //                 '<p class="error_mensaje" id="error_mensaje_ponderaciones"></p>'+
        //             '</label>'+
        //             '<ul id="listado_modulos">'+
        //                 '<li>'+
        //                     '<label>'+
        //                         '<input type="checkbox" id="todos_modulos" value="todos_modulos" class="item_checkbox_modulos">'+
        //                         '<span>Módulos:</span> '+
        //                     '</label>'+
        //                 '</li>'+
        //                 contenido_modulos+
        //             '</ul>'+
        //             '<p class="error_mensaje" id="error_mensaje_modulos"></p>'+
        //             '<button id="boton_crear_ponderacion" type="button">Crear ponderación</button>'+
        //         '</div>'+
        //     '</div>'+
        //     '<button id="boton_crear_plantilla" type="button">Crear plantilla</button>'+
        // '</div>'; 

        // document.getElementById("boton_aniadir_ponderacion").addEventListener('click', function(){
        //     document.getElementById("contenedor_palabra_clave_ponderaciones").style.display = "block";
        // });

        // document.getElementById("boton_crear_ponderacion").addEventListener('click', function(){
        //     this.crear_ponderacion();
        // }.bind(this));

        // document.getElementById("boton_crear_plantilla").addEventListener('click' , function() {
        //     this.crear_nueva_plantilla();
        // }.bind(this));
    }

    eliminar_plantilla(event){
        // event.preventDefault()
        // if(confirm("Esta acción podría provocar desajustes en aquellos cursos que usaron esta plantilla, ¿Quieres continuar?") == true){
        //     let datos_esta_plantilla = JSON.parse(event.currentTarget.getElementsByClassName("datos_esta_plantilla")[0].value);
        //     let key_datos = Object.keys(datos_esta_plantilla)[0];
        //     let value_datos = datos_esta_plantilla[Object.keys(datos_esta_plantilla)[0]];
        //     let valor_objeto_input_hidden = JSON.parse(this.input_hidden.value);
    
        //     for(let key in valor_objeto_input_hidden){
        //         if(key === key_datos){
        //             delete valor_objeto_input_hidden[key_datos];
        //             this.input_hidden.value = JSON.stringify(valor_objeto_input_hidden);
        //         }
        //     }
    
        //     this.actualizar_listas_plantillas();
    
        //     if(this.plantilla_abierta == value_datos.nombre){
        //         this.ventana_crear.innerHTML = '';
        //     }
        // }
    }

    aniadir_nueva_palabra_clave(event){
        // event.preventDefault();
    
        // let input_valor = event.target.previousElementSibling.value;
        // let nueva_palabra_clave = document.createElement('li');
        // nueva_palabra_clave.className = 'nueva_palabra_clave';
        // nueva_palabra_clave.innerHTML = input_valor;

        // let boton_eliminar_palabra_clave = document.createElement('button');
        // boton_eliminar_palabra_clave.type = "button";
        // boton_eliminar_palabra_clave.classList.add('boton_eliminar_palabra_clave');
        // boton_eliminar_palabra_clave.addEventListener("click", function(event){
        //     this.eliminar_palabra_clave(event);
        // }.bind(this));

        // let icono_boton_eliminar = document.createElement('i');
        // icono_boton_eliminar.classList.add("icon");
        // icono_boton_eliminar.classList.add("fa");
        // icono_boton_eliminar.classList.add("fa-trash");
        // icono_boton_eliminar.classList.add("fa-fw");
        // icono_boton_eliminar.ariaHidden = "true";

        // boton_eliminar_palabra_clave.appendChild(icono_boton_eliminar);
        // nueva_palabra_clave.appendChild(boton_eliminar_palabra_clave);

        // let mensaje_error_palabra_clave = event.target.parentNode.getElementsByClassName('mensaje_error_palabra_clave')[0];
    
        // let elemento_donde_se_inserta = event.target.parentNode.previousElementSibling.children[1];
        // let elemento_ninguno = event.target.parentNode.previousElementSibling.children[1].getElementsByClassName('ninguna_por_defecto');
    
        // if(input_valor != ""){
    
        //     if(elemento_ninguno.length > 0){
        //         elemento_ninguno[0].remove();
        //     }
    
        //     elemento_donde_se_inserta.appendChild(nueva_palabra_clave);
    
        //     if(event.target.parentNode.getElementsByClassName('mensaje_error_palabra_clave').length > 0){
        //         event.target.parentNode.getElementsByClassName('mensaje_error_palabra_clave')[0].innerHTML = "";
        //         mensaje_error_palabra_clave.style.display = "none";
        //         event.target.previousElementSibling.value = "";
        //     }        
        // }else{
        //     mensaje_error_palabra_clave.style.display = "block";
        //     mensaje_error_palabra_clave.innerHTML = '⚠️ Este campo no puede quedar vacío.';
        // }
    }

    eliminar_palabra_clave(event){
        // const lista_palabras_clave = event.currentTarget.closest('.lista_palabras_clave');

        // event.currentTarget.parentNode.remove();

        // if(lista_palabras_clave.getElementsByClassName("nueva_palabra_clave").length == 0){
        //     lista_palabras_clave.innerHTML = '<li class="ninguna_por_defecto">Ninguna.</li>';
        // }
    }

    editar_plantilla_existente(){
        // let antiguo_input_hidden = JSON.parse(this.input_hidden.value);
        // let elemento_editar = antiguo_input_hidden[input_hidden_id_plantilla.value];
        // elemento_editar.nombre = document.getElementById("nombre_plantilla").value;

        // let categ = []

        // for (let i = 0; i < document.getElementsByClassName("checkbox_categoria").length; i++) {
        //     if(document.getElementsByClassName("checkbox_categoria")[i].checked){
        //         categ.push(document.getElementsByClassName("checkbox_categoria")[i].value)
        //     }            
        // }

        // elemento_editar.categorias = categ;

        // let mods = [];

        // for (let i = 0; i < document.getElementsByClassName("input_check_modulo").length; i++) {
        //     if(document.getElementsByClassName("input_check_modulo")[i].checked){
        //         let obj = {};
        //         obj.modulo = document.getElementsByClassName("input_check_modulo")[i].value;
                
        //         obj.palabras_clave = [];
                
        //         for (let index = 0; index < document.getElementsByClassName("input_check_modulo")[i].parentNode.nextElementSibling.getElementsByClassName("nueva_palabra_clave").length; index++) {
        //             obj.palabras_clave.push(document.getElementsByClassName("input_check_modulo")[i].parentNode.nextElementSibling.getElementsByClassName("nueva_palabra_clave")[index].textContent);
        //         }

        //         mods.push(obj);
        //     }
        // }

        // elemento_editar.modulos = mods;

        // let promesa = new Promise(function(myResolve, myReject){
        //     this.input_hidden.value = JSON.stringify(antiguo_input_hidden);
        //     myResolve('ok');
        //     myReject('error');
        // }.bind(this));

        // promesa.then(function(value){
        //     if(value=="ok"){
        //         this.actualizar_listas_plantillas();
        //         contenedor_ventana_crear_editar.remove();
        //         document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
        //     }
        // }.bind(this))
        
    }

    // crear_nueva_plantilla(){        
        // let nombre_plantilla = document.getElementById("nombre_plantilla");
        // let categoria_plantilla = document.getElementById("contenedor_checkbox_categoria").children[1];
        // let contenedor_todos_modulos = document.getElementById("contenedor_todos_modulos");
        // let mensaje_error_crear_plantilla = document.getElementById("mensaje_error_crear_plantilla");
        // let input_hidden_value = document.getElementById("id_s_block_barra_progreso_json_string").value;
        // let valido = false;

        // let nueva_plantilla = {};

        // if(!nombre_plantilla.value == ""){
        //     mensaje_error_crear_plantilla.style.display = 'none';
        //     valido = true;
        // }else{
        //     mensaje_error_crear_plantilla.style.display = 'block';
        //     mensaje_error_crear_plantilla.innerHTML = '⚠️ Este campo no puede quedar vacío.';
        //     document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
        // }
        
        // if(valido){
        //     let num_id = 0;

        //     if (input_hidden_value == "" || input_hidden_value == "{}") {
        //         num_id = 0 + 1;
        //     }else{
        //         num_id = Object.keys(JSON.parse(input_hidden_value)).length + 1;
        //     }

        //     let info_interior_plantilla = {};

        //     nueva_plantilla[num_id] = info_interior_plantilla;

        //     nueva_plantilla[num_id].nombre = nombre_plantilla.value;

        //     nueva_plantilla[num_id].categorias = []; 

        //     for (let i = 0; i < categoria_plantilla.children.length; i++) {
        //         let contenedor_checkbox = categoria_plantilla.children[i];
        //         let checkbox = contenedor_checkbox.getElementsByClassName("checkbox_categoria")[0];

        //         if(checkbox.checked){
        //             nueva_plantilla[num_id].categorias.push(checkbox.value);
        //         }
        //     }

        //     nueva_plantilla[num_id].modulos = []; 
            
        //     for (let i = 0; i < contenedor_todos_modulos.children.length; i++) {
        //         let modulo = contenedor_todos_modulos.children[i];
        //         let input_check_modulo = modulo.getElementsByClassName("input_check_modulo")[0];
        //         let lista_elementos_palabras_clave = modulo.getElementsByClassName("lista_palabras_clave")[0].children;
        //         let lista_palabras_clave = [];
                
        //         for (let i = 0; i < lista_elementos_palabras_clave.length; i++) {
        //             lista_palabras_clave.push(lista_elementos_palabras_clave[i].textContent);
        //         }

        //         if(input_check_modulo.checked){
        //             nueva_plantilla[num_id].modulos.push({modulo : input_check_modulo.classList[0].slice(4), palabras_clave: lista_palabras_clave});
        //         }
        //     }
            

        //     let promesa = new Promise(function(myResolve, myReject){
        //         let valor_input_hidden = "";

        //         if(input_hidden_value !== ""){
        //             let valor_anterior = JSON.parse(input_hidden_value);
        //             let nuevo_valor = nueva_plantilla;
        //             let valor_final = Object.assign(valor_anterior, nuevo_valor);
        //             valor_input_hidden = valor_final;
        //         }else{
        //             valor_input_hidden = nueva_plantilla;
        //         }

        //         input_hidden_value = JSON.stringify(valor_input_hidden);
                
        //         myResolve('todo_ok');
        //         myReject('error');
        //     });

        //     promesa.then(
        //         function(value){
        //             document.getElementById("id_s_block_barra_progreso_json_string").value = input_hidden_value;
        //                 this.actualizar_listas_plantillas();
        //                 contenedor_ventana_crear_editar.remove();
        //                 document.location.href = "#id_s_block_barra_progreso_titulo_bloque";
        //         }.bind(this)
        //     );
        // }
    // }

    traducir_nombre_modulos(nombre_modulo){
        let traducido = nombre_modulo;

        switch (nombre_modulo) {
            case 'assign':
                traducido = "tarea";
                break;

            case 'scorm':
                traducido = "scorm";
                break;

            case 'forum':
                traducido = "foro";
                break;

            case 'quiz':
                traducido = "cuestionario";
                break;

            case 'lti':
                traducido = "herramienta externa";
                break;

            case 'page':
                traducido = "página";
                break;
                
            case 'resource':
                traducido = "archivo";
                break;
                
            case 'survey':
                traducido = "encuesta predefinida";
                break;
                
            case 'lesson':
                traducido = "lección";
                break;
                
            case 'label':
                traducido = "etiqueta";
                break;
                
            case 'imscp':
                traducido = "paquete de contenido IMS";
                break;
                
            case 'page':
                traducido = "página";
                break;

            case 'workshop':
                traducido = "taller";
                break;

            case 'glossary':
                traducido = "glosario";
                break;

            case 'book':
                traducido = "libro";
                break;
                
            case 'choice':
                traducido = "consulta";
                break;
                
            case 'feedback':
                traducido = "encuesta";
                break;
                
            case 'folder':
                traducido = "carpeta";
                break;
                
            case 'data':
                traducido = "base de datos";
                break;
        }

        return traducido;
    }
}

window.addEventListener("load", function() {
    promesa.then(
        function(datos){
            var settings = new Settings(datos["modulos"], datos["categorias_cursos"]);
            settings.plantilla_elegida = datos["plantilla_elegida"];

            // 1º - Actualizamos las listas de las plantillas con los datos del input_hidden
            // settings.actualizar_listas_plantillas();

            /** 
             * A partir de aquí, determinamos los eventos y la función que hará cada uno
             */

            // Abrir gestión de plantillas
            settings.boton_gestionar_plantillas.addEventListener("click", function(event){
                settings.abrir_gestion_plantillas(event);
            });

            // // Abrir la ventana con los detalles de la plantilla
            settings.boton_crear_plantilla.addEventListener("click", function(event){
                settings.montar_formulario_plantilla(event, 'crear');
            });
            /**
             * --------------------------------------------------------------------------
             */

            // Con esta línea habilitamos el botón cuando termine de cargarse la página
            document.getElementById("boton_gestionar_plantillas").classList.remove("boton_settings");
        }
    );

});