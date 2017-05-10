<?php 
class Project { 

    public $Id; 
    
    public $UserId; 

    public $Name;
    
    public $Content;

    public $AddDate;

    public $LastUpdate;

    public static function Create()
    {
        $project = new Project();
        $project -> AddDate = date("Y-m-d H:i:s");
        $project -> LastUpdate = date("Y-m-d H:i:s");
        $project -> Name = "Projekt";
        return $project;
    }
} 
?> 