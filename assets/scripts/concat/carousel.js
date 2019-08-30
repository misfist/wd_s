/**
 * File carousel.js
 *
 * Deal with the carousel.
 */
window.wdsCarousel = {};
( function( window, $, app ) {

	// Constructor.
	app.init = function() {
		app.cache();

		// If we're in an ACF edit page.
		if ( window.acf ) {
			app.doCarousel();
		}

		if ( app.meetsRequirements() ) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function() {
		app.$c = {
			window: $( window ),
			theCarousel: $( '.carousel-block' )
		};
	};

	// Combine all events.
	app.bindEvents = function() {
		app.$c.window.on( 'load', app.doCarousel );
	};

	// Do we meet the requirements?
	app.meetsRequirements = function() {
		return app.$c.theCarousel.length;
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function() {

		// Get all the videos in our slides object.
		$( 'video' ).each( function() {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		} );
	};

	// The carousel initializes differently on the backend.
	app.initCarouselOnBackend = function() {

		var slider = tns( {
			container: '.carousel-block',
			items: 1,
			slideBy: 'page',
			autoplay: false,
			navPosition: 'bottom',
			autoplayPosition: 'bottom',
			autoplayTimeout: "5000",
		} );

		app.setInitialLinkAttributes( slider );
		app.setLinkStatesOnChange( slider );
	};

	// The carousel initializes differently on the frontend.
	app.initCarouselOnFrontend = function() {

		let blockList = document.querySelectorAll( '.carousel-block' );

		[].forEach.call( blockList, function( item ) {
			var slider = tns( {
				container: item,
				items: 1,
				slideBy: 'page',
				autoplay: false,
				navPosition: 'bottom',
				autoplayPosition: 'bottom',
				autoplayTimeout: "5000",
			} );

			app.setInitialLinkAttributes( slider );
			app.setLinkStatesOnChange( slider );
		});
	};

	// Kick off the carousel.
	app.doCarousel = function() {

		// Render on the backend.
		if ( window.acf ) {
			window.acf.addAction( 'render_block_preview', app.initCarouselOnBackend );
		} else {
			// Render on the frontend.
			$( document ).ready( function() {
				app.$c.theCarousel.on( 'init', app.playBackgroundVideos );
				app.initCarouselOnFrontend();
			} );
		}
	};

	// Set link attributes on load so we can't tab to inactive slides.
	app.setInitialLinkAttributes = function( slider ) {

		var info = slider.getInfo(),
			allSlides = info.slideItems,
			currentSlide = info.index;

		// Set ALL links and buttons in ALL slides to tabindex -1.
		Object.keys( allSlides ).forEach( function( slide ) {
			allSlides[slide].querySelectorAll( 'a, button' ).forEach( links => links.setAttribute( 'tabindex', '-1' ) );
		});

		// Set the INITIAL slide links and buttons to tabindex 0. This only happens once.
		info.slideItems[currentSlide].querySelectorAll( 'a, button' ).forEach( links => links.setAttribute( 'tabindex', '0' ) );
	};

	// Change link tabindex values on slide change so only the current slide is tab-able.
	app.setLinkStatesOnChange = function( slider ) {

		// Listen for slide changes.
		slider.events.on( 'indexChanged', function() {

			// Get slider info.
			var ChangeInfo = slider.getInfo(),
				allSlides = ChangeInfo.slideItems,
				currentSlide = ChangeInfo.index;

			// Set ALL links and buttons in ALL slides to tabindex -1.
			Object.keys( allSlides ).forEach( function( slide ) {
				allSlides[slide].querySelectorAll( 'a, button' ).forEach( links => links.setAttribute( 'tabindex', '-1' ) );
			});

			// Set the CURRENT slide links and buttons to tabindex 0.
			allSlides[currentSlide].querySelectorAll( 'a, button' ).forEach( links => links.setAttribute( 'tabindex', '0' ) );
		} );
	};

	// Engage!
	$( app.init );
} ( window, jQuery, window.wdsCarousel ) );
