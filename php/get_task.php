<?php

  if( isset($_GET['id']) ) {
    $id = htmlentities( trim($_GET['id']), ENT_QUOTES, 'UTF-8' );

    require_once 'db_connect.php';

    if($connect) {
      $query_result = mysqli_query($connect, "SELECT `tasks`.`autor_id`, `tasks`.`title`, `tasks`.`text`, `tasks`.`images`, `tasks`.`publication_date`, `tasks`.`date_completion`, `tasks`.`status`, `tasks`.`performer`, `users`.`name`, `users`.`specialization`, `users`.`location`, `users`.`photo`, `users`.`average_rating`, `users`.`number_ratings` FROM `users`, `tasks` WHERE `tasks`.`autor_id` = `users`.`id_user` AND `tasks`.`id_task` = '$id'");

      if($query_result) {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        $result = $result[0];

        if($result['autor_id'] === null) {
          $response = [
            'status' => '2'
          ];
        } else {
          session_start();
          
          $data = [
            'my_id' => $_SESSION['id_user'],
            'autor_id' => $result['autor_id'],
            'title' => $result['title'],
            'text' => $result['text'],
            'images' => json_decode($result['images']),
            'autor_name' => $result['name'],
            'autor_specialization' => $result['specialization'],
            'autor_location' => $result['location'],
            'autor_photo' => $result['photo'],
            'autor_average_rating' => round($result['average_rating'], 1),
            'autor_number_ratings' => $result['number_ratings'],
            'publication_date' => [
              'day' => date('j', $result['publication_date']),
              'month' => date('m', $result['publication_date']),
              'year' => date('Y', $result['publication_date']),
            ],
            'time' => time(),
            'status' => $result['status']
          ];
  
          $now = time();
  
          if($result['date_completion'] > $now) {
            $date_completion_days = floor( ( $result['date_completion'] - $now ) / 86400 );
            $date_completion_hours = floor( ( $result['date_completion'] - ($now + $date_completion_days * 86400) ) / 3600);
            $date_completion_minutes = floor( ( $result['date_completion'] - ($now + $date_completion_days * 86400 + $date_completion_hours * 3600) ) / 60);
  
            $data['date_completion']['days'] = $date_completion_days;
            $data['date_completion']['hours'] = $date_completion_hours;
            $data['date_completion']['minutes'] = $date_completion_minutes;
          }

          if($data['status'] == 2 || $data['status'] == 3) {
            $performer = $result['performer'];
            $query_result = mysqli_query($connect, "SELECT `name` FROM `users` WHERE `id_user` = '$performer'");

            for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

            $performer_data = [
              'id' => $performer,
              'name' => $result[0]['name']
            ];

            $data['performer'] = $performer_data;
          }

          $query_result = mysqli_query($connect, "SELECT DISTINCT `users`.`id_user`, `users`.`photo`, `users`.`name`, `offers`.`time`, `offers`.`text` FROM `offers` JOIN `users` ON `offers`.`autor_id` = `users`.`id_user` WHERE `offers`.`target_id` = '$id' ORDER BY `offers`.`time` DESC LIMIT 4");

          for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

          for ($i = 0; $i < count($result); $i++) {
            $timesw = $result[$i]['time'];
            $result[$i]['time'] = [
              'day' => date('j', $timesw),
              'month' => date('m', $timesw),
              'year' => date('Y', $timesw),
              'hour' => date('H', $timesw),
              'minute' => date('i', $timesw)
            ];
          }

          if( count($result) < 4 ) {
            $data['offers']['offers'] = array_reverse($result);
            $data['offers']['more_then_3'] = 0;
          } else {
            $data['offers']['more_then_3'] = 1;
  
            for($i = 0; $i < 3; $i++) {
              $arr[$i] = $result[$i];
            }
  
            $data['offers']['offers'] = array_reverse($arr);
          }
  
          $response = [
            'status' => '1',
            'data' => $data
          ];
  
          session_start();
  
          if($_SESSION['id_user'] == $data['autor_id']) {
            $response['owner'] = '1';
          } else {
            $response['owner'] = '0';
          }
        }

        
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
  } else {
    $response = [
      'status' => '0'
    ];
  }

  echo json_encode($response);

?>