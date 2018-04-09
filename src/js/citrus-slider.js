/*
       .__  __                       
  ____ |__|/  |________ __ __  ______
_/ ___\|  \   __\_  __ \  |  \/  ___/
\  \___|  ||  |  |  | \/  |  /\___ \ 
 \___  >__||__|  |__|  |____//____  >
     \/                           \/ 
 Version: 1.0.3
  Author: Michael Iseard
 Website: https://iseardmedia.com
    Docs: https://gitea.iseardmedia.com/michael/citrus-Slider
    Repo: https://gitea.iseardmedia.com/michael/citrus-Slider
 */

let sliders = document.getElementsByClassName('citrus-slider')
var sliderObjects = []

// CREATE SLIDER OBJECTS
for (var i = 0; i < sliders.length; i++) {
  var el = sliders[i]
  var num = el.children.length
  var slides = el.children
  // var imgUrls = Array.from(el.getElementsByTagName('img')).map(function (e, i) {
  //   e.remove()
  //   return e.src
  // })
  var imgUrls = Array.from(slides).map(function (e, i) {
      var src = e.getElementsByTagName('img')[0].src
      e.getElementsByTagName('img')[0].remove()
      return src
  })

  var slideText = {}
  for (let n = 0; n < slides.length; n++) {    
    slideText[n] = slides[n]
  }
  // set defaults
  sliderObjects[i] = {
    slider: el,
    slideText: slideText,
    imgUrls: imgUrls,
    num: num,
    settings: {
      effect: 'zoom',
      animateText: true,
      showIndicators: true,
      showArrows: true,
      paused: false,
      autoPause: false,
      slideIndex: 1,
      duration: 5000,
      transition: "pan"
    }
  }
  // get settings from data attribute
  if (el.hasAttribute('data-citrus')){
    var settings = JSON.parse(el.dataset.citrus)
    // update object
    for (const key of Object.keys(settings)) {
      sliderObjects[i].settings[key] = settings[key]
    }
  }
  if (sliderObjects[i].settings.slideIndex > sliderObjects[i].num || sliderObjects[i].settings.slideIndex <= 0) {
    sliderObjects[i].settings.slideIndex = 0;
  } else {
    sliderObjects[i].settings.slideIndex--
  }
  sliderConstruct(sliderObjects[i])
}

// CONSTRUCT DOM ELEMENTS
function sliderConstruct(e) {
  
  // set container classes
  e.slider.classList.add(e.settings.transition)
  if (e.settings.effect) {
    e.slider.classList.add(e.settings.effect+"-effect")
  }
  if (e.settings.animateText) {
    e.slider.classList.add('animate-text')
  }
  
  var fragment = document.createDocumentFragment();

  // create arrows
  var arrowContainer = document.createElement("DIV")
  if (e.settings.showArrows==false) {
    arrowContainer.setAttribute("class", "arrows hidden")
  } else {
    arrowContainer.setAttribute("class", "arrows")
  }
  var arrowLeft = document.createElement("DIV")
  arrowLeft.setAttribute("class", "slide-arrow left-arrow")
  var arrowRight = document.createElement("DIV")
  arrowRight.setAttribute("class", "slide-arrow right-arrow")
  arrowContainer.appendChild(arrowLeft)
  arrowContainer.appendChild(arrowRight)
  fragment.prepend(arrowContainer)
  e.arrows = [arrowLeft, arrowRight]

  // create slides
  var slides = document.createElement("DIV");
  e.slides = slides
  slides.classList.add("slides")
  if (e.settings.transition==="pan") {
    slides.style.width = e.num + '00%'
  }
  // set container width
  if (e.settings.transition==="pan") {
    slides.style.width = e.num + '00%'
    slides.style.transform = 'translateX(-' + e.settings.slideIndex / e.num * 100 + '%)'
  }

  var slideFragment = {}
  slideFragment.slide = null
  slideFragment.slideWrap = null

  for (let i = 0; i < e.num; i++) {
    slideFragment.slideWrap = document.createElement("DIV")
    if (i===e.settings.slideIndex) {
      slideFragment.slideWrap.setAttribute("class", "slide-wrap current-slide")
    } else {
      slideFragment.slideWrap.setAttribute("class", "slide-wrap")
    }
    slideFragment.slide = document.createElement("DIV")
    slideFragment.slide.setAttribute("class","slide")
    slideFragment.slideText = e.slideText[i]
    slideFragment.slideText.setAttribute("class","slide-text")
    slideFragment.slide.style.backgroundImage = "url(" + e.imgUrls[i] + ")"
    slideFragment.slideWrap.appendChild(slideFragment.slide)
    slideFragment.slideWrap.appendChild(slideFragment.slideText)
    slides.appendChild(slideFragment.slideWrap)
  }
  fragment.appendChild(slides)

  // create indicator elements
  e.indicators = {}
  var indicatorsContainer = document.createElement("DIV")
  if (e.settings.showIndicators==false) {
    indicatorsContainer.setAttribute("class", "indicators hidden")
  } else {
    indicatorsContainer.setAttribute("class", "indicators")
  }
  for (let i = 0; i < e.num; i++) {
    var indicator = document.createElement("SPAN");
    if (i === e.settings.slideIndex) {
      indicator.setAttribute("class", "slide-indicator current-indicator")
    } else {
      indicator.setAttribute("class", "slide-indicator")
    }
    indicator.setAttribute("data-slide", i)
    indicatorsContainer.appendChild(indicator)
    fragment.appendChild(indicatorsContainer)
    e.indicators[i] = indicator
  }

  e.slider.appendChild(fragment)
  setBindings(e)
  autoSlide(sliderObjects[i])

}

// CREATE BINDINGS FOR ARROWS AND INDICATORS
function setBindings(e) {

  // bind arrow click functions
  for (var i = 0; i < e.arrows.length; i++) {
    e.arrows[i].addEventListener('click', function (el) {
      if (e.slider.classList.contains("animating")) {
        return;
      }
      e.prevSlideIndex = e.settings.slideIndex
      if (el.target.classList.contains('left-arrow')) {
        var num = e.settings.slideIndex - 1
      } else if (el.target.classList.contains('right-arrow')) {
        var num = e.settings.slideIndex + 1
      }
      updateIndex(e, num)
      clearTimeouts(e)
      sliderChange(e)
    })
  }

  // bind indicator click functions
  for (i = 0; i < e.num; i++) {
    e.indicators[i].addEventListener('click', function (el) {
      if (e.slider.classList.contains("animating")) {
        return;
      }
      if (el.target.classList.contains('current-indicator') === false) {
        clearTimeouts(e)
        updateIndex(e, Number(el.target.dataset.slide))
        sliderChange(e)
      }
    })
  }
}

function sliderChange(e) {
  e.prev = e.slider.getElementsByClassName('current-slide')[0]

  // calculate slide index
  if (e.settings.slideIndex < 0) {
    e.settings.slideIndex = e.num - 1
    if (e.num) {
      e.indicators[0].parentElement.classList.add('transition-last')
    }
    setTimeout(function () {
      if (e.num) {
        e.indicators[0].parentElement.classList.remove('transition-last')
      }
    }, 1000)
  } else if (e.settings.slideIndex > e.num - 1) {
    e.settings.slideIndex = 0
    if (e.num) {
      e.indicators[0].parentElement.classList.add('transition-first')
    }
    setTimeout(function () {
      if (e.num) {
        e.indicators[0].parentElement.classList.remove('transition-first')
      }
    }, 1000)
  }

  // set classes based on slide index
  if (e.num > 1) {
    // remove current styles
    e.slider.classList.remove('forwards', 'backwards')
    for (var i = 0; i < e.num; i++) {
      e.slides.children[i].classList.remove('current-slide', 'prev-slide', 'next-slide')
      if (e.num) {
        e.indicators[i].classList.remove('current-indicator')
      }
    }
    // add direction class
    if (e.prevSlideIndex < e.settings.slideIndex) {
      e.slider.classList.add('forwards')
    } else {
      e.slider.classList.add('backwards')
    }

    e.slider.classList.add('animating')

    // add previous slide
    e.prev.classList.add('prev-slide')

    if (e.settings.slideIndex === e.num - 1) {
      e.slides.children[0].classList.add('next-slide')
    } else {
      if (e.slides.children[e.settings.slideIndex + 1]) {
        e.slides.children[e.settings.slideIndex + 1].classList.add('next-slide')
      }
    }

    e.slides.children[e.settings.slideIndex].classList.add('current-slide')
    if (e.num) {
      e.indicators[e.settings.slideIndex].classList.add('current-indicator')
    }
    if (e.settings.transition === "pan") {
      e.slider.children[1].style.transform = 'translateX(-' + e.settings.slideIndex / e.num * 100 + '%)'
    }

    e.intervalPrevAnim = setTimeout(function () {
      e.slider.classList.remove('animating')
    }, 1000)
    autoSlide(e)
  }
}

function updateIndex(e, n) {
  e.prevSlideIndex = e.settings.slideIndex
  e.settings.slideIndex = n
}

function autoSlide(e) {
  if (e.settings.paused === false) {
    e.intervalSlideChange = setTimeout(function () {
      var num = e.settings.slideIndex + 1
      updateIndex(e, num)
      sliderChange(e)
    }, e.settings.duration)
  }
}

function clearTimeouts(e) {
  if (e.settings.autoPause) {
    e.settings.paused = true
  }
  clearTimeout(e.intervalSlideChange)
  clearTimeout(e.intervalPrevAnim)
  for (var i = 0; i < e.num; i++) {
    e.slider.classList.remove('animating')
  }
}