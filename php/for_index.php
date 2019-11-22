<?php

  require_once 'db_connect.php';

  if($connect) {

    $data = [];

    $query_result = mysqli_query($connect, "SELECT `users`.`photo`, `users`.`average_rating`, `tasks`.`id_task`, `tasks`.`publication_date`,`tasks`.`date_completion`, `tasks`.`title`, `tasks`.`text` FROM `tasks` JOIN `users` ON `users`.`id_user` = `tasks`.`autor_id` ORDER BY `tasks`.`publication_date` DESC LIMIT 4");

    if(!$query_result) {
      $response = [
        'status' => 0
      ];
    } else {
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      if( count($result) > 3 ) {
        for($i = 0; $i < 3; $i++) {
          $arr[] = $result[$i];
        }
        $data = [
          'tasks' => $arr,
          'more_then_3' => 1
        ];
      } else {
        $data = [
          'tasks' => $result,
          'more_then_3' => 0
        ];
      }

      for ( $i = 0; $i < count( $data['tasks'] ); $i++ ) {
        $data['tasks'][$i]['publication_date'] = [
          'day' => date('j', $data['tasks'][$i]['publication_date']),
          'month' => date('m', $data['tasks'][$i]['publication_date']),
          'year' => date('Y', $data['tasks'][$i]['publication_date'])
        ];
        $data['tasks'][$i]['date_completion'] = [
          'day' => date('j', $data['tasks'][$i]['date_completion']),
          'month' => date('m', $data['tasks'][$i]['date_completion']),
          'year' => date('Y', $data['tasks'][$i]['date_completion'])
        ];

        if(mb_strlen($data['tasks'][$i]['text']) > 300) {
          $data['tasks'][$i]['text'] = substr($data['tasks'][$i]['text'], 0, 300) . '...';
        }
      }

      $response = [
        'status' => 1, 
        'data' => $data
      ];
       
    }

    if( $response['status'] == 1 ) {
      $query_result = mysqli_query($connect, "SELECT DISTINCT (SELECT COUNT( `tasks`.`id_task` ) FROM `tasks`  WHERE 1) AS 'count_tasks', (SELECT COUNT( `users`.`id_user` ) FROM `users`  WHERE 1) AS 'count_users', ( SELECT `entrances`.`number` FROM `entrances`) AS 'entrances' FROM `users`, `tasks`");

      if(!$query_result) {
        $response = [
          'status' => 0
        ];
      } else {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        $response['data']['count_tasks'] = $result[0]['count_tasks'];
        $response['data']['count_users'] = $result[0]['count_users'];
        $response['data']['entrances'] = $result[0]['entrances'];
      }
    }

    require_once 'db_close_connect.php';

  } else {
    $response = [
      'status' => 0
    ];
  }

  echo json_encode($response);

?>