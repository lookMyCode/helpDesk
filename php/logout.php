<?php
	try {
		session_start();
		session_regenerate_id();
		session_destroy();
		
		$response = [
			'status' => '1'
		];
	} catch(Exception $err) {
		$response = [
			'status' => '0'
		];
	} finally {
		echo json_encode($response);
	}

?>