#Skroll Slider

This is a simple JavaScript and CSS based slider. There are no third party requirements such as jQuery.

##Example usage

```HTML
    <div id="slider1" class="slider-wrap zoom zoom-fade" data-duration="5000">
        <div class="slides" style="height:400px;">
            <div class="slide-wrap">
                <div class="slider-slide" style="background-image: url(/images/slide1.jpg)">
                    <div class="slide-text">
                        <h2>Slide 1</h2>
                    </div>
                </div>
            </div>
            <div class="slide-wrap">
                <div class="slider-slide" style="background-image: url(/images/slide2.jpg)">
                    <div class="slide-text">
                        <h2>Slide 2</h2>
                    </div>
                </div>
            </div>
        </div><!--.slides-->
        <div class="slide-indicators"></div>
        <i class="slide-arrow arrow-left" aria-hidden="true"></i>
        <i class="slide-arrow arrow-right" aria-hidden="true"></i>
    </div><!--#slider1-->
```