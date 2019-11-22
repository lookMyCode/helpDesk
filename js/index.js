$.ajax({
  type: "POST",
  url: '/php/for_index.php',
  success: (answer) => {
    let data = JSON.parse(answer);
    console.log(data);
    if(data.status == 1) {
      $('#count_users').html(data.data.count_users);
      $('#count_tasks').html(data.data.count_tasks);
      $('#entrances').html(data.data.entrances);

      renderAd(data.data.tasks, data.data.more_then_3)
    }
  }, 
  error: (e) => {
    console.log('e');
  }
});

$('aside').on('click', '.ad', (e) => {
  location.href = `/task.html?id=${e.target.closest('.ad').dataset.id}`;
});

$('aside').on('click', '#go_to_tasks', () => {
  location.href = '/task_list.html';
});



function renderAd(data, bool) {
  let aside_block = document.querySelector('aside');
  $(aside_block).html('');

  data.map( (item, index) => {
    let ad = document.createElement('div');
    $(ad).addClass('ad').attr('data-id', item.id_task);

    let adImg = document.createElement('img');
    $(adImg).addClass('ad-photo').attr({
      'src': item.photo,
      'alt': 'image'
    });
    ad.appendChild(adImg);

    let adInfo = document.createElement('div');
    $(adInfo).addClass('ad-info');

    let adInfoHeader = document.createElement('h6');
    $(adInfoHeader).html(item.title);
    adInfo.appendChild(adInfoHeader);

    if(item.average_rating != 0) {
      let adInfoRating = document.createElement('p');
      $(adInfoRating).html(`<i class="far fa-star"></i><span>${item.average_rating}</span>`);
      adInfo.appendChild(adInfoRating);
    }
    
    let adInfoStartDate = document.createElement('p');
    $(adInfoStartDate).html(`<i class="far fa-arrow-alt-circle-right"></i><span>${item.publication_date.day}.${item.publication_date.month}.${item.publication_date.year}</span>`);
    adInfo.appendChild(adInfoStartDate);

    let adInfoFinishDate = document.createElement('p');
    $(adInfoFinishDate).html(`<i class="far fa-arrow-alt-circle-left"></i><span>${item.date_completion.day}.${item.date_completion.month}.${item.date_completion.year}</span>`);
    adInfo.appendChild(adInfoFinishDate);

    ad.appendChild(adInfo);

    let adText = document.createElement('div');
    $(adText).addClass('ad-description').html(item.text);
    ad.appendChild(adText);

    aside_block.appendChild(ad);
  } );

  if(bool == 1) {
    let btn = document.createElement('p');
    $(btn).addClass('hp-btn').attr('id', 'go_to_tasks').html('<span>Zobacz wszystkie</span>');
    aside_block.appendChild(btn);
  }
}