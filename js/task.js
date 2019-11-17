;(function() {

  const id = getId();

  $.ajax({
    type: "POST",
    url: '/php/get_task.php',
    data: {
      'id': id
    },
    success: (answer) => {
      let data = JSON.parse(answer);
      
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
      'title': `${data.autor_name} zjęcie`
    });
    taskAutor.appendChild(taskAutorPhoto);

    if(data.autor_number_ratings != '0') {
      let taskAutorSpan = document.createElement('span');
      $(taskAutorSpan).html(`<i class="far fa-star"></i>${data.autor_average_rating} (${data.autor_number_ratings})`);
      taskAutor.appendChild(taskAutorSpan);
    }

    let taskAutorName = document.createElement('h2');
    $(taskAutorName).html(data.autor_name);
    taskAutor.appendChild(taskAutorName);

    let taskAutorLoc = document.createElement('p');
    $(taskAutorLoc).html(data.autor_location);
    taskAutor.appendChild(taskAutorLoc);

    let taskAutorSpec = document.createElement('p');
    $(taskAutorSpec).html(data.autor_specialization);
    taskAutor.appendChild(taskAutorSpec);

    if(owner == '1') {
      let taskAutorEditBtn = document.createElement('div');
      $(taskAutorEditBtn).addClass('hp-btn').html('<span>Edytuj zadanie</span>').attr({
        'id': 'edit_task_btn'
      });
      taskAutor.appendChild(taskAutorEditBtn);
    }

    taskWrap.appendChild(taskAutor);

    // Task date
    let taskDate = document.createElement('div');
    $(taskDate).addClass('task_date');

    let taskDatePublication = document.createElement('p');
    $(taskDatePublication).html(`<i class="far fa-arrow-alt-circle-right"></i><span>${data.publication_date.day}.${data.publication_date.month}.${data.publication_date.year}</span>`)
    taskDate.appendChild(taskDatePublication);

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