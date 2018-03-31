
let sliders = document.getElementsByClassName('slider-wrap')
var sliderObjects = []

// CREATE SLIDER OBJECTS
for (var i = 0; i < sliders.length; i++) {
  var slides = sliders[i].getElementsByClassName('slide-wrap')
  var indicators = sliders[i].getElementsByClassName('slide-indicator')
  var arrows = sliders[i].getElementsByClassName('slide-arrow')
  var num = slides.length
  var duration = (sliders[i].dataset.duration.length ? sliders[i].dataset.duration : 5000)
  var slider = {slider: sliders[i], paused: false, slideIndex: 0, slides: slides, indicators: indicators, arrows: arrows, num: num, height: 'auto', duration: duration}
  sliderObjects[i] = slider
  sliderInit(sliderObjects[i])
  autoSlide(sliderObjects[i])
}

function sliderInit (e) {
  // SET HEIGHT
  e.height = 0
  for (let i = 0; i < e.num; i++) {
    let textHeight = e.slides[i].getElementsByClassName('slide-text')[0].offsetHeight
    if (e.height < textHeight) {
      e.height = textHeight
    }
  }
  e.height += 250
  document.styleSheets[0].insertRule('#' + e.slider.id + ':not(#top-content) {min-height: ' + e.height + 'px;}')

  // BIND ARROW CLICK FUNCTIONS
  for (var i = 0; i < e.arrows.length; i++) {
    e.arrows[i].addEventListener('click', function (el) {
      if (el.target.classList.contains('arrow-left')) {
        e.slideIndex--
      } else if (el.target.classList.contains('arrow-right')) {
        e.slideIndex++
      }
      clearTimeouts(e)
      e.paused = true
      sliderChange(e)
    })
  }

  // BIND INDICATOR CLICK FUNCTIONS
  for (i = 0; i < e.num; i++) {
    e.indicators[i].addEventListener('click', function (el) {
      clearTimeouts(e)
      e.slideIndex = Number(el.target.dataset.slide)
      e.paused = true
      if (el.target.classList.contains('current-indicator') === false) {
        sliderChange(e)
      }
    })
  }
}

function sliderChange (e) {
  e.prev = e.slider.getElementsByClassName('current-slide')[0]

  // CALCULATE SLIDE INDEX
  if (e.slideIndex < 0) {
    e.slideIndex = e.num - 1
    if (e.num) { e.indicators[0].parentElement.classList.add('transition-last') }
    setTimeout(function () {
      if (e.num) { e.indicators[0].parentElement.classList.remove('transition-last') }
    }, 1000)
  } else if (e.slideIndex > e.num - 1) {
    e.slideIndex = 0
    if (e.num) { e.indicators[0].parentElement.classList.add('transition-first') }
    setTimeout(function () {
      if (e.num) { e.indicators[0].parentElement.classList.remove('transition-first') }
    }, 1000)
  }

  // SET CLASSES BASED ON SLIDE INDEX
  if (e.num > 1) {
    // remove current styles
    for (var i = 0; i < e.num; i++) {
      e.slides[i].classList.remove('current-slide', 'prev-slide', 'next-slide')
      if (e.num) { e.indicators[i].classList.remove('current-indicator') }
    }
    // add previous slide
    e.prev.classList.add('prev-slide', 'prev-anim')

    if (e.slideIndex === e.num - 1) {
      e.slides[0].classList.add('next-slide')
    } else {
      if (e.slides[e.slideIndex + 1]) {
        e.slides[e.slideIndex + 1].classList.add('next-slide')
      }
    }

    e.slides[e.slideIndex].classList.add('current-slide')
    if (e.num) { e.indicators[e.slideIndex].classList.add('current-indicator') }

    if (e.slider.classList.contains('pan')) {
      e.slider.getElementsByClassName('slider')[0].style.transform = 'translateX(-' + e.slideIndex + '00vw)'
    }

    e.intervalPrevAnim = setTimeout(function () {
      for (var i = 0; i < e.num; i++) {
        e.slides[i].classList.remove('prev-anim')
      }
    }, 2000)
    if (e.paused === false) {
      autoSlide(e)
    }
  }
}

function autoSlide (e) {
  e.intervalSlideChange = setTimeout(function () {
    e.slideIndex++
    sliderChange(e)
  }, e.duration)
}

function clearTimeouts (e) {
  clearTimeout(e.intervalSlideChange)
  clearTimeout(e.intervalPrevAnim)
  for (var i = 0; i < e.num; i++) {
    e.slides[i].classList.remove('prev-anim')
  }
}
