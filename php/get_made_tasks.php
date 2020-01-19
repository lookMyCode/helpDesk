<?php

  require_once 'db_connect.php';

  $id_user = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );

  if(!$connect) {
    $response = [
      'status' => 0
    ];
  } else {
    $query_result = mysqli_query($connect, "SELECT `id_task`, `title`, `publication_date`, `text`, `status` FROM `tasks` WHERE `performer` = '$id_user' ORDER BY `publication_date` DESC");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      $result = array_reverse($result);

      for ($i = 0; $i < count($result); $i++) {
        $timesw = $result[$i]['publication_date'];
        $result[$i]['publication_date'] = [
          'day' => date('j', $timesw),
          'month' => date('m', $timesw),
          'year' => date('Y', $timesw),
          'hour' => date('H', $timesw),
          'minute' => date('i', $timesw)
        ];
        $result[$i]['text'] = substr($result[$i]['text'], 0, 300) . '...';
      }

      $response = [
        'status' => 1,
        'data' => $result
      ];
    }
  }

  echo json_encode($response);

?>