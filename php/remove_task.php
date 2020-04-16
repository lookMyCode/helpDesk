<?php

  $id_task = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );
  
  require_once 'db_connect.php';

  if(!$connect) {
    $response = [
      'status' => 0
    ];
  } else {
    session_start();

    $id_user = $_SESSION['id_user'];

    $query_result = mysqli_query($connect, "SELECT `autor_id`, `images` FROM `tasks` WHERE `id_task` = '$id_task'");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      if( count($result) == 1 && $result[0]['autor_id'] == $id_user ) {
        $images = json_decode($result[0]['images']);

        for($i = 0; $i < count($images); $i++) {
          if( strlen($images[$i]) != 0 ) {
            unlink($images[$i]);
          }
        }

        $query_result = mysqli_query($connect, "DELETE FROM `tasks` WHERE `id_task` = '$id_task' AND `autor_id`='$id_user'");

        if(!$query_result) {
          $response = [
            'status' => 0
          ];
        } else {
          $response = [
            'status' => 1
          ];
        }
      }
    }

    require_once 'db_close_connect.php';
  }
    

  echo json_encode($response);

?>