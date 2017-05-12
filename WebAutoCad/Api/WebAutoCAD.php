<?php 
require("connect.php");
require("Project.php");
require("ProjectApiModel.php");
require("ProjectRepository.php");
header('Content-Type: text/json; charset=utf-8');

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
        if(isset($_POST["id"]))
        {
            $project = $repo->FindByUserId($_GET["id"], $mySessionUserId);
            if($project == null)
            {
                header("HTTP/1.0 404 Not Found");
                die();
            }
            if(isset($_POST["name"]))
                $project -> Name = $_POST["name"];
            $project -> Content = json_encode($_POST["dane"], JSON_UNESCAPED_UNICODE);

            $repo -> Update($project);
        }
		else
        {
            $project = Project::Create();
            if(isset($_POST["name"]))
                $project -> Name = $_POST["name"];
            $project -> UserId = $mySessionUserId;
            $project -> Content = json_encode($_POST["dane"], JSON_UNESCAPED_UNICODE);
		
            $repo -> Add($project);
        }
        
        echo json_encode(array('success' => true, 'project' => $project));
    }
?>