;( () => {

  /*( () => {
    return new Promise( (res, rej) => {
      res( isAutorized() );
    } );
  } )().then( (data) => {
    
  } );*/

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
    return false;
  }, () => {
    location.href = '/';
  } );

  $('#submit_task').on('click', (e) => {

    e.preventDefault();

    $('.mini_preloader_wrap').css('opacity', '1');

    if(!$('#task_title').val() || !$('#task_text').val()) {
      !$('#task_title').val() ? $('#task_title').css('borderColor', 'red') : $('#task_title').css('borderColor', '#ECECEC'); 
      !$('#task_text').val() ? $('#task_text').css('borderColor', 'red') : $('#task_text').css('borderColor', '#ECECEC');
      $('.mini_preloader_wrap').css('opacity', '0');
      return false;
    }
    ( () => {
      return new Promise( (res, rej) => {
        let data = new FormData($('#task_form')[0]);
        res(data);
      } );
    } )().then( (data) => {
      $.ajax({
        type: 'POST',
        enctype: 'multipart/form-data',
        url: '/php/new_task.php',
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (answer) {
          let data = JSON.parse(answer);
          $('.mini_preloader_wrap').css('opacity', '0');

          console.log(data);

          if(data.status == '1') {
            location.href = `/task.html?id=${data.data.id}`;
          } else if(data.status == '2') {
            $('.warning').html('Błędny obrazek');
            $('.success').html('');
          } else {
            $('.warning').html('Błąd serwera');
            $('.success').html('');
          }
        },
        error: function (e) {
          $('.warning').html('Błąd serwera');
          $('.success').html('');
        }
      });
    } );

  });

} )();