<?php

    session_start();

    if( isset($_SESSION['auth']) && $_SESSION['auth'] == 1 ) {
        $response = [
            'status' => '1'
        ];
    } else {
        $response = [
            'status' => '2'
        ];
    }

    echo json_encode($response);

?>