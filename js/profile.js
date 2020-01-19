;(function() {

  let preloader = document.createElement('div');
    $(preloader).addClass('mini_preloader_wrap').html('<div class="mini_preloader"><div class="mini_preloader_item"></div><div class="mini_preloader_item"></div><div class="mini_preloader_item"></div><div class="mini_preloader_item"></div><div class="mini_preloader_item"></div></div>');

  let id = getId();

  $('.profile-wrap > .mini_preloader_wrap').css('opacity', '1');

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
  
  $('.profile-wrap').on('click', '#edit_profile', () => {
    location.href = '/edit_profile.html';
  });

  $('.profile-wrap').on('click', '.user-ad', (e) => {
    location.href = `/task.html?id=${e.target.closest('.user-ad').dataset.id}`;
  });

  $('.profile-wrap').on('click', '#show_more_pub_btn', (e) => {
    let btn = e.target.closest('#show_more_pub_btn');
    $(btn).html(preloader);
    
    $('.user-project-wrap.published .mini_preloader_wrap').css('opacity', '1');
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
              }
            }
          });
        }
      } );
    } )().then( (id) => {
      $.ajax({
        type: "POST",
        url: '/php/get_pub_tasks.php',
        data: {
          'id': id
        },
        success: (answer) => {
          let data = JSON.parse(answer);
          if(data.status == 1) {
            renderPubTasks(data.data);
          }
        }
      });
    } );
  });

  $('.profile-wrap').on('click', '#show_more_tak_btn', (e) => {
    let btn = e.target.closest('#show_more_tak_btn');
    $(btn).html(preloader);
    console.log(btn);
    $('.user-project-wrap.taken .mini_preloader_wrap').css('opacity', '1');
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
              }
            }
          });
        }
      } );
    } )().then( (id) => {
      $.ajax({
        type: "POST",
        url: '/php/get_made_tasks.php',
        data: {
          'id': id
        },
        success: (answer) => {
          let data = JSON.parse(answer);
          if(data.status == 1) {
            renderTakTasks(data.data);
          }
        }
      });
    } );
  });

  $('.profile-wrap').on('click', '#show_more_reviews', (e) => {
    let btn = e.target.closest('#show_more_reviews');
    $(btn).html(preloader);
    $('.review-wrap .mini_preloader_wrap').css('opacity', '1');
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
              }
            }
          });
        }
      } );
    } )().then( (id) => {
      $.ajax({
        type: "POST",
        url: '/php/get_reviews.php',
        data: {
          'id': id
        },
        success: (answer) => {
          let data = JSON.parse(answer);

          if(data.status == 1) {
            renderReviews(data.data);
          }
        }
      });
    } );
  });

  $('.profile-wrap').on('click', '#review-send', () => { 
    //$('.review-wrap .mini_preloader_wrap').css('opacity', '1');

    let textReview = $('#textarea_review').val().trim();
    if( textReview != '' ) {
      $('#textarea_review').css('borderColor', '#41F01D');

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
                }
              }
            });
          }
        } );
      } )().then( (id) => {
        $.ajax({
          type: "POST",
          url: '/php/send_review.php',
          data: {
            'id': id,
            'text': textReview
          },
          success: (answer) => {
            console.log(answer);
            let data = JSON.parse(answer);

            if(data.status == 1) {
              $('#textarea_review').val('');

              addReview(data.data);
            } else {
              $('#textarea_review').css('borderColor', 'red');
            }
          }
        });
      } );

    } else {
      $('#textarea_review').css('borderColor', 'red');
    }
  });

  $('.profile-wrap').on('click', '#get_assessment_btn', () => {
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
              }
            }
          });
        }
      } );
    } )()
    .then( (id) => {
      let data = {
        'id': id,
        'assessment': $('#get_assessment_select').val()
      };
      return data;
    } )
    .then( (obj) => {
      $.ajax({
        type: "POST",
        url: '/php/change_rating.php',
        data: obj,
        success: (answer) => {
          console.log(answer);
          let data = JSON.parse(answer);
          console.log(data);
          if(data.status == 1) {
            let $assessment = $('.assessment');

            if($assessment.length == 1) {
              $assessment.html(`<i class="fa fa-star"></i><span>${data.data.average_rating} (${data.data.number_ratings})</span>`);
            } else {
              assessment = document.createElement('p');
              $(assessment).addClass('assessment').html(`<i class="fa fa-star"></i><span>${data.data.average_rating} (${data.data.number_ratings})</span>`);
              $('.user-presentation img').after(assessment);
            }

            $('.get-assessment').remove();
          }
        }
      });
    } );
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
    if(data.data.photo) {
      $(imgPhoto).attr({
        'src': data.data.photo,
        'alt': `${data.data.name} photo`,
        'title': data.data.name
      });
    } else {
      $(imgPhoto).attr({
        'src': '/img/default.jpg',
        'alt': `${data.data.name} photo`,
        'title': data.data.name
      });
    }
    
    userPresentation.appendChild(imgPhoto);

    if(data.data.number_ratings != 0) {
      let assessment = document.createElement('p');
      $(assessment).addClass('assessment');

      let assessmentIcon = document.createElement('i');
      $(assessmentIcon).addClass('fa fa-star');
      assessment.appendChild(assessmentIcon);

      let assessmentSpan = document.createElement('span');
      $(assessmentSpan).html(`${data.data.average_rating} (${data.data.number_ratings})`);
      assessment.appendChild(assessmentSpan);

      userPresentation.appendChild(assessment);
    }

    if(!+data.owner && window.auth && !+data.appreciated) {
      let getAssessment = document.createElement('p');
      $(getAssessment).addClass('get-assessment');

      let getAssessmentSelect = document.createElement('select');
      $(getAssessmentSelect).attr('id', 'get_assessment_select');

      for(let i = 5; i > 0; i--) {
        let getAssessmentSelectOption = document.createElement('option');
        $(getAssessmentSelectOption).val(i).html(i);
        getAssessmentSelect.appendChild(getAssessmentSelectOption);
      }

      getAssessment.appendChild(getAssessmentSelect);

      let getAssessmentBtn = document.createElement('button');
      $(getAssessmentBtn).attr('id', 'get_assessment_btn').html('Oceń');
      getAssessment.appendChild(getAssessmentBtn);

      userPresentation.appendChild(getAssessment);
    }

    if(!+data.owner && window.auth) {
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
      $(hpBtn).attr('id', 'edit_profile');

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
      $(userTitleDateRegSpan2).html(`${data.data.date_registration.day}.${data.data.date_registration.month}.${data.data.date_registration.year}`);
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

    // User projects
    let userProjects = document.createElement('section');
    $(userProjects).addClass('user-projects');

    let userProjectsH2 = document.createElement('h2');
    $(userProjectsH2).html('Projekty');
    userProjects.appendChild(userProjectsH2);

    /* Published start */
    let userProjectsPublished = document.createElement('div');
    $(userProjectsPublished).addClass('user-project-wrap published');

    let userProjectsPublishedH3 = document.createElement('h3');
    $(userProjectsPublishedH3).html('Opublikowane');
    userProjectsPublished.appendChild(userProjectsPublishedH3);

    let userProjectPub = document.createElement('div');
    $(userProjectPub).addClass('user-project');

    if(data.data.tasks.published.tasks.length >= 1) {
      data.data.tasks.published.tasks.map( (item, index) => {
        let userAd = document.createElement('div');
        $(userAd).addClass('user-ad').attr('data-id', item.id_task);

        let userAdH4 = document.createElement('h4');
        $(userAdH4).html(item.title);
        userAd.appendChild(userAdH4);

        let userAdDate = document.createElement('p');
        $(userAdDate).html(`<i class="far fa-arrow-alt-circle-right"></i><span>${item.publication_date.day}.${item.publication_date.month}.${item.publication_date.year}</span>`);
        userAd.appendChild(userAdDate);

        let userAdText = document.createElement('p');
        $(userAdText).html(item.text);
        userAd.appendChild(userAdText);

        userProjectPub.appendChild(userAd);
      } );
    } else {
      let noResult = document.createElement('div');
      $(noResult).addClass('no_result').html('Brak zadań');
      userProjectPub.appendChild(noResult);
    }

    userProjectsPublished.appendChild(userProjectPub);

    if(data.data.tasks.published.more_then_3 == 1) {

      let showMoreBtn = document.createElement('div');
      $(showMoreBtn).addClass('hp-btn').attr('id', 'show_more_pub_btn').html('<span>Pokaż wszystkie</span>');
      userProjectsPublished.appendChild(showMoreBtn);
    }

    userProjects.appendChild(userProjectsPublished); /* Published end */

    /* Taken start */ 
    let userProjectsTaken = document.createElement('div');
    $(userProjectsTaken).addClass('user-project-wrap taken');

    let userProjectsTakenH3 = document.createElement('h3');
    $(userProjectsTakenH3).html('Pobrane');
    userProjectsTaken.appendChild(userProjectsTakenH3);

    let userProjectTak = document.createElement('div');
    $(userProjectTak).addClass('user-project');

    if(data.data.tasks.made.tasks.length > 0 ) {
      data.data.tasks.made.tasks.map( (item, index) => {
        let userAd = document.createElement('div');
        $(userAd).addClass('user-ad').attr('data-id', item.id_task);

        let userAdH4 = document.createElement('h4');
        $(userAdH4).html(item.title);
        userAd.appendChild(userAdH4);

        let userAdDate = document.createElement('p');
        $(userAdDate).html(`<i class="far fa-arrow-alt-circle-right"></i><span>${item.publication_date.day}.${item.publication_date.month}.${item.publication_date.year}</span>`);
        userAd.appendChild(userAdDate);

        let userAdText = document.createElement('p');
        $(userAdText).html(item.text);
        userAd.appendChild(userAdText);

        userProjectTak.appendChild(userAd);
      } );
    } else {
      let noResult = document.createElement('div');
      $(noResult).addClass('no_result').html('Brak zadań');
      userProjectTak.appendChild(noResult);
    }

    userProjectsTaken.appendChild(userProjectTak);

    if(data.data.tasks.made.more_then_3 == 1) {

      let showMoreBtn = document.createElement('div');
      $(showMoreBtn).addClass('hp-btn').attr('id' , 'show_more_tak_btn').html('<span>Pokaż wszystkie</span>');
      userProjectsTaken.appendChild(showMoreBtn);
    }

    userProjects.appendChild(userProjectsTaken); /* Taken end */

    profileWrap.appendChild(userProjects);

    /* Reviews */

    let reviewWrap = document.createElement('section');
    $(reviewWrap).addClass('review-wrap');

    let rewiewHeader = document.createElement('h2');
    $(rewiewHeader).html('Recenzje');
    reviewWrap.appendChild(rewiewHeader);

    if (data.data.reviews.more_then_3 == 1) {
      let reviewSeeMore = document.createElement('div');
      $(reviewSeeMore).addClass('hp-btn').attr('id', 'show_more_reviews').html('<span>Pokaż wszystkie</span>');
      reviewWrap.appendChild(reviewSeeMore);
    }

    if (data.data.reviews.reviews != 0) {
      data.data.reviews.reviews.map( (item, index) => {
        let review = document.createElement('article');
        $(review).addClass('review');
  
        let reviewImg = document.createElement('img');
        $(reviewImg).attr({
          'src': item.photo,
          'alt': `${item.name} photo`
        });
        review.appendChild(reviewImg);
  
        let reviewH5 = document.createElement('h5');
        $(reviewH5).html(item.name);
        review.appendChild(reviewH5);
  
        let reviewDate = document.createElement('p');
        $(reviewDate).html(`<i class="far fa-arrow-alt-circle-right"></i>
        <span>${item.date_review.day}.${item.date_review.month}.${item.date_review.year} ${item.date_review.hour}:${item.date_review.minute}</span>`);
        review.appendChild(reviewDate);
  
        let revivewText = document.createElement('div');
        $(revivewText).html(item.text);
        review.appendChild(revivewText);
  
        reviewWrap.appendChild(review);
      } );
    } else {
      let noResultReviews = document.createElement('p');
      $(noResultReviews).html('Brak recenzyj').css('text-align', 'center');
      reviewWrap.appendChild(noResultReviews);
    }
    
    if(window.auth) {
      let reviewForm = document.createElement('div');
      $(reviewForm).addClass('review-form');

      let textareaReview = document.createElement('textarea');
      $(textareaReview).attr('id', 'textarea_review');
      reviewForm.appendChild(textareaReview);

      let reviewSend = document.createElement('div');
      $(reviewSend).attr('id', 'review-send').html('<i class="fas fa-share"></i>');
      reviewForm.appendChild(reviewSend);

      reviewWrap.appendChild(reviewForm);
    }

    profileWrap.appendChild(reviewWrap);
  }

  function renderPubTasks(data) {
    let userProject = document.querySelector('.published .user-project');
    $(userProject).html('');

    data.map( (item, index) => {
      let userAd = document.createElement('div');
        $(userAd).addClass('user-ad').attr('data-id', item.id_task);

        let userAdH4 = document.createElement('h4');
        $(userAdH4).html(item.title);
        userAd.appendChild(userAdH4);

        let userAdDate = document.createElement('p');
        $(userAdDate).html(`<i class="far fa-arrow-alt-circle-right"></i><span>${item.publication_date.day}.${item.publication_date.month}.${item.publication_date.year}</span>`);
        userAd.appendChild(userAdDate);

        let userAdText = document.createElement('p');
        $(userAdText).html(item.text);
        userAd.appendChild(userAdText);

        userProject.appendChild(userAd);

        $('#show_more_pub_btn').hide();
    } );

    $('.user-project-wrap.published .mini_preloader_wrap').css('opacity', '0');
  }

  function renderTakTasks(data) {
    let userProject = document.querySelector('.taken .user-project');
    $(userProject).html('');

    data.map( (item, index) => {
      let userAd = document.createElement('div');
        $(userAd).addClass('user-ad').attr('data-id', item.id_task);

        let userAdH4 = document.createElement('h4');
        $(userAdH4).html(item.title);
        userAd.appendChild(userAdH4);

        let userAdDate = document.createElement('p');
        $(userAdDate).html(`<i class="far fa-arrow-alt-circle-right"></i><span>${item.publication_date.day}.${item.publication_date.month}.${item.publication_date.year}</span>`);
        userAd.appendChild(userAdDate);

        let userAdText = document.createElement('p');
        $(userAdText).html(item.text);
        userAd.appendChild(userAdText);

        userProject.appendChild(userAd);

        $('#show_more_tak_btn').hide();
    } );

    $('.user-project-wrap.taken .mini_preloader_wrap').css('opacity', '0');
  }

  function renderReviews(data) {
    let before = document.querySelector('.review-form');
    let reviewWrap = document.querySelector('.review-wrap');
    $('#show_more_reviews').remove('#show_more_reviews');
    $('.review').remove('.review');

    data.map( (item, index) => {
      addReview(item)
    } );

    $('.review-wrap .mini_preloader_wrap').css('opacity', '0');
  }

  function addReview(data) {
    let before = document.querySelector('.review-form');
    let reviewWrap = document.querySelector('.review-wrap');

    let review = document.createElement('article');
    $(review).addClass('review');

    let reviewImg = document.createElement('img');
    $(reviewImg).attr({
      'src': data.photo,
      'alt': `${data.name} photo`
    });
    review.appendChild(reviewImg);

    let reviewH5 = document.createElement('h5');
    $(reviewH5).html(data.name);
    review.appendChild(reviewH5);

    let reviewDate = document.createElement('p');
    $(reviewDate).html(`<i class="far fa-arrow-alt-circle-right"></i>
    <span>${data.date_review.day}.${data.date_review.month}.${data.date_review.year} ${data.date_review.hour}:${data.date_review.minute}</span>`);
    review.appendChild(reviewDate);

    let revivewText = document.createElement('div');
    $(revivewText).html(data.text);
    review.appendChild(revivewText);

    reviewWrap.insertBefore(review, before);
  }

})();