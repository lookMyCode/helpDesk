<?php

  $id_task = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );

  require_once 'db_connect.php';

  if($connect) {
    $new_date_completion = time() + 60*60*24*14;
    
    $query_result = mysqli_query($connect, "UPDATE `tasks` SET `date_completion`='$new_date_completion' WHERE `id_task` = '$id_task'");

    if(!$query_result) {
      $response = [
        'status' => '0'
      ];
    } else {
      $response = [
        'status' => '1'
      ];
    }
  } else {
    $response = [
      'status' => '0'
    ];
  }

  echo json_encode($response);

?>