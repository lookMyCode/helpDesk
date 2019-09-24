;(function() {

	$('#login-form-wrap').on('click', '#login_btn', () => {
		const login = $('#login_email').val();
		const pass = $('#login_pass').val();

		$.ajax({
			type: "POST",
			url: '/php/login.php',
			data: {
				'login': login,
				'pass': pass
			},
			success: (answer) => {
				const data = JSON.parse(answer);
				if(data['status'] == 2) {
					$('#login_answer').html('Nieprawidłowy login lub hasło');
				} else if(data['status'] == 1) {
					location.reload();
				} else {
					$('#login_answer').html('Błąd serwera');
				}
			}
		});
	});

})();