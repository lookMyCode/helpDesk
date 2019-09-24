;(function() {

	// Load components
    $('.nav-top').load('/components/nav-top.txt', () => {
			$('.menu').load('/components/menu.txt');
			$('.menu-min>ul').load('/components/menu.txt');

			$.ajax({
				type: "POST",
				url: '/php/is_autorized.php',
				success: (answer) => {
					const data = JSON.parse(answer);
					if(data['status'] == 1) {
						$('.account').load('/components/account_autorized.txt');
						$('.account-min').load('/components/account_autorized.txt');
					} else {
						$('.account').load('/components/account_not_autorized.txt');
						$('.account-min').load('/components/account_not_autorized_min.txt');
					}
				}
			});
		});
		$('#login-form-wrap').load('/components/login-form.txt');
    $('footer').load('/components/footer.txt', () => {
			$('.nav-bottom>ul').load('/components/menu.txt');
		});

})();