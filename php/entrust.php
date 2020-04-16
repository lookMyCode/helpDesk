<?php

  $id_user = htmlentities( trim($_POST['id_user']), ENT_QUOTES, 'UTF-8' );
  $id_task = htmlentities( trim($_POST['id_task']), ENT_QUOTES, 'UTF-8' );

  require_once 'db_connect.php';

  if(!$connect) {
    $response = [
      'status' => 0
    ];
  } else {
    session_start();

    $my_id = $_SESSION['id_user'];

    $query_result = mysqli_query($connect, "SELECT `autor_id` FROM `tasks` WHERE `id_task` = '$id_task' AND `autor_id` = '$my_id'");

    for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

    if( count($result) && $result[0]['autor_id'] == $my_id ) {
      $time = time() + 60*60*24*365;

      $query_result = mysqli_query($connect, "UPDATE `tasks` SET `date_completion` = '$time',`performer`= '$id_user',`status` = 2 WHERE `id_task` = '$id_task'");

      if(!$query_result) {
        $response = [
          'status' => 0
        ];
      } else {
        $response = [
          'status' => 1
        ];
      }
    } else {
      $response = [
        'status' => 0
      ];
    }
  }

  echo json_encode($response);

?>