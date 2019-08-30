'use strict';

/**
 * Accordion block functionality
 *
 * @author Shannon MacMillan, Corey Collins
 */
window.accordionBlockToggle = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		// If we're in an ACF edit page.
		if (window.acf) {
			window.acf.addAction('render_block_preview', app.bindEvents);
		}

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			html: $('html'),
			accordion: $('.accordion'),
			items: $('.accordion-item'),
			headers: $('.accordion-item-header'),
			contents: $('.accordion-item-content'),
			button: $('.accordion-item-toggle'),
			anchorID: $(window.location.hash)
		};
	};

	// Combine all events
	app.bindEvents = function () {
		$('.accordion-item-header').on('click touchstart', app.toggleAccordion);
		$('.accordion-item-toggle').on('click touchstart', app.toggleAccordion);
		app.$c.window.on('load', app.openHashAccordion);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.accordion.length;
	};

	app.toggleAccordion = function () {

		// Add the open class to the item.
		$(this).parents('.accordion-item').toggleClass('open');

		// Is this one expanded?
		var isExpanded = $(this).parents('.accordion-item').hasClass('open');

		// Set this button's aria-expanded value.
		$(this).parents('.accordion-item').find('.accordion-item-toggle').attr('aria-expanded', isExpanded ? 'true' : 'false');

		// Set all other items in this block to aria-hidden=true.
		$(this).parents('.accordion-block').find('.accordion-item-content').not($(this).parents('.accordion-item')).attr('aria-hidden', 'true');

		// Set this item to aria-hidden=false.
		$(this).parents('.accordion-item').find('.accordion-item-content').attr('aria-hidden', isExpanded ? 'false' : 'true');

		// Hide the other panels.
		$(this).parents('.accordion-block').find('.accordion-item').not($(this).parents('.accordion-item')).removeClass('open');
		$(this).parents('.accordion-block').find('.accordion-item-toggle').not($(this)).attr('aria-expanded', 'false');

		return false;
	};

	app.openHashAccordion = function () {

		if (!app.$c.anchorID.selector) {
			return;
		}

		// Trigger a click on the button closest to this accordion.
		app.$c.anchorID.parents('.accordion-item').find('.accordion-item-toggle').trigger('click');

		// Not setting a cached variable as it doesn't seem to grab the height properly.
		var adminBarHeight = $('#wpadminbar').length ? $('#wpadminbar').height() : 0;

		// Animate to the div for a nicer experience.
		app.$c.html.animate({
			scrollTop: app.$c.anchorID.offset().top - adminBarHeight
		}, 'slow');
	};

	// Engage
	app.init();
})(window, jQuery, window.accordionBlockToggle);
'use strict';

/**
 * File carousel.js
 *
 * Deal with the carousel.
 */
window.wdsCarousel = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		// If we're in an ACF edit page.
		if (window.acf) {
			app.doCarousel();
		}

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			theCarousel: $('.carousel-block')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.doCarousel);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.theCarousel.length;
	};

	// Allow background videos to autoplay.
	app.playBackgroundVideos = function () {

		// Get all the videos in our slides object.
		$('video').each(function () {

			// Let them autoplay. TODO: Possibly change this later to only play the visible slide video.
			this.play();
		});
	};

	// The carousel initializes differently on the backend.
	app.initCarouselOnBackend = function () {

		var slider = tns({
			container: '.carousel-block',
			items: 1,
			slideBy: 'page',
			autoplay: false,
			navPosition: 'bottom',
			autoplayPosition: 'bottom',
			autoplayTimeout: "5000"
		});

		app.setInitialLinkAttributes(slider);
		app.setLinkStatesOnChange(slider);
	};

	// The carousel initializes differently on the frontend.
	app.initCarouselOnFrontend = function () {

		var blockList = document.querySelectorAll('.carousel-block');

		[].forEach.call(blockList, function (item) {
			var slider = tns({
				container: item,
				items: 1,
				slideBy: 'page',
				autoplay: false,
				navPosition: 'bottom',
				autoplayPosition: 'bottom',
				autoplayTimeout: "5000"
			});

			app.setInitialLinkAttributes(slider);
			app.setLinkStatesOnChange(slider);
		});
	};

	// Kick off the carousel.
	app.doCarousel = function () {

		// Render on the backend.
		if (window.acf) {
			window.acf.addAction('render_block_preview', app.initCarouselOnBackend);
		} else {
			// Render on the frontend.
			$(document).ready(function () {
				app.$c.theCarousel.on('init', app.playBackgroundVideos);
				app.initCarouselOnFrontend();
			});
		}
	};

	// Set link attributes on load so we can't tab to inactive slides.
	app.setInitialLinkAttributes = function (slider) {

		var info = slider.getInfo(),
			allSlides = info.slideItems,
			currentSlide = info.index;

		// Set ALL links and buttons in ALL slides to tabindex -1.
		Object.keys(allSlides).forEach(function (slide) {
			allSlides[slide].querySelectorAll('a, button').forEach(function (links) {
				return links.setAttribute('tabindex', '-1');
			});
		});

		// Set the INITIAL slide links and buttons to tabindex 0. This only happens once.
		info.slideItems[currentSlide].querySelectorAll('a, button').forEach(function (links) {
			return links.setAttribute('tabindex', '0');
		});
	};

	// Change link tabindex values on slide change so only the current slide is tab-able.
	app.setLinkStatesOnChange = function (slider) {

		// Listen for slide changes.
		slider.events.on('indexChanged', function () {

			// Get slider info.
			var ChangeInfo = slider.getInfo(),
				allSlides = ChangeInfo.slideItems,
				currentSlide = ChangeInfo.index;

			// Set ALL links and buttons in ALL slides to tabindex -1.
			Object.keys(allSlides).forEach(function (slide) {
				allSlides[slide].querySelectorAll('a, button').forEach(function (links) {
					return links.setAttribute('tabindex', '-1');
				});
			});

			// Set the CURRENT slide links and buttons to tabindex 0.
			allSlides[currentSlide].querySelectorAll('a, button').forEach(function (links) {
				return links.setAttribute('tabindex', '0');
			});
		});
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsCarousel);
'use strict';

/**
 * Show/Hide the Search Form in the header.
 *
 * @author Corey Collins
 */
window.ShowHideSearchForm = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			body: $('body'),
			headerSearchToggle: $('.site-header-action .cta-button'),
			headerSearchForm: $('.site-header-action .form-container')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.headerSearchToggle.on('keyup touchstart click', app.showHideSearchForm);
		app.$c.body.on('keyup touchstart click', app.hideSearchForm);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.headerSearchToggle.length;
	};

	// Checks to see if the menu has been opened.
	app.searchIsOpen = function () {

		if (app.$c.body.hasClass('search-form-visible')) {
			return true;
		}

		return false;
	};

	// Adds the toggle class for the search form.
	app.showHideSearchForm = function () {
		app.$c.body.toggleClass('search-form-visible');

		app.toggleSearchFormAriaLabel();
		app.toggleSearchToggleAriaLabel();

		return false;
	};

	// Hides the search form if we click outside of its container.
	app.hideSearchForm = function (event) {

		if (!$(event.target).parents('div').hasClass('site-header-action')) {
			app.$c.body.removeClass('search-form-visible');
			app.toggleSearchFormAriaLabel();
			app.toggleSearchToggleAriaLabel();
		}
	};

	// Toggles the aria-hidden label on the form container.
	app.toggleSearchFormAriaLabel = function () {
		app.$c.headerSearchForm.attr('aria-hidden', app.searchIsOpen() ? 'false' : 'true');
	};

	// Toggles the aria-hidden label on the toggle button.
	app.toggleSearchToggleAriaLabel = function () {
		app.$c.headerSearchToggle.attr('aria-expanded', app.searchIsOpen() ? 'true' : 'false');
	};

	// Engage
	$(app.init);
})(window, jQuery, window.ShowHideSearchForm);
'use strict';

/**
 * File js-enabled.js
 *
 * If Javascript is enabled, replace the <body> class "no-js".
 */
document.body.className = document.body.className.replace('no-js', 'js');
'use strict';

/**
 * File: mobile-menu.js
 *
 * Create an accordion style dropdown.
 */
window.wdsMobileMenu = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			body: $('body'),
			window: $(window),
			subMenuContainer: $('.mobile-menu .sub-menu, .utility-navigation .sub-menu'),
			subSubMenuContainer: $('.mobile-menu .sub-menu .sub-menu'),
			subMenuParentItem: $('.mobile-menu li.menu-item-has-children, .utility-navigation li.menu-item-has-children'),
			offCanvasContainer: $('.off-canvas-container')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDownArrow);
		app.$c.subMenuParentItem.on('click', app.toggleSubmenu);
		app.$c.subMenuParentItem.on('transitionend', app.resetSubMenu);
		app.$c.offCanvasContainer.on('transitionend', app.forceCloseSubmenus);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.subMenuContainer.length;
	};

	// Reset the submenus after it's done closing.
	app.resetSubMenu = function () {

		// When the list item is done transitioning in height,
		// remove the classes from the submenu so it is ready to toggle again.
		if ($(this).is('li.menu-item-has-children') && !$(this).hasClass('is-visible')) {
			$(this).find('ul.sub-menu').removeClass('slideOutLeft is-visible');
		}
	};

	// Slide out the submenu items.
	app.slideOutSubMenus = function (el) {

		// If this item's parent is visible and this is not, bail.
		if (el.parent().hasClass('is-visible') && !el.hasClass('is-visible')) {
			return;
		}

		// If this item's parent is visible and this item is visible, hide its submenu then bail.
		if (el.parent().hasClass('is-visible') && el.hasClass('is-visible')) {
			el.removeClass('is-visible').find('.sub-menu').removeClass('slideInLeft').addClass('slideOutLeft');
			return;
		}

		app.$c.subMenuContainer.each(function () {

			// Only try to close submenus that are actually open.
			if ($(this).hasClass('slideInLeft')) {

				// Close the parent list item, and set the corresponding button aria to false.
				$(this).parent().removeClass('is-visible').find('.parent-indicator').attr('aria-expanded', false);

				// Slide out the submenu.
				$(this).removeClass('slideInLeft').addClass('slideOutLeft');
			}
		});
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function () {

		app.$c.subMenuParentItem.find('a:first').after('<button type="button" aria-expanded="false" class="parent-indicator" aria-label="Open submenu"><span class="down-arrow"></span></button>');
	};

	// Deal with the submenu.
	app.toggleSubmenu = function (e) {

		var el = $(this),
			// The menu element which was clicked on.
		subMenu = el.children('ul.sub-menu'),
			// The nearest submenu.
		$target = $(e.target); // the element that's actually being clicked (child of the li that triggered the click event).

		// Figure out if we're clicking the button or its arrow child,
		// if so, we can just open or close the menu and bail.
		if ($target.hasClass('down-arrow') || $target.hasClass('parent-indicator')) {

			// First, collapse any already opened submenus.
			app.slideOutSubMenus(el);

			if (!subMenu.hasClass('is-visible')) {

				// Open the submenu.
				app.openSubmenu(el, subMenu);
			}

			return false;
		}
	};

	// Open a submenu.
	app.openSubmenu = function (parent, subMenu) {

		// Expand the list menu item, and set the corresponding button aria to true.
		parent.addClass('is-visible').find('.parent-indicator').attr('aria-expanded', true);

		// Slide the menu in.
		subMenu.addClass('is-visible animated slideInLeft');
	};

	// Force close all the submenus when the main menu container is closed.
	app.forceCloseSubmenus = function (event) {
		if ($(event.target).hasClass('off-canvas-container')) {

			// Focus offcanvas menu for a11y.
			app.$c.offCanvasContainer.focus();

			// The transitionend event triggers on open and on close, need to make sure we only do this on close.
			if (!$(this).hasClass('is-visible')) {
				app.$c.subMenuParentItem.removeClass('is-visible').find('.parent-indicator').attr('aria-expanded', false);
				app.$c.subMenuContainer.removeClass('is-visible slideInLeft');
				app.$c.body.css('overflow', 'visible');
				app.$c.body.unbind('touchstart');
			}

			if ($(this).hasClass('is-visible')) {
				app.$c.body.css('overflow', 'hidden');
				app.$c.body.bind('touchstart', function (e) {
					if (!$(e.target).parents('.contact-modal')[0]) {
						e.preventDefault();
					}
				});
			}
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsMobileMenu);
'use strict';

/**
 * File modal.js
 *
 * Deal with multiple modals and their media.
 */
window.wdsModal = {};
(function (window, $, app) {

	var $modalToggle = void 0,
		$focusableChildren = void 0,
		$player = void 0,
		$tag = document.createElement('script'),
		$firstScriptTag = document.getElementsByTagName('script')[0],
		YT = void 0;

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			$firstScriptTag.parentNode.insertBefore($tag, $firstScriptTag);
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			'body': $('body')
		};
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return $('.modal-trigger').length;
	};

	// Combine all events.
	app.bindEvents = function () {

		// Trigger a modal to open.
		app.$c.body.on('click touchstart', '.modal-trigger', app.openModal);

		// Trigger the close button to close the modal.
		app.$c.body.on('click touchstart', '.close', app.closeModal);

		// Allow the user to close the modal by hitting the esc key.
		app.$c.body.on('keydown', app.escKeyClose);

		// Allow the user to close the modal by clicking outside of the modal.
		app.$c.body.on('click touchstart', 'div.modal-open', app.closeModalByClick);

		// Listen to tabs, trap keyboard if we need to
		app.$c.body.on('keydown', app.trapKeyboardMaybe);
	};

	// Open the modal.
	app.openModal = function () {

		// Store the modal toggle element
		$modalToggle = $(this);

		// Figure out which modal we're opening and store the object.
		var $modal = $($(this).data('target'));

		// Display the modal.
		$modal.addClass('modal-open');

		// Add body class.
		app.$c.body.addClass('modal-open');

		// Find the focusable children of the modal.
		// This list may be incomplete, really wish jQuery had the :focusable pseudo like jQuery UI does.
		// For more about :input see: https://api.jquery.com/input-selector/
		$focusableChildren = $modal.find('a, :input, [tabindex]');

		// Ideally, there is always one (the close button), but you never know.
		if (0 < $focusableChildren.length) {

			// Shift focus to the first focusable element.
			$focusableChildren[0].focus();
		}
	};

	// Close the modal.
	app.closeModal = function () {

		// Figure the opened modal we're closing and store the object.
		var $modal = $($('div.modal-open .close').data('target')),


		// Find the iframe in the $modal object.
		$iframe = $modal.find('iframe');

		// Only do this if there are any iframes.
		if ($iframe.length) {

			// Get the iframe src URL.
			var url = $iframe.attr('src');

			// Removing/Readding the URL will effectively break the YouTube API.
			// So let's not do that when the iframe URL contains the enablejsapi parameter.
			if (!url.includes('enablejsapi=1')) {

				// Remove the source URL, then add it back, so the video can be played again later.
				$iframe.attr('src', '').attr('src', url);
			} else {

				// Use the YouTube API to stop the video.
				$player.stopVideo();
			}
		}

		// Finally, hide the modal.
		$modal.removeClass('modal-open');

		// Remove the body class.
		app.$c.body.removeClass('modal-open');

		// Revert focus back to toggle element
		$modalToggle.focus();
	};

	// Close if "esc" key is pressed.
	app.escKeyClose = function (event) {
		if (27 === event.keyCode) {
			app.closeModal();
		}
	};

	// Close if the user clicks outside of the modal
	app.closeModalByClick = function (event) {

		// If the parent container is NOT the modal dialog container, close the modal
		if (!$(event.target).parents('div').hasClass('modal-dialog')) {
			app.closeModal();
		}
	};

	// Trap the keyboard into a modal when one is active.
	app.trapKeyboardMaybe = function (event) {

		// We only need to do stuff when the modal is open and tab is pressed.
		if (9 === event.which && 0 < $('.modal-open').length) {
			var $focused = $(':focus'),
				focusIndex = $focusableChildren.index($focused);

			if (0 === focusIndex && event.shiftKey) {

				// If this is the first focusable element, and shift is held when pressing tab, go back to last focusable element.
				$focusableChildren[$focusableChildren.length - 1].focus();
				event.preventDefault();
			} else if (!event.shiftKey && focusIndex === $focusableChildren.length - 1) {

				// If this is the last focusable element, and shift is not held, go back to the first focusable element.
				$focusableChildren[0].focus();
				event.preventDefault();
			}
		}
	};

	// Hook into YouTube <iframe>.
	app.onYouTubeIframeAPIReady = function () {
		var $modal = $('div.modal'),
			$iframeid = $modal.find('iframe').attr('id');

		$player = new YT.Player($iframeid, {
			events: {
				'onReady': app.onPlayerReady,
				'onStateChange': app.onPlayerStateChange
			}
		});
	};

	// Do something on player ready.
	app.onPlayerReady = function () {};

	// Do something on player state change.
	app.onPlayerStateChange = function () {

		// Set focus to the first focusable element inside of the modal the player is in.
		$(event.target.a).parents('.modal').find('a, :input, [tabindex]').first().focus();
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsModal);
'use strict';

/**
 * File: navigation-primary.js
 *
 * Helpers for the primary navigation.
 */
window.wdsPrimaryNavigation = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			subMenuContainer: $('.main-navigation .sub-menu'),
			subMenuParentItem: $('.main-navigation li.menu-item-has-children')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDownArrow);
		app.$c.subMenuParentItem.find('a').on('focusin focusout', app.toggleFocus);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.subMenuContainer.length;
	};

	// Add the down arrow to submenu parents.
	app.addDownArrow = function () {
		app.$c.subMenuParentItem.find('> a').append('<span class="caret-down" aria-hidden="true"></span>');
	};

	// Toggle the focus class on the link parent.
	app.toggleFocus = function () {
		$(this).parents('li.menu-item-has-children').toggleClass('focus');
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsPrimaryNavigation);
'use strict';

/**
 * File: off-canvas.js
 *
 * Help deal with the off-canvas mobile menu.
 */
window.wdsoffCanvas = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			body: $('body'),
			offCanvasClose: $('.off-canvas-close'),
			offCanvasContainer: $('.off-canvas-container'),
			offCanvasOpen: $('.off-canvas-open'),
			offCanvasScreen: $('.off-canvas-screen')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.body.on('keydown', app.escKeyClose);
		app.$c.offCanvasClose.on('click', app.closeoffCanvas);
		app.$c.offCanvasOpen.on('click', app.toggleoffCanvas);
		app.$c.offCanvasScreen.on('click', app.closeoffCanvas);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.offCanvasContainer.length;
	};

	// To show or not to show?
	app.toggleoffCanvas = function () {

		if ('true' === $(this).attr('aria-expanded')) {
			app.closeoffCanvas();
		} else {
			app.openoffCanvas();
		}
	};

	// Show that drawer!
	app.openoffCanvas = function () {
		app.$c.offCanvasContainer.addClass('is-visible');
		app.$c.offCanvasOpen.addClass('is-visible');
		app.$c.offCanvasScreen.addClass('is-visible');

		app.$c.offCanvasOpen.attr('aria-expanded', true);
		app.$c.offCanvasContainer.attr('aria-hidden', false);
	};

	// Close that drawer!
	app.closeoffCanvas = function () {
		app.$c.offCanvasContainer.removeClass('is-visible');
		app.$c.offCanvasOpen.removeClass('is-visible');
		app.$c.offCanvasScreen.removeClass('is-visible');

		app.$c.offCanvasOpen.attr('aria-expanded', false);
		app.$c.offCanvasContainer.attr('aria-hidden', true);

		app.$c.offCanvasOpen.focus();
	};

	// Close drawer if "esc" key is pressed.
	app.escKeyClose = function (event) {
		if (27 === event.keyCode) {
			app.closeoffCanvas();
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsoffCanvas);
'use strict';

/**
 * File skip-link-focus-fix.js.
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
(function () {
	var isWebkit = -1 < navigator.userAgent.toLowerCase().indexOf('webkit'),
		isOpera = -1 < navigator.userAgent.toLowerCase().indexOf('opera'),
		isIe = -1 < navigator.userAgent.toLowerCase().indexOf('msie');

	if ((isWebkit || isOpera || isIe) && document.getElementById && window.addEventListener) {
		window.addEventListener('hashchange', function () {
			var id = location.hash.substring(1),
				element;

			if (!/^[A-z0-9_-]+$/.test(id)) {
				return;
			}

			element = document.getElementById(id);

			if (element) {
				if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false);
	}
})();
'use strict';

/**
 * Make tables responsive again.
 *
 * @author Haris Zulfiqar
 */
window.wdsTables = {};
(function (window, $, app) {

	// Constructor
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things
	app.cache = function () {
		app.$c = {
			window: $(window),
			table: $('table')
		};
	};

	// Combine all events
	app.bindEvents = function () {
		app.$c.window.on('load', app.addDataLabel);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.table.length;
	};

	// Adds data-label to td based on th.
	app.addDataLabel = function () {
		var table = app.$c.table;
		var tableHeaders = table.find('thead th');
		var tableRow = table.find('tbody tr');

		tableRow.each(function () {
			var td = $(this).find('td');

			td.each(function (index) {
				if ($(tableHeaders.get(index))) {
					$(this).attr('data-label', $(tableHeaders.get(index)).text());
				}
			});
		});

		return false;
	};

	// Engage
	$(app.init);
})(window, jQuery, window.wdsTables);
'use strict';

/**
 * Video Playback Script.
 */
window.WDSVideoBackgroundObject = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();

		if (app.meetsRequirements()) {
			app.bindEvents();
		}
	};

	// Cache all the things.
	app.cache = function () {
		app.$c = {
			window: $(window),
			videoButton: $('.video-toggle')
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.videoButton.on('click', app.doTogglePlayback);
	};

	// Do we meet the requirements?
	app.meetsRequirements = function () {
		return app.$c.videoButton.length;
	};

	// Video Playback.
	app.doTogglePlayback = function () {
		$(this).parents('.content-block').toggleClass('video-toggled');

		if ($(this).parents('.content-block').hasClass('video-toggled')) {
			$(this).siblings('.video-background').trigger('pause');
		} else {
			$(this).siblings('.video-background').trigger('play');
		}
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.WDSVideoBackgroundObject);
'use strict';

/**
 * File window-ready.js
 *
 * Add a "ready" class to <body> when window is ready.
 */
window.wdsWindowReady = {};
(function (window, $, app) {

	// Constructor.
	app.init = function () {
		app.cache();
		app.bindEvents();
	};

	// Cache document elements.
	app.cache = function () {
		app.$c = {
			'window': $(window),
			'body': $(document.body)
		};
	};

	// Combine all events.
	app.bindEvents = function () {
		app.$c.window.load(app.addBodyClass);
	};

	// Add a class to <body>.
	app.addBodyClass = function () {
		app.$c.body.addClass('ready');
	};

	// Engage!
	$(app.init);
})(window, jQuery, window.wdsWindowReady);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbi5qcyIsImNhcm91c2VsLmpzIiwiaGVhZGVyLWJ1dHRvbi5qcyIsImpzLWVuYWJsZWQuanMiLCJtb2JpbGUtbWVudS5qcyIsIm1vZGFsLmpzIiwibmF2aWdhdGlvbi1wcmltYXJ5LmpzIiwib2ZmLWNhbnZhcy5qcyIsInNraXAtbGluay1mb2N1cy1maXguanMiLCJ0YWJsZS5qcyIsInZpZGVvLmpzIiwid2luZG93LXJlYWR5LmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImFjY29yZGlvbkJsb2NrVG9nZ2xlIiwiJCIsImFwcCIsImluaXQiLCJjYWNoZSIsImFjZiIsImFkZEFjdGlvbiIsImJpbmRFdmVudHMiLCJtZWV0c1JlcXVpcmVtZW50cyIsIiRjIiwiaHRtbCIsImFjY29yZGlvbiIsIml0ZW1zIiwiaGVhZGVycyIsImNvbnRlbnRzIiwiYnV0dG9uIiwiYW5jaG9ySUQiLCJsb2NhdGlvbiIsImhhc2giLCJvbiIsInRvZ2dsZUFjY29yZGlvbiIsIm9wZW5IYXNoQWNjb3JkaW9uIiwibGVuZ3RoIiwicGFyZW50cyIsInRvZ2dsZUNsYXNzIiwiaXNFeHBhbmRlZCIsImhhc0NsYXNzIiwiZmluZCIsImF0dHIiLCJub3QiLCJyZW1vdmVDbGFzcyIsInNlbGVjdG9yIiwidHJpZ2dlciIsImFkbWluQmFySGVpZ2h0IiwiaGVpZ2h0IiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImpRdWVyeSIsIndkc0Nhcm91c2VsIiwiZG9DYXJvdXNlbCIsInRoZUNhcm91c2VsIiwicGxheUJhY2tncm91bmRWaWRlb3MiLCJlYWNoIiwicGxheSIsImluaXRDYXJvdXNlbE9uQmFja2VuZCIsInNsaWRlciIsInRucyIsImNvbnRhaW5lciIsInNsaWRlQnkiLCJhdXRvcGxheSIsIm5hdlBvc2l0aW9uIiwiYXV0b3BsYXlQb3NpdGlvbiIsImF1dG9wbGF5VGltZW91dCIsInNldEluaXRpYWxMaW5rQXR0cmlidXRlcyIsInNldExpbmtTdGF0ZXNPbkNoYW5nZSIsImluaXRDYXJvdXNlbE9uRnJvbnRlbmQiLCJibG9ja0xpc3QiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiY2FsbCIsIml0ZW0iLCJyZWFkeSIsImluZm8iLCJnZXRJbmZvIiwiYWxsU2xpZGVzIiwic2xpZGVJdGVtcyIsImN1cnJlbnRTbGlkZSIsImluZGV4IiwiT2JqZWN0Iiwia2V5cyIsInNsaWRlIiwibGlua3MiLCJzZXRBdHRyaWJ1dGUiLCJldmVudHMiLCJDaGFuZ2VJbmZvIiwiU2hvd0hpZGVTZWFyY2hGb3JtIiwiYm9keSIsImhlYWRlclNlYXJjaFRvZ2dsZSIsImhlYWRlclNlYXJjaEZvcm0iLCJzaG93SGlkZVNlYXJjaEZvcm0iLCJoaWRlU2VhcmNoRm9ybSIsInNlYXJjaElzT3BlbiIsInRvZ2dsZVNlYXJjaEZvcm1BcmlhTGFiZWwiLCJ0b2dnbGVTZWFyY2hUb2dnbGVBcmlhTGFiZWwiLCJldmVudCIsInRhcmdldCIsImNsYXNzTmFtZSIsInJlcGxhY2UiLCJ3ZHNNb2JpbGVNZW51Iiwic3ViTWVudUNvbnRhaW5lciIsInN1YlN1Yk1lbnVDb250YWluZXIiLCJzdWJNZW51UGFyZW50SXRlbSIsIm9mZkNhbnZhc0NvbnRhaW5lciIsImFkZERvd25BcnJvdyIsInRvZ2dsZVN1Ym1lbnUiLCJyZXNldFN1Yk1lbnUiLCJmb3JjZUNsb3NlU3VibWVudXMiLCJpcyIsInNsaWRlT3V0U3ViTWVudXMiLCJlbCIsInBhcmVudCIsImFkZENsYXNzIiwiYWZ0ZXIiLCJlIiwic3ViTWVudSIsImNoaWxkcmVuIiwiJHRhcmdldCIsIm9wZW5TdWJtZW51IiwiZm9jdXMiLCJjc3MiLCJ1bmJpbmQiLCJiaW5kIiwicHJldmVudERlZmF1bHQiLCJ3ZHNNb2RhbCIsIiRtb2RhbFRvZ2dsZSIsIiRmb2N1c2FibGVDaGlsZHJlbiIsIiRwbGF5ZXIiLCIkdGFnIiwiY3JlYXRlRWxlbWVudCIsIiRmaXJzdFNjcmlwdFRhZyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiWVQiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsImVzY0tleUNsb3NlIiwiY2xvc2VNb2RhbEJ5Q2xpY2siLCJ0cmFwS2V5Ym9hcmRNYXliZSIsIiRtb2RhbCIsImRhdGEiLCIkaWZyYW1lIiwidXJsIiwiaW5jbHVkZXMiLCJzdG9wVmlkZW8iLCJrZXlDb2RlIiwid2hpY2giLCIkZm9jdXNlZCIsImZvY3VzSW5kZXgiLCJzaGlmdEtleSIsIm9uWW91VHViZUlmcmFtZUFQSVJlYWR5IiwiJGlmcmFtZWlkIiwiUGxheWVyIiwib25QbGF5ZXJSZWFkeSIsIm9uUGxheWVyU3RhdGVDaGFuZ2UiLCJhIiwiZmlyc3QiLCJ3ZHNQcmltYXJ5TmF2aWdhdGlvbiIsInRvZ2dsZUZvY3VzIiwiYXBwZW5kIiwid2Rzb2ZmQ2FudmFzIiwib2ZmQ2FudmFzQ2xvc2UiLCJvZmZDYW52YXNPcGVuIiwib2ZmQ2FudmFzU2NyZWVuIiwiY2xvc2VvZmZDYW52YXMiLCJ0b2dnbGVvZmZDYW52YXMiLCJvcGVub2ZmQ2FudmFzIiwiaXNXZWJraXQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJpc09wZXJhIiwiaXNJZSIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImlkIiwic3Vic3RyaW5nIiwiZWxlbWVudCIsInRlc3QiLCJ0YWdOYW1lIiwidGFiSW5kZXgiLCJ3ZHNUYWJsZXMiLCJ0YWJsZSIsImFkZERhdGFMYWJlbCIsInRhYmxlSGVhZGVycyIsInRhYmxlUm93IiwidGQiLCJnZXQiLCJ0ZXh0IiwiV0RTVmlkZW9CYWNrZ3JvdW5kT2JqZWN0IiwidmlkZW9CdXR0b24iLCJkb1RvZ2dsZVBsYXliYWNrIiwic2libGluZ3MiLCJ3ZHNXaW5kb3dSZWFkeSIsImxvYWQiLCJhZGRCb2R5Q2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7O0FBS0FBLE9BQU9DLG9CQUFQLEdBQThCLEVBQTlCO0FBQ0UsV0FBVUQs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QVAsQ0FBYzZMLElBQWQsQ0FBb0IxTCxJQUFJMkwsWUFBeEI7QUFDQSxFQUZEOztBQUlBO0FBQ0EzTCxLQUFJMkwsWUFBSixHQUFtQixZQUFXO0FBQzdCM0wsTUFBSU8sRUFBSixDQUFPc0UsSUFBUCxDQUFZeUIsUUFBWixDQUFzQixPQUF0QjtBQUNBLEVBRkQ7O0FBSUE7QUFDQXZHLEdBQUdDLElBQUlDLElBQVA7QUFDQSxDQTVCQyxFQTRCQ0osTUE1QkQsRUE0QlN3QyxNQTVCVCxFQTRCaUJ4QyxPQUFPNEwsY0E1QnhCLENBQUYiLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQWNjb3JkaW9uIGJsb2NrIGZ1bmN0aW9uYWxpdHlcbiAqXG4gKiBAYXV0aG9yIFNoYW5ub24gTWFjTWlsbGFuLCBDb3JleSBDb2xsaW5zXG4gKi9cbndpbmRvdy5hY2NvcmRpb25CbG9ja1RvZ2dsZSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdC8vIElmIHdlJ3JlIGluIGFuIEFDRiBlZGl0IHBhZ2UuXG5cdFx0aWYgKCB3aW5kb3cuYWNmICkge1xuXHRcdFx0d2luZG93LmFjZi5hZGRBY3Rpb24oICdyZW5kZXJfYmxvY2tfcHJldmlldycsIGFwcC5iaW5kRXZlbnRzICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHRodG1sOiAkKCAnaHRtbCcgKSxcblx0XHRcdGFjY29yZGlvbjogJCggJy5hY2NvcmRpb24nICksXG5cdFx0XHRpdGVtczogJCggJy5hY2NvcmRpb24taXRlbScgKSxcblx0XHRcdGhlYWRlcnM6ICQoICcuYWNjb3JkaW9uLWl0ZW0taGVhZGVyJyApLFxuXHRcdFx0Y29udGVudHM6ICQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKSxcblx0XHRcdGJ1dHRvbjogJCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICksXG5cdFx0XHRhbmNob3JJRDogJCggd2luZG93LmxvY2F0aW9uLmhhc2ggKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0JCggJy5hY2NvcmRpb24taXRlbS1oZWFkZXInICkub24oICdjbGljayB0b3VjaHN0YXJ0JywgYXBwLnRvZ2dsZUFjY29yZGlvbiApO1xuXHRcdCQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsIGFwcC50b2dnbGVBY2NvcmRpb24gKTtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5vcGVuSGFzaEFjY29yZGlvbiApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5hY2NvcmRpb24ubGVuZ3RoO1xuXHR9O1xuXG5cdGFwcC50b2dnbGVBY2NvcmRpb24gPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEFkZCB0aGUgb3BlbiBjbGFzcyB0byB0aGUgaXRlbS5cblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5hY2NvcmRpb24taXRlbScgKS50b2dnbGVDbGFzcyggJ29wZW4nICk7XG5cblx0XHQvLyBJcyB0aGlzIG9uZSBleHBhbmRlZD9cblx0XHRsZXQgaXNFeHBhbmRlZCA9ICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmhhc0NsYXNzKCAnb3BlbicgKTtcblxuXHRcdC8vIFNldCB0aGlzIGJ1dHRvbidzIGFyaWEtZXhwYW5kZWQgdmFsdWUuXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuZmluZCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBpc0V4cGFuZGVkID8gJ3RydWUnIDogJ2ZhbHNlJyApO1xuXG5cdFx0Ly8gU2V0IGFsbCBvdGhlciBpdGVtcyBpbiB0aGlzIGJsb2NrIHRvIGFyaWEtaGlkZGVuPXRydWUuXG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWJsb2NrJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKS5ub3QoICQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApICkuYXR0ciggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7XG5cblx0XHQvLyBTZXQgdGhpcyBpdGVtIHRvIGFyaWEtaGlkZGVuPWZhbHNlLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1pdGVtJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tY29udGVudCcgKS5hdHRyKCAnYXJpYS1oaWRkZW4nLCBpc0V4cGFuZGVkID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuXG5cdFx0Ly8gSGlkZSB0aGUgb3RoZXIgcGFuZWxzLlxuXHRcdCQoIHRoaXMgKS5wYXJlbnRzKCAnLmFjY29yZGlvbi1ibG9jaycgKS5maW5kKCAnLmFjY29yZGlvbi1pdGVtJyApLm5vdCggJCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkgKS5yZW1vdmVDbGFzcyggJ29wZW4nICk7XG5cdFx0JCggdGhpcyApLnBhcmVudHMoICcuYWNjb3JkaW9uLWJsb2NrJyApLmZpbmQoICcuYWNjb3JkaW9uLWl0ZW0tdG9nZ2xlJyApLm5vdCggJCggdGhpcyApICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0YXBwLm9wZW5IYXNoQWNjb3JkaW9uID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoICEgYXBwLiRjLmFuY2hvcklELnNlbGVjdG9yICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFRyaWdnZXIgYSBjbGljayBvbiB0aGUgYnV0dG9uIGNsb3Nlc3QgdG8gdGhpcyBhY2NvcmRpb24uXG5cdFx0YXBwLiRjLmFuY2hvcklELnBhcmVudHMoICcuYWNjb3JkaW9uLWl0ZW0nICkuZmluZCggJy5hY2NvcmRpb24taXRlbS10b2dnbGUnICkudHJpZ2dlciggJ2NsaWNrJyApO1xuXG5cdFx0Ly8gTm90IHNldHRpbmcgYSBjYWNoZWQgdmFyaWFibGUgYXMgaXQgZG9lc24ndCBzZWVtIHRvIGdyYWIgdGhlIGhlaWdodCBwcm9wZXJseS5cblx0XHRjb25zdCBhZG1pbkJhckhlaWdodCA9ICQoICcjd3BhZG1pbmJhcicgKS5sZW5ndGggPyAkKCAnI3dwYWRtaW5iYXInICkuaGVpZ2h0KCkgOiAwO1xuXG5cdFx0Ly8gQW5pbWF0ZSB0byB0aGUgZGl2IGZvciBhIG5pY2VyIGV4cGVyaWVuY2UuXG5cdFx0YXBwLiRjLmh0bWwuYW5pbWF0ZSgge1xuXHRcdFx0c2Nyb2xsVG9wOiBhcHAuJGMuYW5jaG9ySUQub2Zmc2V0KCkudG9wIC0gYWRtaW5CYXJIZWlnaHRcblx0XHR9LCAnc2xvdycgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2Vcblx0YXBwLmluaXQoKTtcblxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuYWNjb3JkaW9uQmxvY2tUb2dnbGUgKSApO1xuIiwiLyoqXG4gKiBGaWxlIGNhcm91c2VsLmpzXG4gKlxuICogRGVhbCB3aXRoIHRoZSBjYXJvdXNlbC5cbiAqL1xud2luZG93Lndkc0Nhcm91c2VsID0ge307XG4oIGZ1bmN0aW9uKCB3aW5kb3csICQsIGFwcCApIHtcblxuXHQvLyBDb25zdHJ1Y3Rvci5cblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdC8vIElmIHdlJ3JlIGluIGFuIEFDRiBlZGl0IHBhZ2UuXG5cdFx0aWYgKCB3aW5kb3cuYWNmICkge1xuXHRcdFx0YXBwLmRvQ2Fyb3VzZWwoKTtcblx0XHR9XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHR0aGVDYXJvdXNlbDogJCggJy5jYXJvdXNlbC1ibG9jaycgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmRvQ2Fyb3VzZWwgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMudGhlQ2Fyb3VzZWwubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFsbG93IGJhY2tncm91bmQgdmlkZW9zIHRvIGF1dG9wbGF5LlxuXHRhcHAucGxheUJhY2tncm91bmRWaWRlb3MgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEdldCBhbGwgdGhlIHZpZGVvcyBpbiBvdXIgc2xpZGVzIG9iamVjdC5cblx0XHQkKCAndmlkZW8nICkuZWFjaCggZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIExldCB0aGVtIGF1dG9wbGF5LiBUT0RPOiBQb3NzaWJseSBjaGFuZ2UgdGhpcyBsYXRlciB0byBvbmx5IHBsYXkgdGhlIHZpc2libGUgc2xpZGUgdmlkZW8uXG5cdFx0XHR0aGlzLnBsYXkoKTtcblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gVGhlIGNhcm91c2VsIGluaXRpYWxpemVzIGRpZmZlcmVudGx5IG9uIHRoZSBiYWNrZW5kLlxuXHRhcHAuaW5pdENhcm91c2VsT25CYWNrZW5kID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgc2xpZGVyID0gdG5zKCB7XG5cdFx0XHRjb250YWluZXI6ICcuY2Fyb3VzZWwtYmxvY2snLFxuXHRcdFx0aXRlbXM6IDEsXG5cdFx0XHRzbGlkZUJ5OiAncGFnZScsXG5cdFx0XHRhdXRvcGxheTogZmFsc2UsXG5cdFx0XHRuYXZQb3NpdGlvbjogJ2JvdHRvbScsXG5cdFx0XHRhdXRvcGxheVBvc2l0aW9uOiAnYm90dG9tJyxcblx0XHRcdGF1dG9wbGF5VGltZW91dDogXCI1MDAwXCIsXG5cdFx0fSApO1xuXG5cdFx0YXBwLnNldEluaXRpYWxMaW5rQXR0cmlidXRlcyggc2xpZGVyICk7XG5cdFx0YXBwLnNldExpbmtTdGF0ZXNPbkNoYW5nZSggc2xpZGVyICk7XG5cdH07XG5cblx0Ly8gVGhlIGNhcm91c2VsIGluaXRpYWxpemVzIGRpZmZlcmVudGx5IG9uIHRoZSBmcm9udGVuZC5cblx0YXBwLmluaXRDYXJvdXNlbE9uRnJvbnRlbmQgPSBmdW5jdGlvbigpIHtcblxuXHRcdGxldCBibG9ja0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmNhcm91c2VsLWJsb2NrJyApO1xuXG5cdFx0W10uZm9yRWFjaC5jYWxsKCBibG9ja0xpc3QsIGZ1bmN0aW9uKCBpdGVtICkge1xuXHRcdFx0dmFyIHNsaWRlciA9IHRucygge1xuXHRcdFx0XHRjb250YWluZXI6IGl0ZW0sXG5cdFx0XHRcdGl0ZW1zOiAxLFxuXHRcdFx0XHRzbGlkZUJ5OiAncGFnZScsXG5cdFx0XHRcdGF1dG9wbGF5OiBmYWxzZSxcblx0XHRcdFx0bmF2UG9zaXRpb246ICdib3R0b20nLFxuXHRcdFx0XHRhdXRvcGxheVBvc2l0aW9uOiAnYm90dG9tJyxcblx0XHRcdFx0YXV0b3BsYXlUaW1lb3V0OiBcIjUwMDBcIixcblx0XHRcdH0gKTtcblxuXHRcdFx0YXBwLnNldEluaXRpYWxMaW5rQXR0cmlidXRlcyggc2xpZGVyICk7XG5cdFx0XHRhcHAuc2V0TGlua1N0YXRlc09uQ2hhbmdlKCBzbGlkZXIgKTtcblx0XHR9KTtcblx0fTtcblxuXHQvLyBLaWNrIG9mZiB0aGUgY2Fyb3VzZWwuXG5cdGFwcC5kb0Nhcm91c2VsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBSZW5kZXIgb24gdGhlIGJhY2tlbmQuXG5cdFx0aWYgKCB3aW5kb3cuYWNmICkge1xuXHRcdFx0d2luZG93LmFjZi5hZGRBY3Rpb24oICdyZW5kZXJfYmxvY2tfcHJldmlldycsIGFwcC5pbml0Q2Fyb3VzZWxPbkJhY2tlbmQgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gUmVuZGVyIG9uIHRoZSBmcm9udGVuZC5cblx0XHRcdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRhcHAuJGMudGhlQ2Fyb3VzZWwub24oICdpbml0JywgYXBwLnBsYXlCYWNrZ3JvdW5kVmlkZW9zICk7XG5cdFx0XHRcdGFwcC5pbml0Q2Fyb3VzZWxPbkZyb250ZW5kKCk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIFNldCBsaW5rIGF0dHJpYnV0ZXMgb24gbG9hZCBzbyB3ZSBjYW4ndCB0YWIgdG8gaW5hY3RpdmUgc2xpZGVzLlxuXHRhcHAuc2V0SW5pdGlhbExpbmtBdHRyaWJ1dGVzID0gZnVuY3Rpb24oIHNsaWRlciApIHtcblxuXHRcdHZhciBpbmZvID0gc2xpZGVyLmdldEluZm8oKSxcblx0XHRcdGFsbFNsaWRlcyA9IGluZm8uc2xpZGVJdGVtcyxcblx0XHRcdGN1cnJlbnRTbGlkZSA9IGluZm8uaW5kZXg7XG5cblx0XHQvLyBTZXQgQUxMIGxpbmtzIGFuZCBidXR0b25zIGluIEFMTCBzbGlkZXMgdG8gdGFiaW5kZXggLTEuXG5cdFx0T2JqZWN0LmtleXMoIGFsbFNsaWRlcyApLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZSApIHtcblx0XHRcdGFsbFNsaWRlc1tzbGlkZV0ucXVlcnlTZWxlY3RvckFsbCggJ2EsIGJ1dHRvbicgKS5mb3JFYWNoKCBsaW5rcyA9PiBsaW5rcy5zZXRBdHRyaWJ1dGUoICd0YWJpbmRleCcsICctMScgKSApO1xuXHRcdH0pO1xuXG5cdFx0Ly8gU2V0IHRoZSBJTklUSUFMIHNsaWRlIGxpbmtzIGFuZCBidXR0b25zIHRvIHRhYmluZGV4IDAuIFRoaXMgb25seSBoYXBwZW5zIG9uY2UuXG5cdFx0aW5mby5zbGlkZUl0ZW1zW2N1cnJlbnRTbGlkZV0ucXVlcnlTZWxlY3RvckFsbCggJ2EsIGJ1dHRvbicgKS5mb3JFYWNoKCBsaW5rcyA9PiBsaW5rcy5zZXRBdHRyaWJ1dGUoICd0YWJpbmRleCcsICcwJyApICk7XG5cdH07XG5cblx0Ly8gQ2hhbmdlIGxpbmsgdGFiaW5kZXggdmFsdWVzIG9uIHNsaWRlIGNoYW5nZSBzbyBvbmx5IHRoZSBjdXJyZW50IHNsaWRlIGlzIHRhYi1hYmxlLlxuXHRhcHAuc2V0TGlua1N0YXRlc09uQ2hhbmdlID0gZnVuY3Rpb24oIHNsaWRlciApIHtcblxuXHRcdC8vIExpc3RlbiBmb3Igc2xpZGUgY2hhbmdlcy5cblx0XHRzbGlkZXIuZXZlbnRzLm9uKCAnaW5kZXhDaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdC8vIEdldCBzbGlkZXIgaW5mby5cblx0XHRcdHZhciBDaGFuZ2VJbmZvID0gc2xpZGVyLmdldEluZm8oKSxcblx0XHRcdFx0YWxsU2xpZGVzID0gQ2hhbmdlSW5mby5zbGlkZUl0ZW1zLFxuXHRcdFx0XHRjdXJyZW50U2xpZGUgPSBDaGFuZ2VJbmZvLmluZGV4O1xuXG5cdFx0XHQvLyBTZXQgQUxMIGxpbmtzIGFuZCBidXR0b25zIGluIEFMTCBzbGlkZXMgdG8gdGFiaW5kZXggLTEuXG5cdFx0XHRPYmplY3Qua2V5cyggYWxsU2xpZGVzICkuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlICkge1xuXHRcdFx0XHRhbGxTbGlkZXNbc2xpZGVdLnF1ZXJ5U2VsZWN0b3JBbGwoICdhLCBidXR0b24nICkuZm9yRWFjaCggbGlua3MgPT4gbGlua3Muc2V0QXR0cmlidXRlKCAndGFiaW5kZXgnLCAnLTEnICkgKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBTZXQgdGhlIENVUlJFTlQgc2xpZGUgbGlua3MgYW5kIGJ1dHRvbnMgdG8gdGFiaW5kZXggMC5cblx0XHRcdGFsbFNsaWRlc1tjdXJyZW50U2xpZGVdLnF1ZXJ5U2VsZWN0b3JBbGwoICdhLCBidXR0b24nICkuZm9yRWFjaCggbGlua3MgPT4gbGlua3Muc2V0QXR0cmlidXRlKCAndGFiaW5kZXgnLCAnMCcgKSApO1xuXHRcdH0gKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59ICggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNDYXJvdXNlbCApICk7XG4iLCIvKipcbiAqIFNob3cvSGlkZSB0aGUgU2VhcmNoIEZvcm0gaW4gdGhlIGhlYWRlci5cbiAqXG4gKiBAYXV0aG9yIENvcmV5IENvbGxpbnNcbiAqL1xud2luZG93LlNob3dIaWRlU2VhcmNoRm9ybSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0Ym9keTogJCggJ2JvZHknICksXG5cdFx0XHRoZWFkZXJTZWFyY2hUb2dnbGU6ICQoICcuc2l0ZS1oZWFkZXItYWN0aW9uIC5jdGEtYnV0dG9uJyApLFxuXHRcdFx0aGVhZGVyU2VhcmNoRm9ybTogJCggJy5zaXRlLWhlYWRlci1hY3Rpb24gLmZvcm0tY29udGFpbmVyJyApLFxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmhlYWRlclNlYXJjaFRvZ2dsZS5vbiggJ2tleXVwIHRvdWNoc3RhcnQgY2xpY2snLCBhcHAuc2hvd0hpZGVTZWFyY2hGb3JtICk7XG5cdFx0YXBwLiRjLmJvZHkub24oICdrZXl1cCB0b3VjaHN0YXJ0IGNsaWNrJywgYXBwLmhpZGVTZWFyY2hGb3JtICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLmhlYWRlclNlYXJjaFRvZ2dsZS5sZW5ndGg7XG5cdH07XG5cblx0Ly8gQ2hlY2tzIHRvIHNlZSBpZiB0aGUgbWVudSBoYXMgYmVlbiBvcGVuZWQuXG5cdGFwcC5zZWFyY2hJc09wZW4gPSBmdW5jdGlvbigpIHtcblxuXHRcdGlmICggYXBwLiRjLmJvZHkuaGFzQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApICkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cdC8vIEFkZHMgdGhlIHRvZ2dsZSBjbGFzcyBmb3IgdGhlIHNlYXJjaCBmb3JtLlxuXHRhcHAuc2hvd0hpZGVTZWFyY2hGb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkudG9nZ2xlQ2xhc3MoICdzZWFyY2gtZm9ybS12aXNpYmxlJyApO1xuXG5cdFx0YXBwLnRvZ2dsZVNlYXJjaEZvcm1BcmlhTGFiZWwoKTtcblx0XHRhcHAudG9nZ2xlU2VhcmNoVG9nZ2xlQXJpYUxhYmVsKCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0Ly8gSGlkZXMgdGhlIHNlYXJjaCBmb3JtIGlmIHdlIGNsaWNrIG91dHNpZGUgb2YgaXRzIGNvbnRhaW5lci5cblx0YXBwLmhpZGVTZWFyY2hGb3JtID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0aWYgKCAhICQoIGV2ZW50LnRhcmdldCApLnBhcmVudHMoICdkaXYnICkuaGFzQ2xhc3MoICdzaXRlLWhlYWRlci1hY3Rpb24nICkgKSB7XG5cdFx0XHRhcHAuJGMuYm9keS5yZW1vdmVDbGFzcyggJ3NlYXJjaC1mb3JtLXZpc2libGUnICk7XG5cdFx0XHRhcHAudG9nZ2xlU2VhcmNoRm9ybUFyaWFMYWJlbCgpO1xuXHRcdFx0YXBwLnRvZ2dsZVNlYXJjaFRvZ2dsZUFyaWFMYWJlbCgpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBUb2dnbGVzIHRoZSBhcmlhLWhpZGRlbiBsYWJlbCBvbiB0aGUgZm9ybSBjb250YWluZXIuXG5cdGFwcC50b2dnbGVTZWFyY2hGb3JtQXJpYUxhYmVsID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmhlYWRlclNlYXJjaEZvcm0uYXR0ciggJ2FyaWEtaGlkZGVuJywgYXBwLnNlYXJjaElzT3BlbigpID8gJ2ZhbHNlJyA6ICd0cnVlJyApO1xuXHR9O1xuXG5cdC8vIFRvZ2dsZXMgdGhlIGFyaWEtaGlkZGVuIGxhYmVsIG9uIHRoZSB0b2dnbGUgYnV0dG9uLlxuXHRhcHAudG9nZ2xlU2VhcmNoVG9nZ2xlQXJpYUxhYmVsID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmhlYWRlclNlYXJjaFRvZ2dsZS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIGFwcC5zZWFyY2hJc09wZW4oKSA/ICd0cnVlJyA6ICdmYWxzZScgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2Vcblx0JCggYXBwLmluaXQgKTtcblxufSAoIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuU2hvd0hpZGVTZWFyY2hGb3JtICkgKTtcbiIsIi8qKlxuICogRmlsZSBqcy1lbmFibGVkLmpzXG4gKlxuICogSWYgSmF2YXNjcmlwdCBpcyBlbmFibGVkLCByZXBsYWNlIHRoZSA8Ym9keT4gY2xhc3MgXCJuby1qc1wiLlxuICovXG5kb2N1bWVudC5ib2R5LmNsYXNzTmFtZSA9IGRvY3VtZW50LmJvZHkuY2xhc3NOYW1lLnJlcGxhY2UoICduby1qcycsICdqcycgKTtcbiIsIi8qKlxuICogRmlsZTogbW9iaWxlLW1lbnUuanNcbiAqXG4gKiBDcmVhdGUgYW4gYWNjb3JkaW9uIHN0eWxlIGRyb3Bkb3duLlxuICovXG53aW5kb3cud2RzTW9iaWxlTWVudSA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdGJvZHk6ICQoICdib2R5JyApLFxuXHRcdFx0d2luZG93OiAkKCB3aW5kb3cgKSxcblx0XHRcdHN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51LCAudXRpbGl0eS1uYXZpZ2F0aW9uIC5zdWItbWVudScgKSxcblx0XHRcdHN1YlN1Yk1lbnVDb250YWluZXI6ICQoICcubW9iaWxlLW1lbnUgLnN1Yi1tZW51IC5zdWItbWVudScgKSxcblx0XHRcdHN1Yk1lbnVQYXJlbnRJdGVtOiAkKCAnLm1vYmlsZS1tZW51IGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4sIC51dGlsaXR5LW5hdmlnYXRpb24gbGkubWVudS1pdGVtLWhhcy1jaGlsZHJlbicgKSxcblx0XHRcdG9mZkNhbnZhc0NvbnRhaW5lcjogJCggJy5vZmYtY2FudmFzLWNvbnRhaW5lcicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy53aW5kb3cub24oICdsb2FkJywgYXBwLmFkZERvd25BcnJvdyApO1xuXHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5vbiggJ2NsaWNrJywgYXBwLnRvZ2dsZVN1Ym1lbnUgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0ub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLnJlc2V0U3ViTWVudSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIub24oICd0cmFuc2l0aW9uZW5kJywgYXBwLmZvcmNlQ2xvc2VTdWJtZW51cyApO1xuXHR9O1xuXG5cdC8vIERvIHdlIG1lZXQgdGhlIHJlcXVpcmVtZW50cz9cblx0YXBwLm1lZXRzUmVxdWlyZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBSZXNldCB0aGUgc3VibWVudXMgYWZ0ZXIgaXQncyBkb25lIGNsb3NpbmcuXG5cdGFwcC5yZXNldFN1Yk1lbnUgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFdoZW4gdGhlIGxpc3QgaXRlbSBpcyBkb25lIHRyYW5zaXRpb25pbmcgaW4gaGVpZ2h0LFxuXHRcdC8vIHJlbW92ZSB0aGUgY2xhc3NlcyBmcm9tIHRoZSBzdWJtZW51IHNvIGl0IGlzIHJlYWR5IHRvIHRvZ2dsZSBhZ2Fpbi5cblx0XHRpZiAoICQoIHRoaXMgKS5pcyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkgJiYgISAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy12aXNpYmxlJyApICkge1xuXHRcdFx0JCggdGhpcyApLmZpbmQoICd1bC5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlT3V0TGVmdCBpcy12aXNpYmxlJyApO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudSBpdGVtcy5cblx0YXBwLnNsaWRlT3V0U3ViTWVudXMgPSBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHQvLyBJZiB0aGlzIGl0ZW0ncyBwYXJlbnQgaXMgdmlzaWJsZSBhbmQgdGhpcyBpcyBub3QsIGJhaWwuXG5cdFx0aWYgKCBlbC5wYXJlbnQoKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgJiYgISBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhpcyBpdGVtJ3MgcGFyZW50IGlzIHZpc2libGUgYW5kIHRoaXMgaXRlbSBpcyB2aXNpYmxlLCBoaWRlIGl0cyBzdWJtZW51IHRoZW4gYmFpbC5cblx0XHRpZiAoIGVsLnBhcmVudCgpLmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSAmJiBlbC5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRlbC5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5zdWItbWVudScgKS5yZW1vdmVDbGFzcyggJ3NsaWRlSW5MZWZ0JyApLmFkZENsYXNzKCAnc2xpZGVPdXRMZWZ0JyApO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGFwcC4kYy5zdWJNZW51Q29udGFpbmVyLmVhY2goIGZ1bmN0aW9uKCkge1xuXG5cdFx0XHQvLyBPbmx5IHRyeSB0byBjbG9zZSBzdWJtZW51cyB0aGF0IGFyZSBhY3R1YWxseSBvcGVuLlxuXHRcdFx0aWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdzbGlkZUluTGVmdCcgKSApIHtcblxuXHRcdFx0XHQvLyBDbG9zZSB0aGUgcGFyZW50IGxpc3QgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byBmYWxzZS5cblx0XHRcdFx0JCggdGhpcyApLnBhcmVudCgpLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKS5maW5kKCAnLnBhcmVudC1pbmRpY2F0b3InICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSApO1xuXG5cdFx0XHRcdC8vIFNsaWRlIG91dCB0aGUgc3VibWVudS5cblx0XHRcdFx0JCggdGhpcyApLnJlbW92ZUNsYXNzKCAnc2xpZGVJbkxlZnQnICkuYWRkQ2xhc3MoICdzbGlkZU91dExlZnQnICk7XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gQWRkIHRoZSBkb3duIGFycm93IHRvIHN1Ym1lbnUgcGFyZW50cy5cblx0YXBwLmFkZERvd25BcnJvdyA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLiRjLnN1Yk1lbnVQYXJlbnRJdGVtLmZpbmQoICdhOmZpcnN0JyApLmFmdGVyKCAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgY2xhc3M9XCJwYXJlbnQtaW5kaWNhdG9yXCIgYXJpYS1sYWJlbD1cIk9wZW4gc3VibWVudVwiPjxzcGFuIGNsYXNzPVwiZG93bi1hcnJvd1wiPjwvc3Bhbj48L2J1dHRvbj4nICk7XG5cdH07XG5cblx0Ly8gRGVhbCB3aXRoIHRoZSBzdWJtZW51LlxuXHRhcHAudG9nZ2xlU3VibWVudSA9IGZ1bmN0aW9uKCBlICkge1xuXG5cdFx0bGV0IGVsID0gJCggdGhpcyApLCAvLyBUaGUgbWVudSBlbGVtZW50IHdoaWNoIHdhcyBjbGlja2VkIG9uLlxuXHRcdFx0c3ViTWVudSA9IGVsLmNoaWxkcmVuKCAndWwuc3ViLW1lbnUnICksIC8vIFRoZSBuZWFyZXN0IHN1Ym1lbnUuXG5cdFx0XHQkdGFyZ2V0ID0gJCggZS50YXJnZXQgKTsgLy8gdGhlIGVsZW1lbnQgdGhhdCdzIGFjdHVhbGx5IGJlaW5nIGNsaWNrZWQgKGNoaWxkIG9mIHRoZSBsaSB0aGF0IHRyaWdnZXJlZCB0aGUgY2xpY2sgZXZlbnQpLlxuXG5cdFx0Ly8gRmlndXJlIG91dCBpZiB3ZSdyZSBjbGlja2luZyB0aGUgYnV0dG9uIG9yIGl0cyBhcnJvdyBjaGlsZCxcblx0XHQvLyBpZiBzbywgd2UgY2FuIGp1c3Qgb3BlbiBvciBjbG9zZSB0aGUgbWVudSBhbmQgYmFpbC5cblx0XHRpZiAoICR0YXJnZXQuaGFzQ2xhc3MoICdkb3duLWFycm93JyApIHx8ICR0YXJnZXQuaGFzQ2xhc3MoICdwYXJlbnQtaW5kaWNhdG9yJyApICkge1xuXG5cdFx0XHQvLyBGaXJzdCwgY29sbGFwc2UgYW55IGFscmVhZHkgb3BlbmVkIHN1Ym1lbnVzLlxuXHRcdFx0YXBwLnNsaWRlT3V0U3ViTWVudXMoIGVsICk7XG5cblx0XHRcdGlmICggISBzdWJNZW51Lmhhc0NsYXNzKCAnaXMtdmlzaWJsZScgKSApIHtcblxuXHRcdFx0XHQvLyBPcGVuIHRoZSBzdWJtZW51LlxuXHRcdFx0XHRhcHAub3BlblN1Ym1lbnUoIGVsLCBzdWJNZW51ICk7XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8vIE9wZW4gYSBzdWJtZW51LlxuXHRhcHAub3BlblN1Ym1lbnUgPSBmdW5jdGlvbiggcGFyZW50LCBzdWJNZW51ICkge1xuXG5cdFx0Ly8gRXhwYW5kIHRoZSBsaXN0IG1lbnUgaXRlbSwgYW5kIHNldCB0aGUgY29ycmVzcG9uZGluZyBidXR0b24gYXJpYSB0byB0cnVlLlxuXHRcdHBhcmVudC5hZGRDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgdHJ1ZSApO1xuXG5cdFx0Ly8gU2xpZGUgdGhlIG1lbnUgaW4uXG5cdFx0c3ViTWVudS5hZGRDbGFzcyggJ2lzLXZpc2libGUgYW5pbWF0ZWQgc2xpZGVJbkxlZnQnICk7XG5cdH07XG5cblx0Ly8gRm9yY2UgY2xvc2UgYWxsIHRoZSBzdWJtZW51cyB3aGVuIHRoZSBtYWluIG1lbnUgY29udGFpbmVyIGlzIGNsb3NlZC5cblx0YXBwLmZvcmNlQ2xvc2VTdWJtZW51cyA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoICQoIGV2ZW50LnRhcmdldCApLmhhc0NsYXNzKCAnb2ZmLWNhbnZhcy1jb250YWluZXInICkgKSB7XG5cblx0XHRcdC8vIEZvY3VzIG9mZmNhbnZhcyBtZW51IGZvciBhMTF5LlxuXHRcdFx0YXBwLiRjLm9mZkNhbnZhc0NvbnRhaW5lci5mb2N1cygpO1xuXG5cdFx0XHQvLyBUaGUgdHJhbnNpdGlvbmVuZCBldmVudCB0cmlnZ2VycyBvbiBvcGVuIGFuZCBvbiBjbG9zZSwgbmVlZCB0byBtYWtlIHN1cmUgd2Ugb25seSBkbyB0aGlzIG9uIGNsb3NlLlxuXHRcdFx0aWYgKCAhICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRcdGFwcC4kYy5zdWJNZW51UGFyZW50SXRlbS5yZW1vdmVDbGFzcyggJ2lzLXZpc2libGUnICkuZmluZCggJy5wYXJlbnQtaW5kaWNhdG9yJyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRcdFx0YXBwLiRjLnN1Yk1lbnVDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlIHNsaWRlSW5MZWZ0JyApO1xuXHRcdFx0XHRhcHAuJGMuYm9keS5jc3MoICdvdmVyZmxvdycsICd2aXNpYmxlJyApO1xuXHRcdFx0XHRhcHAuJGMuYm9keS51bmJpbmQoICd0b3VjaHN0YXJ0JyApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoICQoIHRoaXMgKS5oYXNDbGFzcyggJ2lzLXZpc2libGUnICkgKSB7XG5cdFx0XHRcdGFwcC4kYy5ib2R5LmNzcyggJ292ZXJmbG93JywgJ2hpZGRlbicgKTtcblx0XHRcdFx0YXBwLiRjLmJvZHkuYmluZCggJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0XHRpZiAoICEgJCggZS50YXJnZXQgKS5wYXJlbnRzKCAnLmNvbnRhY3QtbW9kYWwnIClbMF0gKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNNb2JpbGVNZW51ICkgKTtcbiIsIi8qKlxuICogRmlsZSBtb2RhbC5qc1xuICpcbiAqIERlYWwgd2l0aCBtdWx0aXBsZSBtb2RhbHMgYW5kIHRoZWlyIG1lZGlhLlxuICovXG53aW5kb3cud2RzTW9kYWwgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdGxldCAkbW9kYWxUb2dnbGUsXG5cdFx0JGZvY3VzYWJsZUNoaWxkcmVuLFxuXHRcdCRwbGF5ZXIsXG5cdFx0JHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzY3JpcHQnICksXG5cdFx0JGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdzY3JpcHQnIClbMF0sXG5cdFx0WVQ7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0JGZpcnN0U2NyaXB0VGFnLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCAkdGFnLCAkZmlyc3RTY3JpcHRUYWcgKTtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHQnYm9keSc6ICQoICdib2R5JyApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkKCAnLm1vZGFsLXRyaWdnZXInICkubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFRyaWdnZXIgYSBtb2RhbCB0byBvcGVuLlxuXHRcdGFwcC4kYy5ib2R5Lm9uKCAnY2xpY2sgdG91Y2hzdGFydCcsICcubW9kYWwtdHJpZ2dlcicsIGFwcC5vcGVuTW9kYWwgKTtcblxuXHRcdC8vIFRyaWdnZXIgdGhlIGNsb3NlIGJ1dHRvbiB0byBjbG9zZSB0aGUgbW9kYWwuXG5cdFx0YXBwLiRjLmJvZHkub24oICdjbGljayB0b3VjaHN0YXJ0JywgJy5jbG9zZScsIGFwcC5jbG9zZU1vZGFsICk7XG5cblx0XHQvLyBBbGxvdyB0aGUgdXNlciB0byBjbG9zZSB0aGUgbW9kYWwgYnkgaGl0dGluZyB0aGUgZXNjIGtleS5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAuZXNjS2V5Q2xvc2UgKTtcblxuXHRcdC8vIEFsbG93IHRoZSB1c2VyIHRvIGNsb3NlIHRoZSBtb2RhbCBieSBjbGlja2luZyBvdXRzaWRlIG9mIHRoZSBtb2RhbC5cblx0XHRhcHAuJGMuYm9keS5vbiggJ2NsaWNrIHRvdWNoc3RhcnQnLCAnZGl2Lm1vZGFsLW9wZW4nLCBhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgKTtcblxuXHRcdC8vIExpc3RlbiB0byB0YWJzLCB0cmFwIGtleWJvYXJkIGlmIHdlIG5lZWQgdG9cblx0XHRhcHAuJGMuYm9keS5vbiggJ2tleWRvd24nLCBhcHAudHJhcEtleWJvYXJkTWF5YmUgKTtcblxuXHR9O1xuXG5cdC8vIE9wZW4gdGhlIG1vZGFsLlxuXHRhcHAub3Blbk1vZGFsID0gZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTdG9yZSB0aGUgbW9kYWwgdG9nZ2xlIGVsZW1lbnRcblx0XHQkbW9kYWxUb2dnbGUgPSAkKCB0aGlzICk7XG5cblx0XHQvLyBGaWd1cmUgb3V0IHdoaWNoIG1vZGFsIHdlJ3JlIG9wZW5pbmcgYW5kIHN0b3JlIHRoZSBvYmplY3QuXG5cdFx0bGV0ICRtb2RhbCA9ICQoICQoIHRoaXMgKS5kYXRhKCAndGFyZ2V0JyApICk7XG5cblx0XHQvLyBEaXNwbGF5IHRoZSBtb2RhbC5cblx0XHQkbW9kYWwuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gQWRkIGJvZHkgY2xhc3MuXG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gRmluZCB0aGUgZm9jdXNhYmxlIGNoaWxkcmVuIG9mIHRoZSBtb2RhbC5cblx0XHQvLyBUaGlzIGxpc3QgbWF5IGJlIGluY29tcGxldGUsIHJlYWxseSB3aXNoIGpRdWVyeSBoYWQgdGhlIDpmb2N1c2FibGUgcHNldWRvIGxpa2UgalF1ZXJ5IFVJIGRvZXMuXG5cdFx0Ly8gRm9yIG1vcmUgYWJvdXQgOmlucHV0IHNlZTogaHR0cHM6Ly9hcGkuanF1ZXJ5LmNvbS9pbnB1dC1zZWxlY3Rvci9cblx0XHQkZm9jdXNhYmxlQ2hpbGRyZW4gPSAkbW9kYWwuZmluZCggJ2EsIDppbnB1dCwgW3RhYmluZGV4XScgKTtcblxuXHRcdC8vIElkZWFsbHksIHRoZXJlIGlzIGFsd2F5cyBvbmUgKHRoZSBjbG9zZSBidXR0b24pLCBidXQgeW91IG5ldmVyIGtub3cuXG5cdFx0aWYgKCAwIDwgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gU2hpZnQgZm9jdXMgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0JGZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhlIG1vZGFsLlxuXHRhcHAuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0Ly8gRmlndXJlIHRoZSBvcGVuZWQgbW9kYWwgd2UncmUgY2xvc2luZyBhbmQgc3RvcmUgdGhlIG9iamVjdC5cblx0XHRsZXQgJG1vZGFsID0gJCggJCggJ2Rpdi5tb2RhbC1vcGVuIC5jbG9zZScgKS5kYXRhKCAndGFyZ2V0JyApICksXG5cblx0XHRcdC8vIEZpbmQgdGhlIGlmcmFtZSBpbiB0aGUgJG1vZGFsIG9iamVjdC5cblx0XHRcdCRpZnJhbWUgPSAkbW9kYWwuZmluZCggJ2lmcmFtZScgKTtcblxuXHRcdC8vIE9ubHkgZG8gdGhpcyBpZiB0aGVyZSBhcmUgYW55IGlmcmFtZXMuXG5cdFx0aWYgKCAkaWZyYW1lLmxlbmd0aCApIHtcblxuXHRcdFx0Ly8gR2V0IHRoZSBpZnJhbWUgc3JjIFVSTC5cblx0XHRcdGxldCB1cmwgPSAkaWZyYW1lLmF0dHIoICdzcmMnICk7XG5cblx0XHRcdC8vIFJlbW92aW5nL1JlYWRkaW5nIHRoZSBVUkwgd2lsbCBlZmZlY3RpdmVseSBicmVhayB0aGUgWW91VHViZSBBUEkuXG5cdFx0XHQvLyBTbyBsZXQncyBub3QgZG8gdGhhdCB3aGVuIHRoZSBpZnJhbWUgVVJMIGNvbnRhaW5zIHRoZSBlbmFibGVqc2FwaSBwYXJhbWV0ZXIuXG5cdFx0XHRpZiAoICEgdXJsLmluY2x1ZGVzKCAnZW5hYmxlanNhcGk9MScgKSApIHtcblxuXHRcdFx0XHQvLyBSZW1vdmUgdGhlIHNvdXJjZSBVUkwsIHRoZW4gYWRkIGl0IGJhY2ssIHNvIHRoZSB2aWRlbyBjYW4gYmUgcGxheWVkIGFnYWluIGxhdGVyLlxuXHRcdFx0XHQkaWZyYW1lLmF0dHIoICdzcmMnLCAnJyApLmF0dHIoICdzcmMnLCB1cmwgKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0Ly8gVXNlIHRoZSBZb3VUdWJlIEFQSSB0byBzdG9wIHRoZSB2aWRlby5cblx0XHRcdFx0JHBsYXllci5zdG9wVmlkZW8oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBGaW5hbGx5LCBoaWRlIHRoZSBtb2RhbC5cblx0XHQkbW9kYWwucmVtb3ZlQ2xhc3MoICdtb2RhbC1vcGVuJyApO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBib2R5IGNsYXNzLlxuXHRcdGFwcC4kYy5ib2R5LnJlbW92ZUNsYXNzKCAnbW9kYWwtb3BlbicgKTtcblxuXHRcdC8vIFJldmVydCBmb2N1cyBiYWNrIHRvIHRvZ2dsZSBlbGVtZW50XG5cdFx0JG1vZGFsVG9nZ2xlLmZvY3VzKCk7XG5cblx0fTtcblxuXHQvLyBDbG9zZSBpZiBcImVzY1wiIGtleSBpcyBwcmVzc2VkLlxuXHRhcHAuZXNjS2V5Q2xvc2UgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0aWYgKCAyNyA9PT0gZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdGFwcC5jbG9zZU1vZGFsKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENsb3NlIGlmIHRoZSB1c2VyIGNsaWNrcyBvdXRzaWRlIG9mIHRoZSBtb2RhbFxuXHRhcHAuY2xvc2VNb2RhbEJ5Q2xpY2sgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG5cblx0XHQvLyBJZiB0aGUgcGFyZW50IGNvbnRhaW5lciBpcyBOT1QgdGhlIG1vZGFsIGRpYWxvZyBjb250YWluZXIsIGNsb3NlIHRoZSBtb2RhbFxuXHRcdGlmICggISAkKCBldmVudC50YXJnZXQgKS5wYXJlbnRzKCAnZGl2JyApLmhhc0NsYXNzKCAnbW9kYWwtZGlhbG9nJyApICkge1xuXHRcdFx0YXBwLmNsb3NlTW9kYWwoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gVHJhcCB0aGUga2V5Ym9hcmQgaW50byBhIG1vZGFsIHdoZW4gb25lIGlzIGFjdGl2ZS5cblx0YXBwLnRyYXBLZXlib2FyZE1heWJlID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gV2Ugb25seSBuZWVkIHRvIGRvIHN0dWZmIHdoZW4gdGhlIG1vZGFsIGlzIG9wZW4gYW5kIHRhYiBpcyBwcmVzc2VkLlxuXHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggJiYgMCA8ICQoICcubW9kYWwtb3BlbicgKS5sZW5ndGggKSB7XG5cdFx0XHRsZXQgJGZvY3VzZWQgPSAkKCAnOmZvY3VzJyApLFxuXHRcdFx0XHRmb2N1c0luZGV4ID0gJGZvY3VzYWJsZUNoaWxkcmVuLmluZGV4KCAkZm9jdXNlZCApO1xuXG5cdFx0XHRpZiAoIDAgPT09IGZvY3VzSW5kZXggJiYgZXZlbnQuc2hpZnRLZXkgKSB7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQsIGFuZCBzaGlmdCBpcyBoZWxkIHdoZW4gcHJlc3NpbmcgdGFiLCBnbyBiYWNrIHRvIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnQuXG5cdFx0XHRcdCRmb2N1c2FibGVDaGlsZHJlblsgJGZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCAtIDEgXS5mb2N1cygpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSBlbHNlIGlmICggISBldmVudC5zaGlmdEtleSAmJiBmb2N1c0luZGV4ID09PSAkZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoIC0gMSApIHtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IGZvY3VzYWJsZSBlbGVtZW50LCBhbmQgc2hpZnQgaXMgbm90IGhlbGQsIGdvIGJhY2sgdG8gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50LlxuXHRcdFx0XHQkZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8gSG9vayBpbnRvIFlvdVR1YmUgPGlmcmFtZT4uXG5cdGFwcC5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHRcdGxldCAkbW9kYWwgPSAkKCAnZGl2Lm1vZGFsJyApLFxuXHRcdFx0JGlmcmFtZWlkID0gJG1vZGFsLmZpbmQoICdpZnJhbWUnICkuYXR0ciggJ2lkJyApO1xuXG5cdFx0JHBsYXllciA9IG5ldyBZVC5QbGF5ZXIoICRpZnJhbWVpZCwge1xuXHRcdFx0ZXZlbnRzOiB7XG5cdFx0XHRcdCdvblJlYWR5JzogYXBwLm9uUGxheWVyUmVhZHksXG5cdFx0XHRcdCdvblN0YXRlQ2hhbmdlJzogYXBwLm9uUGxheWVyU3RhdGVDaGFuZ2Vcblx0XHRcdH1cblx0XHR9ICk7XG5cdH07XG5cblx0Ly8gRG8gc29tZXRoaW5nIG9uIHBsYXllciByZWFkeS5cblx0YXBwLm9uUGxheWVyUmVhZHkgPSBmdW5jdGlvbigpIHtcblx0fTtcblxuXHQvLyBEbyBzb21ldGhpbmcgb24gcGxheWVyIHN0YXRlIGNoYW5nZS5cblx0YXBwLm9uUGxheWVyU3RhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIFNldCBmb2N1cyB0byB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgaW5zaWRlIG9mIHRoZSBtb2RhbCB0aGUgcGxheWVyIGlzIGluLlxuXHRcdCQoIGV2ZW50LnRhcmdldC5hICkucGFyZW50cyggJy5tb2RhbCcgKS5maW5kKCAnYSwgOmlucHV0LCBbdGFiaW5kZXhdJyApLmZpcnN0KCkuZm9jdXMoKTtcblx0fTtcblxuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzTW9kYWwgKSApO1xuIiwiLyoqXG4gKiBGaWxlOiBuYXZpZ2F0aW9uLXByaW1hcnkuanNcbiAqXG4gKiBIZWxwZXJzIGZvciB0aGUgcHJpbWFyeSBuYXZpZ2F0aW9uLlxuICovXG53aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0c3ViTWVudUNvbnRhaW5lcjogJCggJy5tYWluLW5hdmlnYXRpb24gLnN1Yi1tZW51JyApLFxuXHRcdFx0c3ViTWVudVBhcmVudEl0ZW06ICQoICcubWFpbi1uYXZpZ2F0aW9uIGxpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMud2luZG93Lm9uKCAnbG9hZCcsIGFwcC5hZGREb3duQXJyb3cgKTtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJ2EnICkub24oICdmb2N1c2luIGZvY3Vzb3V0JywgYXBwLnRvZ2dsZUZvY3VzICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnN1Yk1lbnVDb250YWluZXIubGVuZ3RoO1xuXHR9O1xuXG5cdC8vIEFkZCB0aGUgZG93biBhcnJvdyB0byBzdWJtZW51IHBhcmVudHMuXG5cdGFwcC5hZGREb3duQXJyb3cgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMuc3ViTWVudVBhcmVudEl0ZW0uZmluZCggJz4gYScgKS5hcHBlbmQoICc8c3BhbiBjbGFzcz1cImNhcmV0LWRvd25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+JyApO1xuXHR9O1xuXG5cdC8vIFRvZ2dsZSB0aGUgZm9jdXMgY2xhc3Mgb24gdGhlIGxpbmsgcGFyZW50LlxuXHRhcHAudG9nZ2xlRm9jdXMgPSBmdW5jdGlvbigpIHtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJ2xpLm1lbnUtaXRlbS1oYXMtY2hpbGRyZW4nICkudG9nZ2xlQ2xhc3MoICdmb2N1cycgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cud2RzUHJpbWFyeU5hdmlnYXRpb24gKSApO1xuIiwiLyoqXG4gKiBGaWxlOiBvZmYtY2FudmFzLmpzXG4gKlxuICogSGVscCBkZWFsIHdpdGggdGhlIG9mZi1jYW52YXMgbW9iaWxlIG1lbnUuXG4gKi9cbndpbmRvdy53ZHNvZmZDYW52YXMgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXG5cdFx0aWYgKCBhcHAubWVldHNSZXF1aXJlbWVudHMoKSApIHtcblx0XHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIENhY2hlIGFsbCB0aGUgdGhpbmdzLlxuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHRib2R5OiAkKCAnYm9keScgKSxcblx0XHRcdG9mZkNhbnZhc0Nsb3NlOiAkKCAnLm9mZi1jYW52YXMtY2xvc2UnICksXG5cdFx0XHRvZmZDYW52YXNDb250YWluZXI6ICQoICcub2ZmLWNhbnZhcy1jb250YWluZXInICksXG5cdFx0XHRvZmZDYW52YXNPcGVuOiAkKCAnLm9mZi1jYW52YXMtb3BlbicgKSxcblx0XHRcdG9mZkNhbnZhc1NjcmVlbjogJCggJy5vZmYtY2FudmFzLXNjcmVlbicgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzLlxuXHRhcHAuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5ib2R5Lm9uKCAna2V5ZG93bicsIGFwcC5lc2NLZXlDbG9zZSApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDbG9zZS5vbiggJ2NsaWNrJywgYXBwLmNsb3Nlb2ZmQ2FudmFzICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc09wZW4ub24oICdjbGljaycsIGFwcC50b2dnbGVvZmZDYW52YXMgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLm9uKCAnY2xpY2snLCBhcHAuY2xvc2VvZmZDYW52YXMgKTtcblx0fTtcblxuXHQvLyBEbyB3ZSBtZWV0IHRoZSByZXF1aXJlbWVudHM/XG5cdGFwcC5tZWV0c1JlcXVpcmVtZW50cyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmxlbmd0aDtcblx0fTtcblxuXHQvLyBUbyBzaG93IG9yIG5vdCB0byBzaG93P1xuXHRhcHAudG9nZ2xlb2ZmQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cblx0XHRpZiAoICd0cnVlJyA9PT0gJCggdGhpcyApLmF0dHIoICdhcmlhLWV4cGFuZGVkJyApICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFwcC5vcGVub2ZmQ2FudmFzKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0Ly8gU2hvdyB0aGF0IGRyYXdlciFcblx0YXBwLm9wZW5vZmZDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmFkZENsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cdFx0YXBwLiRjLm9mZkNhbnZhc1NjcmVlbi5hZGRDbGFzcyggJ2lzLXZpc2libGUnICk7XG5cblx0XHRhcHAuJGMub2ZmQ2FudmFzT3Blbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsIHRydWUgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIGZhbHNlICk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgdGhhdCBkcmF3ZXIhXG5cdGFwcC5jbG9zZW9mZkNhbnZhcyA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYy5vZmZDYW52YXNDb250YWluZXIucmVtb3ZlQ2xhc3MoICdpcy12aXNpYmxlJyApO1xuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzU2NyZWVuLnJlbW92ZUNsYXNzKCAnaXMtdmlzaWJsZScgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgZmFsc2UgKTtcblx0XHRhcHAuJGMub2ZmQ2FudmFzQ29udGFpbmVyLmF0dHIoICdhcmlhLWhpZGRlbicsIHRydWUgKTtcblxuXHRcdGFwcC4kYy5vZmZDYW52YXNPcGVuLmZvY3VzKCk7XG5cdH07XG5cblx0Ly8gQ2xvc2UgZHJhd2VyIGlmIFwiZXNjXCIga2V5IGlzIHByZXNzZWQuXG5cdGFwcC5lc2NLZXlDbG9zZSA9IGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRpZiAoIDI3ID09PSBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0YXBwLmNsb3Nlb2ZmQ2FudmFzKCk7XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEVuZ2FnZSFcblx0JCggYXBwLmluaXQgKTtcblxufSggd2luZG93LCBqUXVlcnksIHdpbmRvdy53ZHNvZmZDYW52YXMgKSApO1xuIiwiLyoqXG4gKiBGaWxlIHNraXAtbGluay1mb2N1cy1maXguanMuXG4gKlxuICogSGVscHMgd2l0aCBhY2Nlc3NpYmlsaXR5IGZvciBrZXlib2FyZCBvbmx5IHVzZXJzLlxuICpcbiAqIExlYXJuIG1vcmU6IGh0dHBzOi8vZ2l0LmlvL3ZXZHIyXG4gKi9cbiggZnVuY3Rpb24oKSB7XG5cdHZhciBpc1dlYmtpdCA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICd3ZWJraXQnICksXG5cdFx0aXNPcGVyYSA9IC0xIDwgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoICdvcGVyYScgKSxcblx0XHRpc0llID0gLTEgPCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggJ21zaWUnICk7XG5cblx0aWYgKCAoIGlzV2Via2l0IHx8IGlzT3BlcmEgfHwgaXNJZSApICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGlkID0gbG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoIDEgKSxcblx0XHRcdFx0ZWxlbWVudDtcblxuXHRcdFx0aWYgKCAhICggL15bQS16MC05Xy1dKyQvICkudGVzdCggaWQgKSApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdGlmICggZWxlbWVudCApIHtcblx0XHRcdFx0aWYgKCAhICggL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pICkudGVzdCggZWxlbWVudC50YWdOYW1lICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC50YWJJbmRleCA9IC0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZWxlbWVudC5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdH0sIGZhbHNlICk7XG5cdH1cbn0oKSApO1xuIiwiLyoqXG4gKiBNYWtlIHRhYmxlcyByZXNwb25zaXZlIGFnYWluLlxuICpcbiAqIEBhdXRob3IgSGFyaXMgWnVsZmlxYXJcbiAqL1xud2luZG93Lndkc1RhYmxlcyA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3Jcblx0YXBwLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuY2FjaGUoKTtcblxuXHRcdGlmICggYXBwLm1lZXRzUmVxdWlyZW1lbnRzKCkgKSB7XG5cdFx0XHRhcHAuYmluZEV2ZW50cygpO1xuXHRcdH1cblx0fTtcblxuXHQvLyBDYWNoZSBhbGwgdGhlIHRoaW5nc1xuXHRhcHAuY2FjaGUgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMgPSB7XG5cdFx0XHR3aW5kb3c6ICQoIHdpbmRvdyApLFxuXHRcdFx0dGFibGU6ICQoICd0YWJsZScgKVxuXHRcdH07XG5cdH07XG5cblx0Ly8gQ29tYmluZSBhbGwgZXZlbnRzXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5vbiggJ2xvYWQnLCBhcHAuYWRkRGF0YUxhYmVsICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnRhYmxlLmxlbmd0aDtcblx0fTtcblxuXHQvLyBBZGRzIGRhdGEtbGFiZWwgdG8gdGQgYmFzZWQgb24gdGguXG5cdGFwcC5hZGREYXRhTGFiZWwgPSBmdW5jdGlvbigpIHtcblx0XHRjb25zdCB0YWJsZSA9IGFwcC4kYy50YWJsZTtcblx0XHRjb25zdCB0YWJsZUhlYWRlcnMgPSB0YWJsZS5maW5kKCAndGhlYWQgdGgnICk7XG5cdFx0Y29uc3QgdGFibGVSb3cgPSB0YWJsZS5maW5kKCAndGJvZHkgdHInICk7XG5cblx0XHR0YWJsZVJvdy5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnN0IHRkID0gJCggdGhpcyApLmZpbmQoICd0ZCcgKTtcblxuXHRcdFx0dGQuZWFjaCggZnVuY3Rpb24oIGluZGV4ICkge1xuXHRcdFx0XHRpZiAoICQoIHRhYmxlSGVhZGVycy5nZXQoIGluZGV4ICkgKSApIHtcblx0XHRcdFx0XHQkKCB0aGlzICkuYXR0ciggJ2RhdGEtbGFiZWwnLCAkKCB0YWJsZUhlYWRlcnMuZ2V0KCBpbmRleCApICkudGV4dCgpICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0Ly8gRW5nYWdlXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0gKCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1RhYmxlcyApICk7XG4iLCIvKipcbiAqIFZpZGVvIFBsYXliYWNrIFNjcmlwdC5cbiAqL1xud2luZG93LldEU1ZpZGVvQmFja2dyb3VuZE9iamVjdCA9IHt9O1xuKCBmdW5jdGlvbiggd2luZG93LCAkLCBhcHAgKSB7XG5cblx0Ly8gQ29uc3RydWN0b3IuXG5cdGFwcC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLmNhY2hlKCk7XG5cblx0XHRpZiAoIGFwcC5tZWV0c1JlcXVpcmVtZW50cygpICkge1xuXHRcdFx0YXBwLmJpbmRFdmVudHMoKTtcblx0XHR9XG5cdH07XG5cblx0Ly8gQ2FjaGUgYWxsIHRoZSB0aGluZ3MuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdHdpbmRvdzogJCggd2luZG93ICksXG5cdFx0XHR2aWRlb0J1dHRvbjogJCggJy52aWRlby10b2dnbGUnIClcblx0XHR9O1xuXHR9O1xuXG5cdC8vIENvbWJpbmUgYWxsIGV2ZW50cy5cblx0YXBwLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRhcHAuJGMudmlkZW9CdXR0b24ub24oICdjbGljaycsIGFwcC5kb1RvZ2dsZVBsYXliYWNrICk7XG5cdH07XG5cblx0Ly8gRG8gd2UgbWVldCB0aGUgcmVxdWlyZW1lbnRzP1xuXHRhcHAubWVldHNSZXF1aXJlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gYXBwLiRjLnZpZGVvQnV0dG9uLmxlbmd0aDtcblx0fTtcblxuXHQvLyBWaWRlbyBQbGF5YmFjay5cblx0YXBwLmRvVG9nZ2xlUGxheWJhY2sgPSBmdW5jdGlvbigpIHtcblx0XHQkKCB0aGlzICkucGFyZW50cyggJy5jb250ZW50LWJsb2NrJyApLnRvZ2dsZUNsYXNzKCAndmlkZW8tdG9nZ2xlZCcgKTtcblxuXHRcdGlmICggJCggdGhpcyApLnBhcmVudHMoICcuY29udGVudC1ibG9jaycgKS5oYXNDbGFzcyggJ3ZpZGVvLXRvZ2dsZWQnICkgKSB7XG5cdFx0XHQkKCB0aGlzICkuc2libGluZ3MoICcudmlkZW8tYmFja2dyb3VuZCcgKS50cmlnZ2VyKCAncGF1c2UnICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQoIHRoaXMgKS5zaWJsaW5ncyggJy52aWRlby1iYWNrZ3JvdW5kJyApLnRyaWdnZXIoICdwbGF5JyApO1xuXHRcdH1cblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG5cbn0oIHdpbmRvdywgalF1ZXJ5LCB3aW5kb3cuV0RTVmlkZW9CYWNrZ3JvdW5kT2JqZWN0ICkgKTtcbiIsIi8qKlxuICogRmlsZSB3aW5kb3ctcmVhZHkuanNcbiAqXG4gKiBBZGQgYSBcInJlYWR5XCIgY2xhc3MgdG8gPGJvZHk+IHdoZW4gd2luZG93IGlzIHJlYWR5LlxuICovXG53aW5kb3cud2RzV2luZG93UmVhZHkgPSB7fTtcbiggZnVuY3Rpb24oIHdpbmRvdywgJCwgYXBwICkge1xuXG5cdC8vIENvbnN0cnVjdG9yLlxuXHRhcHAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC5jYWNoZSgpO1xuXHRcdGFwcC5iaW5kRXZlbnRzKCk7XG5cdH07XG5cblx0Ly8gQ2FjaGUgZG9jdW1lbnQgZWxlbWVudHMuXG5cdGFwcC5jYWNoZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGFwcC4kYyA9IHtcblx0XHRcdCd3aW5kb3cnOiAkKCB3aW5kb3cgKSxcblx0XHRcdCdib2R5JzogJCggZG9jdW1lbnQuYm9keSApXG5cdFx0fTtcblx0fTtcblxuXHQvLyBDb21iaW5lIGFsbCBldmVudHMuXG5cdGFwcC5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLndpbmRvdy5sb2FkKCBhcHAuYWRkQm9keUNsYXNzICk7XG5cdH07XG5cblx0Ly8gQWRkIGEgY2xhc3MgdG8gPGJvZHk+LlxuXHRhcHAuYWRkQm9keUNsYXNzID0gZnVuY3Rpb24oKSB7XG5cdFx0YXBwLiRjLmJvZHkuYWRkQ2xhc3MoICdyZWFkeScgKTtcblx0fTtcblxuXHQvLyBFbmdhZ2UhXG5cdCQoIGFwcC5pbml0ICk7XG59KCB3aW5kb3csIGpRdWVyeSwgd2luZG93Lndkc1dpbmRvd1JlYWR5ICkgKTtcbiJdfQ==
