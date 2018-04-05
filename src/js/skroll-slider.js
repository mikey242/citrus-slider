
let sliders = document.getElementsByClassName('skroll-slider')
var sliderObjects = []

// CREATE SLIDER OBJECTS
for (var i = 0; i < sliders.length; i++) {
  var el = sliders[i]
  var num = el.children.length
  var slides = el.querySelectorAll('div')
  var imgElements = el.querySelectorAll('img')
  var imgUrls = Array.from(el.querySelectorAll('img')).map(function(e,i) {
    return e.src
  })
  // set defaults
  sliderObjects[i] = {slider: el, img: imgElements, slides: slides, imgUrls: imgUrls, settings:{num: num, zoom: true, paused: false, slideIndex: 0, duration: 5000, transition: "pan"}}
  // get settings from data attribute
  var settings = JSON.parse(el.dataset.skroll)
  // update object
  for (const key of Object.keys(settings)) {
    sliderObjects[i].settings[key] = settings[key]
  }
  sliderConstruct(sliderObjects[i])
  autoSlide(sliderObjects[i])
}

// CONSTRUCT DOM ELEMENTS
function sliderConstruct(e) {

  // set container classes
  e.slider.classList.add((e.settings.zoom ? 'zoom' : null), e.settings.transition)

  var fragment = document.createDocumentFragment();

  // create arrows
  var arrowContainer = document.createElement("DIV")
  arrowContainer.setAttribute("class", "arrows")
  var arrowLeft = document.createElement("DIV")
  arrowLeft.setAttribute("class","slide-arrow left-arrow")
  var arrowRight = document.createElement("DIV")
  arrowRight.setAttribute("class","slide-arrow right-arrow")
  arrowContainer.appendChild(arrowLeft)
  arrowContainer.appendChild(arrowRight)
  fragment.prepend(arrowContainer)
  e.arrows = [arrowLeft,arrowRight]

  // create slide elements
  var slidesContainer = document.createElement("DIV")
  slidesContainer.setAttribute("class", "slides")
  // set container width
  if (e.settings.transition==="pan") {
    slidesContainer.style.width = e.settings.num + '00%'
  }
  for (let i = 0; i < e.settings.num; i++) {
    e.slides[i].removeChild(e.img[i])
    if (i===0) {
      e.slides[i].classList.add('slide-wrap', 'current-slide')
    } else {
      e.slides[i].classList.add('slide-wrap')
    }
    var slideInner = document.createElement("DIV")
    slideInner.style.backgroundImage = "url(" + e.imgUrls[i] + ")"
    slideInner.setAttribute("class", "slide")
    e.slides[i].appendChild(slideInner)
    slidesContainer.appendChild(e.slides[i])
  }
  fragment.appendChild(slidesContainer)
  delete e.img

  // create indicator elements
  e.indicators = {}
  var indicatorsContainer = document.createElement("DIV")
  indicatorsContainer.setAttribute("class", "indicators")
    for (let i = 0; i < e.settings.num; i++) {
    var indicator = document.createElement("SPAN");
    if (i===0) {
      indicator.setAttribute("class","slide-indicator current-indicator")
    } else {
      indicator.setAttribute("class","slide-indicator")
    }
    indicator.setAttribute("data-slide",i)
    indicatorsContainer.appendChild(indicator)
    fragment.appendChild(indicatorsContainer)
    e.indicators[i] = indicator
  }

  // apply changes to dom
  e.slider.appendChild(fragment)
  console.log(e)
  setBindings(e)
}

// CREATE BINDINGS FOR ARROWS AND INDICATORS
function setBindings(e) {

    // bind arrow click functions
    for (var i = 0; i < e.arrows.length; i++) {
      e.arrows[i].addEventListener('click', function (el) {
        e.prevSlideIndex = e.settings.slideIndex
        if (el.target.classList.contains('left-arrow')) {
          var num = e.settings.slideIndex-1
        } else if (el.target.classList.contains('right-arrow')) {
          var num = e.settings.slideIndex+1
        }
        updateIndex(e,num)
        clearTimeouts(e)
        e.settings.paused = true
        sliderChange(e)
      })
    }
  
    // bind indicator click functions
    for (i = 0; i < e.settings.num; i++) {
      e.indicators[i].addEventListener('click', function (el) {
        clearTimeouts(e)
        updateIndex(e,Number(el.target.dataset.slide))
        e.settings.paused = true
        if (el.target.classList.contains('current-indicator') === false) {
          sliderChange(e)
        }
      })
    }
}

// function sliderInit (e) {
//   console.log(e)
//   // SET HEIGHT
//   e.height = 0
//   // SET WIDTH
//   if (e.slider.classList.contains('pan')) {
//     // e.slidesWrap.style.width = e.settings.num + '00%'
//   }
//   // SET FIRST SLIDE AS CURRENT
//   e.slides[0].classList.add('current-slide')
//   e.indicators = {}
//   for (let i = 0; i < e.settings.num; i++) {
//     e.slides[i].setAttribute('data-slide', i)
//     // CREATE INDICATORS
//     var indicator = document.createElement("SPAN");
//     if (i===0) {
//       indicator.setAttribute("class","slide-indicator current-indicator")
//     } else {
//       indicator.setAttribute("class","slide-indicator")
//     }
//     indicator.setAttribute("data-slide",i)
//     e.slider.children[1].appendChild(indicator)
//     e.indicators[i] = indicator
//     // CALCULATE HEIGHT BASED ON TEXT
//     let textHeight = e.slides[i].getElementsByClassName('slide-text')[0].offsetHeight
//     if (e.height < textHeight) {
//       e.height = textHeight
//     }
//   }
//   e.height += 250
//   document.styleSheets[0].insertRule('#' + e.slider.id + ':not(#top-content) {min-height: ' + e.height + 'px;}')

//   // BIND ARROW CLICK FUNCTIONS
//   for (var i = 0; i < e.arrows.length; i++) {
//     e.arrows[i].addEventListener('click', function (el) {
//       e.prevSlideIndex = e.settings.slideIndex
//       if (el.target.classList.contains('arrow-left')) {
//         var num = e.settings.slideIndex-1
//       } else if (el.target.classList.contains('arrow-right')) {
//         var num = e.settings.slideIndex+1
//       }
//       updateIndex(e,num)
//       clearTimeouts(e)
//       e.settings.paused = true
//       sliderChange(e)
//     })
//   }

//   // BIND INDICATOR CLICK FUNCTIONS
//   for (i = 0; i < e.settings.num; i++) {
//     e.indicators[i].addEventListener('click', function (el) {
//       clearTimeouts(e)
//       updateIndex(e,Number(el.target.dataset.slide))
//       e.settings.paused = true
//       if (el.target.classList.contains('current-indicator') === false) {
//         sliderChange(e)
//       }
//     })
//   }
// }

function sliderChange (e) {
  e.prev = e.slider.getElementsByClassName('current-slide')[0]

  // calculate slide index
  if (e.settings.slideIndex < 0) {
    e.settings.slideIndex = e.settings.num - 1
    if (e.settings.num) { e.indicators[0].parentElement.classList.add('transition-last') }
    setTimeout(function () {
      if (e.settings.num) { e.indicators[0].parentElement.classList.remove('transition-last') }
    }, 1000)
  } else if (e.settings.slideIndex > e.settings.num - 1) {
    e.settings.slideIndex = 0
    if (e.settings.num) { e.indicators[0].parentElement.classList.add('transition-first') }
    setTimeout(function () {
      if (e.settings.num) { e.indicators[0].parentElement.classList.remove('transition-first') }
    }, 1000)
  }

  // set classes based on slide index
  if (e.settings.num > 1) {
    // remove current styles
    e.slider.classList.remove('forwards', 'backwards')
    for (var i = 0; i < e.settings.num; i++) {
      e.slides[i].classList.remove('current-slide', 'prev-slide', 'next-slide')
      if (e.settings.num) { e.indicators[i].classList.remove('current-indicator') }
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

    if (e.settings.slideIndex === e.settings.num - 1) {
      e.slides[0].classList.add('next-slide')
    } else {
      if (e.slides[e.settings.slideIndex + 1]) {
        e.slides[e.settings.slideIndex + 1].classList.add('next-slide')
      }
    }

    e.slides[e.settings.slideIndex].classList.add('current-slide')
    if (e.settings.num) { e.indicators[e.settings.slideIndex].classList.add('current-indicator') }
    console.log(e)
    if (e.settings.transition==="pan") {
      e.slider.children[1].style.transform = 'translateX(-' + e.settings.slideIndex / e.settings.num * 100 + '00%)'
    }

    e.intervalPrevAnim = setTimeout(function () {
      e.slider.classList.remove('animating')
    }, 1500)
    if (e.settings.paused === false) {
      autoSlide(e)
    }
  }
}

function updateIndex (e,n) {
  e.prevSlideIndex = e.settings.slideIndex
  e.settings.slideIndex = n
}

function autoSlide (e) {
  e.intervalSlideChange = setTimeout(function () {
    var num = e.settings.slideIndex+1
    updateIndex(e,num)
    sliderChange(e)
  }, e.settings.duration)
}

function clearTimeouts (e) {
  clearTimeout(e.intervalSlideChange)
  clearTimeout(e.intervalPrevAnim)
  for (var i = 0; i < e.settings.num; i++) {
    e.slides[i].classList.remove('prev-anim')
  }
}
