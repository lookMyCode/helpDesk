;(function() {

	$('#login-form-wrap').on('click', '#login_btn', sendLogin);

	$('#login-form-wrap').on('keydown', '#login-form .form-row', (e) => {
		if(e.keyCode == 13) {
			sendLogin();
		}
	});

	

})();