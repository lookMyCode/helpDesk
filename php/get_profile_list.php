<?php

  if( isset($_GET['role']) && $_GET['role'] == 'all' ) {
    require_once 'db_connect.php';

    if($connect) {
      $query_result = mysqli_query($connect, "SELECT `id_user`, `photo`, `name`, `average_rating`, `number_ratings`, `specialization`, `location`, `about` FROM `users`");

      if($query_result) {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        for($i = 0; $i < count($result); $i++) {
          if(mb_strlen($result[$i]['about']) > 300) {
            $result[$i]['about'] = substr($result[$i]['about'], 0, 300) . '...';
          }
        }

        $response = [
          'status' => '1',
          'data' => $result
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

    require_once 'db_close_connect.php';
  } else {
    $response = [
      'status' => '0'
    ];
  }

  echo json_encode($response);

?>