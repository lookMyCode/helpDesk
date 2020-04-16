;(function() {

  const id = getId();

  $('.task_wrap').on('click', '.link_to_autor', ({target}) => {
    const elem = target.closest('img') || target.closest('h2');
    const {autor} = elem.dataset;
    
    location.href = `/profile.html?id=${autor}`;
  });

  $('.task_wrap').on('click', '.link_to_offerer', ({target}) => {
    const {id} = target.closest('article').dataset;
    
    location.href = `/profile.html?id=${id}`;
  });

  $.ajax({
    type: "GET",
    url: '/php/get_task.php',
    data: {
      'id': id
    },
    success: (answer) => {
      //console.log(answer);
      let data = JSON.parse(answer);
      console.log(data);
      
      if(data.status == '1') {
        renderTask(data.data, data.owner);
      } else {
        location.href = '/';
      }
      
    }
  });

  $('.task_wrap').on('click', '#edit_task_btn', () => {
    location.href = `/edit_task.html?id=${id}`;
  });

  $('.task_wrap').on('click', '#change_date_completion', () => {
    $.ajax({
      type: "POST",
      url: '/php/change_date_completion.php',
      data: {
        'id': id
      },
      success: (answer) => {
        let data = JSON.parse(answer);
        
        if(data.status == '1') {
          $('.short_time').html('Zadanie zostało przedłużone na 14 dni').css({
            'color': 'green'
          });
          $('#change_date_completion').hide();
          setTimeout(() => {
            $('.short_time').hide();
          }, 60000);
        } else {
          $('.short_time').html('Błąd serwera').css({
            'color': 'red'
          });
        }
      }
    });
  });

  $('.task_wrap').on('click', '#change_performer', () => {
    const result = confirm('Czy napewno chcesz usunąć wykonawce?');

    if(result) {

      $.ajax({
        type: "POST",
        url: '/php/delete_performer.php',
        data: {
          'id': id
        },
        success: (answer) => {
          let data = JSON.parse(answer);
          
          if(data.status == 1) {
            location.reload();
          } else {
            alert('Błąd serwera');
          }
        }
      });

    }
  });

  $('.task_wrap').on('click', '#end_task', () => {
    const result = confirm('Czy napewno chcesz skończyć zadanie? Już nie będzie możliwości odwołać to!');

    if(result) {

      $.ajax({
        type: "POST",
        url: '/php/end_task.php',
        data: {
          'id': id
        },
        success: (answer) => {
          let data = JSON.parse(answer);
          
          if(data.status == 1) {
            location.reload();
          } else {
            alert('Błąd serwera');
          }
        }
      });

    }
  });

  $('.task_wrap').on('click', '#activate_task', () => {
    const result = confirm('Zadanie będzie aktywne! Kontynujesz?');

    if(result) {

      $.ajax({
        type: "POST",
        url: '/php/delete_performer.php',
        data: {
          'id': id
        },
        success: (answer) => {
          let data = JSON.parse(answer);
          
          if(data.status == 1) {
            location.reload();
          } else {
            alert('Błąd serwera');
          }
        }
      });

    }    
  });

  $('.task_wrap').on('click', '#offer-send', () => { 

    let textOffer = $('#textarea_offer').val().trim();
    if( textOffer != '' ) {
      $('#textarea_offer').css('borderColor', '#41F01D');

      ( () => {
        return new Promise( (res, rej) => {
          res(getParams().id);
        } );
      } )().then( (id) => {
        $.ajax({
          type: "POST",
          url: '/php/send_offer.php',
          data: {
            'id': id,
            'text': textOffer
          },
          success: (answer) => {
            console.log(answer);
            let data = JSON.parse(answer);

            if(data.status == 1) {
              $('#textarea_offer').val('');

              addOffer(data.data);
            } else {
              $('#textarea_offer').css('borderColor', 'red');
            }
          }
        });
      } );

    } else {
      $('#textarea_offer').css('borderColor', 'red');
    }
  });

  $('.task_wrap').on('click', '.allow_realize_btn', ({target}) => {
    const idUser = target.closest('.offer').dataset.id;
    const result = confirm('Czy napewno chcech wybrać tego wykonawcę?');

    if(result) {

      ( () => {
        return new Promise( (res, rej) => {
          res( getParams().id );
        } );
      } )().then( (idTask) => {
        $.ajax({
          type: "POST",
          url: '/php/entrust.php',
          data: {
            'id_task': idTask,
            'id_user': idUser
          },
          success: (answer) => {
            let data = JSON.parse(answer);
    
            if(data.status == 1) {
              location.reload();
            }
          }
        });
      } );

    }
  });

  $('.task_wrap').on('click', '#show_more_offers', (e) => {
    let btn = e.target.closest('#show_more_offers');
    $(btn).html(preloader);
    $('.task_wrap .mini_preloader_wrap').css('opacity', '1');

    ( () => {
      return new Promise( (res, rej) => {
        res( getParams().id );
      } );
    } )().then( (id) => {
      $.ajax({
        type: "POST",
        url: '/php/get_offers.php',
        data: {
          'id': id
        },
        success: (answer) => {
          let data = JSON.parse(answer);
          console.log(data);

          if(data.status == 1) {
            renderOffers(data.data);
          }
        }
      });
    } );
  });

  function renderTask(data, owner) {
    let taskWrap = document.querySelector('.task_wrap');
    $(taskWrap).html('');

    // Task autor
    let taskAutor = document.createElement('section');
    $(taskAutor).addClass('task_autor');

    let taskAutorPhoto = document.createElement('img');
    $(taskAutorPhoto).attr({
      'src': data.autor_photo,
      'alt': `${data.autor_name} zjęcie`,
      'title': `${data.autor_name} zjęcie`,
      'data-autor': data.autor_id
    }).addClass('link_to_autor');
    taskAutor.appendChild(taskAutorPhoto);

    if(data.autor_number_ratings != '0') {
      let taskAutorSpan = document.createElement('span');
      $(taskAutorSpan).html(`<i class="far fa-star"></i>${data.autor_average_rating} (${data.autor_number_ratings})`);
      taskAutor.appendChild(taskAutorSpan);
    }

    let taskAutorName = document.createElement('h2');
    $(taskAutorName).html(data.autor_name).addClass('link_to_autor').attr('data-autor', data.autor_id);
    taskAutor.appendChild(taskAutorName);

    let taskAutorLoc = document.createElement('p');
    $(taskAutorLoc).html(data.autor_location);
    taskAutor.appendChild(taskAutorLoc);

    let taskAutorSpec = document.createElement('p');
    $(taskAutorSpec).html(data.autor_specialization);
    taskAutor.appendChild(taskAutorSpec);

    if(owner == '1' && data.status == 1) {
      let taskAutorEditBtn = document.createElement('div');
      $(taskAutorEditBtn).addClass('hp-btn').html('<span>Edytuj zadanie</span>').attr({
        'id': 'edit_task_btn'
      });
      taskAutor.appendChild(taskAutorEditBtn);
    }

    taskWrap.appendChild(taskAutor);

    // Task date and status
    let taskDate = document.createElement('div');
    $(taskDate).addClass('task_date').addClass('task_status');

    let taskDatePublication = document.createElement('p');
    $(taskDatePublication).html(`<i class="far fa-arrow-alt-circle-right"></i><span>${data.publication_date.day}.${data.publication_date.month}.${data.publication_date.year}</span>`)
    taskDate.appendChild(taskDatePublication);

    let taskDateStatus = document.createElement('p');
    switch (data.status) {
      case '1':
        $(taskDateStatus).html(`<i class="fas fa-stamp"></i><span class="green">Aktywne</span>`);
        taskDate.appendChild(taskDateStatus);

        if(data.date_completion != undefined && data.date_completion.days < 7) {
          let taskDateCompletion = document.createElement('p');
          $(taskDateCompletion).html(`Wygaśnie za: ${data.date_completion.days} dni ${data.date_completion.hours} godzin ${data.date_completion.minutes} minut`).addClass('short_time');
          taskDate.appendChild(taskDateCompletion);
    
          if(owner == '1') {
            let taskDateBtn = document.createElement('div');
            $(taskDateBtn).addClass('hp-btn').html('<span>Przedłuż</span>').attr({
              'id': 'change_date_completion'
            });
            taskDate.appendChild(taskDateBtn);
          }
        }
        break;
      case '2':
        $(taskDateStatus).html(`<i class="fas fa-stamp"></i><span class="blue">Realizuje się przez <a href="/profile.html?id=${data.performer.id}">${data.performer.name}</a></span>`);
        taskDate.appendChild(taskDateStatus);

        if(owner == 1) {
          let taskDateBtn1 = document.createElement('div');
          $(taskDateBtn1).addClass('hp-btn').html('<span>Usuń wykonawcę</span>').attr({
            'id': 'change_performer'
          });
          taskDate.appendChild(taskDateBtn1);

          let taskDateBtn2 = document.createElement('div');
          $(taskDateBtn2).addClass('hp-btn').css('margin', '15px 0').html('<span>Skończ zadanie</span>').attr({
            'id': 'end_task',
          });
          taskDate.appendChild(taskDateBtn2);
        }

        break;
      case '3':
        $(taskDateStatus).html(`<i class="fas fa-stamp"></i><span class="red">Skończone przez <a href="/profile.html?id=${data.performer.id}">${data.performer.name}</a></span>`);
        taskDate.appendChild(taskDateStatus);
        
        break;
      case '4':
        $(taskDateStatus).html(`<i class="fas fa-stamp"></i><span class="brown">Archiwium</span>`);
        taskDate.appendChild(taskDateStatus);
        
        if(owner == 1) {
          let taskDateBtn = document.createElement('div');
          $(taskDateBtn).addClass('hp-btn').html('<span>Aktywizuj</span>').attr({
            'id': 'activate_task'
          });
          taskDate.appendChild(taskDateBtn);
        }
        break;
    }

    

    taskWrap.appendChild(taskDate);

    // Task title
    let taskTitle = document.createElement('section');
    $(taskTitle).addClass('task_title');

    let taskTitleH1 = document.createElement('h1');
    $(taskTitleH1).html(data.title);
    taskTitle.appendChild(taskTitleH1);

    taskWrap.appendChild(taskTitle);

    // Task text
    let taskText = document.createElement('div');
    $(taskText).addClass('task_text').html(data.text);
    taskWrap.appendChild(taskText);

    // Task images
    let taskImgs = document.createElement('div');
    $(taskImgs).addClass('task_imgs');

    data.images.map( (item) => {
      let img = document.createElement('img');
      $(img).attr({
        'src': item,
        'alt': ''
      });
      taskImgs.appendChild(img);
    } );

    taskWrap.appendChild(taskImgs);

    // Task offers
    let taskOffersWrap = document.createElement('section');
    $(taskOffersWrap).addClass('offers-wrap');

    let taskOffersWrapHeader = document.createElement('h2');
    $(taskOffersWrapHeader).html('Propozycji realizacji');
    taskOffersWrap.appendChild(taskOffersWrapHeader);

    if(+data.offers.more_then_3) {
      let showMoreBtn = document.createElement('div');
      $(showMoreBtn).addClass('hp-btn').attr('id', 'show_more_offers').html('<span>Pokaż wszystkie</span>');
      taskOffersWrap.appendChild(showMoreBtn);
    }

    if(data.offers.offers.length != 0) {
      data.offers.offers.map( (item) => {
        let offer = document.createElement('article');
        $(offer).addClass('offer').attr('data-id', item.id_user);
  
        let offerImg = document.createElement('img');
        const imgPath = item.photo ? item.photo : '/img/default.jpg';
        $(offerImg).addClass('link_to_offerer').attr({
          'src': imgPath,
          'alt': `${item.name} zjęcie`
        });
        offer.appendChild(offerImg);
  
        let offerName = document.createElement('h5');
        $(offerName).html(item.name).addClass('link_to_offerer');
        offer.appendChild(offerName);
  
        if( +owner && data.status == 1 && item.id_user != data.my_id ) {
          let allowRealizeBtn = document.createElement('div');
          $(allowRealizeBtn).addClass('hp-btn allow_realize_btn').html('<span>Powierzyć</span>');
          offer.appendChild(allowRealizeBtn);
        }
  
        let offerTime = document.createElement('p');
        $(offerTime).html(`<i class="far fa-arrow-alt-circle-right"></i><span>${item.time.day}.${item.time.month}.${item.time.year} ${item.time.hour}:${item.time.minute}</span>`);
        offer.appendChild(offerTime);
  
        let offerText = document.createElement('div');
        $(offerText).html(item.text);
        offer.appendChild(offerText);
  
        taskOffersWrap.appendChild(offer);
      } );
    } else {
      let noResultOffers = document.createElement('p');
      $(noResultOffers).html('Brak propozycij').css('text-align', 'center');
      taskOffersWrap.appendChild(noResultOffers);
    }

    

    if(window.auth) {
      let offerForm = document.createElement('div');
      $(offerForm).addClass('offer-form');

      let textareaOffer = document.createElement('textarea');
      $(textareaOffer).attr('id', 'textarea_offer');
      offerForm.appendChild(textareaOffer);

      let offerSend = document.createElement('div');
      $(offerSend).attr('id', 'offer-send').html('<i class="fas fa-share"></i>');
      offerForm.appendChild(offerSend);

      taskOffersWrap.appendChild(offerForm);
    }


    taskWrap.appendChild(taskOffersWrap);
  }

  function renderOffers(data) {
    let before = document.querySelector('.offer-form');
    let pffersWrap = document.querySelector('.offers-wrap');
    $('#show_more_offers').remove('#show_more_offers');
    $('.offer').remove('.offer');

    data.map( (item, index) => {
      addOffer(item)
    } );

    $('.offers-wrap .mini_preloader_wrap').css('opacity', '0');
  }

  function addOffer(data) {
    let before = document.querySelector('.offer-form');
    let offersWrap = document.querySelector('.offers-wrap');

    let offer = document.createElement('article');
    $(offer).addClass('offer').attr('data-id', data.id_user);

    let offerImg = document.createElement('img');
    const imgPath = data.photo ? data.photo : '/img/default.jpg';
    $(offerImg).addClass('link_to_offerer').attr({
      'src': imgPath,
      'alt': `${data.name} photo`
    });
    offer.appendChild(offerImg);

    let offerH5 = document.createElement('h5');
    $(offerH5).html(data.name).addClass('link_to_offerer');
    offer.appendChild(offerH5);

    if( +data.owner && data.status == 1 && data.id_user != data.my_id ) {
      let allowRealizeBtn = document.createElement('div');
      $(allowRealizeBtn).addClass('hp-btn allow_realize_btn').html('<span>Powierzyć</span>');
      offer.appendChild(allowRealizeBtn);
    }

    let offerDate = document.createElement('p');
    $(offerDate).html(`<i class="far fa-arrow-alt-circle-right"></i>
    <span>${data.time.day}.${data.time.month}.${data.time.year} ${data.time.hour}:${data.time.minute}</span>`);
    offer.appendChild(offerDate);

    let offerText = document.createElement('div');
    $(offerText).html(data.text);
    offer.appendChild(offerText);

    offersWrap.insertBefore(offer, before);
  }

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

})();