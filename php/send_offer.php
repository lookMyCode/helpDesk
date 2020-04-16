<?php

$id_task = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );
$text_offer = htmlentities( trim($_POST['text']), ENT_QUOTES, 'UTF-8' );

require_once 'db_connect.php';

if(!$connect) {
  $response = [
    'status' => 0
  ];
} else {
  session_start();

  if( isset($_SESSION['id_user']) ) {
    $autor_id = $_SESSION['id_user'];
    $time = time();

    $query_result = mysqli_query($connect, "INSERT INTO `offers`(`autor_id`, `target_id`, `text`, `time`) VALUES ('$autor_id', '$id_task', '$text_offer', '$time')");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      $query_result = mysqli_query($connect, "SELECT DISTINCT `users`.`id_user`, `users`.`photo`, `users`.`name`, `offers`.`time`, `offers`.`text` FROM `offers` JOIN `users` ON `offers`.`autor_id` = `users`.`id_user` WHERE `offers`.`target_id` = '$id_task' AND `offers`.`autor_id` = '$autor_id' ORDER BY `offers`.`time` DESC LIMIT 1");

      if(!$query_result) {
        $response = [
          'status' => 0
        ];
      } else {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
        $result = $result[0];

        $timesw = $result['time'];

        $result['time'] = [
          'day' => date('j', $timesw),
          'month' => date('m', $timesw),
          'year' => date('Y', $timesw),
          'hour' => date('H', $timesw),
          'minute' => date('i', $timesw)
        ];

        $response = [
          'status' => 1,
          'data' => $result
        ];
      }
    }
  } else {
    $response = [
      'status' => 0
    ];
  }
}

echo json_encode($response);

?>