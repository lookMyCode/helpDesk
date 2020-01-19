<?php

  $mail = htmlentities( trim($_POST['mail']), ENT_QUOTES, 'UTF-8' );

  require_once 'db_connect.php';

  if(!$connect) {
    $response = [
      'status' => 0
    ];
  } else {
    $query_result = mysqli_query($connect, "SELECT `id_user` FROM `users` WHERE `mail` = '$mail'");

    for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

      if(count($result) == '0') {
        $response = [
          'status' => 2
        ];
      } elseif(count($result) == '1') {
        
        $pass = generate_string();

        $pass_hash = password_hash($pass, PASSWORD_BCRYPT);

        $query_result = mysqli_query($connect, "UPDATE `users` SET `password`='$pass_hash' WHERE `mail` = '$mail'");

        if(!$query_result) {
          $response = [
            'status' => 0
          ];
        } else {
          $mail_text = 'Witam!' . "\r\n" . 
          "\r\n" . 
          'Twoje nowe hasło: ' . $pass . "\r\n" . 
          'Polecam przy załogowaniu odrazu zmienić go.'  . "\r\n" . 
          'Dla tego wejdź: Profil - Edycja profilu'  . "\r\n" . 
          "\r\n" . 
          'Jesli są niezgodności - proszę o odpowiedź!'  . "\r\n" . 
          'Do zobaczenia na Help-Place.pl';
          
          $headers = 'From: admin@help-place.pl' . "\r\n" .
          'Reply-To: admin@help-place.pl' . "\r\n" .
          'X-Mailer: PHP/' . phpversion();
          mail($mail, 'Twoje nowe hasło na Help-Place.pl!', $mail_text, $headers);

          $response = [
            'status'=> '1'
          ];
        }

      } else {
        $response = [
          'status' => 3
        ];
      }

      echo json_encode($response);
  }

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