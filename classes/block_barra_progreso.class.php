<?php 

// global $CFG;

// // require_once($CFG->wwwroot.'blocks/barra_progreso/block_barra_progreso.php');
// require_once('../block_barra_progreso.php');
require_once($CFG->dirroot . "/blocks/barra_progreso/block_barra_progreso.php");


class Barra_progreso extends block_barra_progreso{
    
    public function sacar_modulos($id_curso){
        global $DB;    

        $secciones_sql = '
            SELECT name, id
            FROM {course_sections} 
            WHERE {course_sections}.course = ?
        ';
        $secciones = $DB->get_recordset_sql($secciones_sql, [$id_curso]);
        
        $modulos_sql = '
            SELECT cm.id as identificacion, mm.name as tipo_modulo, cm.instance as instancia
            FROM {course_modules} cm
            INNER JOIN {modules} mm
            ON cm.module = mm.id
            WHERE cm.section = ?
        ';
        
        $contador_seccion = 0;
        $secciones_modulos_curso = new stdClass;

        foreach ($secciones as $seccion) {            
            $obj_secciones = new stdClass;
            $obj_secciones->nombre = ($seccion->name == "") ? "Tema $contador_seccion" : $seccion->name;
            
            $array_modulos = [];
            $modulos = $DB->get_recordset_sql($modulos_sql, [$seccion->id]);
            foreach ($modulos as $modulo) {
                $obj_modulos = new stdClass;
                $obj_modulos->id = $modulo->identificacion;
                $obj_modulos->nombre = $this->sacar_nombre_modulo($modulo->instancia, $modulo->tipo_modulo);
                $obj_modulos->tipo_modulo = $modulo->tipo_modulo;
                array_push($array_modulos, $obj_modulos);
            }

            $obj_secciones->modulos = $array_modulos;

            $secciones_modulos_curso->{$seccion->id} = $obj_secciones;

            $contador_seccion++;
        }

        $json = json_encode($secciones_modulos_curso);
        return $json;
    }
    
    private function sacar_nombre_modulo($id_modulo, $tipo_modulo){
        global $DB;

        $sql = "SELECT name FROM mood_$tipo_modulo WHERE id = ?";
        $fila = $DB->get_record_sql($sql, [$id_modulo]);
        $nombre_modulo = ($fila->name) ? $fila->name : "no name | " . $tipo_modulo;

        return $nombre_modulo;
    }

    public function sacar_categorias(){
        global $DB;
        $categorias_sql = '
            SELECT id, name 
            FROM {course_categories}
        ';
        $categorias = $DB->get_recordset_sql($categorias_sql);

        $array_categorias = [];
        // $array_categorias = [];

        foreach ($categorias as $categoria) {
            $array_categorias[$categoria->id] = $categoria->name;
        }

        // var_dump($array_categorias);
        return $array_categorias;
    }

    public function sacar_todos_modulos(){
        global $DB;
        $todos_modulos_sql = '
            SELECT id, name FROM {modules} 
            where name != "assignment"
            ORDER BY CASE 
            when NAME = "forum" then 1 
            when NAME = "scorm" then 2 
            when NAME = "assign" then 3
            when NAME = "quiz" then 4 
            ELSE 5 end
        ';
        $todos_modulos = $DB->get_recordset_sql($todos_modulos_sql);
        
        $array_todos_modulos = [];

        foreach ($todos_modulos as $mod) {
            $array_todos_modulos[$mod->name] = $this->determinar_icono_modulo($mod->name);
        }

        return $array_todos_modulos;
    }

    

    public function sacar_modulos_traducido(){
        $array_todos_modulos_traducidos = [];

        foreach ($this->sacar_todos_modulos() as $modulo => $url_icono_modulo) {            
            $array_todos_modulos_traducidos[$this->traducir_nombre_modulos($modulo)] = $url_icono_modulo;
        }

        return $array_todos_modulos_traducidos;
    }

    public function traducir_nombre_modulos($nombre_modulo){

        $traducido = $nombre_modulo;
        
        switch ($nombre_modulo) {
            case 'assign':
                $traducido = "tarea";
                break;

            case 'scorm':
                $traducido = "scorm";
                break;

            case 'forum':
                $traducido = "foro";
                break;

            case 'quiz':
                $traducido = "cuestionario";
                break;

            case 'lti':
                $traducido = "herramienta externa";
                break;

            case 'page':
                $traducido = "página";
                break;
                
            case 'resource':
                $traducido = "archivo";
                break;
                
            case 'survey':
                $traducido = "encuesta predefinida";
                break;
                
            case 'lesson':
                $traducido = "lección";
                break;
                
            case 'label':
                $traducido = "etiqueta";
                break;
                
            case 'imscp':
                $traducido = "paquete de contenido IMS";
                break;
                
            case 'page':
                $traducido = "página";
                break;

            case 'workshop':
                $traducido = "taller";
                break;

            case 'glossary':
                $traducido = "glosario";
                break;

            case 'book':
                $traducido = "libro";
                break;
                
            case 'choice':
                $traducido = "consulta";
                break;
                
            case 'feedback':
                $traducido = "encuesta";
                break;
                
            case 'folder':
                $traducido = "carpeta";
                break;
                
            case 'data':
                $traducido = "base de datos";
                break;
        }

        return $traducido;
    }
    
    private function determinar_icono_modulo($tipo_modulo){
        global $OUTPUT;
        // $output = $PAGE->get_renderer('block_barra_progreso');
        $link_modulo = $OUTPUT->image_url('icon', 'mod_'.$tipo_modulo)->out();
        return $link_modulo;
    }    

    public function determinar_plantilla_a_usar(){
        global $CFG;

        // var_dump(get_config('block_barra_progreso'));
        // $ah = new stdClass;
        // $ah->id = 47;
        // var_dump(block_instance('barra_progreso', $ah));
        // $instancia = 47;
        // $blockinstance = block_instance('barra_progreso', context_block::instance(47));
        // $config = $blockinstance->get_config();
        // var_dump($blockinstance)
        
        $plantillas_existentes = $this->get_plantillas();
        $plantilla_a_usar = 0;
        // var_dump($plantillas_existentes);
        // $this->get_config_block();
        var_dump($this->get_instance_block());
        return $plantilla_a_usar;
    }

    public function get_plantillas(){
        global $COURSE; 
        $datos_categoria = core_course_category::get($COURSE->category);        
        $todas_plantillas = json_decode(get_config('block_barra_progreso', 'json_string'));
        $datos_plantilla_a_usar = [];
        if(!empty($todas_plantillas)){
            foreach ($todas_plantillas as $key => $value) {
                if(in_array($datos_categoria->name, $value->categorias) || in_array("Todas las categorías", $value->categorias) || get_config('block_barra_progreso', 'plantilla') == $key){
                    array_push($datos_plantilla_a_usar, $value);
                    // var_dump($key);
                }
            }
        }
            
        return $datos_plantilla_a_usar;
    }
}