<?php

  session_start();
  require_once 'db_connect.php';

  if( !$connect || !$_SESSION['id_user'] ) {
    $response = [
      'status' => 0
    ];
  } else {
    $id_user = $_SESSION['id_user'];

    $query_result = mysqli_query($connect, "SELECT `id_user`, `name`, `photo` FROM `users` WHERE `id_user` = '$id_user'");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      $self = $result[0];

      $query = "SELECT `mes`.*, `users`.`id_user`, `users`.`name`, `users`.`photo` 
      FROM (
          SELECT `messages`.`autor_id`,
            `messages`.`target_id`,
              `messages`.`text`,
              `messages`.`date_sending`,
              `messages`.`status`,
              `m1`.`count_send_unread`
          FROM
                (SELECT `autor_id`, `target_id`, `status`,
                    MAX(`date_sending`) AS 'max_sent_date',
                    SUM( IF(`status` = 0, 1, 0) ) AS 'count_send_unread'
                FROM `messages`
                WHERE `autor_id` = '$id_user'
                GROUP BY `autor_id`, `target_id`
                ) `m1`
          JOIN 
                `messages` ON `m1`.`autor_id` = `messages`.`autor_id` AND `m1`.`target_id` = `messages`.`target_id` AND `m1`.`max_sent_date` = `messages`.`date_sending`
      
          UNION 
      
          SELECT `messages`.`autor_id`,
            `messages`.`target_id`,
              `messages`.`text`,
              `messages`.`date_sending`,
              `messages`.`status`,
              `m2`.`count_send_unread`
          FROM
                (SELECT `autor_id`, `target_id`, `status`,
                    MAX(`date_sending`) AS 'max_sent_date',
                    SUM( IF(`status` = 0, 1, 0) ) AS 'count_send_unread'
                FROM `messages`
                WHERE `target_id` = '$id_user'
                GROUP BY `autor_id`, `target_id`
                ) `m2`
          JOIN `messages` ON `m2`.`autor_id` = `messages`.`autor_id` AND `m2`.`target_id` = `messages`.`target_id` AND `m2`.`max_sent_date` = `messages`.`date_sending`) `mes`, `users` 
      WHERE (`users`.`id_user` = `mes`.`autor_id` AND `users`.`id_user` <> '$id_user') OR (`users`.`id_user` = `mes`.`target_id` AND `users`.`id_user` <> '$id_user')
      ORDER BY `date_sending`";

      $query_result = mysqli_query($connect, $query);

      if(!$query_result) {
        $response = [
          'status' => 0
        ];
      } else {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        for($i = 0; $i < count($result); $i++) {
          $id = $result[$i]['id_user'];
          $flag = false;

          for($j = $i + 1; $j < count($result); $j++) {
            if( $id == $result[$j]['id_user'] ) {

              if( $result[$i]['date_sending'] > $result[$j]['date_sending'] ) {
                array_splice($result, $j, 1);
              } elseif( $result[$i]['date_sending'] < $result[$j]['date_sending'] ) {
                array_splice($result, $i, 1);
              }
              
              $flag = true;
            }
          }

          if($flag) {
            $i -= 1;
          }
        }

        for($i = 0; $i < count($result); $i++) {
          $date_sending = $result[$i]['date_sending'];

          $result[$i]['date_sending'] = [
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
            'self' => $self,
            'dialogues' => $result
          ]
        ];
      }
    }
  }

  echo json_encode($response);

?>