<?php 

// global $CFG;

// // require_once($CFG->wwwroot.'blocks/barra_progreso/block_barra_progreso.php');
// require_once('../block_barra_progreso.php');

// use customcertelement_bgimage\element;

require_once($CFG->dirroot . "/blocks/barra_progreso/block_barra_progreso.php");


class Barra_progreso extends block_barra_progreso{
    

    public function sacar_categorias(){
        global $DB;
        $categorias_sql = '
            SELECT id, name 
            FROM {course_categories}
        ';
        $categorias = $DB->get_recordset_sql($categorias_sql);

        $array_categorias = [];

        foreach ($categorias as $categoria) {
            $array_categorias[$categoria->id] = $categoria->name;
        }

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
    

}