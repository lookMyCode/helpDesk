<?php

$id_target = htmlentities( trim($_POST['id']), ENT_QUOTES, 'UTF-8' );
$text_review = htmlentities( trim($_POST['text']), ENT_QUOTES, 'UTF-8' );

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

    $query_result = mysqli_query($connect, "INSERT INTO `reviews`(`autor_id`, `target_id`, `text`, `date_review`) VALUES ('$autor_id', '$id_target', '$text_review', '$time')");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      $query_result = mysqli_query($connect, "SELECT DISTINCT `users`.`photo`, `users`.`name`, `reviews`.`date_review`, `reviews`.`text` FROM `reviews` JOIN `users` ON `reviews`.`autor_id` = `users`.`id_user` WHERE `reviews`.`target_id` = '$id_target' AND `reviews`.`autor_id` = '$autor_id' ORDER BY `reviews`.`date_review` DESC LIMIT 1");

      if(!$query_result) {
        $response = [
          'status' => 0
        ];
      } else {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
        $result = $result[0];

        $timesw = $result['date_review'];

        $result['date_review'] = [
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