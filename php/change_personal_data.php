<?php

  $specialization = htmlentities( trim($_POST['specialization']), ENT_QUOTES, 'UTF-8' );
  $location = htmlentities( trim($_POST['location']), ENT_QUOTES, 'UTF-8' );
  $tel = htmlentities( trim($_POST['tel']), ENT_QUOTES, 'UTF-8' );
  $public_mail = htmlentities( trim($_POST['public_mail']), ENT_QUOTES, 'UTF-8' );
  $skype = htmlentities( trim($_POST['skype']), ENT_QUOTES, 'UTF-8' );
  $website = htmlentities( trim($_POST['website']), ENT_QUOTES, 'UTF-8' );
  $about = htmlentities( trim($_POST['about']), ENT_QUOTES, 'UTF-8' );

  require_once 'db_connect.php';

  if($connect) {
    session_start();
    $id_user = $_SESSION['id_user'];

    $query_result = mysqli_query($connect, "UPDATE `users` SET `specialization`='$specialization',`location`='$location',`tel`='$tel',`public_mail`='$public_mail',`skype`='$skype',`website`='$website',`about`='$about' WHERE `id_user`='$id_user'");

    if(!$query_result) {
      $response = [
        'status' => '0'
      ];
    } else {
			$_SESSION['specialization'] = $specialization;
			$_SESSION['location'] = $location;
			$_SESSION['tel'] = $tel;
			$_SESSION['public_mail'] = $public_mail;
			$_SESSION['skype'] = $skype;
			$_SESSION['website'] = $website;
      $_SESSION['about'] = $about;
      
      $response = [
        'status' => '1'
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