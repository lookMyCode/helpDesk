<?php

  require_once 'db_connect.php';    

  if(!$connect) {
    $response = [
      'status' => 0
    ];
  } else {
    $query_result = mysqli_query($connect, "SELECT `number` FROM `entrances` WHERE `id_entrances` = 1");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      $num = ++$result[0]['number'];
      
      $query_result = mysqli_query($connect, "UPDATE `entrances` SET `number`= '$num' WHERE `id_entrances` = 1");

      if(!$query_result) {
        $response = [
          'status' => 0
        ];
      } else {
        $response = [
          'status' => 1,
          'data' => [
            'count' => $num
          ]
        ];
      }
    }

    require_once 'db_connect.php';
  }

  echo json_encode($response);

?>