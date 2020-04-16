<?php

  $id_user = htmlentities( trim($_GET['id']), ENT_QUOTES, 'UTF-8' );

  session_start();

  if($id_user > 0) {

    require_once 'db_connect.php';

    if($connect) {
      $query_result = mysqli_query($connect, "SELECT * FROM `users` WHERE `id_user` = '$id_user'");
	
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
      
      if(isset($result) && $result && count($result) == 1) {

        $response = [
          'status' => '1',
          'owner' => '0',
          'data' => [
            'mail' => $result[0]['mail'],
            'name' => $result[0]['name'],
            'specialization' => $result[0]['specialization'],
            'location' => $_SESSION['location'],
            'date_registration' => [
              'day' => date('j', $result[0]['date_registration']),
              'month' => date('m', $result[0]['date_registration']),
              'year' => date('Y', $result[0]['date_registration']),
            ],
            'tel' => $result[0]['tel'],
            'public_mail' => $result[0]['public_mail'],
            'skype' => $result[0]['skype'],
            'website' => $result[0]['website'],
            'about' => $result[0]['about'],
            'average_rating' => round( $result[0]['average_rating'], 1),
            'number_ratings' => $result[0]['number_ratings'],
            'photo' => $result[0]['photo'],
            `tasks` => []
          ]
        ];

        if( $id_user == $_SESSION['id_user'] ) {
          $response['owner'] = '1';
        };

        if( in_array( $_SESSION['id_user'], json_decode($result[0]['appreciated']) ) ) {
          $response['appreciated'] = 1;
        } else {
          $response['appreciated'] = 0;
        }

      } else {
        $response = [
          'status' => '0'
        ];
      }

      if($response['status'] == 1) {
        $query_result = mysqli_query($connect, "SELECT `id_task`, `title`, `publication_date`, `text`, `status` FROM `tasks` WHERE `autor_id` = '$id_user' ORDER BY `publication_date` DESC LIMIT 4");

        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        if( count($result) < 4 ) {
          $response['data']['tasks']['published']['tasks'] = array_reverse($result);
          $response['data']['tasks']['published']['more_then_3'] = 0;
        } else {
          $response['data']['tasks']['published']['more_then_3'] = 1;

          for($i = 0; $i < 3; $i++) {
            $arr[$i] = $result[$i];
          }

          $response['data']['tasks']['published']['tasks'] = array_reverse($arr);
        }

        for($i = 0; $i < count($response['data']['tasks']['published']['tasks']); $i++) {
          $timesw = $response['data']['tasks']['published']['tasks'][$i]['publication_date'];
          $response['data']['tasks']['published']['tasks'][$i]['publication_date'] = [
            'day' => date('j', $timesw),
            'month' => date('m', $timesw),
            'year' => date('Y', $timesw),
            'hour' => date('H', $timesw),
            'minute' => date('i', $timesw)
          ];

          if(mb_strlen($response['data']['tasks']['published']['tasks'][$i]['text']) > 300) {
            $response['data']['tasks']['published']['tasks'][$i]['text'] = substr($response['data']['tasks']['published']['tasks'][$i]['text'], 0, 300) . '...';
          }
        }



        $query_result = mysqli_query($connect, "SELECT `id_task`, `title`, `publication_date`, `text`, `status` FROM `tasks` WHERE `performer` = '$id_user' ORDER BY `publication_date` DESC LIMIT 4");

        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        if( count($result) < 4 ) {
          $response['data']['tasks']['made']['tasks'] = array_reverse($result);
          $response['data']['tasks']['made']['more_then_3'] = 0;
        } else {
          $response['data']['tasks']['made']['more_then_3'] = 1;

          for($i = 0; $i < 3; $i++) {
            $arr[$i] = $result[$i];
          }

          $response['data']['tasks']['made']['tasks'] = array_reverse($arr);
        }

        for($i = 0; $i < count($response['data']['tasks']['made']['tasks']); $i++) {
          $timesw = $response['data']['tasks']['made']['tasks'][$i]['publication_date'];
          $response['data']['tasks']['made']['tasks'][$i]['publication_date'] = [
            'day' => date('j', $timesw),
            'month' => date('m', $timesw),
            'year' => date('Y', $timesw),
            'hour' => date('H', $timesw),
            'minute' => date('i', $timesw)
          ];

          if(mb_strlen($response['data']['tasks']['made']['tasks'][$i]['text']) > 300) {
            $response['data']['tasks']['made']['tasks'][$i]['text'] = substr($response['data']['tasks']['made']['tasks'][$i]['text'], 0, 300) . '...';
          }
        }


        $query_result = mysqli_query($connect, "SELECT DISTINCT `users`.`id_user`, `users`.`photo`, `users`.`name`, `reviews`.`date_review`, `reviews`.`text` FROM `reviews` JOIN `users` ON `reviews`.`autor_id` = `users`.`id_user` WHERE `reviews`.`target_id` = '$id_user' ORDER BY `reviews`.`date_review` DESC LIMIT 4");

        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

        for ($i = 0; $i < count($result); $i++) {
          $timesw = $result[$i]['date_review'];
          $result[$i]['date_review'] = [
            'day' => date('j', $timesw),
            'month' => date('m', $timesw),
            'year' => date('Y', $timesw),
            'hour' => date('H', $timesw),
            'minute' => date('i', $timesw)
          ];
        }

        if( count($result) < 4 ) {
          $response['data']['reviews']['reviews'] = array_reverse($result);
          $response['data']['reviews']['more_then_3'] = 0;
        } else {
          $response['data']['reviews']['more_then_3'] = 1;

          for($i = 0; $i < 3; $i++) {
            $arr[$i] = $result[$i];
          }

          $response['data']['reviews']['reviews'] = array_reverse($arr);
        }
      } 
    } else {
      $response = [
        'status' => '0'
      ];
    }
    require_once 'db_close_connect.php';
  } else {
    $response = [
      'status' => '0'
    ];
  }

  echo json_encode($response);

?>