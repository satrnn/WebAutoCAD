<?php 

class ProjectRepository 
{ 
    private $pdo;

    function __construct($host, $db_name, $db_user,  $db_password) 
    {
        $this->pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $db_user,  $db_password);
        $this->pdo->exec("set names utf8");
    }

    public function Add ($project)
    {
        $stmt = $this->pdo -> prepare("INSERT INTO `projects`(`Name`, `UserId`, `Content`, `AddDate`, `LastUpdate`, `IsDeleted`) 
            VALUES(:name, :userId, :content, Now(), Now(), false)");

        $stmt -> bindValue(':name', $project->Name, PDO::PARAM_STR);
		$stmt -> bindValue(':userId', $project->UserId, PDO::PARAM_STR);
		$stmt -> bindValue(':content', $project->Content, PDO::PARAM_STR);

        $ilosc = $stmt -> execute();

        $project->Id = $this->pdo->lastInsertId();
        return $ilosc;
    } 
    
    public function Update ($project)
    {
        $stmt = $this->pdo -> prepare("UPDATE `projects` 
            SET `Name` = :name, `UserId` = :userId, `Content` = :content, `LastUpdate` = Now() 
            WHERE `Id` = :id");
        $stmt -> bindValue(':id', $project->Id, PDO::PARAM_INT);
        $stmt -> bindValue(':name', $project->Name, PDO::PARAM_STR);
		$stmt -> bindValue(':userId', $project->UserId, PDO::PARAM_INT);
		$stmt -> bindValue(':content', $project->Content, PDO::PARAM_STR);

        $ilosc = $stmt -> execute();

        return $ilosc;
    } 

    public function Delete ($projectId)
    {
        $stmt = $this->pdo -> prepare("UPDATE `projects` 
            SET `IsDeleted` = true
            WHERE `Id` = :id");
        $stmt -> bindValue(':id', $projectId, PDO::PARAM_INT);

        $ilosc = $stmt -> execute();
    } 
    
    public function FindByUserId ($projectId, $userId)
    {
        $stmt = $this->pdo->prepare('SELECT * FROM `projects` 
            WHERE `IsDeleted` = false and `UserId` = :userId AND `Id` = :Id');

        $stmt -> bindParam(':userId', $userId, PDO::PARAM_INT);
        $stmt -> bindParam(':Id', $projectId, PDO::PARAM_INT);
        $stmt -> execute();

        while($row = $stmt->fetch())
        {
            $result = new Project();
            $result->Id = $row['Id'];
            $result->Name = $row['Name'];
            $result->UserId = $row['UserId'];
            $result->Content = $row['Content'];
            $result->AddDate = $row['AddDate'];
            $result->LastUpdate = $row['LastUpdate'];

            return $result;
        }

        return null;
    } 

    public function GetByUserId($userId)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM `projects`
            WHERE `IsDeleted` = false and `UserId` = :userId
            ORDER BY `LastUpdate` DESC");
            
        $stmt -> bindParam( ':userId', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $projects = array();
        while($row = $stmt->fetch())
        {
            
            array_push($projects, $this->_RowToObj($row));
        }

        return $projects;
    } 

    private function _RowToObj($row)
    {
        $project = new Project();
        $project->Id = $row['Id'];
        $project->Name = $row['Name'];
        $project->UserId = $row['UserId'];
        $project->Content = $row['Content'];
        $project->AddDate = $row['AddDate'];
        $project->LastUpdate = $row['LastUpdate'];
        return $project;
    }
} 
?> 