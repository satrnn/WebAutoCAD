<?php 
class ProjectApiModel { 

    public $id; 
    
    public $name;
    
    public $content;

    public $addDate;

    public $lastUpdate;

    public static function ParseAll($projects)
    {
        $results = array();

        for($p = 0; $p < count($projects); $p++ ){
            $item = new ProjectApiModel();
            $item -> id = $projects[$p] -> Id;
            $item -> name = $projects[$p] -> Name;
            $item -> content = json_decode($projects[$p] -> Content);
            $item -> addDate = $projects[$p] -> AddDate;
            $item -> lastUpdate = $projects[$p] -> LastUpdate;
            array_push($results, $item);
        };

        return $results;
    }
} 
?> 