<?php

if( isset($_GET['role']) ) {
  $role = htmlentities( trim($_GET['role']), ENT_QUOTES, 'UTF-8' );
  $status = htmlentities( trim($_GET['status']), ENT_QUOTES, 'UTF-8' );
  $sort = htmlentities( trim($_GET['sort']), ENT_QUOTES, 'UTF-8' );

  require_once 'db_connect.php';

    if($connect) { 
      session_start();


      switch ($role) { // Check role
        case 'all':
          $role_query = '1';
        break;
        case 'my':
          $role_query = '`tasks`.`autor_id` =' . $_SESSION['id_user'];
        break;
        case 'me':
          $role_query = '`tasks`.`performer` =' . $_SESSION['id_user'];
        break;
        default:
          $response = [
            'status' => 0
          ];
        break;
      }

      switch ($status) { // Check status
        case 'all':
          $status_query = '1';
        break;
        case 'active':
          $status_query = '`tasks`.`status` = 1';
        break;
        case 'process':
          $status_query = '`tasks`.`status` = 2';
        break;
        case 'finished':
          $status_query = '`tasks`.`status` = 3';
        break;
        case 'archive':
          $status_query = '`tasks`.`status` = 4';
        break;
        default:
          $response = [
            'status' => 0
          ];
        break;
      }

      switch ($sort) { // Check sort
        case 'new':
          $sort_query = '`tasks`.`publication_date` DESC';
        break;
        case 'old':
          $sort_query = '`tasks`.`publication_date`';
        break;
        case 'rating':
          $sort_query = '`users`.`average_rating` DESC';
        break;
        default:
          $response = [
            'status' => 0
          ];
        break;
      }

      if( $response['status'] !== 0 ) {

        $query_result = mysqli_query($connect, "SELECT `users`.`name`, `users`.`photo`, `users`.`average_rating`, `tasks`.`id_task`, `tasks`.`publication_date`,`tasks`.`date_completion`, `tasks`.`title`, `tasks`.`text`, `tasks`.`status` FROM `tasks` JOIN `users` ON `users`.`id_user` = `tasks`.`autor_id` WHERE " . "$role_query AND " . "$status_query ORDER BY " . "$sort_query");

        if(!$query_result && $_SESSION['id_user'] == null) {
          $response = [
            'status' => 2
          ];
        } elseif(!$query_result) {
          $response = [
            'status' => 0
          ];
        } else {
          for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

          for($i = 0; $i < count($result); $i++) {
            $result[$i]['publication_date'] = [
              'day' => date('j', $result[$i]['publication_date']),
              'month' => date('m', $result[$i]['publication_date']),
              'year' => date('Y', $result[$i]['publication_date'])
            ];
            $result[$i]['date_completion'] = [
              'day' => date('j', $result[$i]['date_completion']),
              'month' => date('m', $result[$i]['date_completion']),
              'year' => date('Y', $result[$i]['date_completion'])
            ];

            if(mb_strlen($result[$i]['text']) > 300) {
              $result[$i]['text'] = substr($result[$i]['text'], 0, 300) . '...';
            }
          }

          $response = [
            'status' => 1,
            'data' => $result
          ];
        }

      } else {
        $response = [
          'status' => 0
        ];
      }
    } else {
      $response = [
        'status' => 0
      ];
    }

} else {
  $response = [
    'status' => 0
  ];
}

echo json_encode($response);

?>