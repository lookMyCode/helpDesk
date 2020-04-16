<?php

  require_once 'db_connect.php';

  $id_user = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );

  if(!$connect) {
    $response = [
      'status' => 0
    ];
  } else {
    $query_result = mysqli_query($connect, "SELECT DISTINCT `users`.`id_user`, `users`.`photo`, `users`.`name`, `reviews`.`date_review`, `reviews`.`text` FROM `reviews` JOIN `users` ON `reviews`.`autor_id` = `users`.`id_user` WHERE `reviews`.`target_id` = '$id_user' ORDER BY `reviews`.`date_review` DESC");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      $result = array_reverse($result);

      for ($i = 0; $i < count($result); $i++) {
        $timesw = $result[$i]['date_review'];
        $result[$i]['date_review'] = [
          'day' => date('j', $timesw),
          'month' => date('m', $timesw),
          'year' => date('Y', $timesw),
          'hour' => date('H', $timesw),
          'minute' => date('i', $timesw)
        ];
      }

      $response = [
        'status' => 1,
        'data' => $result
      ];
    }
  }

  echo json_encode($response);

?>