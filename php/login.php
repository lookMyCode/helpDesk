<?php

	require_once 'db_connect.php';

	$login = htmlentities( trim($_POST['login']), ENT_QUOTES, 'UTF-8' );
	$pass = htmlentities( trim($_POST['pass']), ENT_QUOTES, 'UTF-8' );	

	if($connect) {
		if( !empty($login) ) {
			$query_result = mysqli_query($connect, "SELECT `id_user` FROM `users` WHERE `mail`='" . mysqli_real_escape_string($connect, $login) . "' AND `password`='" . mysqli_real_escape_string($connect, $pass) . "'");
	
			for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);
	
			if( count($result) == 1 ) {
				session_start();
				session_regenerate_id();
				$sesion_id = session_id();
				$user_id = $result[0]['id_user'];
				
				$query_result = mysqli_query($connect, "UPDATE `users` SET `session_id`='$sesion_id' WHERE `id_user`='$user_id'");

				$response = [
					'status' => '1'
				];
			}  elseif( count($result) > 1 ) {
				$response = [
					'status' => '0'
				];
			} else {
				$response = [
					'status' => '2'
				];
			}
		} else {
			$response = [
				'status' => '2'
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