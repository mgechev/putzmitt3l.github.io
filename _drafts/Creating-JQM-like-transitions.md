---
layout: post
title: Creating JQM-like "Page" transitions
---
<!--
// TODO: add direct links to repo for TL;Don't Wanna Read section
// TODO: add direct links to some type of "Demo"
// TODO: add 'skip to the implementation section'
// TODO: add links in the text
// TODO: change "pages" in markup and instructions
// TODO: check and add full-stops to paragraphs
// TODO: run a spell-check
-->

>## "I don't want to read, I want to look at the code"
>[Link to the demo code](https://github.com/Putzmitt3l/blog-octo-demos/tree/master/jqmliketransitions)

## Introduction and Motivation
------------------------------

Hey, you ever used 'JQM'? It's more often refered to as jQuery Mobile <!-- (Note: add link for the site) -->.
I'm guessing if you are reading this article you have.

That being said at some point of your work you might have had experienced one or two quircks of the JQM ( of course after
deploying your app on a device ). Well I have as well... don't get me wrong JQM is a great tool for getting your basic simple Cross-platform App up and running. But sometimes it's best to do custom things to avoid unexpected behaviour, or just for the sake of 'the simplicity of your codebase'.

My team-lead decided that we won't use it for our latest project ( after struggling with some JQM bugs previously ) and will do things custom because we are supporting one device for now. So I was tasked first with creating a 'utility' that would imitate the view-change functionality of the JQM Framework. For those who are not very familiar with
what I'm talking about here is a link to the documentation <!-- (Note: add link for the site) -->. In short you only change the
HTML markup and you have functioning view transitions with more or less native feel.


## Implementation
-----------------

So here we are, at the Implementation part.

Before we get started, I'd like to say that I won't be saying "page", but
rather use the word "view", because that's essentially what we are animating.
We only have __ONE__ index.html page ("multy-page").

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

* __view-container__ will hold our views and when we get to the CSS part I'll explain why we need it to house our them in a container

* __view__ will have standartised rules for displaying, that all the views share

* __current-view__ will mark which view is currently displayed in the viewport

* __transition-view__ will have the same definition in CSS as current-view but semantically is correct to use such class
instead of just working with one "display-view" class

* __transition-in__ class is responsible for the animation of the view that is comming to the viewport

* __transition-out__ class is responsible for the animation of the view that is comming off the viewport

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
Links' ```view-link-dest``` data attribute contains ids of the divs that have a class "view".

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

Now there are a couple of things I'd like to note:

1. The 'view-container' has ```overflow:hidden``` which means that during
view transitions you won't get those nasty scroll bars poping-up.

2. The ```perspective property``` is left there if you ever want to implement
any 3d animations. <!-- add Link to http://www.w3schools.com/cssref/css3_pr_perspective.asp -->

3. Using ```display property``` is definetly going to mess-up your animations.
I only got a traditional 'page-change' like in the browser, after
deploying the app and navigating through it. Who knows what kind of unexpected
behavior you will get.
Better use the ```translate``` options of the ```transform property``` to hide views from viewport.

4. The time for making the view transitions is ```.6s```. You can think of it
as 60fps. That also guarantees us smooth animations.

5. Finally I haven't included the keyframes in the article. You'll have to
look them up in the repository. And I'd also recomend checking what is this
keyframe business all about. <!-- add Link to https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes -->

>"View transitions" are not ment only for your views.
You can use this approach for UI elements residing in your view.

###Enough goofing around, time for some code...
but what should our Javascript do with the HTML/CSS we've created???

To put it simply:

1. Get the links information.
2. Get the view that the link resides in.
3. Get the view that the link is pointing at.
4. Add a triggerViewChange() function like in JQM, when you programmatically need to change the view ( comfortable when you need to prep a view before you show it ).
5. Animate the two views and all kinds of wizardry around that using
the information the link gives us.
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

    navModule.triggerViewChange = function( options ) {

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
