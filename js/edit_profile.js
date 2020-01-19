;( () => {

  ( () => {
    return new Promise( (res, rej) => {
      $.ajax({
        type: "POST",
        url: '/php/get_user_data_for_edit.php',
        success: (answer) => {
          let data = JSON.parse(answer);
      
          if(data['status'] == 1) {
            res(data);
          } else {
            location.href = '/';
          }
        }
      });
    } );
  } )().then( (data) => {
    $('#specialization').val(data.data.specialization);
    $('#location').val(data.data.location);

    $('#tel').val(data.data.tel);
    $('#mail').val(data.data.public_mail);
    $('#skype').val(data.data.skype);
    $('#website').val(data.data.website);

    $('#about').val(data.data.about);

  } );

  $('#submit_photo').on('click', () => {
    $('.edit_photo .mini_preloader_wrap').css('opacity', '1');
    let file_data = $('#user_photo').prop('files')[0];   
    let form_data = new FormData();                  
    form_data.append('file', file_data);
    $.ajax({
      url: '/php/upload_photo.php', 
      dataType: 'text',  
      cache: false,
      contentType: false,
      processData: false,
      data: form_data,                         
      type: 'POST',
      success: (answer) => {
        let data = JSON.parse(answer);

        if(data.status == 1) {
          $('.edit_photo .success').html('Foto zostało zmienione');
          $('.edit_photo .warning').html('');
        } else {
          $('.edit_photo .success').html('');
          $('.edit_photo .warning').html('Błąd: Foto nie zostało wysłane');
        }
        $('.edit_photo .mini_preloader_wrap').css('opacity', '0');
      }
   });
  });

  $('#change_personal_data').on('click', () => {
    $('.edit_personal_data .mini_preloader_wrap').eq(0).css('opacity', '1');
    let personalData = {
      'specialization': $('#specialization').val(),
      'location': $('#location').val(),
      'tel': $('#tel').val(),
      'public_mail': $('#mail').val(),
      'skype': $('#skype').val(),
      'website': $('#website').val(),
      'about': $('#about').val()
    };

    $.ajax({
      url: '/php/change_personal_data.php',
      data: personalData,                         
      type: 'POST',
      success: (answer) => {
        let data = JSON.parse(answer);

        if(data.status == 1) {
          $('.edit_personal_data .success').html('Twoje dane zostali zmienione');
          $('.edit_personal_data .warning').html('');
        } else {
          $('.edit_personal_data .success').html('');
          $('.edit_personal_data .warning').html('Błąd serwera');
        }

        $('.edit_personal_data .mini_preloader_wrap').eq(0).css('opacity', '0');
      }
   });
  });

  $('#change_pass').on('click', () => {
    $('.edit_personal_data .mini_preloader_wrap').eq(1).css('opacity', '1');

    let
      pass1 = $('#pass1'),
      pass2 = $('#pass2'),
      pass3 = $('#pass3');

    let 
      pass2Val = validatePass( pass2.val() ),
      pass3Val = validatePass( pass3.val() );

      checkInput(pass2, pass2Val);
      checkInput(pass3, pass3Val);

      if(pass3Val !== pass2Val) {
        pass3.css('borderColor', 'red');
        pass2.css('borderColor', 'red');
      }

      if( pass1.val() && pass2Val && pass3Val ) {
        let data = {
          'pass1': pass1.val(),
          'pass2': pass2Val,
          'pass3': pass3Val
        };

        $.ajax({
          type: "POST",
          url: "/php/change_pass.php",
          data: data,
          success: (answer) => {
            let data = JSON.parse(answer);

            if(data.status == '1') {
              $('.pass_success').html('Hasło zostało zmienione');
              $('.pass_warning').html('');
            } else if(data.status == '2') {
              $('.pass_success').html('');
              $('.pass_warning').html('Wpisz poprawne dane');
            } else {
              $('.pass_success').html('');
              $('.pass_warning').html('Błąd serwera');
            }

            $('.edit_personal_data .mini_preloader_wrap').eq(1).css('opacity', '0');
          },
          error: (error) => {
            $('.pass_success').html('');
            $('.pass_warning').html('Błąd serwera');

            $('.edit_personal_data .mini_preloader_wrap').eq(1).css('opacity', '0');
          }
        });
      } else {
        $('.pass_warning').html('Wpisz poprawne dane!');

        $('.edit_personal_data .mini_preloader_wrap').eq(1).css('opacity', '0');
      }
  });

  $('#remove_profile_btn').on('click', () => {
    if( !confirm('Usunięcie jest bezpowrotne, one usunie wszystkie twoje dane. Czy napewno chcesz usunąć profil?') ) {
      return false;
    };
    $('.remove_profile .mini_preloader_wrap').css('opacity', '1');

    if( $(pass_remove).val().length != 0 ) {
      $.ajax({
        type: 'POST',
        url: "/php/remove_profile.php",
        data: {
          'pass': $(pass_remove).val()
        },
        success: (answer) => {
          $('.remove_profile .mini_preloader_wrap').css('opacity', '0');
          let data = JSON.parse(answer);

          if( data.status == 1 ) {
            location.href = '/';
          } else if(data.status == 2) {
          $('.remove_warning').html('Wpisz poprawne hasło');
          } else {
            $('.remove_warning').html('Błąd serwera');
          }
        },
        error: (error) => {
          $('.remove_profile .mini_preloader_wrap').css('opacity', '0');
          $('.remove_warning').html('Błąd serwera');
        }
      });
    } else {
      $('.remove_success').html('');
      $('.remove_warning').html('Wpisz hasło');
      $('.remove_profile .mini_preloader_wrap').css('opacity', '0');
    }
  })

} )();