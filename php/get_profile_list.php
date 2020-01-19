<?php

  if( isset($_GET['role']) ) {
    require_once 'db_connect.php';

    if($connect) {

      $query = "SELECT DISTINCT `id_user`, `photo`, `name`, `average_rating`, `number_ratings`, `specialization`, `location`, `about` FROM `users`";
      if($_GET['role'] == 'giver') {
        $query .= " JOIN `tasks` ON `users`.`id_user` = `tasks`.`autor_id`";
      } elseif($_GET['role'] == 'making') {
        $query .= " JOIN `tasks` ON `users`.`id_user` = `tasks`.`performer`";
      }

      if( isset($_GET['sort']) ) {
        
        if($_GET['sort'] == 'new') {
          $query .= " ORDER BY `date_registration` DESC";
        } else if($_GET['sort'] == 'old') {
          $query .= " ORDER BY `date_registration`";
        } else if($_GET['sort'] == 'rating') {
          $query .= " ORDER BY `average_rating` DESC";
        }

      }
      $query_result = mysqli_query($connect, $query);


      if($query_result) {
        for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);


        for($i = 0; $i < count($result); $i++) {
          if(mb_strlen($result[$i]['about']) > 300) {
            $result[$i]['about'] = substr($result[$i]['about'], 0, 300) . '...';
          }
          $result[$i]['average_rating'] = round($result[$i]['average_rating'], 1);
        }

        $response = [
          'status' => '1',
          'data' => $result
        ];
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

    require_once 'db_close_connect.php';
  } else {
    $response = [
      'status' => '0'
    ];
  }

  echo json_encode($response);

?>