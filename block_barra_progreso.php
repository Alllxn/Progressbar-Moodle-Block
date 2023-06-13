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
        $contenido = '<div id="contenedor_principal_barra_progreso">';
        $contenido .= '<div id="contenedor_barra">
            <div id="barra"></div>
            <div id="info_barra">
                <span>% Completado</span>
            </div>
        </div>';
        $contenido .= '<div id="contenedor_detalles_barra_progreso">
            <button type="button">
                <span>Mostrar más detalles</span>
                <span><i class="icon fa fa-angle-down fa-fw " aria-hidden="true"></i></span>
            </button>
            <div id="detalles_barra_progreso">
            </div>
        </div>';
        $contenido .= '</div>';
        var_dump($this->determinar_plantilla_usar());
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
                return null;
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
}