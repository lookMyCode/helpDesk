<?php

  if( isset($_POST['id']) ) {
    $id = $_POST['id'];

    require_once 'db_connect.php';

    if($connect) {
      $query_result = mysqli_query($connect, "SELECT `tasks`.`autor_id`, `tasks`.`title`, `tasks`.`text`, `tasks`.`images`, `tasks`.`publication_date`, `tasks`.`date_completion`, `users`.`name`, `users`.`specialization`, `users`.`location`, `users`.`photo`, `users`.`average_rating`, `users`.`number_ratings` FROM `users`, `tasks` WHERE `tasks`.`autor_id` = `users`.`id_user` AND `tasks`.`id_task` = '$id'");

      if($query_result) {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        $result = $result[0];

        if($result['autor_id'] === null) {
          $response = [
            'status' => '2'
          ];
        } else {
          $data = [
            'autor_id' => $result['autor_id'],
            'title' => $result['title'],
            'text' => $result['text'],
            'images' => json_decode($result['images']),
            'autor_name' => $result['name'],
            'autor_specialization' => $result['specialization'],
            'autor_location' => $result['location'],
            'autor_photo' => $result['photo'],
            'autor_average_rating' => $result['average_rating'],
            'autor_number_ratings' => $result['number_ratings'],
            'publication_date' => [
              'day' => date('j', $result['publication_date']),
              'month' => date('m', $result['publication_date']),
              'year' => date('Y', $result['publication_date']),
            ],
            'time' => time()
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