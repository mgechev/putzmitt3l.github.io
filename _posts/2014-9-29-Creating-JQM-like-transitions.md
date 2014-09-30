---
layout: post
title: Creating JQM-like "Page" transitions
---

>## "I don't want to read, I want to look at the code"
>[Link to the demo code](https://github.com/Putzmitt3l/blog-octo-demos/tree/master/jqmliketransitions) <br/>
>[Link to demo]({{ site.baseurl }}/demo/transitions)

## Introduction and Motivation
------------------------------

Have you ever used 'JQM'? It's more often referred to as [jQuery Mobile](http://jquerymobile.com/).
I'm guessing if you are reading this article you had.

That being said at some point of your work you might have experienced one or two quirks of the JQM ( of course after deploying your app on a
device). Well I have as well...
Don't get me wrong JQM is a great tool for getting your basic simple Cross-platform App up and running. But sometimes it's best to do custom things to avoid unexpected behavior or just for the sake of 'code simplicity'.

My team-lead decided that we won't use it for our latest project ( after struggling with some JQM bugs previously ) and will do things custom because we are supporting one device for now. So I was tasked first with creating a 'utility' that would imitate the view-change functionality of the JQM Framework. For those who are not very familiar with what I'm talking about, here is a [link](http://demos.jquerymobile.com/1.4.4/transitions/) to the demo and documentation. In short you only change the HTML markup and you have functioning view transitions with more or less native feel.

## Implementation
-----------------

So here we are, at the interesting part.

Before we get started, I'd like to say that I won't be saying "page", but
rather use the word "view", because that's essentially what we are animating.
We only have __ONE__ index.html page ( a "multi-page").

First we need to create our views container in our html and of course our views:

{% highlight html linenos %}
<div class="view-container">
    <div id="home-view" class="view current-view">
    </div>
    <div id="second-view" class="view">
    </div>
    <div id="third-view" class="view">
    </div>
</div>
{% endhighlight %}

_Basic rundown of our html classes_:

* __view-container__ will hold our views and when we get to the CSS part I'll explain why we need it, to house our views

* __view__ will have standardized rules for displaying, that all the views share

* __current-view__ will mark which view is currently displayed in the viewport

* __transition-view__ will have the same definition as current-view, but semantically it's correct to use such class
instead of just working with one universal "display-view" class

* __transition-in__ class is responsible for the animation of the view that is coming __TO__ the viewport

* __transition-out__ class is responsible for the animation of the view that is coming __OFF__ the viewport

Next we add the links that will help us navigate through the views:
{% highlight html linenos %}
<div class="view-container">
    <div id="home-view" class="view current-view">
        <!--
            These links can house used for icon containers
            or styled like icons, buttons etc.
        -->
        <a href="#" class="view-link" data-view-link-dest="second-view">
          Second view
        </a>
        <a href="#" class="view-link" data-view-link-dest="third-view" >
          Third view
        </a>
    </div>
    <div id="second-view" class="view">
        <!--
            Note the View Transition data attribute.
            This will help us further customise our view transitions
            and of course the look and feel of our app.
        -->
        <a href="#" class="view-link" data-view-link-dest="home-view" data-view-transition="slidelefttoright">
            Home view
        </a>
    </div>
    <div id="third-view" class="view">
        <a href="#" class="view-link" data-view-link-dest="home-view" data-view-transition="slidelefttoright">
            Home view
        </a>
    </div>
</div>
{% endhighlight %}

__Note__: The ```view-link-dest``` data attribute in the links contains ids of the divs that have a class "view".

Now for the CSS part:
{% highlight css linenos %}
/* Animation container for the views*/
.view-container {
    position: relative;
    width: 100%;
    height: 100%;

    -webkit-perspective: 1200px;
    -moz-perspective: 1200px;
    perspective: 1200px;

    -webkit-overlow-scrolling: touch;
    overflow: hidden;
}

.view {
    position: absolute;

    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transform-style: preserve-3d;

    box-sizing: border-box;
    height: 100%;
    width: 100%;
    text-align: center;

    /* MUI IMPORTANTE: Do NOT use display: block/none for showing hiding pages*/
    -webkit-transform: translate3d(-1000%,0,0);
    -moz-transform: translate3d(-1000%,0,0);
    transform: translate3d(-1000%,0,0);
}

.view.current-view {
    -webkit-transform: translate3d(0,0,0);
    -moz-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
}

.view.transition-view {
    -webkit-transform: translate3d(0,0,0);
    -moz-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
}
/* Move to/from LEFT/RIGHT animations */
.view-move-to-left {
    -webkit-animation: moveToLeft .6s ease both;
    animation: moveToLeft .6s ease both;
}

.view-move-from-left {
    -webkit-animation: moveFromLeft .6s ease both;
    animation: moveFromLeft .6s ease both;
}

.view-move-to-right {
    -webkit-animation: moveToRight .6s ease both;
    animation: moveToRight .6s ease both;
}

.view-move-from-right {
    -webkit-animation: moveFromRight .6s ease both;
    animation: moveFromRight .6s ease both;
}

/*
    Key-frames for LEFT/RIGHT movement animations
    not included in article. Please check link to
    github repo.
*/
{% endhighlight %}

Now there are a couple of things I'd like to point out:

1. The 'view-container' has ```overflow:hidden``` which means that during
view transitions you won't get those nasty scroll bars popping-up.

2. The ```perspective property``` is left there if you ever want to implement
any 3d animations. [[link](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective)]

3. Using the ```display property``` is definitely going to mess-up your animations on the mobile device.
I only got a traditional 'page-change' behavior, like in the browser, after deploying the app and navigating through it.
Who knows what kind of unexpected behavior you will get.
Common practice is to use the ```translate``` options of the ```transform property``` to hide elements from viewport.

4. Finally I haven't included the keyframes in the article. You'll have to
look them up in the repository. And I'd also recommend checking what is this
keyframe business all about.[[link](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes)]

###Enough goofing around, time for some code...
but what should our JavaScript do with the HTML/CSS we've created???

To put it simply:

1. Get the link information.
2. Get the view that the link resides in.
3. Get the view that the link is pointing at.
4. Animate the two views and all kinds of wizardry, using the information the link gives us.
5. ( Optional ) Add a triggerViewChange() function like in JQM, when you pragmatically need to change the view ( comfortable when you need to prep a view before you show it ).
6. ( Optional ) Emit some custom event regarding the view change.
7. ( Optional ) Add some basic error logging to help you (and maybe some of your colleagues ), the next time some HTML has to be added to the page.
{% highlight javascript linenos %}
var navigation = (function ( $ ){
    'use strict';
    var navModule = {},
        viewTransitions = {
            'sliderighttoleft': {
                'outDirection': 'view-move-to-left',
                'inDirection': 'view-move-from-right'
            },
            'slidelefttoright': {
                'outDirection': 'view-move-to-right',
                'inDirection': 'view-move-from-left'
            }
        },
        animEndEventNames = {
            'WebkitAnimation' : 'webkitAnimationEnd',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
            'animation' : 'animationend'
        },

        // general css classes for the animation
        currentViewClass = 'current-view',
        transitionViewClass = 'transition-view';

    // private function for our module
    function changeView ( options ) {
        // NOTE: here we explicitly choose the Webkit vendor prefix
        // next line should detect browser type and is left like that for the sake of simplicity.

        // animation classes
        var animationEndEvent = animEndEventNames[ 'WebkitAnimation' ],
            _this = this,
            outClass,
            inClass;

        if( options.viewTransition === undefined ) {
            // default transition
            options.viewTransition = 'sliderighttoleft';
        }

        outClass = transitionViewClass + ' ' + viewTransitions[ options.viewTransition ].outDirection;
        inClass = transitionViewClass + ' ' + viewTransitions[ options.viewTransition ].inDirection;

        options.$currentView.removeClass( currentViewClass )
            .addClass( outClass );

        options.$destinationView.addClass( currentViewClass )
                .addClass( inClass );

        options.$currentView.on( animationEndEvent, function() {
            options.$currentView.removeClass( outClass );
        });

        options.$destinationView.on( animationEndEvent, function() {
            options.$destinationView.removeClass( inClass );
        });
    }

    // exposing the function for our fellow devs to use freely
    navModule.triggerViewChange = function( options ) {
        changeView ( options );
    }

    navModule.init = function () {
        var _this = this;

        /*
            binding the eventListener to the document enables the
            eventHandler triggering even from dynamically-added
            markup
        */

        $( document ).on( 'click', '.view-link' , function( e ) {
            e.preventDefault();
            e.stopPropagation();

            var $this = $( this ),
                $currentView = $this.closest( '.view' ),
                destinationViewId = $this.data( 'viewLinkDest' ),
                $destinationView = $( '#' + destinationViewId ),
                viewTransition = $this.data( 'viewTransition' );


            changeView({
                $currentView: $currentView,
                $destinationView: $destinationView,
                viewTransition: viewTransition
            });
        });
    }

    return navModule;
})( jQuery );


navigation.init();
{% endhighlight %}


## Final Thoughts
-----------------

Well they aren't much...

Usually with building such utilities you strive for code simplicity and avoiding potential bugs, that may arise
with the usage of such frameworks, libraries or whatever. Will you succeed in that matter, though?
Ultimately it depends on how good you are at what you do.

On the other hand we don't have to re-invent the wheel every time and such frameworks and libraries are often beneficial for the work process.
We can also learn a lot from the communities gathered alongside those projects.

__Takeaway__: It's up to you to decide whether incorporating something can boost your project development or not. For me there
are three key questions that help me make this choice.

* How much time will it take to implement the functionality that this tool(library, etc.) provides?
* Is the tool easy to use and customize?
* Is it well supported?
