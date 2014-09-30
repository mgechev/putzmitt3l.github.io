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


    /**
     * Performs animation-classes changing.
     * @param  {jQueryObject} options.$currentView      represents the current view that the user sees
     * @param  {jQueryObject} options.$destinationView      represents the view the user is going to transition to
     * @param  {String} options.viewTransition      defines the transition animation type
     */
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

    /**
     * Manually trigger view-change
     * @param  {jQueryObject} options.viewDestinationId     the Id of the destination view we want to transition to
     * @param  {jQueryObject} options.viewTransition    the animation transition type
     * @return {[type]}         [description]
     */
    navModule.triggerViewChange = function( options ) {

    }

    /**
     * Binds view-changing animations on links click event.
     * The eventListener is binded to the document, and that
     * ensures that if we dynamically add markup to our views, the links
     * will work.
     */
    navModule.init = function () {
        var _this = this;
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

