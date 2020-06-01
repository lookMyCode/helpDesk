<?php

if( isset($_POST['target']) ) {
  $target = htmlentities( trim($_POST['target']), ENT_QUOTES, 'UTF-8' );
  $message = htmlentities( trim($_POST['message']), ENT_QUOTES, 'UTF-8' );

  session_start();
  require_once 'db_connect.php';

  if( !$connect || !$_SESSION['id_user'] ) {
    $response = [
      'status' => 0
    ];
  } else {
    $id_user = $_SESSION['id_user'];

    $query_result = mysqli_query($connect, "UPDATE `messages` SET `status` = '1' WHERE `target_id` = '$id_user' AND `autor_id` = '$target'");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
      echo json_encode($response);
      exit();
    }

    if( $message && !empty($message) ) {
      $now = time();
      $query_result = mysqli_query($connect, "INSERT INTO `messages` (`autor_id`, `target_id`, `text`, `status`, `date_sending`) VALUES ('$id_user', '$target', '$message', '0', '$now')");

      if(!$query_result) {
        $response = [
          'status' => 0
        ];
        echo json_encode($response);
        exit();
      }
    }

    $query_result = mysqli_query($connect, "SELECT `name` FROM `users` WHERE `id_user` = '$target'");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      if( count($result) == 1) {
        $interlocutor = [
          'id' => $target,
          'name' => $result[0]['name']
        ];

        $query_result = mysqli_query($connect, "SELECT `id_message`, `autor_id`, `target_id`, `text`,`status`, `date_sending` FROM `messages` WHERE (`autor_id` = '$id_user' AND `target_id` = '$target') OR (`autor_id` = '$target' AND `target_id` = '$id_user')");

        if(!$query_result) {
          $response = [
            'status' => 0
          ];
        } else {
          for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

          $messages = [];
          for($i = 0; $i < count($result); $i++) {
            $date_sending = $result[$i]['date_sending'];

            $messages[$i]['id_message'] = $result[$i]['id_message'];
            $messages[$i]['autor_id'] = $result[$i]['autor_id'];
            $messages[$i]['target_id'] = $result[$i]['target_id'];
            $messages[$i]['text'] = $result[$i]['text'];
            $messages[$i]['status'] = $result[$i]['status'];
            $messages[$i]['date_sending'] = [
              'year' => date('Y', $date_sending),
              'month' => date('m', $date_sending),
              'day' => date('j', $date_sending),
              'hour' => date('H', $date_sending),
              'min' => date('i', $date_sending)
            ];
          }

          $response = [
            'status' => 1,
            'data' => [
              'interlocutor' => $interlocutor,
              'messages' => $messages
            ]
          ];
        }
      } else {
        $response = [
          'status' => 0
        ];
      }
    }
  }
} else {
  $response = [
    'status' => 0
  ];
}

echo json_encode($response);

?>