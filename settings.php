<?php

Global $PAGE;
$PAGE->requires->js(new moodle_url($CFG->wwwroot . '/blocks/barra_progreso/classes/settings.js'));
require_once 'classes/block_barra_progreso.class.php';

$barra_progreso = new Barra_progreso();

?>
<script>
    window.onload = function(){
        var settings = new Settings();
        settings.inicializar_settings();
    }
</script>

<?php

$categorias = "";
foreach ($barra_progreso->sacar_categorias() as $categoria) {
    $categorias .= '
    <li>
        <label>
            <input type="checkbox" id="'.$categoria.'" value="'.$categoria.'" class="item_checkbox_categorias">
            <span>'.$categoria.'</span> 
        </label>
    </li>
    ';
}

$ponderaciones = "";
for ($i=0; $i <= 100 ; $i++) { 
    $ponderaciones .= '
        <option value="'.$i.'">'.$i.'%</option>
    ';
}

$modulos = "";
foreach ($barra_progreso->sacar_todos_modulos() as $modulo => $url_modulo) {
    $modulos .= '
    <li>
        <label>
            <input type="checkbox" id="mod_'.$modulo.'" value="'.$modulo.'" class="item_checkbox_modulos">
            <span><img src="'.$url_modulo.'" class="img_modulos"/></span>
            <span>'.$barra_progreso->traducir_nombre_modulos($modulo).'</span> 
        </label>
    </li>
    ';
}

$html = '
<div id="contenedor_ventana_modal_settings">
    <div id="ventana_modal_settings">
        <div id="ventana_gestionar_plantillas">
            <span>Plantillas:</span>
            <ul id="lista_plantillas">
                <li>
                    <span>Aun no existen plantillas.</span>
                </li>
            <ul>
        </div>
        <button type="button" id="crear_plantilla">Crear nueva plantilla</button>
        <div id="ventana_crear">
            <h4 id="titulo_crear_editar_plantilla">Crear nueva plantilla</h4>
            <div id="contenedor_nombre_plantilla" class="elemento_formulario_plantillas">
                <span>Nombre de la plantilla:</span>
                <label for="input_nombre_plantilla">
                    <input type="text" id="input_nombre_plantilla" name="input_nombre_plantilla" value="">
                    <p class="error_mensaje" id="error_mensaje_nombre_plantilla"></p>
                </label>
            </div>
            <div id="contenedor_categorias_plantilla" class="elemento_formulario_plantillas">
                <span>Seleccione una categoría:</span>
                <ul>
                    <li>
                        <label>
                            <input type="checkbox" id="todas_categorias" value="todas_categorias" class="item_checkbox_categorias" checked>
                            <span>Todas las categorias</span> 
                        </label>
                    </li>
                    '.$categorias.'
                </ul>
                <p class="error_mensaje" id="error_mensaje_categorias"></p>
            </div>
            <div id="contenedor_ponderaciones_plantilla" class="elemento_formulario_plantillas">
                <span>Ponderaciones: <span id="total_ponderaciones">0%</span></span>
                <ul id="lista_ponderaciones">
                    <li id="item_lista_vacia_ponderaciones">Ninguna</li>
                </ul>
                <button id="boton_aniadir_ponderacion" type="button">+</button>
                <p class="error_mensaje" id="error_mensaje_ponderaciones_plantilla"></p>
            </div>

            <div id="contenedor_crear_editar_ponderaciones">
                <h5 id="titulo_crear_editar_ponderacion">Crear ponderación</h5>
                <div id="contenedor_palabra_clave_ponderaciones" class="elemento_formulario_plantillas">
                    <span>Palabra clave: </span>
                    <label for="input_palabra_clave">
                        <input type="text" id="input_palabra_clave" name="input_palabra_clave">
                        <p class="error_mensaje" id="error_mensaje_palabra_clave"></p>
                    </label>
                </div>
                
                <div id="contenedor_porcentaje_ponderaciones" class="elemento_formulario_plantillas">
                    <span>Ponderación:</span>
                    <label for="input_porcentaje_ponderacion">
                        <select name="input_porcentaje_ponderacion" id="input_porcentaje_ponderacion">
                            '.$ponderaciones.'
                        </select>
                        <p class="error_mensaje" id="error_mensaje_ponderaciones"></p>
                    </label>
                </div>
                <div id="contenedor_listado_modulos_ponderaciones" class="elemento_formulario_plantillas">
                    <span>Seleccione los módulos:</span>
                    <ul id="listado_modulos">
                        <li>
                            <label>
                                <input type="checkbox" id="todos_modulos" value="todos_modulos" class="item_checkbox_modulos" checked>
                                <span>Todos los modulos</span> 
                            </label>
                        </li>
                        '.$modulos.'
                    </ul>
                    <p class="error_mensaje" id="error_mensaje_modulos"></p>
                </div>
                <p class="error_mensaje" id="error_mensaje_modulos"></p>
                <button id="boton_crear_ponderacion" type="button">Crear ponderación</button>
            </div>
            <div id="contenedor_boton_crear_editar_plantilla">
                <button id="boton_crear_plantilla" type="button">Crear plantilla</button>
            </div>
        </div>
    </div>
</div>
';


$settings->add(new admin_setting_configtext(
    'block_barra_progreso/titulo_bloque',
    'Título del bloque',
    'Esto cambiará el nombre del título que aparecerá en el bloque.',
    ''
));

$settings->add(new admin_setting_configtext(
    'block_barra_progreso/json_string',
    'hidden',
    '',
    ''
));

$settings->add(new admin_setting_heading('contenedor_gestion_plantillas', 'Gestionar plantillas', $html));

// $settings->add(new admin_setting_configtext(
//     'block_barra_progreso/hidden_script',
//     'hidden_script',
//     '<script>
//     var promesa = new Promise(function(resolve) {
//         var modulos = '.json_encode($barra_progreso->sacar_todos_modulos()).';
//         var categorias_cursos = '.json_encode($barra_progreso->sacar_categorias()).';
//         var plantilla_elegida = '.(get_config('block_barra_progreso', 'plantilla')) ? get_config('block_barra_progreso', 'plantilla') : "0".';
//         var datos = [];
//         datos["modulos"] = modulos;
//         datos["categorias_cursos"] = categorias_cursos;
//         datos["plantilla_elegida"] = plantilla_elegida;
//         resolve(datos)
//     });
// </script>',
//     ''
// ));


