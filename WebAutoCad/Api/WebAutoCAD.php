<?php 
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Odczyt danych

        $result = array();

		var_dump($_GET);
        echo json_encode($result);
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		
        include("connect.php") ;
        // Zapis danych
        $result = array('success' => true);
		
		$dane= $_POST;

        $conn = new mysqli($host, $db_user, $db_password, $db_name);
        if (!$conn->set_charset("utf8"))   
        {
            printf("Error loading character set utf8: %s\n", $conn->error);
        }
        $dane = $_POST["dane"];

        for($i = 0; $i < count ($dane) ; $i ++ ) {
             $item = $dane[$i];
             $x1 = $item["x1"];
             $x2 = $item["x2"];
             $y1 = $item["y1"];
             $y2 = $item["y2"];
             $type = $item["state"]["type"];
             $leng = $item["state"]["leng"];
             $fi = $item["state"]["fi"];

             $add = "INSERT INTO `lines`(`x1`, `x2`, `y1`, `y2`, `leng`, `type`, `fi`) VALUES('$x1', '$x2', '$y1', '$y2', '$leng', '$type', '$fi')";
        }

       
        if ($conn->query($add) === TRUE) 
        {
            
            
            //echo $dane;
            echo json_encode("New record created successfully");
        } 
        else 
        {
            echo "Error: " . $add . "<br>" . $conn->error;
        }

		//$result['odpowiedz'] = var_dump( $_POST)
        //echo json_encode($result);
		
    }
?>