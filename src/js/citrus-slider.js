/*
       .__  __                       
  ____ |__|/  |________ __ __  ______
_/ ___\|  \   __\_  __ \  |  \/  ___/
\  \___|  ||  |  |  | \/  |  /\___ \ 
 \___  >__||__|  |__|  |____//____  >
     \/                           \/ 
 Version: 1.0.6
  Author: Michael Iseard
 Website: https://citrus.iseardmedia.com
    Docs: https://gitea.iseardmedia.com/michael/citrus-Slider
    Repo: https://gitea.iseardmedia.com/michael/citrus-Slider
 */

"use strict"

// CREATE SLIDER OBJECTS
var getSliders = (function () {

  var sliderObjects = []

  var Slider = function (el) {
    this.sliderContainer = el
    this.slideText = getContent(el.children)
    this.num = el.children.length
    this.imgUrls = getImages(el)
    this.settings = {
      // default settings
      width: "100%",
      height: "100%",
      autoHeight: false,
      effect: true,
      effectType: 'zoom',
      animateText: true,
      showIndicators: true,
      showArrows: true,
      paused: false,
      autoPause: true,
      slideIndex: 0,
      slideDuration: 5000,
      slideTransition: "pan"
    }
    // public function
    this.reset = function () {
      sliderInit(this)
      clearTimeouts(this)
      autoSlide(this)
    }
  }

  let sliders = document.getElementsByClassName('citrus-slider')
  for (var i = 0; i < sliders.length; i++) {
    sliderObjects[i] = new Slider(sliders[i])
    var e = sliderObjects[i]
    getSettings(e, sliderInit)
    autoSlide(e)
  }

  // GET SETTINGS FROM DATA ATTRIBUTE
  function getSettings(e, cb) {
    // get settings from data attribute
    if (e.sliderContainer.hasAttribute('data-citrus')) {
      var settings = JSON.parse(e.sliderContainer.dataset.citrus)
      // update object
      for (const key of Object.keys(settings)) {
        e.settings[key] = settings[key]
      }
      e.sliderContainer.removeAttribute('data-citrus')
      if (e.settings.slideIndex > e.num || e.settings.slideIndex <= 0) {
        e.settings.slideIndex = 0;
      } else {
        e.settings.slideIndex--
      }
    }
    if (typeof cb === "function") {
      cb(e)
    }
  }

  // GET SLIDES INNER CONTENT
  function getContent(el) {
    var slideText = {}
    for (let n = 0; n < el.length; n++) {
      slideText[n] = el[n]
    }
    return slideText
  }

  // GET IMAGE URLS FROM SLIDES
  function getImages(el) {
    var urls = Array.from(el.children).map(function (e, i) {
      var src = e.getElementsByTagName('img')[0].src
      e.getElementsByTagName('img')[0].remove()
      return src
    })
    return urls
  }

  // CALCULATE HEIGHT OF GIVEN SLIDER ELEMENT
  function autoHeight(e) {
    var height = 0
    for (let i = 0; i < e.num; i++) {
      let textHeight = e.slideText[i].offsetHeight
      if (height < textHeight) {
        height = textHeight
      }
    }
    height += 250
    return height + "px"
  }

  // SETS CLASSES AND SIZE SLIDER CONTAINER
  function sliderInit(e) {
    var height = e.settings.height
    if (e.settings.autoHeight === true) {
      height = autoHeight(e)
    }
    e.sliderContainer.setAttribute("style", "width:" + e.settings.width + "; height:" + height)
    e.sliderContainer.setAttribute("class", "citrus-slider")
    // set container classes
    e.sliderContainer.classList.add("transition-" + e.settings.slideTransition)
    if (e.settings.effect) {
      e.sliderContainer.classList.add("effect-" + e.settings.effectType)
    }
    if (e.settings.animateText) {
      e.sliderContainer.classList.add('animate-text')
    }
    sliderConstruct(e)
  }

  // CONSTRUCT DOM ELEMENTS
  function sliderConstruct(e) {
    var fragment = document.createDocumentFragment();

    // create arrows
    var arrowContainer = document.createElement("DIV")
    if (e.settings.showArrows == false) {
      arrowContainer.setAttribute("class", "citrus-arrows hidden")
    } else {
      arrowContainer.setAttribute("class", "citrus-arrows")
    }
    var arrowLeft = document.createElement("DIV")
    arrowLeft.setAttribute("class", "slide-arrow left-arrow")
    var arrowRight = document.createElement("DIV")
    arrowRight.setAttribute("class", "slide-arrow right-arrow")
    arrowContainer.appendChild(arrowLeft)
    arrowContainer.appendChild(arrowRight)
    fragment.appendChild(arrowContainer)
    e.arrows = [arrowLeft, arrowRight]

    // create slides
    var slides = document.createElement("DIV");
    e.slides = slides
    slides.classList.add("citrus-slides")
    if (e.settings.slideTransition === "pan") {
      slides.style.width = e.num + '00%'
    }
    // set container width
    if (e.settings.slideTransition === "pan") {
      slides.style.width = e.num + '00%'
      slides.style.transform = 'translateX(-' + e.settings.slideIndex / e.num * 100 + '%)'
    }

    var slideFragment = {}
    slideFragment.slide = null
    slideFragment.slideWrap = null

    for (let i = 0; i < e.num; i++) {
      slideFragment.slideWrap = document.createElement("DIV")
      if (i === e.settings.slideIndex) {
        slideFragment.slideWrap.setAttribute("class", "slide-wrap current-slide")
      } else {
        slideFragment.slideWrap.setAttribute("class", "slide-wrap")
      }
      slideFragment.slide = document.createElement("DIV")
      slideFragment.slide.setAttribute("class", "slide")
      slideFragment.slideText = e.slideText[i]
      slideFragment.slideText.setAttribute("class", "slide-text")
      slideFragment.slide.style.backgroundImage = "url(" + e.imgUrls[i] + ")"
      slideFragment.slideWrap.appendChild(slideFragment.slide)
      slideFragment.slideWrap.appendChild(slideFragment.slideText)
      slides.appendChild(slideFragment.slideWrap)
    }
    fragment.appendChild(slides)

    // create indicator elements
    e.indicators = {}
    var indicatorsContainer = document.createElement("DIV")
    if (e.settings.showIndicators == false) {
      indicatorsContainer.setAttribute("class", "citrus-indicators hidden")
    } else {
      indicatorsContainer.setAttribute("class", "citrus-indicators")
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

    e.sliderContainer.innerHTML = ""
    e.sliderContainer.appendChild(fragment)
    setBindings(e)
  }

  // CREATE BINDINGS FOR ARROWS AND INDICATORS
  function setBindings(e) {

    // bind arrow click functions
    for (var i = 0; i < e.arrows.length; i++) {
      e.arrows[i].addEventListener('click', function (el) {
        if (e.settings.autoPause) {
          e.settings.paused = true
        }
        if (e.sliderContainer.classList.contains("animating")) {
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
        sliderChange(e, autoSlide)
      })
    }

    // bind indicator click functions
    for (i = 0; i < e.num; i++) {
      e.indicators[i].addEventListener('click', function (el) {
        if (e.settings.autoPause) {
          e.settings.paused = true
        }
        if (e.sliderContainer.classList.contains("animating")) {
          return;
        }
        if (el.target.classList.contains('current-indicator') === false) {
          clearTimeouts(e)
          updateIndex(e, Number(el.target.dataset.slide))
          sliderChange(e, autoSlide)
        }
      })
    }
  }

  // UPDATES SLIDE CLASSES BASED ON PREVIOUS AND CURRENT INDEXES 
  function sliderChange(e, cb) {
    e.prev = e.sliderContainer.getElementsByClassName('current-slide')[0]

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
      e.sliderContainer.classList.remove('forwards', 'backwards')
      for (var i = 0; i < e.num; i++) {
        e.slides.children[i].classList.remove('current-slide', 'prev-slide', 'next-slide')
        if (e.num) {
          e.indicators[i].classList.remove('current-indicator')
        }
      }
      // add direction class
      if (e.prevSlideIndex < e.settings.slideIndex) {
        e.sliderContainer.classList.add('forwards')
      } else {
        e.sliderContainer.classList.add('backwards')
      }

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
      if (e.settings.slideTransition === "pan") {
        e.sliderContainer.children[1].style.transform = 'translateX(-' + e.settings.slideIndex / e.num * 100 + '%)'
      }

      // add and remove animating class to slider container
      e.sliderContainer.classList.add('animating')
      e.intervalPrevAnim = setTimeout(function () {
        e.sliderContainer.classList.remove('animating')
      }, 1000)

      if (typeof cb === "function") {
        cb(e)
      }
    }
  }

  // UPDATE CURRENT AND PREVIOUS INDEX
  function updateIndex(e, n) {
    e.prevSlideIndex = e.settings.slideIndex
    e.settings.slideIndex = n
  }

  // AUTOMATIC SLIDE CHANGING BASED ON TIMING IN SETTINGS
  function autoSlide(e) {
    if (e.settings.paused === false) {
      e.intervalSlideChange = setTimeout(function () {
        var num = e.settings.slideIndex + 1
        updateIndex(e, num)
        sliderChange(e, autoSlide)
      }, e.settings.slideDuration)
    }
  }

  // CLEAR TIMEOUTS USED FOR AUTOSLIDE
  function clearTimeouts(e) {
    clearTimeout(e.intervalSlideChange)
    clearTimeout(e.intervalPrevAnim)
    for (var i = 0; i < e.num; i++) {
      e.sliderContainer.classList.remove('animating')
    }
  }

  // MAKE SLIDEROBJECTS PUBLIC VIA GETSLIDERS
  return sliderObjects
})()