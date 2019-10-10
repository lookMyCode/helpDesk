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
            'date_registration' => $result[0]['date_registration'],
            'tel' => $result[0]['tel'],
            'public_mail' => $result[0]['public_mail'],
            'skype' => $result[0]['skype'],
            'website' => $result[0]['website'],
            'about' => $result[0]['about'],
            'average_rating' => $result[0]['average_rating'],
            'number_ratings' => $result[0]['number_ratings'],
            'photo' => $result[0]['photo']
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