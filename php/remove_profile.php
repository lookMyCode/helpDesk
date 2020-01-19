<?php

session_start();
$id_user = $_SESSION['id_user'];
$pass = htmlentities( trim($_POST['pass']), ENT_QUOTES, 'UTF-8' );

require_once 'db_connect.php';

if(!$connect) {
  $response = [
    'status' => 0
  ];
} else {
  $query_result = mysqli_query($connect, "SELECT `password`, `photo` FROM `users` WHERE `id_user` = '$id_user'");

  for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

  $password = $result[0]['password'];
  $photo = $result[0]['photo'];

  if( count($result) == 1 && password_verify($pass, $password) ) {
    $query_result = mysqli_query($connect, "DELETE FROM `users` WHERE `id_user` = '$id_user'");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      if( strlen($photo) != 0 ) {
        unlink('..' . $photo);
      }

      $query_result = mysqli_query($connect, "SELECT `images` FROM `tasks` WHERE `autor_id` = 1");

      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      for($i = 0; $i < count($result); $i++) {
        if($result[$i] != '' || $result[$i] != false) {
          $images = json_decode($result[$i]);
          for($j = 0; $j < count($images); $j++) {
            if( strlen($images) != 0 ) {
              unlink($images);
            }
          }
        }
      }

      $query_result = mysqli_query($connect, "DELETE FROM `tasks` WHERE `autor_id` = '$id_user'");

      $query_result = mysqli_query($connect, "DELETE FROM `reviews` WHERE `autor_id` = '$id_user' OR `target_id` = '$id_user'");

      session_destroy();

      $response = [
        'status' => 1
      ];
    }
  } else {
    $response = [
      'status' => 2
    ];
  }
}

echo json_encode($response);

?>