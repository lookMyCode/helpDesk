<?php

  session_start();

  $id_user = $_SESSION['id_user'];

  if( isset($_SESSION['id_user']) && $_SESSION['id_user'] == $id_user ) {
    $response = [
      'status' => '1',
      'data' => [
        'specialization' => $_SESSION['specialization'],
        'location' => $_SESSION['location'],
        'tel' => $_SESSION['tel'],
        'public_mail' => $_SESSION['public_mail'],
        'skype' => $_SESSION['skype'],
        'website' => $_SESSION['website'],
        'about' => $_SESSION['about']
      ]
    ];
  } else {
    $response = [
      'status' => '0'
    ];
  }

  echo json_encode($response);

?>