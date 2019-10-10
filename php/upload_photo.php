<?php

if ( 0 < $_FILES['file']['error'] ) {
  $result = [
    'status' => '0'
  ];
}
else {
  $arr = explode('.', $_FILES['file']['name']);
  $file_type = $arr[count($arr) - 1];

  session_start();
  $file_name = $_SESSION['id_user'];

  if($file_type == 'png') {
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
  }
  
}

if($result['status'] == 1) {
  require_once 'db_connect.php';
  $id = $_SESSION['id_user'];
  $query_result = mysqli_query($connect, "UPDATE `users` SET `photo`= '/user_photo/$file_name' WHERE `id_user` = '$id'");

  if(!$query_result) {
    $result['status'] = '0';
  } else {
    $_SESSION['photo'] = "/user_photo/$file_name";
  }

  require_once 'db_close_connect.php';
}

echo json_encode($result);

?>