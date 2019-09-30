;(function() {

	// Load components
    $('.nav-top').load('/components/nav-top.txt', () => {
		$('.menu').load('/components/menu.txt');
		$('.menu-min>ul').load('/components/menu.txt');

		if(auth) {
			$('.account').load('/components/account_autorized.txt');
			$('.account-min').load('/components/account_autorized.txt');
		} else {
			$('.account').load('/components/account_not_autorized.txt');
			$('.account-min').load('/components/account_not_autorized_min.txt');
		}
	});
	$('#login-form-wrap').load('/components/login-form.txt');
    $('footer').load('/components/footer.txt', () => {
		$('.nav-bottom>ul').load('/components/menu.txt');
	});

	if( !$.cookie('cookies-accept') ) {
		$('.cookie-wrap').load('/components/cookie.txt', () => {
			$('.cookie-wrap').fadeIn();
			$('.cookie-wrap').on('click', '#cookie-accept-btn', () => {
				$.cookie('cookies-accept', 'true', {
					expires: 365,
					path: '/'
				});
				$('.cookie-wrap').fadeOut();
			});
		});
	}

})();