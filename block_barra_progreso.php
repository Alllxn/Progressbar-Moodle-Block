<?php


require_once($CFG->dirroot . "/blocks/barra_progreso/classes/block_barra_progreso.class.php");

class block_barra_progreso extends block_base {
    public function init() {
        // $this->title = get_string('barra_progreso', 'block_barra_progreso');
    }
    // The PHP tag and the curly bracket for the class definition 
    // will only be closed after there is another function added in the next section.

    public function specialization()
    {
        if (isset($this->config)) {
            if (empty($this->config->title)) {
            $this->title = get_config('block_barra_progreso', 'titulo_bloque');
            } else {
            $this->title = $this->config->title;
            }
        }else if(get_config('block_barra_progreso', 'titulo_bloque') != ""){
            $this->title = get_config('block_barra_progreso', 'titulo_bloque');
        } else {
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
        
        // var_dump($this->instance->id);
        // var_dump($this);
        // var_dump($this->comprobar_existe_plantilla());
        // $this->montar_barra_segun_plantilla($this->comprobar_existe_plantilla());
        $contenido = '<div id="contenedor_principal_barra_progreso">';
        $contenido .= '<div id="contenedor_barra">
            <div id="barra"></div>
            <div id="info_barra">
                <span>% Completado</span>
                <span>'.$this->sacar_porcentaje().'</span>
            </div>
        </div>';
        $contenido .= '<div id="contenedor_detalles_barra_progreso">
            <button type="button">
                <span>Mostrar más detalles</span>
                <span><i class="icon fa fa-angle-down fa-fw " aria-hidden="true"></i></span>
            </button>
            <div id="detalles_barra_progreso">
                '.'//.$this->montar_barra_segun_plantilla($this->get_plantillas()).
            </div>
        </div>';
        $contenido .= '</div>';

        return $contenido;
    }

    public function montar_barra_segun_plantilla($plantillas){
        global $COURSE;
        $barra_progreso = new Barra_progreso();
        $modulos = JSON_decode($barra_progreso->sacar_modulos($COURSE->id));
        
        $resultado = ""; 
        
        var_dump($modulos);
        // var_dump($plantillas);

        return $resultado;
        
    }

    public function sacar_porcentaje(){        
        $resultado = "5/10";
        return $resultado;
    }

    public function get_instance_block(){
        // var_dump($this->instance->id);
        // return $this->instance->id;
    }

    public function has_config()
    {
      return true;
    }

    function _self_test() {
        return true;
      }
}