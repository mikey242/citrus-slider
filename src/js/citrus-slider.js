/*
       .__  __                       
  ____ |__|/  |________ __ __  ______
_/ ___\|  \   __\_  __ \  |  \/  ___/
\  \___|  ||  |  |  | \/  |  /\___ \ 
 \___  >__||__|  |__|  |____//____  >
     \/                           \/ 
 Version: 1.0.7
  Author: Michael Iseard
 Website: https://citrus.iseardmedia.com
    Docs: https://gitea.iseardmedia.com/michael/citrus-Slider
    Repo: https://gitea.iseardmedia.com/michael/citrus-Slider
 */

"use strict"

// CREATE SLIDER OBJECTS
const citrus = (function () {

  const sliderObjects = []

  class Slider {
    constructor(el) {
      this.sliderContainer = el
      this.slideText = getContent(el.children)
      this.num = el.children.length
      this.imgUrls = getImages(el)
      this.settings = {
        // default settings
        animateText: true,
        animationDuration: 0.8,
        autoHeight: false,
        autoPause: true,
        effect: false,
        height: "100%",
        paused: false,
        showArrows: true,
        showIndicators: true,
        slideDuration: 5000,
        slideIndex: 0,
        slideTransition: "pan",
        width: "100%"
      }
    }
  }

  // OBJECT PUBLIC FUNCTIONS
  Slider.prototype.goToSlide = function (slide) {
    this.settings.slideIndex = slide
    sliderChange(this)
  }
  Slider.prototype.stop = function () {
    this.settings.paused = true
    clearTimeout(this.intervalSlideChange)
  }
  Slider.prototype.play = function () {
    this.settings.paused = false
    autoSlide(this)
  }
  Slider.prototype.prevSlide = function () {
    this.settings.slideIndex--
      sliderChange(this)
  }
  Slider.prototype.nextSlide = function () {
    this.settings.slideIndex++
      sliderChange(this)
  }
  Slider.prototype.reset = function () {
    window.removeEventListener('scroll', updatePosition)
    clearTimeout(this.intervalSlideChange)
    sliderInit(this)
    autoSlide(this)
  }

  // CREATE INDIVIDUAL SLIDER OBJECTS FROM CONSTRUCTOR
  let sliders = Array.from(document.getElementsByClassName('citrus-slider'))
  sliders.forEach(function (slider, i) {
    sliderObjects[i] = new Slider(sliders[i])
    let e = sliderObjects[i]
    getSettings(e, sliderInit)
    autoSlide(e)
  })

  // SETS CLASSES AND SIZE SLIDER CONTAINER
  function sliderInit(e) {
    let height = e.settings.height
    if (e.settings.autoHeight === true) {
      height = autoHeight(e)
    }
    e.sliderContainer.setAttribute("style", "width:" + e.settings.width + "; height:" + height)
    e.sliderHeight = e.sliderContainer.offsetHeight
    e.sliderContainer.setAttribute("class", "citrus-slider")
    // set container classes
    e.sliderContainer.classList.add("transition-" + e.settings.slideTransition)
    if (e.settings.effect) {
      e.sliderContainer.classList.add("effect-" + e.settings.effect)
    }
    if (e.settings.animateText) {
      e.sliderContainer.classList.add('animate-text')
    }
    sliderConstruct(e)
  }

  // CONSTRUCT DOM ELEMENTS
  function sliderConstruct(e) {
    let fragment = document.createDocumentFragment()

    // create arrows
    let arrowsContainer = document.createElement("DIV")
    if (e.settings.showArrows == false) {
      arrowsContainer.setAttribute("class", "citrus-arrows hidden")
    } else {
      arrowsContainer.setAttribute("class", "citrus-arrows")
    }
    let arrowLeft = document.createElement("DIV")
    arrowLeft.setAttribute("class", "slide-arrow left-arrow")
    let arrowRight = document.createElement("DIV")
    arrowRight.setAttribute("class", "slide-arrow right-arrow")
    arrowsContainer.appendChild(arrowLeft)
    arrowsContainer.appendChild(arrowRight)
    fragment.appendChild(arrowsContainer)
    e.arrows = [arrowLeft, arrowRight]

    // create slides
    let slidesContainer = document.createElement("DIV")
    e.slides = slidesContainer
    slidesContainer.setAttribute("class", "citrus-slides")
    slidesContainer.setAttribute("style", "animation-duration:" + e.settings.animationDuration + "s;" + "transition-duration:" + e.settings.animationDuration + "s;")
    if (e.settings.slideTransition === "pan") {
      slidesContainer.style.width = e.num + '00%'
    }
    // set container width
    if (e.settings.slideTransition === "pan") {
      slidesContainer.style.width = e.num + '00%'
      slidesContainer.style.transform = 'translateX(-' + e.settings.slideIndex / e.num * 100 + '%)'
    }

    for (let i = 0; i < e.num; i++) {
      let slideWrap = document.createElement("DIV")
      if (i === e.settings.slideIndex) {
        slideWrap.setAttribute("class", "slide-wrap current-slide")
      } else {
        slideWrap.setAttribute("class", "slide-wrap")
      }
      let slide = document.createElement("DIV")
      slide.setAttribute("class", "slide")
      let slideText = e.slideText[i]
      slideText.setAttribute("class", "slide-text")
      slide.style.backgroundImage = "url(" + e.imgUrls[i] + ")"
      slideWrap.appendChild(slide)
      slideWrap.appendChild(slideText)
      slidesContainer.appendChild(slideWrap)
    }
    fragment.appendChild(slidesContainer)

    // create indicator elements
    e.indicators = []
    let indicatorsContainer = document.createElement("DIV")
    if (e.settings.showIndicators == false) {
      indicatorsContainer.setAttribute("class", "citrus-indicators hidden")
    } else {
      indicatorsContainer.setAttribute("class", "citrus-indicators")
    }
    for (let i = 0; i < e.num; i++) {
      let indicator = document.createElement("SPAN")
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

    // clear innerHTML of original slides container and append fragment
    e.sliderContainer.innerHTML = ""
    e.sliderContainer.appendChild(fragment)
    if (e.settings.effect === "parallax") {
      parallaxEffect(e)
    }
    setBindings(e)
  }

  // CREATE BINDINGS FOR ARROWS AND INDICATORS
  function setBindings(e) {

    // bind arrow click functions
    for (let arrow of e.arrows) {
      arrow.addEventListener('click', function (el) {
        if (e.settings.autoPause) {
          e.settings.paused = true
        }
        if (e.sliderContainer.classList.contains("animating")) {
          return
        }
        e.settings.prevIndex = e.settings.slideIndex
        if (el.target.classList.contains('left-arrow')) {
          e.settings.slideIndex--
        } else if (el.target.classList.contains('right-arrow')) {
          e.settings.slideIndex++
        }
        sliderChange(e)
      })
    }

    // bind indicator click functions
    for (let indicator of e.indicators) {
      indicator.addEventListener('click', function (el) {
        if (e.settings.autoPause) {
          e.settings.paused = true
        }
        if (e.sliderContainer.classList.contains("animating")) {
          return
        }
        if (el.target.classList.contains('current-indicator') === false) {
          e.settings.prevIndex = e.settings.slideIndex
          e.settings.slideIndex = Number(el.target.dataset.slide)
          sliderChange(e)
        }
      })
    }
  }

  // UPDATES SLIDE CLASSES BASED ON PREVIOUS AND CURRENT INDEXES 
  function sliderChange(e) {
    clearTimeout(e.intervalSlideChange)
    e.prev = e.sliderContainer.getElementsByClassName('current-slide')[0]

    // calculate slide index
    if (e.settings.slideIndex < 0) {
      e.settings.slideIndex = e.num - 1
      if (e.num) {
        e.indicators[0].parentElement.classList.add('transition-last')
        setTimeout(function () {
          e.indicators[0].parentElement.classList.remove('transition-last')
        }, 1000)
      }
    } else if (e.settings.slideIndex > e.num - 1) {
      e.settings.slideIndex = 0
      if (e.num) {
        e.indicators[0].parentElement.classList.add('transition-first')
        setTimeout(function () {
          e.indicators[0].parentElement.classList.remove('transition-first')
        }, 1000)
      }
    }

    // set classes based on slide index
    if (e.num > 1) {
      // remove current styles
      e.sliderContainer.classList.remove('forwards', 'backwards')
      for (let i = 0; i < e.num; i++) {
        e.slides.children[i].classList.remove('current-slide', 'prev-slide', 'next-slide')
        if (e.num) {
          e.indicators[i].classList.remove('current-indicator')
        }
      }
      // add direction class
      if (e.settings.prevIndex < e.settings.slideIndex) {
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
      }, e.settings.animationDuration * 1000)
      autoSlide(e)
    }
  }

  // AUTOMATIC SLIDE CHANGING BASED ON TIMING IN SETTINGS
  function autoSlide(e) {
    if (e.settings.paused === false) {
      e.intervalSlideChange = setTimeout(function () {
        e.settings.prevIndex = e.settings.slideIndex
        e.settings.slideIndex++
          sliderChange(e)
      }, e.settings.slideDuration)
    }
  }

  // PARALLAX EFFECT
  function parallaxEffect(e) {
    updatePosition(e)
    window.addEventListener('scroll', function () {
      if (e.settings.effect === "parallax") {
        updatePosition(e)
      }
    })
  }

  function updatePosition(e) {
    let windowHeight = window.innerHeight
    if (isScrolledIntoView(e.sliderContainer, true, 0)) {
      let offset = (e.sliderContainer.getBoundingClientRect().top / windowHeight) * (e.sliderHeight * 0.3)
      for (let i = 0; i < e.num; i++) {
        e.slides.children[i].children[0].style.backgroundPosition = 'center calc(50% - ' + (offset) + 'px)'
      }
    }
  }

  // ----------HELPER FUNCTIONS----------\\

  // GET SLIDES INNER CONTENT
  function getContent(e) {
    let slideText = {}
    for (let i = 0; i < e.length; i++) {
      slideText[i] = e[i]
    }
    return slideText
  }

  // GET IMAGE URLS FROM SLIDES
  function getImages(e) {
    let urls = Array.from(e.children).map(e => e.getElementsByTagName('img')[0].src)
    let img = e.getElementsByTagName("img")
    while (img[0]) {
      img[0].remove()
    }
    return urls
  }

  // CALCULATE HEIGHT OF GIVEN SLIDER ELEMENT
  function autoHeight(e) {
    let height = 0
    for (let i = 0; i < e.num; i++) {
      let textHeight = e.slideText[i].offsetHeight
      if (height < textHeight) {
        height = textHeight
      }
    }
    height += 250
    return height + "px"
  }

  // GET SETTINGS FROM DATA ATTRIBUTE
  function getSettings(e, cb) {
    // get settings from data attribute
    if (e.sliderContainer.hasAttribute('data-citrus')) {
      let settings = JSON.parse(e.sliderContainer.dataset.citrus)
      // update object
      for (const key of Object.keys(settings)) {
        e.settings[key] = settings[key]
      }
      e.sliderContainer.removeAttribute('data-citrus')
      if (e.settings.slideIndex > e.num || e.settings.slideIndex <= 0) {
        e.settings.slideIndex = 0
      } else {
        e.settings.slideIndex--
      }
    }
    if (typeof cb === "function") {
      cb(e)
    }
  }

  // CHECK IF SLIDER IN VIEW
  function isScrolledIntoView(el, isPartial, offset) {
    var isVisible
    var elemTop = el.getBoundingClientRect().top + offset
    var elemBottom = el.getBoundingClientRect().bottom - offset
    // Only completely visible elements return true:
    if (isPartial === true) {
      // Partially visible elements return true:
      isVisible = elemTop < window.innerHeight && elemBottom >= 0
    } else {
      isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight)
    }
    return isVisible
  }

  // MAKE SLIDEROBJECTS PUBLIC VIA citrusSliders
  return sliderObjects
})()