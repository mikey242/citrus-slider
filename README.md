#Skroll Slider

This is a simple JavaScript and CSS based slider. There are no third party requirements such as jQuery.

```HTML
    <div id="slider1" class="slider-wrap parallax-background-container" data-duration="5000">
        <div class="slider" style="height:300px;">
            <div class="slide-wrap" data-slide='1'>
                <div class="slider-slide" style="background-image: url(https://picsum.photos/1680/300/?random)">
                    <div class="slide-text">
                        <h2>Slide 1</h2>
                    </div>
                </div>
            </div>
            <div class="slide-wrap" data-slide='2'>
                <div class="slider-slide" style="background-image: url(https://picsum.photos/1680/300/?random)">
                    <div class="slide-text">
                        <h2>Slide 2</h2>
                    </div>
                </div>
            </div>
        </div><!--.slider-->
        <div class="slide-indicators"></div>
        <i class="fa fa-chevron-left slide-arrow arrow-left" aria-hidden="true"></i>
        <i class="fa fa-chevron-right slide-arrow arrow-right" aria-hidden="true"></i>
    </div><!--#slider1-->
```