;(function() {
	// Load components
    $('.nav-top').load('/components/nav-top.txt', () => {
		$('.menu').load('/components/menu.txt');
		$('.menu-min>ul').load('/components/menu.txt');

		( () => {
			return new Promise( (res, rej) => {
				if(window.auth || isAutorized()) {
					res();
				} else {
					$.ajax({
						type: "POST",
						url: '/php/is_autorized.php',
						success: (answer) => {
							const data = JSON.parse(answer);
							if(data['status'] == 1) {
								res();
							} else {
								rej();
							}
						}
					});
				}
			} );
		} )().then( () => {
			$('.account').load('/components/account_autorized.txt');
			$('.account-min').load('/components/account_autorized.txt');
		}, () => {
			$('.account').load('/components/account_not_autorized.txt');
			$('.account-min').load('/components/account_not_autorized_min.txt');
		} );
		
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

	if( !$.cookie('visited_today') ) {
		$.ajax({
			type: "POST",
			url: '/php/visited_today.php',
			success: (answer) => {
				let data = JSON.parse(answer);

				if(data.status == 1) {
					$.cookie('visited_today', 'true', {
						expires: 0.25,
						path: '/'
					});
				}

				$('entrances').html(data.data.count);
			}
		});
	}

})();