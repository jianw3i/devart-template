function TouchSwipe() {

	var enabled = false;
	var start;
	var callback;

	this.setListener = function( listener ) {
		callback = listener;
	}

	this.setEnabled = function( e ) {
		enabled = e;
	}

	// touch events
	document.addEventListener( 'touchstart', function ( event ) {

		if (!enabled) return;
		if (event.touches.length == 1) {
			var t = event.touches[0];
			start = {
				time: Date.now(),
				x: t.pageX,
				y: t.pageY
			}
		}

		// console.log('touchstart', event.touches.length, event.targetTouches.length, event.changedTouches.length);

		event.preventDefault();
	}, false );

	document.addEventListener( 'touchend', function ( event ) {

		if (!enabled) return;

		if (event.changedTouches.length == 1) {
			var t = event.changedTouches[0];
			end = {
				time: Date.now(),
				x: t.pageX,
				y: t.pageY
			}
			var dt = (Date.now() - start.time) / 1000;
			var dx = t.pageX - start.x;
			var dy = t.pageY - start.y;

			var px = dx / innerWidth * 100;
			var py = Math.abs(dy) / innerHeight * 100;
			var endy = t.pageY / innerHeight;

			var swipeUp = endy < 0.01 && dt < 1.5 && py > 50 && dy < 0;;

			// console.log( dt + "s <br/>x:" + px + " <br/>y:" +  py + " <br/>endy:" + endy +  " <br/>SWIPED:" + swipeUp )

			if (swipeUp && callback) callback();


		}

		// console.log('touchend', event.touches.length, event.targetTouches.length, event.changedTouches.length);
	}, false );
	
}