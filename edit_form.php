<?php 
require_once 'classes/block_barra_progreso.class.php';
class block_barra_progreso_edit_form extends block_edit_form {

    protected function specific_definition($mform) {
        global $CFG, $COURSE, $PAGE, $OUTPUT; 
        
        $barra_progreso = new Barra_progreso();
        
        $PAGE->requires->js(new moodle_url($CFG->wwwroot . '/blocks/barra_progreso/classes/config_estancia.js'));

        // En esta variable están todos los módulos que contiene el curso
        $modulos_curso = json_decode($barra_progreso->sacar_modulos($COURSE->id));

        $plantillas = $barra_progreso->get_plantillas();

        $plantillas_select = [0 => 'Ninguna'];
        $plantilla_default = $barra_progreso->determinar_plantilla_a_usar();

        foreach ($plantillas as $key => $value) {
            $plantillas_select[$key+1] = $value->nombre;
            // var_dump($value);
        }

        // var_dump($plantillas_select);
        
        // Las posibles elecciones
        $elecciones_select = [
            0 => "No",
            1 => "Si"
        ];

        // Definimos los enlaces para las imagenes de estado de cada sección 
        $url_image_tick = $OUTPUT->image_url('tick', 'block_barra_progreso');
        $url_image_cross = $OUTPUT->image_url('cross', 'block_barra_progreso');

        // Creamos las imagenes ocultas, para poder luego tratarlas mediante javascript
        $mform->addElement('html', '<img id="img_tick" style="display:none;" src="'.$url_image_tick.'"/>');
        $mform->addElement('html', '<img id="img_cross" style="display:none;" src="'.$url_image_cross.'"/>');

        // Header de la configuración
        $mform->addElement('header', 'config_header', 'Determinar módulos');

        $mform->addElement('text', 'config_title', 'titulo instancia');
        $mform->setDefault('config_title', (get_config('block_barra_progreso', 'titulo_bloque') ? get_config('block_barra_progreso', 'titulo_bloque') : 'Barra de progreso personalizada'));
        $mform->setType('config_title', PARAM_TEXT);

        // El input que determina si se tendrá en cuenta la configuración predeterminada o la personalizada
        $mform->addElement('select', 'config_personalizar_barra', "Personalizar barra:", $elecciones_select, array('onchange' => 'javascript:comprobar_visualizacion_elementos();'));
        $mform->setDefault('config_personalizar_barra', 0);
        $mform->setType('config_personalizar_barra', PARAM_INT);

        // El input que determina si se tendrá en cuenta la configuración predeterminada o la personalizada
        $mform->addElement('select', 'config_elegir_plantilla', "Selecciones una plantilla:", $plantillas_select, array('onchange' => 'javascript:comprobar_visualizacion_elementos();'));
        $mform->setDefault('config_elegir_plantilla', 0);
        $mform->setType('config_elegir_plantilla', PARAM_INT);
        
        
        // Cubrimos los elementos a personalizar para mostrarlos u ocultarlos
        $mform->addElement('html', '<div id="elementos_personalizar" style="display: none">');

        // Comenzamos a desglozar cada sección del curso (Ej: Bienvenidos/as, tema 1, etc...)
        foreach ($modulos_curso as $id_seccion => $contenido_seccion) {

            // El título de cada sección
            $mform->addElement('html', '<h5 id="'.$id_seccion.'">' . $contenido_seccion->nombre . '</h5>');

            // Si en la sección no encuentra ningún módulo, cambiará el mensaje, en lugar de dejarlo vacío
            if(!empty($contenido_seccion->modulos)){

                // Desglozamos los módulos que contiene dicha sección
                foreach ($contenido_seccion->modulos as $modulos) {
                    $mform->addElement('html', '<div id="wrapper_id_cm_'.$modulos->id.'" class="wrapper_cm">');

                    $mform->addElement('html', '<img class="imagenes_estado"/>');

                    $mform->addElement('select', 'config_seccion_'.$modulos->id, $modulos->nombre.':', $elecciones_select, array('onchange' => 'javascript:comprobar_tipo_imagen_modulo(event);', 'disabled' => 'disabled', 'class' => 'input_config_instancia_bloque'));
                    // $mform->addOption('class', 'input_config_instance_block');
                    $mform->setDefault('config_seccion_'.$modulos->id, 0);
                    $mform->setType('config_seccion_'.$modulos->id, PARAM_INT);
                    
                    $mform->addElement('html', '</div>');
                }

            }else{
                $mform->addElement('html', '<div class="form-group row fitem" style="padding-left: 15px;">❌ Esta sección no tiene módulos.</div>');
            }
        }

        $mform->addElement('html', '</div>');

    }
}