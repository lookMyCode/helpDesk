;(function() {

	// Off preloader
	$(window).on('load', () => {
		$('#preloader-wrap').fadeOut(700);	
	});
	
	// Open min menu
	$('header').on('click', '#min-menu-btn', () => {
		$('.menu-min').fadeToggle(700);
	});

	// Open login modal window
	$('header').on('click', '.login-btn', () => {
		$('#login-form-wrap').fadeIn(700).css('display', 'flex');
	});

	// Close login modal window
	$('body').on('click', '#login-close-btn', () => {
		$('#login-form-wrap').fadeOut(700);
	});

	// Logout
	$('header').on('click', '#logout-btn', () => {
		$.ajax({
			type: "POST",
			url: '/php/logout.php',
			success: (answer) => {
				const data = JSON.parse(answer);
				if(data['status'] == 1) {
					location.reload();
				}
			}
		});
	});

})();