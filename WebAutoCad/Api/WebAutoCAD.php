<?php 
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Odczyt danych

        $result = array();

		var_dump($_GET);
        echo json_encode($result);
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		
        // Zapis danych
        $result = array('success' => true);
		
		$dane= $_POST;
		
		$data = json_decode( file_get_contents('php://input') );

		$result['msg'] = "Udalo sie zapisac!";
		$result['odpowiedz'] = var_dump( $_POST)
        echo json_encode($result);
		
    }
?>