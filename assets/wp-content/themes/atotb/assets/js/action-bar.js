// The phone action bar (Ryan, 2026-10-02, M4 mega-menu pass): Donate, "or Get involved", fixed to the bottom of a phone
// screen once the reader is past the first screen, and hidden again over sections with their own ask (the closing
// band, the homepage's join chapter and the footer). Without this script the bar stays shown on phones; CSS keeps it hidden from 900 px.
( () => {
	const bar = document.querySelector( '.atotb-action-bar' );
	if ( ! bar ) {
		return;
	}
	let past = false;
	const ends = new Set();
	const update = () => bar.classList.toggle( 'is-shown', past && ! ends.size );
	const onScroll = () => {
		const now = window.scrollY > window.innerHeight * 0.8;
		if ( now !== past ) {
			past = now;
			update();
		}
	};
	const watch = new IntersectionObserver( ( entries ) => {
		entries.forEach( ( entry ) => ( entry.isIntersecting ? ends.add( entry.target ) : ends.delete( entry.target ) ) );
		update();
	} );
	// Sections that carry their own ask: the closing band, the homepage's join chapter, the footer, and any section
	// marked `atotb-own-ask` (Ryan, 2026-10-02: hide the bar over sections with their own ask).
	document.querySelectorAll( 'main > .atotb-closing-band, .atotb-join, .atotb-own-ask, .atotb-site-footer' ).forEach( ( end ) => watch.observe( end ) );
	window.addEventListener( 'scroll', onScroll, { passive: true } );
	window.addEventListener( 'resize', onScroll );
	onScroll();
	update();
} )();
