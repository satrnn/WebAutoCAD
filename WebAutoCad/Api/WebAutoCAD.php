<?php 
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Odczyt danych

        $result = array();

        echo json_encode($result);
    }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Zapis danych
        $result = (object) array('success' => true);

        echo json_encode($result);
    }
?>