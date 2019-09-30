<?php
	header('Content-Type: text/html; charset=utf-8');

	$mail = htmlentities( trim($_POST['mail']), ENT_QUOTES, 'UTF-8' );
	$name = htmlentities( trim($_POST['name']), ENT_QUOTES, 'UTF-8' );
	$pass1 = htmlentities( trim($_POST['pass1']), ENT_QUOTES, 'UTF-8' );
	$pass2 = htmlentities( trim($_POST['pass2']), ENT_QUOTES, 'UTF-8' );

	if( preg_match('/^[a-z0-9_-]{2,16}@[0-9a-z_-]+\.[a-z]{2,5}$/i', $mail) && mb_strlen($pass1) >=6 && mb_strlen($pass1) <= 30 && $pass1 === $pass2 ) {
		require_once 'db_connect.php';
		if($connect) {
			$query_result = mysqli_query($connect, "SELECT COUNT(`id_user`) AS 'count' FROM `users` WHERE `mail` = '$mail'");
	
			for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

			if($result[0]['count'] == '0') {
				
				session_start();
				session_regenerate_id();

				$pass = password_hash($pass1, PASSWORD_BCRYPT);

				$query_result = mysqli_query($connect, "INSERT INTO `users`(`mail`, `password`, `name`) VALUES ('" . mysqli_real_escape_string($connect, $mail) . "', '" . mysqli_real_escape_string($connect, $pass) . "' ,'" . mysqli_real_escape_string($connect, $name) . "')");

				if($query_result) {
					$query_result = mysqli_query($connect, "SELECT `id_user` FROM `users` WHERE `mail` = '" . mysqli_real_escape_string($connect, $mail) . "'");
					
					if($query_result) {
						for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

						$_SESSION['auth'] = 1;
						$_SESSION['id_user'] = $result[0]['id_user'];
						$_SESSION['mail'] = $mail;
						$_SESSION['name'] = $name;

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

	echo json_encode($response);
// 0 - server error, 1 - OK, 2 - not valid, 3 - is user
?> 