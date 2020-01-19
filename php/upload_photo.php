<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if ( 0 < $_FILES['file']['error'] ) {
  $response = [
    'status' => '0'
  ];
}
else {
  $arr = explode('.', $_FILES['file']['name']);
  $file_type = $arr[count($arr) - 1];

  session_start();
  $file_name = $_SESSION['id_user'];
  $file_name .= '_';
  $file_name .= generate_string();

  if($file_type == 'png' || $file_type == 'jpg') {
    $file_name .= '.';
    $file_name .= $file_type;
    move_uploaded_file($_FILES['file']['tmp_name'], '../user_photo/' . $file_name);
    $response = [
      'status' => '1'
    ];
  } else {
    $response = [
      'status' => '2'
    ];
  }

  /*if($file_type == 'png') {
    $file_name .= '.png';
    move_uploaded_file($_FILES['file']['tmp_name'], '../user_photo/' . $file_name);
    $result = [
      'status' => '1'
    ];
  } elseif($file_type == 'jpg') {
    $file_name .= '.jpg';
    move_uploaded_file($_FILES['file']['tmp_name'], '../user_photo/' . $file_name);
    $result = [
      'status' => '1'
    ];
  } else {
    $result = [
      'status' => '2'
    ];
  }*/
  
}

if($response['status'] == 1) {
  require_once 'db_connect.php';

  $id = $_SESSION['id_user'];
  $query_result = mysqli_query($connect, "SELECT `photo` FROM `users` WHERE `id_user` = '$id'");
  if($query_result) {
    for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
    $old_img_name = $result[0]['photo'];
    if( strlen($old_img_name) != 0 ) {
      unlink('..' . $old_img_name);
    }
  }

  $query_result = mysqli_query($connect, "UPDATE `users` SET `photo`= '/user_photo/$file_name' WHERE `id_user` = '$id'");

  if(!$query_result) {
    $response['status'] = '0';
  } else {
    $_SESSION['photo'] = "/user_photo/$file_name";
  }

  require_once 'db_close_connect.php';
}

echo json_encode($response);

function generate_string($input = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', $strength = 16) {
  $input_length = strlen($input);
  $random_string = '';
  for($i = 0; $i < $strength; $i++) {
      $random_character = $input[mt_rand(0, $input_length - 1)];
      $random_string .= $random_character;
  }

  return $random_string;
}

?>