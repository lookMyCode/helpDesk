<?php

  session_start();

  if( isset($_SESSION['id_user']) ) {
    $response = [
      'status' => '1',
      'id' => $_SESSION['id_user']
    ];
  } else {
    $response = [
      'status' => '2'
    ];
  }

  echo json_encode($response);

?>