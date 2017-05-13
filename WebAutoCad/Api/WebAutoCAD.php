<?php 
require("connect.php");
require("Project.php");
require("ProjectApiModel.php");
require("ProjectRepository.php");
header('Content-Type: text/json; charset=utf-8');

function _GetContent()
{
    if(!isset($_POST["dane"]))
    {
        return null;
    }
    return json_encode($_POST["dane"], JSON_UNESCAPED_UNICODE);
}

$mySessionUserId = 777;

    $repo = new ProjectRepository($host, $db_name, $db_user,  $db_password);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Odczyt danych
        if(isset($_GET["id"]))
        {
            $project = $repo->FindByUserId($_GET["id"], $mySessionUserId);
            if($project == null)
            {
                header("HTTP/1.0 404 Not Found");
                die();
            }

            echo json_encode($project);
        }
        else
        {
            
            echo json_encode(ProjectApiModel::ParseAll($repo->GetByUserId($mySessionUserId)));
        }
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') 
    {    
        // Zapis danych
        $project = null;
        if(isset($_POST["id"]) && $_POST["id"] != null)
        {
            $project = $repo->FindByUserId($_POST["id"], $mySessionUserId);
            if($project == null)
            {
                header("HTTP/1.0 404 Not Found");
                die();
            }

            if(isset($_POST["delete"]) && (bool)$_POST["delete"])
            {
                 $repo -> Delete($project -> Id);
            }
            else
            {
                if(isset($_POST["name"]))
                $project -> Name = $_POST["name"];
                $project -> Content = _GetContent(); 
                $repo -> Update($project);
            }
        }
		else
        {
            $project = Project::Create();
            if(isset($_POST["name"]))
                $project -> Name = $_POST["name"];

            $project -> UserId = $mySessionUserId;
            $project -> Content = _GetContent();
		
            $repo -> Add($project);
        }
        
        echo json_encode(array('success' => true, 'project' => ProjectApiModel::Parse($project)));
    }
?>