/**
 * The mega menu's behaviour (M4 mega-menu pass; decision 0047). The page works without it: each section's label is a
 * link to the section, the panels stay hidden, and on a phone the row wraps.
 *
 * With it, each section's label becomes a button that opens its panel (a disclosure: aria-expanded and aria-controls).
 * One panel is open at a time. A click outside, Escape, or moving focus out of the panel closes it; Escape returns
 * focus to the button. Focus leaving the menu also closes the phone menu, so the open list never hides what has focus. On a phone, a Menu button shows and hides the row, and the panels open in place.
 */
( () => {
	const PHONE = window.matchMedia( '(max-width: 899px)' );

	const setup = ( nav ) => {
		const row = nav.querySelector( '.atotb-mega__row' );
		if ( ! row ) {
			return;
		}
		const buttons = [];
		nav.querySelectorAll( '.atotb-mega__top[data-atotb-panel]' ).forEach( ( link ) => {
			const panel = document.getElementById( link.dataset.atotbPanel );
			if ( ! panel ) {
				return;
			}
			const button = document.createElement( 'button' );
			button.type = 'button';
			button.className = link.className;
			button.textContent = link.textContent;
			button.setAttribute( 'aria-expanded', 'false' );
			button.setAttribute( 'aria-controls', panel.id );
			link.replaceWith( button );
			buttons.push( button );
		} );

		const panelOf = ( button ) => document.getElementById( button.getAttribute( 'aria-controls' ) );
		const close = ( button ) => {
			button.setAttribute( 'aria-expanded', 'false' );
			panelOf( button ).hidden = true;
		};
		const closeAll = ( except ) => buttons.forEach( ( b ) => b !== except && close( b ) );
		const openOne = () => buttons.find( ( b ) => b.getAttribute( 'aria-expanded' ) === 'true' );

		buttons.forEach( ( button ) => {
			button.addEventListener( 'click', () => {
				const open = button.getAttribute( 'aria-expanded' ) === 'true';
				closeAll( button );
				button.setAttribute( 'aria-expanded', open ? 'false' : 'true' );
				panelOf( button ).hidden = open;
			} );
		} );

		// The phone menu's button, before the row.
		const toggle = document.createElement( 'button' );
		toggle.type = 'button';
		toggle.className = 'atotb-mega__toggle';
		toggle.setAttribute( 'aria-expanded', 'false' );
		toggle.setAttribute( 'aria-controls', row.id );
		toggle.innerHTML =
			'<svg class="atotb-mega__icon-open" aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
			'<svg class="atotb-mega__icon-close" aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
			'<span class="screen-reader-text"></span>';
		toggle.querySelector( '.screen-reader-text' ).textContent = nav.dataset.atotbMenuLabel || 'Menu';
		const setPhoneOpen = ( open ) => {
			toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
			nav.classList.toggle( 'is-open', open );
			if ( ! open ) {
				closeAll();
			}
		};
		toggle.addEventListener( 'click', () => setPhoneOpen( toggle.getAttribute( 'aria-expanded' ) !== 'true' ) );
		nav.insertBefore( toggle, row );
		nav.classList.add( 'is-ready' );

		document.addEventListener( 'click', ( event ) => {
			if ( ! nav.contains( event.target ) ) {
				closeAll();
				if ( PHONE.matches ) {
					setPhoneOpen( false );
				}
			}
		} );
		// On the document: Safari doesn't focus a clicked button (MDN, <button>, "Clicking and focus"), so after a click focus
		// may be outside the menu.
		document.addEventListener( 'keydown', ( event ) => {
			if ( event.key !== 'Escape' ) {
				return;
			}
			const open = openOne();
			if ( open ) {
				close( open );
				open.focus();
			} else if ( nav.classList.contains( 'is-open' ) ) {
				setPhoneOpen( false );
				toggle.focus();
			}
		} );
		// Tabbing out of an open panel, to the next section or beyond, closes it. A press is left to the click handler:
		// closing on the press would move the rows under the pointer, so a tap on a phone would land outside the menu.
		let pressing = false;
		nav.addEventListener( 'pointerdown', () => {
			pressing = true;
		} );
		document.addEventListener( 'pointerup', () => setTimeout( () => ( pressing = false ) ), true );
		nav.addEventListener( 'focusin', ( event ) => {
			const open = openOne();
			if ( ! pressing && open && event.target !== open && ! panelOf( open ).contains( event.target ) ) {
				close( open );
			}
		} );
		nav.addEventListener( 'focusout', ( event ) => {
			if ( event.relatedTarget && ! nav.contains( event.relatedTarget ) ) {
				closeAll();
				if ( PHONE.matches ) {
					setPhoneOpen( false );
				}
			}
		} );
		// Leaving phone width with the menu open: the row is always shown on wider screens.
		PHONE.addEventListener( 'change', () => setPhoneOpen( false ) );
	};

	const start = () => document.querySelectorAll( '.atotb-mega' ).forEach( setup );
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', start );
	} else {
		start();
	}
} )();
