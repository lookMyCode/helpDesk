<?php

  $path = htmlentities( trim($_POST['path']), ENT_QUOTES, 'UTF-8' );
  $id_task = htmlentities( trim($_POST['id_task']), ENT_QUOTES, 'UTF-8' );

  require_once 'db_connect.php';

  if($connect) {
    $query_result = mysqli_query($connect, "SELECT `images` FROM `tasks` WHERE `id_task` = '$id_task'");

    if($query_result) {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      $img_name = json_decode($result[0]['images']);

      for($i = 0; $i < count($img_name); $i++) {
        if($img_name[$i] == $path) {
          unset($img_name[$i]);
          unlink($path);
        }
      }

      $arr = [];

      for($i = 0; $i < count($img_name); $i++) {
        $arr[] = $img_name[$i];
      }

      $arr = json_encode($arr);

      $query_result = mysqli_query($connect, "UPDATE `tasks` SET `images`='$arr' WHERE `id_task` = '$id_task'");

      if($query_result) {
        $response = [
          'status' => '1'
        ];
      } else {
        $response = [
          'status' => '0'
        ];
      }
    } else {
      $response = [
        'status' => '0'
      ];
    }
  } else {
    $response = [
      'status' => '0'
    ];
  }

  echo json_encode($response);

?>