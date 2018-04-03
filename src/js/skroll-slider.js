
let sliders = document.getElementsByClassName('slider-wrap')
var sliderObjects = []

// CREATE SLIDER OBJECTS
for (var i = 0; i < sliders.length; i++) {
  var slidesWrap = sliders[i].querySelector('.slides')
  var slides = sliders[i].getElementsByClassName('slide-wrap')
  var arrows = sliders[i].getElementsByClassName('slide-arrow')
  var num = slides.length
  var duration = (sliders[i].dataset.duration.length ? sliders[i].dataset.duration : 5000)
  var slider = {slider: sliders[i], slidesWrap: slidesWrap, paused: false, slideIndex: 0, slides: slides, arrows: arrows, num: num, height: 'auto', duration: duration}
  sliderObjects[i] = slider
  sliderInit(sliderObjects[i])
  autoSlide(sliderObjects[i])
}

function sliderInit (e) {
  // SET HEIGHT
  e.height = 0
  // SET WIDTH
  if (e.slider.classList.contains('pan')) {
    e.slidesWrap.style.width = e.num + '00%'
  }
  // SET FIRST SLIDE AS CURRENT
  e.slides[0].classList.add('current-slide')
  e.indicators = {}
  for (let i = 0; i < e.num; i++) {
    e.slides[i].setAttribute('data-slide', i)
    // CREATE INDICATORS
    var indicator = document.createElement("SPAN");
    if (i===0) {
      indicator.setAttribute("class","slide-indicator current-indicator")
    } else {
      indicator.setAttribute("class","slide-indicator")
    }
    indicator.setAttribute("data-slide",i)
    e.slider.children[1].appendChild(indicator)
    e.indicators[i] = indicator
    // CALCULATE HEIGHT BASED ON TEXT
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
      e.prevSlideIndex = e.slideIndex
      if (el.target.classList.contains('arrow-left')) {
        var num = e.slideIndex-1
      } else if (el.target.classList.contains('arrow-right')) {
        var num = e.slideIndex+1
      }
      updateIndex(e,num)
      clearTimeouts(e)
      e.paused = true
      sliderChange(e)
    })
  }

  // BIND INDICATOR CLICK FUNCTIONS
  for (i = 0; i < e.num; i++) {
    e.indicators[i].addEventListener('click', function (el) {
      clearTimeouts(e)
      updateIndex(e,Number(el.target.dataset.slide))
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
    e.slider.classList.remove('forwards', 'backwards')
    for (var i = 0; i < e.num; i++) {
      e.slides[i].classList.remove('current-slide', 'prev-slide', 'next-slide')
      if (e.num) { e.indicators[i].classList.remove('current-indicator') }
    }
    // add direction class
    if (e.prevSlideIndex < e.slideIndex) {
      e.slider.classList.add('forwards')
    } else {
      e.slider.classList.add('backwards')
    }

    e.slider.classList.add('animating')

    // add previous slide
    e.prev.classList.add('prev-slide')

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
      e.slidesWrap.style.transform = 'translateX(-' + e.slideIndex / e.num * 100 + '00%)'
    }

    e.intervalPrevAnim = setTimeout(function () {
      e.slider.classList.remove('animating')
    }, 1500)
    if (e.paused === false) {
      autoSlide(e)
    }
  }
}

function updateIndex (e,n) {
  e.prevSlideIndex = e.slideIndex
  e.slideIndex = n
}

function autoSlide (e) {
  e.intervalSlideChange = setTimeout(function () {
    var num = e.slideIndex+1
    updateIndex(e,num)
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
