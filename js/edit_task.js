;( () => {

  ( () => {
    return new Promise( (res, rej) => {
      let id = getId();
      res(id);
    } );
  } )().then( (data) => {
    if(!!data) {
      $.ajax({
        type: "GET",
        url: '/php/get_task_data.php',
        data: {
          'id': data
        },
        success: (answer) => {
          let data = JSON.parse(answer);
          
          if(data.status == '1') {
            loadPage(data.data);
          } else {
            location.href = '/';
          }
        }
      });
    } else {
      location.href = '/';
    }
  } );

  $('#submit_task').on('click', (e) => {

    e.preventDefault();

    $('.edit_task_data .mini_preloader_wrap').css('opacity', '1');

    if(!$('#task_title').val() || !$('#task_text').val()) {
      !$('#task_title').val() ? $('#task_title').css('borderColor', 'red') : $('#task_title').css('borderColor', '#ECECEC'); 
      !$('#task_text').val() ? $('#task_text').css('borderColor', 'red') : $('#task_text').css('borderColor', '#ECECEC');
      $('.edit_task_data .mini_preloader_wrap').css('opacity', '0');
      return false;
    }

    ( () => {
      return new Promise( (res, rej) => {
        let data = new FormData($('#task_form')[0]);
        data.append("id_task", getId());
        res(data);
      } );
    } )().then( (data) => {
      $.ajax({
        type: 'POST',
        enctype: 'multipart/form-data',
        url: '/php/edit_task.php',
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (answer) {
          let data = JSON.parse(answer);

          $('.edit_task_data .mini_preloader_wrap').css('opacity', '0');

          if(data.status == '1') {
            $('.warning').html('');
            $('.success').html('Zadanie zostało zmienione');

            $('#task_title').css('borderColor', '#ECECEC');
            $('#task_text').css('borderColor', '#ECECEC');

            setTimeout(() => {
              loadPage(data.data);
            }, 1000);
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

  $('#remove_task_btn').on('click', () => {
    $('.remove_task .mini_preloader_wrap').css('opacity', '1');

    let accept_remove = confirm('Usunięcie zadania jest bezpowrotne. Czy napewno chcech usunąć zadanie?');
    if(accept_remove) {
      ( () => {
        return new Promise( (res, rej) => {
          res( getParams() );
        } );
      } )().then( (data) => {
        $.ajax({
          type: 'POST',
          url: '/php/remove_task.php', 
          data: data,
          success: function (answer) {
            $('.remove_task .mini_preloader_wrap').css('opacity', '0');
            
            let data = JSON.parse(answer);

            if(data.status == 1) {
              location.href = '/profile.html';
            } else {
              $('.remove_warning').html('Błąd serwera');
            }
          },
          error: function (err) {
            console.log(err);
          }
        });
      } );
    }
  });

  $('.edit_task_data').on('click', '#remove_img', (e) => {
    let imgPath = $('.img_wrap img').attr('src');
    
    $.ajax({
      type: "POST",
      url: '/php/remove_img.php',
      data: {
        'path': imgPath,
        'id_task': getId()
      },
      success: (answer) => {
        let data = JSON.parse(answer);

        if(data.status == '1')  {
          e.target.closest('div.img_wrap').remove();

          $('.warning').html('');
          $('.success').html('Obrazek został usunięty');
        } else {
          $('.warning').html('Błąd serwera');
          $('.success').html('');
        }
      }
    });
  });

  function getId() {
    // Check URL
    let param = location.search;
    param = param.slice(1);
    let args = param.split('&');
    let argState = {};
    
    args.map((item) => {
      let arr = item.split('=');
      argState[arr[0]]  = arr[1];
    });

    return argState['id'];
  }

  function loadPage(data) {
    $('#task_title').val(data.title);
    $('#task_text').html(data.text);

    data.images = JSON.parse(data.images);

    let images = document.querySelector('.images');
    $(images).html('');
    data.images.map( (item) => {
      let imgWrap = document.createElement('div');
      $(imgWrap).addClass('img_wrap');

      let img = document.createElement('img');
      $(img).attr({
        'src': item,
        'alt': ''
      });
      imgWrap.appendChild(img);

      let removeImg = document.createElement('div');
      $(removeImg).addClass('remove_img').html('<i class="fas fa-times"></i>').attr({
        'id': 'remove_img'
      });
      imgWrap.appendChild(removeImg);

      images.appendChild(imgWrap);
    } );
    
  };

} )();