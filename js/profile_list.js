;(function() {
  'use strict';

  let params = getParams();
  let flag = false;

  $('.filter_inputs').on('change', makeURL);

  $(window).on('popstate', makeURL);

  $('#profiles').on('click', '.profile', (e) => {
    location.href = `/profile.html?id=${e.target.closest('.profile').dataset.id}`;
  });

  if( params.role != undefined ) {
    
    $('.filter_role').map( (index, item) => {
      $(item).val() == params.role ? (() => {
        $(item).prop('checked', true);
        flag = true;
      })() : $(item).prop('checked', false);
    } );

    flag == false ? $('.filter_role[value=all]').prop('checked', true) : null;

  } else {
    location.search != false ? location.search = '' : null;
  }

  makeURL();

  function makeURL() {
    $('.filter_role').map( (index, item) => {
      delete params[''];
      $(item).prop('checked') ? params.role = $(item).val() : null;
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
    let params = getParams();

    $.ajax({
      type: "GET",
      url: '/php/get_profile_list.php',
      data: params,
      success: (answer) => {
        let data = JSON.parse(answer);

        if(data.status == 1) {
          renderProfiles(data.data);
        } else {
          console.log('Error');
        }        
      }
    });
  };

  function renderProfiles(data) {
    let profiles = document.getElementById('profiles');
    $(profiles).html('');

    data.map( (item, index) => {
      let profile = document.createElement('div');
      $(profile).addClass('profile').attr('data-id', item.id_user);

      let profileImg = document.createElement('img');
      $(profileImg).addClass('profile_photo').attr({
        'src': item.photo ? item.photo : '/img/default.jpg',
        'alt': `${item.name} zjęcie`
      });
      profile.appendChild(profileImg);

      let profileTitle = document.createElement('div');
      $(profileTitle).addClass('profile_title');

      let profileTitleName = document.createElement('h6');
      $(profileTitleName).html(item.name);
      profileTitle.appendChild(profileTitleName);
      
      if(item.number_ratings != 0) {
        let rating = document.createElement('p');
        $(rating).html(`<i class="far fa-star"></i>
        <span>${item.average_rating}</span>`);
        profileTitle.appendChild(rating);
      }

      if(item.specialization) {
        let specialization = document.createElement('p');
        $(specialization).html(item.specialization);
        profileTitle.appendChild(specialization);
      }

      if(item.location) {
        let location = document.createElement('p');
        $(location).html(item.location);
        profileTitle.appendChild(location);
      }

      profile.appendChild(profileTitle);

      let profileAbout = document.createElement('div');
      $(profileAbout).addClass('profile_about').html(item.about);
      profile.appendChild(profileAbout);

      profiles.appendChild(profile);
    } );
  }

})();