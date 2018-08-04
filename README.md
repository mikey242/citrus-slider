![alt text](https://citrus.iseardmedia.com/img/citrus.png?v1.0 "Citrus Slider")

Citrus Slider is a simple JavaScript and CSS based slider. There are no third party requirements such as jQuery.

- [Demo](#demo)
- [Installation](#installation)
    - [Include required files](#include-required-files)
    - [Add markup](#add-markup)
    - [Add desired content](#add-desired-content)
    - [Customize settings](#customize-settings)
- [Settings](#settings)
- [Methods](#methods)

# Demo
You can see it in action by going [here](https://citrus.iseardmedia.com)

# Installation

## Include required files

Include citrus-slider in your project by adding these two lines before the end of the head tag.
                
```
<link rel="stylesheet" href="css/citrus-slider.min.css">
<script src="js/citrus-slider.min.js"></script>
```
## Add markup

A simple container `<div>`, with each child `<div>` as a separate slide. The first `<img>` tag will be used as the slide background image.

                
```
<div class="citrus-slider">
    <div><img src="img/slide-1.jpg"></div>
    <div><img src="img/slide-2.jpg"></div>
    <div><img src="img/slide-3.jpg"></div>
</div>
```
## Add desired content

This can include even include other images. Remember that the first image will be used as the slide background.
           
```
<div class="citrus-slider">
    <div><img src="img/slide-1.jpg"><h2>Slide 1</h2></div>
    <div><img src="img/slide-2.jpg"><h2>Slide 2</h2></div>
    <div><img src="img/slide-3.jpg"><h2>Slide 3</h2></div>
</div>
```             
            
## Customize settings

Add data-citrus followed by a JSON string of the settings you would like to change.
           
```
<div class="citrus-slider" data-citrus='{"duration" : 4000, "transition" : "pan"}'>
    <div><img src="img/slide-1.jpg"></div>
    <div><img src="img/slide-2.jpg"></div>
    <div><img src="img/slide-3.jpg"></div>
</div>
```             
# Settings

| Key | Value | Default | Description |
|-----|-------|---------|-------------| 
width |	any valid css width (e.g 400px, 100%) |	'100%' | Sets the width of the slider
height | any valid css height (e.g 400px, 100%) | '100%' | Sets the height of the slider |
animationDuration |	number in seconds | 0.8 | Determines how long the animation should take when transitioning slides
autoHeight | true, false | false | Automatically sets the height of the slider based on the height of the content
slideTransition |	'pan', 'zoom-fade', 'scope', 'fallaway', 'downandout' | 'pan' | Slide transition animation
slideIndex | 1,2,3 etc. | 1 | Indicate which slide the slider should start on
slideDuration |	number in ms (e.g 5000) | 5000 | Delay between slide transitions
effect | 'zoom', 'pan', 'parallax', false | false | Slide resting animation type
animateText | true, false | true | Enable or disable slide content animating in after slide transition
showIndicators | true, false | true | Enable or disable slide indicators
showArrows | true, false | true | Enable or disable slide arrows
paused | true, false | false | Enable or disable automatic, timed slide transition
autoPause |	true, false | true | Enable or disable automatic pausing (e.g. when user interacts with slider)

# Methods

Invoking `citrus` will return a slider object with various methods. This will allow you to programmatically control the slider. For example, to reset the slider you would use `citrus[0].reset()`. The `[0]` represents the index of the slider. If you have more than one slider on a page you will need to change this to the slider you intend to target.

| Method | Description | Example |
|--------|-------------|---------|
play() | Unpauses and starts the automatic slideshow | citrus[0].play()
stop() | Stops and pauses the automatic slideshow | citrus[0].stop()
prevSlide() | Goes to the previous slide in the sequence | citrus[0].prevSlide()
nextSlide() | Goes to the next slide in the sequence | citrus[0].nextSlide()
gotoSlide() | Goes to the specified slide in the sequence | citrus[0].gotoSlide(2)
reset() | Resets slider by rebuilding and resetting status | citrus[0].reset()