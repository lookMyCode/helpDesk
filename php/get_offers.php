<?php

  require_once 'db_connect.php';

  $id_task = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );

  session_start();
  $my_id = $_SESSION['id_user'];

  if(!$connect) {
    $response = [
      'status' => 0
    ];
  } else {
    $query_result = mysqli_query($connect, "SELECT `autor_id`, `status` FROM `tasks` WHERE `id_task` = '$id_task'");

    for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

    $task_autor = $result[0]['autor_id'];
    $task_status = $result[0]['status'];

    $query_result = mysqli_query($connect, "SELECT DISTINCT `users`.`id_user`, `users`.`photo`, `users`.`name`, `offers`.`autor_id`, `offers`.`time`, `offers`.`text` FROM `offers` JOIN `users` ON `offers`.`autor_id` = `users`.`id_user` WHERE `offers`.`target_id` = '$id_task' ORDER BY `offers`.`time` DESC");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      $result = array_reverse($result);

      for ($i = 0; $i < count($result); $i++) {
        $timesw = $result[$i]['time'];
        $result[$i]['time'] = [
          'day' => date('j', $timesw),
          'month' => date('m', $timesw),
          'year' => date('Y', $timesw),
          'hour' => date('H', $timesw),
          'minute' => date('i', $timesw)
        ];

        if($my_id == $task_autor) {
          $result[$i]['owner'] = 1;
        } else {
          $result[$i]['owner'] = 0;
        }
        $result[$i]['my_id'] = $my_id;
        $result[$i]['status'] = $task_status;
      }

      $response = [
        'status' => 1,
        'data' => $result
      ];
    }
  }

  echo json_encode($response);

?>