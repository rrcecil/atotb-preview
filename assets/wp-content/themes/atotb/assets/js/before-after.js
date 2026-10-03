// The before/after slider (homepage proof band). The theme renders the range input hidden; this script shows it and moves
// the split as it changes, by pointer or by the arrow, Page, Home and End keys. The input's thumb has no width, so a
// pointer sets the split exactly where it is. Without this script, both photos show, split at the middle.
( () => {
	document.querySelectorAll( '.atotb-ba' ).forEach( frame => {
		const range = frame.querySelector( '.atotb-ba__range' );
		if ( ! range ) return;
		const template = range.dataset.valuetext || '';
		const set = () => {
			frame.style.setProperty( '--pos', `${ range.value }%` );
			range.setAttribute( 'aria-valuetext', template.replace( '{left}', range.value ).replace( '{right}', 100 - range.value ) );
		};
		range.addEventListener( 'input', set );
		// The caption that follows the slider describes it.
		const caption = frame.nextElementSibling;
		if ( caption && caption.classList.contains( 'atotb-ba__caption' ) ) {
			caption.id ||= `atotb-ba-caption-${ Math.random().toString( 36 ).slice( 2, 8 ) }`;
			range.setAttribute( 'aria-describedby', caption.id );
		}
		range.hidden = false;
		frame.classList.add( 'is-ready' );
		set();
	} );
} )();
