<?php
	header('Content-Type: text/html; charset=utf-8');

	require 'recaptchalib.php';

	$mail = htmlentities( trim($_POST['mail']), ENT_QUOTES, 'UTF-8' );
	$name = htmlentities( trim($_POST['name']), ENT_QUOTES, 'UTF-8' );
	$pass1 = htmlentities( trim($_POST['pass1']), ENT_QUOTES, 'UTF-8' );
	$pass2 = htmlentities( trim($_POST['pass2']), ENT_QUOTES, 'UTF-8' );
	$g_recaptcha_response = htmlentities( trim($_POST['g-recaptcha-response']), ENT_QUOTES, 'UTF-8' );

	$re = new ReCaptcha('6LcQJcQUAAAAAHrxqW8VgIJMCdMboSjVAvqmcxhs');
	$reResult = $re->verifyResponse($_SERVER['REMOTE_ADDR'], $g_recaptcha_response);

	if($reResult->success) {

		if( preg_match('/^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i', $mail) && mb_strlen($pass1) >=6 && mb_strlen($pass1) <= 30 && $pass1 === $pass2 ) {
			require_once 'db_connect.php';
			if($connect) {
				$query_result = mysqli_query($connect, "SELECT COUNT(`id_user`) AS 'count' FROM `users` WHERE `mail` = '$mail'");
		
				for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

				if($result[0]['count'] == '0') {
					
					session_start();
					session_regenerate_id();

					$pass = password_hash($pass1, PASSWORD_BCRYPT);

					$now = time();

					$query_result = mysqli_query($connect, "INSERT INTO `users`(`mail`, `password`, `name`, `date_registration`, `appreciated`) VALUES ('$mail', '$pass', '$name', '$now', '[]')");

					if($query_result) {
						$query_result = mysqli_query($connect, "SELECT `id_user` FROM `users` WHERE `mail` = '" . mysqli_real_escape_string($connect, $mail) . "'");
						
						if($query_result) {
							for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

							$_SESSION['auth'] = 1;
							$_SESSION['id_user'] = $result[0]['id_user'];
							$_SESSION['mail'] = $mail;
							$_SESSION['name'] = $name;

							$mail_text = 'Witam!' . "\r\n" . 
							"\r\n" . 
							'Dziękuję za rejestrację na serwisie Help-Place.pl'  . "\r\n" . 
							'Mam nadzieję że mój serwis będzie Ci pożyteczny!'  . "\r\n" . 
							"\r\n" . 
							'Jesli nie tworzyłesz konta - proszę o odpowiedź!'  . "\r\n" . 
							'Do zobaczenia na Help-Place.pl';
							
							$headers = 'From: admin@help-place.pl' . "\r\n" .
							'Reply-To: admin@help-place.pl' . "\r\n" .
							'X-Mailer: PHP/' . phpversion();
							mail($mail, 'Dziękuję za rejestrację na serwisie Help-Place.pl!', $mail_text, $headers);

							$response = [
								'status'=> '1'
							];
						} else {
							$response = [
								'status'=> '0'
							];
						}
						
					} else { // Query error
						$response = [
							'status'=> '0'
						];
					}
				} elseif($result[0]['count'] > 1) { // Server error, database has more then 1 user with this mail
					$response = [
						'status'=> '0'
					];
				} else { // Isset this user
					$response = [
						'status'=> '3'
					];
				}
			} else { // Connect error
				$response = [
					'status'=> '0'
				];
			}
		} else { // Data is not valid
			$response = [
				'status'=> '2'
			];
		}

	} else {
		$response = [
			'status'=> '4'
		];
	}

	echo json_encode($response);
// 0 - server error, 1 - OK, 2 - not valid, 3 - is user, 4 - bot
?> 