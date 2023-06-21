<?php


// require_once($CFG->dirroot . "/blocks/barra_progreso/classes/block_barra_progreso.class.php");

class block_barra_progreso extends block_base {
    // public $barra_progreso;

    public function init() {
        // $this->title = get_string('barra_progreso', 'block_barra_progreso');
        // $this->barra_progreso = new Barra_progreso();
    }
    // The PHP tag and the curly bracket for the class definition 
    // will only be closed after there is another function added in the next section.

    public function specialization()
    {
        if (isset($this->config)) {
            if(!empty($this->config->title) || $this->config->title != ""){
                $this->title = $this->config->title;
            }else if(get_config('block_barra_progreso', 'titulo_bloque') == ""){
                $this->title = get_string('barra_progreso', 'block_barra_progreso');
            }else{
                $this->title = get_config('block_barra_progreso', 'titulo_bloque');
            }
        }else{
            $this->title = get_string('barra_progreso', 'block_barra_progreso');
        }
    }

    public function get_content() {
        if ($this->content !== null) {
          return $this->content;
        }
    
        $this->content         =  new stdClass;
        $this->content->text   = $this->contenido_principal();
        // $this->content->footer = 'Footer here...';
     
        return $this->content;
    }

    public function contenido_principal(){
        // $contenido = '<div id="contenedor_principal_barra_progreso">';
        // $contenido .= '<div id="contenedor_barra">
        //     <div id="barra"></div>
        //     <div id="info_barra">
        //         <span>% Completado</span>
        //     </div>
        // </div>';
        // $contenido .= '<div id="contenedor_detalles_barra_progreso">
        //     <button type="button">
        //         <span>Mostrar más detalles</span>
        //         <span><i class="icon fa fa-angle-down fa-fw " aria-hidden="true"></i></span>
        //     </button>
        //     <div id="detalles_barra_progreso">
        //     </div>
        // </div>';
        // $contenido .= '</div>';
        $plantilla_a_usar = $this->determinar_plantilla_usar();
        
        $contenido = '<div id="contenedor_principal_barra_progreso">';

        if( is_null($plantilla_a_usar) || ( isset($this->config) && $this->config->personalizar_barra == 0 && $plantilla_a_usar === 0 ) ){
            $contenido .= '<p>Es necesario ajustar los módulos que se quieren incluir en la barra de progreso</p>';
        }else{
            $lista_modulos_filtrado_plantilla = $this->lista_modulos_por_plantilla();
            // var_dump($lista_modulos_filtrado_plantilla);

            $ponderacion = "<ul>";
            foreach ($lista_modulos_filtrado_plantilla as $elemento_ponderacion_plantilla) {
                // var_dump($elemento_ponderacion_plantilla);
                $modulos = "";

                if(count($elemento_ponderacion_plantilla->elementos) > 0){
                    foreach ($elemento_ponderacion_plantilla->elementos as $elemento_modulo) {
                        $modulos .= '<li>
                        '.'$elemento_modulos'.'
                        </li>';
                        var_dump($elemento_modulo);
                    }
                }else{
                    $modulos .= '<li>No existen modulos</li>';
                }
                
                $ponderacion .= '<li>
                    <p>Ponderación: '.$elemento_ponderacion_plantilla->porcentaje_total.'%</p>
                    <div>
                        <ul>
                            '.$modulos.'
                        </ul>
                    </div>
                </li>';
            }
            $ponderacion .= "<ul>";


            $contenido .= '<div id="contenedor_barra">
                <div id="barra"></div>
                <div id="info_barra">
                    <span>% Completado</span>
                </div>
                <div id="desgloce_barra">'.
                $ponderacion
                .'</div>
            </div>';
        }

        $contenido .= '</div>';

        return $contenido;
    }

    public function has_config()
    {
        return true;
    }

    function _self_test() {
        return true;
    }

    /** 
     * 
     * Obtenemos los datos json de las plantillas que se podrían aplicar al curso según su categoría,
     * es decir, todos aquellos que afecten a todas las categorias o aquellas plantillas que contentan la categoría del curso
     */
    public function obtener_plantillas_este_curso(){
        global $COURSE; 
        $datos_categoria = core_course_category::get($COURSE->category);        
        $todas_plantillas = json_decode(get_config('block_barra_progreso', 'json_string'));
        $datos_plantilla_a_usar = [];
        if(!empty($todas_plantillas)){
            foreach ($todas_plantillas as $value) {
                if(in_array($datos_categoria->name, $value->categorias) || in_array("todas_categorias", $value->categorias)){
                    array_push($datos_plantilla_a_usar, $value);
                }
            }
        }
        return $datos_plantilla_a_usar;
    }

    /** 
     * 
     * Determinamos los datos de la plantilla que se usará en el curso;
     * Si existen datos guardados en la instancia, se usarán dicho datos, 
     * pero si la plantilla elegida es 0 (ninguna), devolverá null.
     * En el caso contrario devolverá aquella plantilla que se le determina por defecto.
     */
    public function determinar_plantilla_usar(){
        if(isset($this->config)){
            if($this->config->elegir_plantilla < 1){
                return 0;
            }else{
                return $this->obtener_plantillas_este_curso()[$this->config->elegir_plantilla-1];
            }
        }else{
            return $this->determinar_plantilla_default();
        }
    }

    /** 
     * 
     * Determinamos que plantilla se usará cuando no se haya elegido ninguna en los datos de la instancia
     * @return Object|Null con los datos de las plantillas
     * @return
     */
    public function determinar_plantilla_default(){
        global $COURSE;
        $datos_categoria = core_course_category::get($COURSE->category);   
        $plantillas_este_curso = $this->obtener_plantillas_este_curso();

        foreach ($plantillas_este_curso as $plantilla) {
            if(count($plantilla->categorias) == 1 && in_array($datos_categoria->name, $plantilla->categorias)){
                return $plantilla;
            }else if(in_array($datos_categoria->name, $plantilla->categorias)){
                return $plantilla;
            }else if(in_array('todas_categorias', $plantilla->categorias)){
                return $plantilla;
            }
        }

        return NULL;
    }

    /**
     * 
     * Rescatamos el array que se le pasará a edit_form con las opciones a elegir.
     * @param Object datos plantillas
     * @return Array con las opciones a elegir en el select
     */
    public function obtener_array_plantillas_select($plantillas){
        $plantillas_select = [0 => 'Ninguna'];
        foreach ($plantillas as $key => $value) {
            $plantillas_select[$key+1] = $value->nombre_plantilla;
        }
        return $plantillas_select;
    }






    private function sacar_nombre_modulo($id_modulo, $tipo_modulo){
        global $DB;

        $sql = "SELECT name FROM mood_$tipo_modulo WHERE id = ?";
        $fila = $DB->get_record_sql($sql, [$id_modulo]);
        $nombre_modulo = ($fila->name) ? $fila->name : "no name | " . $tipo_modulo;

        return $nombre_modulo;
    }

    
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
                $obj_modulos->instancia = $modulo->instancia;
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

    public function lista_modulos_por_plantilla(){
        global $COURSE;
        $plantilla_a_usar = $this->determinar_plantilla_usar();
        $modulos_curso = json_decode($this->sacar_modulos($COURSE->id));
        $array_modulos_plantilla = [];

        foreach ($plantilla_a_usar->ponderaciones as $ponderacion) {
            $elemento_ponderacion = new stdClass();
            $elemento_ponderacion->palabra_clave = $ponderacion->palabra_clave;
            $elemento_ponderacion->porcentaje_total = $ponderacion->porcentaje;
            $elemento_ponderacion->elementos = [];

            foreach ($modulos_curso as $seccion) {
                foreach ($seccion->modulos as $modulo) {
                    if(strpos(strtoupper($modulo->nombre), strtoupper($elemento_ponderacion->palabra_clave)) !== false){
                        $modulo_ponderacion = new stdClass();
                        $modulo_ponderacion->nombre_modulo = $modulo->nombre;
                        $modulo_ponderacion->tipo_modulo = $modulo->tipo_modulo;
                        $modulo_ponderacion->id_modulo = $modulo->id;
                        $modulo_ponderacion->instancia = $modulo->instancia;
                        $modulo_ponderacion->url_img = $this->determinar_icono_modulo($modulo->tipo_modulo);
                        $modulo_ponderacion->estado_modulo = $this->obtener_progreso_y_nota($modulo_ponderacion->instancia, $modulo_ponderacion->tipo_modulo);
                        array_push($elemento_ponderacion->elementos, $modulo_ponderacion);
                    }
                }
            }

            // $porcentaje_ponderacion_por_modulo = $elemento_ponderacion->porcentaje_total / count($elemento_ponderacion->elementos);
            $porcentaje_ponderacion_por_modulo = (count($elemento_ponderacion->elementos) != 0) ? $elemento_ponderacion->porcentaje_total / count($elemento_ponderacion->elementos) : 0;

            foreach ($elemento_ponderacion->elementos as $ponderacion) {
                $ponderacion->porcentaje_ponderacion = $porcentaje_ponderacion_por_modulo;
            }

            array_push($array_modulos_plantilla, $elemento_ponderacion);
        }

        // var_dump($array_modulos_plantilla);
        return $array_modulos_plantilla;
    }
    
    public function determinar_icono_modulo($tipo_modulo){
        global $OUTPUT;
        $link_modulo = $OUTPUT->image_url('icon', 'mod_'.$tipo_modulo)->out();
        return $link_modulo;
    }    

    private function obtener_progreso_y_nota($instancia, $tipo_modulo = ""){
        global $DB, $USER;

        $progreso = new stdClass;
        $progreso->estado_actual = ["😓", "error"];
        $progreso->cuenta_como_hecho = false;
        $progreso->nota = "-";

        switch ($tipo_modulo) {
            case 'forum':
                $sql_forum = "SELECT id 
                        FROM {forum_discussions} 
                        WHERE forum = ?";

                $datos_sql_forum = $DB->get_records_sql($sql_forum, [$instancia]);

                $progreso->estado_actual = ["❌", "No ha respondido en el foro"];
                $progreso->nota = 0;
                
                foreach ($datos_sql_forum as $datos_forum) {
                    $sql_discussions = "SELECT id 
                                        FROM {forum_posts} 
                                        WHERE discussion = ?
                                        AND userid = ?";
    
                    $datos_sql_discussions = $DB->record_exists_sql($sql_discussions, [$datos_forum->id, $USER->id]);

                    if($datos_sql_discussions) {
                        $progreso->estado_actual = ["✅", "Ha respondido en el foro"];
                        $progreso->cuenta_como_hecho = true;
                        $progreso->nota = 10;
                    }
                }

                break;
            
            case 'scorm':
                $sql_scorm = 'SELECT MAX(CAST(value AS DECIMAL)) as max_value
                            FROM {scorm_scoes_track} 
                            WHERE scormid = ? 
                            AND userid = ?
                            AND element LIKE "cmi.core.score.raw"';

                $datos_sql_scorm = $DB->get_record_sql($sql_scorm, [$instancia, $USER->id]);
                $nota = $datos_sql_scorm->max_value;
                $progreso->nota = $nota;

                if($nota === NULL || $nota < 0){
                    $progreso->estado_actual = ["❌", "No realizado"];
                    $progreso->nota = 0;
                }else{
                    $progreso->estado_actual = ["✅", "Realizado"];
                    $progreso->cuenta_como_hecho = true;
                }

                break;

            case 'assign':
                $sql_assign = 'SELECT ab.status as estado, ag.grade as nota
                FROM {assign_submission} ab
                left join {assign_grades} ag 
                on ag.assignment = ab.assignment 
                AND ag.userid = ab.userid
                WHERE ab.assignment = ?
                AND ab.userid = ?';

                $datos_sql_assign = $DB->get_record_sql($sql_assign, [$instancia, $USER->id]);

                if($datos_sql_assign){
                    $nota = $datos_sql_assign->nota;
                    $progreso->nota = $nota;
                    if($datos_sql_assign->estado === NULL || $datos_sql_assign->estado === "new"){
                        $progreso->estado_actual = ["❌", "No se ha entregado"];
                        $progreso->nota = 0;                
                    }else if($datos_sql_assign->estado === "submitted" && ($datos_sql_assign->nota === NULL || $datos_sql_assign->nota < 0)){
                        $progreso->estado_actual = ["⚠️", "Entregado pero no corregido"];
                        $progreso->cuenta_como_hecho = true;
                    }else if($datos_sql_assign->estado === "submitted" && $datos_sql_assign->nota >= 0){
                        $progreso->estado_actual = ["✅", "Entregado y corregido"];
                        $progreso->cuenta_como_hecho = true;
                    }
                }else{
                    $progreso->estado_actual = ["❌", "No realizado"];
                    $progreso->nota = 0;               
                }

                break;

                
            case 'quiz':
                $sql_quiz = 'SELECT grade 
                            FROM {quiz_grades} 
                            WHERE quiz = ? 
                            AND userid = ?';
                
                $datos_sql_quiz = $DB->get_record_sql($sql_quiz, [$instancia, $USER->id]);
                $detalles_nota = ($datos_sql_quiz) ? $datos_sql_quiz->grade : NULL;
                $progreso->nota = $detalles_nota;
                
                if($detalles_nota != NULL){
                    $progreso->estado_actual = ["✅", "Realizado"];
                    $progreso->cuenta_como_hecho = true;
                }else{
                    $progreso->estado_actual = ["❌", "No realizado"];
                    $progreso->nota = 0;     
                }

                break;

            default:

                break;
        }

        $progreso->nota = ($progreso->nota > 10) ? round($progreso->nota / 10, 3) : round($progreso->nota, 3);
        return $progreso;
    }
}