;(function() {

  let displayWidth = window.outerWidth;

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
    $('#create_task_btn').show();
  }, () => {
    $('#create_task_btn').hide();
  } );

  $(window).resize(function() {
    if(window.outerWidth != displayWidth) {
      window.outerWidth > 991 ? $('.filter_param').show() : $('.filter_param').hide();
      displayWidth = window.outerWidth;
    }
  });
  $('#filter_toggle').on('click', showFilter);

  $('#tasks').on('click', '.task', (e) => {
    location.href = `/task.html?id=${e.target.closest('.task').dataset.id}`;
  });

  $('#create_task_btn').on('click', () => {
    location.href = '/new_task.html';
  });

  ( () => {
    return new Promise( (res, rej) => {
      let params = getParams();
      res(params)
    } );
  } )().then( (data) => {
    if( !$.isEmptyObject(data) ) {
      for(key in data) {
        data[key] == undefined ? delete data[key] : null;
      }
    }
    
    data.role     == undefined    ? data.role     = 'all'     : null;
    data.status   == undefined    ? data.status   = 'all'     : null;
    data.sort     == undefined    ? data.sort     = 'new'     : null;
    return data;
  } ).then( (data) => {
    for(key in data) {
      $(`.filter_inputs[name=${key}]`).map( (index, item) => {
        data[key] == $(item).val() ? $(item).prop('checked', true) : $(item).prop('checked', false);
      } );
    }
    return data;
  } ).then( (data) => {
    makeURL();
  } );

  $('.filter_inputs').on('change', makeURL);

  $(window).on('popstate', makeURL);

  function makeURL() {
    let params = {};
    $('.filter_inputs').map( (index, item) => {
      $(item).prop('checked') ? params[$(item).attr('name')] = $(item).val() : null;
    } );

    let arr = [];

    for (let key in params) {
      arr.push(`${key}=${params[key]}`);
    }
    
    let searchStr = arr.join('&');

    history.replaceState({}, null, `?${searchStr}`);
    
    loadPage();
  };

  function loadPage() {

    ( () => {
      return new Promise( (res, rej) => {
        let params = getParams();
        res(params);
      } );
    } )().then( (data) => {
      $.ajax({
        type: "GET",
        url: '/php/get_task_list.php',
        data: data,
        success: (answer) => {
          let data = JSON.parse(answer);

          if(data.status == 1 && data.data.length != 0) {
            renderTasks(data.data);
          } else if(data.status == 2 || data.data.length == 0) {
            $('#tasks').html('<div class="zero_result"><span>Nie znależono wyników</span></div>');
          } else {
            $('#tasks').html('<div class="zero_result"><span>Błąd serwera</span></div>');
          }
        }
      });
    } );
  };

  function showFilter() {
    $('#filter_toggle').off('click', showFilter).on('click', hideFilter).html('<span>Zwiń</span>');
    $('.filter_param').slideDown(700);
  }

  function hideFilter() {
    $('#filter_toggle').off('click', hideFilter).on('click', showFilter).html('<span>Rozwiń</span>');
    $('.filter_param').slideUp(700);
  }

  function renderTasks(data) {
    let tasks = document.getElementById('tasks');
    $(tasks).html('');

    data.map( (item, index) => {
      let task = document.createElement('div');
      $(task).addClass('task').attr('data-id', item.id_task);

      let taskImg = document.createElement('img');
      $(taskImg).addClass('autor_photo').attr({
        'src': item.photo ? item.photo : '/img/default.jpg',
        'alt': `${item.name} zjęcie`
      });
      task.appendChild(taskImg);

      let taskAutorInfo = document.createElement('div');
      $(taskAutorInfo).addClass('autor_info');

      let taskAutorHeader = document.createElement('h6');
      $(taskAutorHeader).html(item.name);
      taskAutorInfo.appendChild(taskAutorHeader);

      if(item.average_rating != 0) {
        let taskAutorRating = document.createElement('p');
        $(taskAutorRating).html(`<i class="fa fa-star"></i><span>${item.average_rating}</span>`);
        taskAutorInfo.appendChild(taskAutorRating);
      }

      task.appendChild(taskAutorInfo);

      let taskDate = document.createElement('div');
      $(taskDate).addClass('task_date');

      let taskDateStart = document.createElement('p');
      $(taskDateStart).attr({
        'title': 'Data założenia zadania'
      }).html(`<i class="far fa-arrow-alt-circle-right"></i> <span>${item.publication_date.day}.${item.publication_date.month}.${item.publication_date.year}</span>`);
      taskDate.appendChild(taskDateStart);

      let taskDateFinish = document.createElement('p');
      $(taskDateFinish).attr({
        'title': 'Data wygaśnienia zadania'
      }).html(`<i class="far fa-arrow-alt-circle-left"></i> <span>${item.date_completion.day}.${item.date_completion.month}.${item.date_completion.year}</span>`);
      taskDate.appendChild(taskDateFinish);

      task.appendChild(taskDate);

      let taskTitle = document.createElement('div');
      $(taskTitle).addClass('task_title');

      let taskTitleHeader = document.createElement('h3');
      $(taskTitleHeader).html(item.title);
      taskTitle.appendChild(taskTitleHeader);

      task.appendChild(taskTitle);

      let taskText = document.createElement('div');
      $(taskText).addClass('task_text').html(item.text);
      task.appendChild(taskText);

      tasks.appendChild(task);
    } );
  }

})();