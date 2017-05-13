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
            $item =  ProjectApiModel::Parse($projects[$p]);
            array_push($results, $item);
        };

        return $results;
    }

    public static function Parse($project)
    {
        $item = new ProjectApiModel();
        $item -> id = $project -> Id;
        $item -> name = $project -> Name;
        $item -> content = json_decode($project -> Content);
        $item -> addDate = $project -> AddDate;
        $item -> lastUpdate = $project -> LastUpdate;

        return $item;
    }
} 
?> 