<?php
  if( isset($_POST['id']) ) {
    $id_task = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );

    require_once 'db_connect.php';

    if(!$connect) {
      $response = [
        'status' => 0
      ];
    } else {
      $query_result = mysqli_query($connect, "SELECT `autor_id` FROM `tasks` WHERE `id_task` = '$id_task'");

      if(!$query_result) {
        $response = [
          'status' => 0
        ];
      } else {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
        $autor_id = $result[0]['autor_id'];

        session_start();
        $user_id = $_SESSION['id_user'];

        if($autor_id !== $user_id)  {
          $response = [
            'status' => 0
          ];
        } else {
          $new_date_completion = time();

          $query_result = mysqli_query($connect, "UPDATE `tasks` SET `date_completion` = '$new_date_completion', `status` = 3 WHERE `id_task` = '$id_task'");

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
  } else {
    $response = [
      'status' => 0
    ];
  }

  echo json_encode($response);
?>