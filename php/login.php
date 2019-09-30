<?php

$login = htmlentities( trim($_POST['login']), ENT_QUOTES, 'UTF-8' );
$pass = htmlentities( trim($_POST['pass']), ENT_QUOTES, 'UTF-8' );

require_once 'db_connect.php';

if($connect) {

	if( !empty($login) ) {
		
		$query_result = mysqli_query($connect, "SELECT * FROM `users` WHERE `mail` = '$login'");
	
		for($result = []; $row = mysqli_fetch_assoc($query_result); $result[] = $row);

		if( count($result) == 1 && password_verify($pass, $result[0]['password']) ) {
			
			session_start();
			session_regenerate_id();

			$_SESSION['auth'] = 1;
			$_SESSION['id_user'] = $result[0]['id_user'];
			$_SESSION['mail'] = $result[0]['mail'];
			$_SESSION['name'] = $result[0]['name'];
			$_SESSION['specialization'] = $result[0]['specialization'];
			$_SESSION['location'] = $result[0]['location'];
			$_SESSION['date_registration'] = $result[0]['date_registration'];
			$_SESSION['tel'] = $result[0]['tel'];
			$_SESSION['public_mail'] = $result[0]['public_mail'];
			$_SESSION['skype'] = $result[0]['skype'];
			$_SESSION['website'] = $result[0]['website'];
			$_SESSION['about'] = $result[0]['about'];
			$_SESSION['average_rating'] = $result[0]['average_rating'];
			$_SESSION['number_ratings'] = $result[0]['number_ratings'];

			$response = [
				'status' => '1'
			];
			
		} elseif( count($result) > 1 ) { // Server error, we have more than 1 user with this mail
			$response = [
				'status' => '0'
			];
		} else { // Isset this mail in our database
			$response = [
				'status' => '2'
			];
		}
		
	} else { // Have not mail
		$response = [
			'status' => '2'
		];
	}

	require_once 'db_close_connect.php';
	
} else { // Connect error
	$response = [
		'status' => '0'
	];
}

echo json_encode($response);

?>