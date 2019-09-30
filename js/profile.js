;(function() {

  let id = getId();

  $(window).on('popstate', loaderPage);

  ( () => {
    return new Promise( (res, rej) => {
      if(id) {
        res(id);
      } else {
        $.ajax({
          type: "POST",
          url: '/php/get_id.php',
          success: (answer) => {
            let data = JSON.parse(answer);
        
            if(data['status'] == 1) {
              res(data['id']);
            } else {
              location.href = '/';
            }
          }
        });
      }
    } );
  } )().then( (id) => {
    history.replaceState({}, null, `?id=${id}`);
    loaderPage();
  } );
  
  

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
  
  function loaderPage(e) {
    
    $.ajax({
      type: "GET",
      url: '/php/get_user_data.php',
      async: true,
      data: {
        'id': getId()
      },
      success: (answer) => {
        let data = JSON.parse(answer);
        console.log(data);
    
        if(data['status'] == 1) {
          renderProfile(data);
        } else {
          location.href = `${location.origin}${location.pathname}`;
        }
      }
    });
  }

  function renderProfile(data) {
    let profileWrap = document.querySelector('.profile-wrap');

    $(profileWrap).html('');

    // User presentation
    let userPresentation = document.createElement('div');
    $(userPresentation).addClass('user-presentation');

    let imgPhoto = document.createElement('img');
    $(imgPhoto).attr({
      'src': '/img/face.jpg',
      'alt': `${data.data.name} photo`
    });
    userPresentation.appendChild(imgPhoto);

    if(data.data.number_ratings != 0) {
      let assessment = document.createElement('p');
      $(assessment).addClass('assessment');

      let assessmentIcon = document.createElement('i');
      $(assessmentIcon).addClass('fa fa-star');
      assessment.appendChild(assessmentIcon);

      let assessmentSpan = document.createElement('span');
      $(assessmentSpan).html(data.data.average_rating);
      assessment.appendChild(assessmentSpan);

      userPresentation.appendChild(assessment);
    }

    if(!+data.owner && auth) {
      let getAssessment = document.createElement('p');
      $(getAssessment).addClass('get-assessment');

      let getAssessmentSelect = document.createElement('select');

      for(let i = 5; i > 0; i--) {
        let getAssessmentSelectOption = document.createElement('option');
        $(getAssessmentSelectOption).val(i).html(i);
        getAssessmentSelect.appendChild(getAssessmentSelectOption);
      }

      getAssessment.appendChild(getAssessmentSelect);

      let getAssessmentBtn = document.createElement('button');
      $(getAssessmentBtn).html('Oceń');
      getAssessment.appendChild(getAssessmentBtn);

      userPresentation.appendChild(getAssessment);
    }

    if(!+data.owner && auth) {
      let hpBtn = document.createElement('p');
      $(hpBtn).attr('id', 'sent_message').addClass('hp-btn');

      let hpBtnIcon = document.createElement('i');
      $(hpBtnIcon).addClass('far fa-comments');
      hpBtn.appendChild(hpBtnIcon);

      let hpBtnSpan = document.createElement('span');
      $(hpBtnSpan).html('Napisz');
      hpBtn.appendChild(hpBtnSpan);

      userPresentation.appendChild(hpBtn);
    } 
    
    if(+data.owner) {
      let hpBtn = document.createElement('p');
      $(hpBtn).addClass('hp-btn');

      let hpBtnIcon = document.createElement('i');
      $(hpBtnIcon).addClass('fas fa-user-cog');
      hpBtn.appendChild(hpBtnIcon);

      let hpBtnSpan = document.createElement('span');
      $(hpBtnSpan).html('Edytuj profil');
      hpBtn.appendChild(hpBtnSpan);

      userPresentation.appendChild(hpBtn);
    }

    profileWrap.appendChild(userPresentation);


    // User title
    let userTitle = document.createElement('section');
    $(userTitle).addClass('user-title');

    let userTitleHeader = document.createElement('h1');
    $(userTitleHeader).html(data.data.name);
    userTitle.appendChild(userTitleHeader);

    if(data.data.specialization) {
      let userTitleSpecialization = document.createElement('p');

      let userTitleSpecSpan1 = document.createElement('span');
      $(userTitleSpecSpan1).html('Specjalizacja:');
      userTitleSpecialization.appendChild(userTitleSpecSpan1);

      let userTitleSpecSpan2 = document.createElement('span');
      $(userTitleSpecSpan2).html(data.data.specialization);
      userTitleSpecialization.appendChild(userTitleSpecSpan2);

      userTitle.appendChild(userTitleSpecialization);
    }

    if(data.data.location) {
      let userTitleLocation = document.createElement('p');

      let userTitleLocSpan1 = document.createElement('span');
      $(userTitleLocSpan1).html('Lokalizacja:');
      userTitleLocation.appendChild(userTitleLocSpan1);

      let userTitleLocSpan2 = document.createElement('span');
      $(userTitleLocSpan2).html(data.data.location);
      userTitleLocation.appendChild(userTitleLocSpan2);

      userTitle.appendChild(userTitleLocation);
    }

    if(data.data.date_registration) {
      let userTitleDateReg = document.createElement('p');

      let userTitleDateRegSpan1 = document.createElement('span');
      $(userTitleDateRegSpan1).html('Na Help-Place z:');
      userTitleDateReg.appendChild(userTitleDateRegSpan1);

      let userTitleDateRegSpan2 = document.createElement('span');
      $(userTitleDateRegSpan2).html(data.data.date_registration);
      userTitleDateReg.appendChild(userTitleDateRegSpan2);

      userTitle.appendChild(userTitleDateReg);
    }

    profileWrap.appendChild(userTitle);

    
    // User contact
    let userContact = document.createElement('section');
    $(userContact).addClass('user-contact');

    let userContactHeader = document.createElement('h2');
    $(userContactHeader).html('Kontakt');
    userContact.appendChild(userContactHeader);

    if(data.data.tel) {
      let userContactTel = document.createElement('p');

      let userContactTelSpan1 = document.createElement('span');
      $(userContactTelSpan1).html('Numer telefonu:');
      userContactTel.appendChild(userContactTelSpan1);

      let userContactTelSpan2 = document.createElement('span');
      $(userContactTelSpan2).html(`<a href="tel:${data.data.tel}">${data.data.tel}</a>`);
      userContactTel.appendChild(userContactTelSpan2);

      userContact.appendChild(userContactTel);
    }

    if(data.data.public_mail) {
      let userContactMail = document.createElement('p');

      let userContactMailSpan1 = document.createElement('span');
      $(userContactMailSpan1).html('Mail:');
      userContactMail.appendChild(userContactMailSpan1);

      let userContactMailSpan2 = document.createElement('span');
      $(userContactMailSpan2).html(`<a href="mailto:${data.data.public_mail}">${data.data.public_mail}</a>`);
      userContactMail.appendChild(userContactMailSpan2);

      userContact.appendChild(userContactMail);
    }

    if(data.data.skype) {
      let userContactSkype = document.createElement('p');

      let userContactSkypeSpan1 = document.createElement('span');
      $(userContactSkypeSpan1).html('Skype:');
      userContactSkype.appendChild(userContactSkypeSpan1);

      let userContactSkypeSpan2 = document.createElement('span');
      $(userContactSkypeSpan2).html(`<a href="skype:${data.data.skype}">${data.data.skype}</a></span>`);
      userContactSkype.appendChild(userContactSkypeSpan2);

      userContact.appendChild(userContactSkype);
    }

    if(data.data.website) {
      let userContactWeb = document.createElement('p');

      let userContactWebSpan1 = document.createElement('span');
      $(userContactWebSpan1).html('Strona internetowa:');
      userContactWeb.appendChild(userContactWebSpan1);

      let userContactWebSpan2 = document.createElement('span');
      $(userContactWebSpan2).html(`<a href="${data.data.website}" target="_blank">${data.data.website}</a>`);
      userContactWeb.appendChild(userContactWebSpan2);

      userContact.appendChild(userContactWeb);
    }

    if(!data.data.tel && !data.data.public_mail && !data.data.skype && !data.data.website) {
      let haveNotInfo = document.createElement('p');
      $(haveNotInfo).html('Brak informacji');
      userContact.appendChild(haveNotInfo);
    }

    profileWrap.appendChild(userContact);


    // User about
    let userAbout = document.createElement('section');
    $(userAbout).addClass('user-about');

    let userAboutHeader = document.createElement('h2');
    $(userAboutHeader).html('O mnie');
    userAbout.appendChild(userAboutHeader);

    let userAboutText = document.createElement('p');

    if(data.data.about) {
      $(userAboutText).html(data.data.about);
    } else {
      $(userAboutText).html('Brak informacji');
    }

    userAbout.appendChild(userAboutText);

    profileWrap.appendChild(userAbout);

    //console.log(userAbout);
  }

})();



/* 
$.ajax({
  type: "POST",
  url: '/php/get_id.php',
  success: (answer) => {
    let data = JSON.parse(answer);

    if(data['status'] == 1) {
      
    } else {
      location.href = '/';
    }
  }
});
*/

/* 
new Promise( (resolve, reject) => {
  $.ajax({
    type: "POST",
    url: '/php/get_id.php',
    success: (answer) => {
      let data = JSON.parse(answer);
  
      if(data['status'] == 1) {
        resolve(data['id']);
      } else {
        location.href = '/';
      }
    }
  });
} ).then(function(data) {
  window.id = data;
});

*/