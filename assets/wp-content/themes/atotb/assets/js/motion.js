/**
 * The homepage's one motion moment: the bridge funding bar fills once as it comes into view,
 * drawing the eye to the fundraising ask. Nothing moves for visitors who prefer reduced motion,
 * and the bar shows in full if this script never runs.
 */
( function () {
	var bars = document.querySelectorAll( '.atotb-progress__bar' );
	if ( ! bars.length || window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches || ! ( 'IntersectionObserver' in window ) ) {
		return;
	}
	document.documentElement.classList.add( 'atotb-motion' );
	var observer = new IntersectionObserver( function ( entries ) {
		entries.forEach( function ( entry ) {
			if ( entry.isIntersecting ) {
				entry.target.classList.add( 'is-in' );
				observer.unobserve( entry.target );
			}
		} );
	}, { threshold: 0.6 } );
	bars.forEach( function ( bar ) {
		observer.observe( bar );
	} );
}() );
