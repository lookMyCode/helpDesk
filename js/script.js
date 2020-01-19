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

	// Link to registration
	$('body').on('click', '.reg-btn', () => {
		location.href = '/registration.html';
	});

	// Link to task list
	$('body').on('click', '.tasks-btn', () => {
		location.href = '/task_list.html';
	});

	// Logout
	$('header').on('click', '#logout-btn', () => {
		$.ajax({
			type: "POST",
			url: '/php/logout.php',
			success: (answer) => {
				const data = JSON.parse(answer);
				if(data['status'] == 1) {
					auth = false;
					location.reload();
				}
			}
		});
	});

	// Go to profile
	$('header').on('click', '#profile-btn', () => {
		location.href = '/profile.html';
	});

	// Visability button "Go to top"
$('#go_top').fadeOut(400);

$(window).scroll(() => {
  if( $(window).scrollTop() > 100 ) {
    $('#go_top').fadeIn(400);
  } else {
    $('#go_top').fadeOut(400);
  }
});

// Animate link to top
$('a').click(function() {
  var elementClick = $(this).attr('href')
  if(elementClick != '#') {
    var destination = $(elementClick).offset().top;
    jQuery('html:not(:animated),body:not(:animated)').animate({
      scrollTop: destination
    }, 500);
    return false;
  }
});

})();