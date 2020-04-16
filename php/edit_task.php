<?php

  header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
  header("Cache-Control: post-check=0, pre-check=0", false);
  header("Pragma: no-cache");

  $title = htmlentities( trim($_POST['task_title']), ENT_QUOTES, 'UTF-8' );
  $text = htmlentities( trim($_POST['task_text']), ENT_QUOTES, 'UTF-8' );
  $id_task = htmlentities( trim($_POST['id_task']), ENT_QUOTES, 'UTF-8' );

  if($_FILES['user_photo']['name']) { // Isset image?

    if($_FILES['user_photo']['size'] > 5242880) { // Check image size
      $response = [
        'status' => '2'
      ];
    } else { // Image size is good
      if ( 0 < $_FILES['user_photo']['error'] ) { // Check file errors
        $response = [
          'status' => '0'
        ];
      } else { // Image has not error
        $arr = explode('.', $_FILES['user_photo']['name']);
        $file_type = $arr[count($arr) - 1];

        $file_name = $id_task;
        $file_name .= '_';
        $file_name .= generate_string();

        if($file_type == 'png') {
          $file_name .= '.png';
          move_uploaded_file($_FILES['user_photo']['tmp_name'], '../task_img/' . $file_name);
          $response = [
            'status' => '1'
          ];
          $isset_img = true;
        } elseif($file_type == 'jpg') {
          $file_name .= '.jpg';
          move_uploaded_file($_FILES['user_photo']['tmp_name'], '../task_img/' . $file_name);
          $response = [
            'status' => '1'
          ];
          $isset_img = true;
        } else {
          $response = [
            'status' => '2'
          ];
        }
      }
    }
    
  } else { // Have not image
    $response = [
      'status' => '1'
    ];
    $isset_img = false;
  }

  if( $response['status'] == 1 && ( empty($title) || empty($title) ) ) {
    $response = [
      'status' => '0'
    ];
  }


  if($response['status'] == 1) {
    require_once 'db_connect.php';

    if($connect) {
      if($isset_img) {
        $query_result = mysqli_query($connect, "SELECT `images` FROM `tasks` WHERE `id_task` = '$id_task'");

        if($query_result) {
          for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

          $img_name = json_decode($result[0]['images']);

          for($i = 0; $i < count($img_name); $i++) {
            unlink($img_name[$i]);
          }
        }
        
        $query_result = mysqli_query($connect, "UPDATE `tasks` SET `title`='$title',`text`='$text', `images`='\[\"../task_img/$file_name\"\]' WHERE `id_task`='$id_task'");
      } else {
        $query_result = mysqli_query($connect, "UPDATE `tasks` SET `title`='$title',`text`='$text' WHERE `id_task`='$id_task'");
      }

      if(!$query_result) {
        $response = [
          'status' => '0'
        ];
      } else {      
        $response = [
          'status' => '1'
        ];
      }

      if($response['status'] == '1') {
        $query_result = mysqli_query($connect, "SELECT * FROM `tasks` WHERE `id_task` = '$id_task'");
  
        if(!$query_result) {
          $response = [
            'status' => '0'
          ];
        } else {      
          for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

          $response['data'] = [
            'title' => $result[0]['title'],
            'text' => $result[0]['text'],
            'images' => $result[0]['images']
          ];
        }
      }

      require_once 'db_close_connect.php';
    } else {
      $response = [
        'status' => '0'
      ];
    }
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