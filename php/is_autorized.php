<?php

    require_once 'db_connect.php';

    if($connect) {
        session_start();
        $sess_id = session_id();

        $query_result = mysqli_query($connect, "SELECT `name` FROM `users` WHERE `session_id` = '$sess_id'");
        
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        if( count($result) == 1 ) {
            $response = [
                'status' => '1',
                'data' => $result[0]
            ];
        } elseif( count($result) == 0 ) {
            $response = [
                'status' => '2'
            ];
        } else {
            $response = [
                'status' => '0'
            ];
        }

        require_once 'db_close_connect.php';
    } else {
        $response = [
            'status' => '0'
        ];
    }

    echo json_encode($response);

?>