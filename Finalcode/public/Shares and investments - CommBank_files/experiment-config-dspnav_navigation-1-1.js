/* global SwitchBladeLiteTnt, CQURLInfo */
/* jshint -W069 */

var isAssetSwitchingExpEnabled = false;

(function (document, window, SwitchBladeLiteTnt, CQURLInfo) {
	'use strict';

	var sections = {
		'page-not-found': true,
		'homepage': true,
		'personal': true,
		'digital': true,
		'security-privacy': true,
		'support': true,
		'important-info': true,
		'search': true,
		'about-us': true,
		'business': true,
		'corporate': true,
		

		'articles': true,
		'guidance': true,

		// CAAS
		'shared': true,
		'caas': true,

		// When viewed on static server
		'components': true,
		'cb3-components': true,
		'compiled': true
	};

	/**
	 * Create a style block to control styles of elements that
	 * may not be on the page when script runs
	 * @param {string} css
	 */
	var createStyleElement = function createStyleElement(css) {

		var style = document.createElement('style');
		style.setAttribute('type', 'text/css');

		try {
			style.innerHTML = css;
		} catch (error) {
			style.styleSheet.cssText = css;
		}

		document.getElementsByTagName('head')[0].appendChild(style);
	};

	if (typeof CQURLInfo !== 'undefined' && typeof CQURLInfo.runModes !== 'undefined' && CQURLInfo.runModes.indexOf('author') >= 0) {
		// This is definitely author mode
		return;
	} else {
		// This is publisher mode or an unknown environment, i.e not author mode

		// Hide the second navigation item, it can be displayed later if needed. The navigation
		// may not exist on the page when this code executes.
		createStyleElement('#primary-nav-1 { display: none; }');
	}

	if (!isAssetSwitchingExpEnabled) {
		// Asset switching experiment is not enabled
		return;
	}

	function onLoginPage () {
		return (/login-netbank/.test(window.location.pathname));
	}

	function referrerIsCommbank () {
		return (/commbank.com.au|commbank.test.cba|commbank.dev.cba/.test(document.referrer));
	}


	/**
	 * The experiment only runs in these sections or under these conditions
	 */
	var runExperiment = function runExperiment () {

		// Do not run experiment this session if user navigates to logon page directly
		var exclusionKey = 'EXCLUDE-EXPERIMENT-GLO';
		if (sessionStorage.getItem(exclusionKey) === 'true') {
			return false;
		}

		// Fetch pathname
		var pathname = window.location.pathname;

		// Remove .html extension
		var pathsSplit = pathname.replace('.html', '').split('/');

		// Remove first part if it's blank
		if (pathsSplit[0] === '') {
			pathsSplit.shift();
		}

		// Remove /content/
		// I.e '/content/commbank-neo/important-info.html' -> '/important-info.html';
		if (pathsSplit[0] === 'content') {
			pathsSplit.shift();
		}

		// Remove /commbank-neo/
		if (pathsSplit[0] === 'commbank-neo') {
			pathsSplit.shift();
		}

		// 404 page
		if ('undefined' !== typeof sections['page-not-found'] && document.title === '404 error page') {
			return sections['page-not-found'];
		}

		// Homepage
		if ('undefined' !== typeof sections['homepage'] && (pathname === '/' || pathname === '/personal.html')) {
			return sections['homepage'];
		}

		// Personal section
		if ('undefined' !== typeof sections['personal'] && pathsSplit[0] === 'personal') {
			return sections['personal'];
		}
        
        if ('undefined' !== typeof sections['digital'] && pathsSplit[0] === 'digital') {
			return sections['digital'];
		}

		// Security/Privacy
		if ('undefined' !== typeof sections['security-privacy'] && pathsSplit[0] === 'security-privacy') {
			return sections['security-privacy'];
		}

		// FAQs/Topic landing pages (Note: Support landing page and Contact Us come under personal section)
		if ('undefined' !== typeof sections['support'] && pathsSplit[0] === 'support') {
			return sections['support'];
		}

		// Important information
		if ('undefined' !== typeof sections['important-info'] && pathsSplit[0] === 'important-info') {
			return sections['important-info'];
		}

		// Search results page
		if ('undefined' !== typeof sections['search'] && pathsSplit[0] === 'search') {
			return sections['search'];
		}

		// About us page
		if ('undefined' !== typeof sections['about-us'] && pathsSplit[0] === 'about-us') {
			return sections['about-us'];
		}

		// Business page
		if ('undefined' !== typeof sections['business'] && pathsSplit[0] === 'business') {
			return sections['business'];
		}

		// Corporate page
		if ('undefined' !== typeof sections['corporate'] && pathsSplit[0] === 'corporate') {
			return sections['corporate'];
		}

		// Not sure where article section is
		if ('undefined' !== typeof sections['articles'] && pathsSplit[0] === 'articles') {
			return sections['articles'];
		}

		// The guidance page seems to use the newsroom template
		if ('undefined' !== typeof sections['guidance'] && pathsSplit[0] === 'guidance') {
			return sections['guidance'];
		}

		// Newsroom articles
		if ('undefined' !== typeof sections['shared'] && pathsSplit[0] === 'shared') {
			return sections['shared'];
		}

		// Content as a service articles
		if ('undefined' !== typeof sections['caas'] && pathsSplit[0] === 'caas') {
			// Content As A Service article pages
			return sections['caas'];
		}

		// Static dev server
		if ('undefined' !== typeof sections['components'] && pathsSplit[0] === 'components') {
			return sections['components'];
		}

		// Static dev server
		if ('undefined' !== typeof sections['cb3-components'] && pathsSplit[0] === 'cb3-components') {
			return sections['cb3-components'];
		}

		// Static dev server
		if ('undefined' !== typeof sections['compiled'] && pathsSplit[0] === 'compiled') {
			return sections['compiled'];
		}

		// Do not run the experiment
		return false;
	};

	// For testing: set a session storage value
	// localStorage.setItem('CB-ASSET-SWITCHING-LOGIN-GLO', 'EXPERIENCE-1');

	window.cdExperiment = new SwitchBladeLiteTnt({
		'mbox': 'CB-ASSET-SWITCHING-LOGIN-GLO',
		'offerMap': {
			'DEFAULT': {
				'nav': 'default'
			},
			'EXPERIENCE-1': {
				'nav': 'experiment'
			}
		},
		'experiments': {
			'nav': {
				'variations': {
					// This maps to DEFAULT
					'default': {
						'show': '#gloNavUnauth',
						'hide': '#primary-nav-1'
					},
					// This maps to EXPERIENCE-1
					'experiment': {
						'show': '#gloNavUnauth',
						'hide': '#primary-nav-1',
						'default': false
					}
				},
				'condition': runExperiment
			}
		},
		'cacheOffer': true,
		'enabled': isAssetSwitchingExpEnabled,
		'default': 'DEFAULT',
		'onLoad': function onLoad() {}
	});

	// Start experiment
	window.cdExperiment.init();

})(document, window, SwitchBladeLiteTnt, CQURLInfo);
