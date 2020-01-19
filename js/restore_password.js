;( () => {

  $('#resstore_pass_btn').on('click', (e) => {
    e.preventDefault();

    $('.mini_preloader_wrap').css('opacity', '1');

    let $form = $('#restore_password');

    $.ajax({
      'url': $form.attr('action'),
      'data': $form.serialize(),
      'method': $form.attr('method'),
      success: (answer) => {
        $('.mini_preloader_wrap').css('opacity', '0');

        let data = JSON.parse(answer);

        if(data.status == 1) {
          $('.reg-warning').html('');
          $('.reg-success').html('Nowe hasło zostało wysłane na podaty email');
        } else if(data.status == 2) {
          $('.reg-warning').html('Brak podanego konta');
          $('.reg-success').html('');
        } else {
          $('.reg-warning').html('Błąd serwera');
          $('.reg-success').html('');
        }
      },
      error: (err) => {
        $('.mini_preloader_wrap').css('opacity', '0');  

        $('.reg-warning').html('Błąd serwera');
      }
    });
  })

} )();