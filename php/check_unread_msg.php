<?php

session_start();
require_once 'db_connect.php';

if(!$connect) {
  $response = [
    'status' => 0
  ];
} else {
  if(!$_SESSION['id_user']) {
    $response = [
      'status' => 2
    ];
  } else {
    $id_user = $_SESSION['id_user'];

    $query_result = mysqli_query($connect, "SELECT COUNT(DISTINCT `autor_id`) AS 'count_msg' FROM `messages` WHERE `target_id` = '$id_user' AND `status` = 0");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      if( count($result) == 1 ) {
        $response = [
          'status' => 1,
          'data' => $result[0]
        ];
      } else {
        $response = [
          'status' => 0
        ];
      }
    }
  }
}

echo json_encode($response);
// 0 - Error, 1 - OK, 2 - not autorizeted

?>