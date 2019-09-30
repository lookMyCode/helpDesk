;(function() {

  $.ajax({
    type: "POST",
    url: '/php/is_autorized.php',
    success: (answer) => {
      const data = JSON.parse(answer);
      if(data['status'] == 1) {
        auth = true;
      } else {
        auth = false;
      }
    }
  });

})();