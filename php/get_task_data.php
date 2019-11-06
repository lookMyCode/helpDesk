<?php

  $id_task = htmlentities( trim($_GET['id']), ENT_QUOTES, 'UTF-8' );

  session_start();
  if( isset($_SESSION['id_user']) ) {
    $id_user = $_SESSION['id_user'];
  }

  if($id_task > 0) {

    require_once 'db_connect.php';

    if($connect) {
      $query_result = mysqli_query($connect, "SELECT * FROM `tasks` WHERE `id_task` = '$id_task'");
	
      for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
      
      if(isset($result) && $result && count($result) == 1 && $id_user == $result[0]['autor_id']) {

        $response = [
          'status' => '1',
          'data' => [
            'title' => $result[0]['title'],
            'text' => $result[0]['text'],
            'images' => $result[0]['images']
          ]
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