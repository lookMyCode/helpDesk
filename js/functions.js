function isAutorized() {
  $.ajax({
    type: "POST",
    url: '/php/is_autorized.php',
    success: (answer) => {
      const data = JSON.parse(answer);
      if(data['status'] == 1) {
        window.auth = true;
      } else {
        window.auth = false;
      }
      return auth;
    }
  });
}

function sendLogin() {
  $('#login-form .mini_preloader_wrap').css('opacity', '1');

  const login = $('#login_email').val();
  const pass = $('#login_pass').val();

  $.ajax({
    type: "POST",
    url: '/php/login.php',
    data: {
      'login': login,
      'pass': pass
    },
    success: (answer) => {
      $('#login-form .mini_preloader_wrap').css('opacity', '0');

      const data = JSON.parse(answer);
      if(data['status'] == 2) {
        $('#login_answer').html('Nieprawidłowy login lub hasło');
      } else if(data['status'] == 1) {
        $('#login_answer').html('');
        location.reload();
      } else {
        $('#login_answer').html('Błąd serwera');
      }
    }
  });
}

function sendReg(e) {
  e.preventDefault();
  $('.mini_preloader_wrap').css('opacity', '1');

  let 
    name        = $('#reg-name'),
    mail        = $('#reg-mail'),
    pass1		    = $('#pass1'),
    pass2		    = $('#pass2'),
    flag        = true;

  let $form = $('#registr-form');

  let 
    nameVal = validateName( name.val() ),
    mailVal = validateMail( mail.val() ),
    pass1Val = validatePass( pass1.val() ),
    pass2Val = validatePass( pass2.val() );

    checkInput(name, nameVal);
    checkInput(mail, mailVal);
    checkInput(pass1, pass1Val);
    checkInput(pass2, pass2Val);

    if(pass1Val !== pass2Val) {
      flag = false;
      pass1.css('borderColor', 'red');
      pass2.css('borderColor', 'red');
    }

    if(nameVal && mailVal && pass1Val && pass2Val && flag && pass1Val === pass2Val) {
      $('.reg-warning').html('');

      $.ajax({
        'url': $form.attr('action'),
        'data': $form.serialize(),
        'method': $form.attr('method'),
        success: (answer) => {
          $('.mini_preloader_wrap').css('opacity', '0');
          console.log(answer);
          const data = JSON.parse(answer);

          if( data['status'] == 1 ) {
            location.href = '/';
          } else if( data['status'] == 2 ) {
            $('.reg-warning').html('Wpisz poprawne dane');
            grecaptcha.execute();
          } else if(data['status'] == 3) {
            $('.reg-warning').html('Podany mail już istnieje');
          } else if( data['status'] == 4 ) {
            $('.reg-warning').html('Nie przeszedłesz sprawdzenia na bota, sprobuj ponownie');
            grecaptcha.execute();
          } else {
            $('.reg-warning').html('Błąd serwera');
            grecaptcha.execute();
          }
          $('.reg-warning').html(data['data']);
        },
        error: (err) => {
          $('.mini_preloader_wrap').css('opacity', '0');
          $('.reg-warning').html('Błąd serwera');
          grecaptcha.execute();
        }
      });
    } else {
      $('.reg-warning').html('Wpisz poprawne dane');
      $('.mini_preloader_wrap').css('opacity', '0');
    }

}

// Functions for form
function validateName(name) {
  name = name.trim();

  let arr = [];
  let arr_start = name.split(' ');

  for(let i = 0; i < arr_start.length; i++) {
    if( arr_start[i].trim() != '' ) arr.push(arr_start[i]);
  }

  let regExp = /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{3,20}$/i;

  for(let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].trim();
    
    if( toValidateValue(regExp, arr[i]) === false ) {
      return false;
    }
  }

  name = arr.join(' ');

  return name;
}

function validateMail(mail) {
  mail = mail.trim();

  let regExp = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
  if ( toValidateValue(regExp, mail) ) {
    return mail;
  } else {
    return false;
  }
}

function validatePass(pass) {
  pass = pass.trim();

  if(pass.length >= 6 && pass.length <= 30) {
    return pass;
  } else {
    return false;
  } 
}

function toValidateValue(regExp, value) {  
  return regExp.test(value);
}

function checkInput(input, text) {
  if(text) {
    input.val(text);
    input.css('borderColor', 'green');
  } else {
    input.css('borderColor', 'red');
    flag = false;
  }
}

function getParams() {
  // Check URL
  let param = location.search;
  param = param.slice(1);
  let args = param.split('&');
  let argState = {};
  
  args.map((item) => {
    let arr = item.split('=');
    argState[arr[0]]  = arr[1];
  });

  return argState;
}

function isEmptyObject(obj) {
  for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
          return false;
      }
  }
  return true;
}