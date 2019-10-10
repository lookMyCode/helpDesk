<?php

$pass1 = htmlentities( trim($_POST['pass1']), ENT_QUOTES, 'UTF-8' );
$pass2 = htmlentities( trim($_POST['pass2']), ENT_QUOTES, 'UTF-8' );
$pass3 = htmlentities( trim($_POST['pass3']), ENT_QUOTES, 'UTF-8' );

if(mb_strlen($pass2) >= 6 && mb_strlen($pass2) <= 30 && $pass3 === $pass2) {
  require_once 'db_connect.php';
		if($connect) {

      session_start();
      session_regenerate_id();

      $id_user = $_SESSION['id_user'];

      $query_result = mysqli_query($connect, "SELECT `password` FROM `users` WHERE `id_user` = '$id_user'");
	
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
      
      if( password_verify($pass1, $result[0]['password']) ) {
        $pass = password_hash($pass2, PASSWORD_BCRYPT);
        $query_result = mysqli_query($connect, "UPDATE `users` SET `password`='$pass' WHERE `id_user` = '$id_user'");

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
          'status' => '2'
        ];
      }

    require_once 'db_close_connect.php';
    } else {
      $response = [
        'status' => '0'
      ];
    }
}

echo json_encode($response);

?>