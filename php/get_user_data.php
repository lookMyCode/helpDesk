<?php

  $id_user = htmlentities( trim($_GET['id']), ENT_QUOTES, 'UTF-8' );

  session_start();

  if( isset($_SESSION['id_user']) && $_SESSION['id_user'] == $id_user ) {
    $response = [
      'status' => '1',
      'owner' => '1',
      'data' => [
        'mail' => $_SESSION['mail'],
        'name' => $_SESSION['name'],
        'specialization' => $_SESSION['specialization'],
        'location' => $_SESSION['location'],
        'date_registration' => $_SESSION['date_registration'],
        'tel' => $_SESSION['tel'],
        'public_mail' => $_SESSION['public_mail'],
        'skype' => $_SESSION['skype'],
        'website' => $_SESSION['website'],
        'about' => $_SESSION['about'],
        'average_rating' => $_SESSION['average_rating'],
        'number_ratings' => $_SESSION['number_ratings']
      ]
    ];
  } else if($id_user > 0) {

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
            'number_ratings' => $result[0]['number_ratings']
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

  } else {
    $response = [
      'status' => '0'
    ];
  }

  echo json_encode($response);

?>