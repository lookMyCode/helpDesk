const slideTimer = 6000; // Slider's interval

const slides = $('.slide');

// Slider's height
sliderHeight();
$(window).resize(sliderHeight);

slides.each(() => {
	let control = document.createElement('label');
	$(control).html('<input type="radio" name="control" class="control" checked><span></span>');
	document.querySelector('#slides_control').appendChild(control);
});

// Slides background, position and check first checkbox
slides.map( (index, item) => {
	let num = 1 + index;
  $(item).css({
		'left': (index * 100) + '%'
  });
  index === 0 ? $('#slides_control > label > input')[index].checked = true : $('#slides_control > label > input')[index].checked = false;
} );

$('.control').on('change', changeSlide); // Change slide after click in checkbox

// Arrow buttons
$('.slide_arrows.prev').on('click', prevSlide);

$('.slide_arrows.next').on('click', nextSlide);

$(window).on('load', slider); // Main function slider

function selectCheckedControl() {
  const controls = $('.control');
  const checkedIndex = controls.map( (index, item) => {
    if(item.checked) {
      return index;
    };
  } );
  return checkedIndex[0];
};

function changeSlide() {
  const checkedIndex = selectCheckedControl();

  setTimeout( () => {
    $('.slides_wrap').css({
      'transform': 'translateX(' + (checkedIndex * -100) + '%)'
    });
  }, 500 );
};

function prevSlide() {
  const checkedIndex = selectCheckedControl();
  const newIndex = checkedIndex === 0 ? $('.control').length - 1 : checkedIndex - 1;
  
  $('.control')[newIndex].checked = true;

  changeSlide();
};

function nextSlide() {
  const checkedIndex = selectCheckedControl();
  const newIndex = checkedIndex === $('.control').length - 1 ? 0 : checkedIndex + 1;

  $('.control')[newIndex].checked = true;

  changeSlide();  
}

function slider() {
  setTimeout(() => {
    nextSlide();
    slider();
  }, slideTimer);
};

function sliderHeight() {
  let heightDoc = document.documentElement.clientHeight;
  $('#slider').css('height', heightDoc + 'px');
}