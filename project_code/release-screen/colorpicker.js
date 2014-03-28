/*
 * Touch Based Color Picker
 * @author github.com/zz85 @blurspline 
 */

function ColorPicker(width, height) {

	var box = Math.min(width, height);

	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.id = 'touch-colorpicker';

	var enabled = false;
	this.domElement = canvas;

	this.setEnabled = function( bool ) {
		// canvas.style.display = bool ? 'display' : 'none';
		enabled = bool;
	}

	this.setListener = function( listener ) {
		this.listener = listener;
	}

	this.setSize = function( width, height ) {

	}

	var ctx = canvas.getContext('2d');

	var imageData = ctx.getImageData(0, 0, width, height);
	var data = imageData.data;

	var h, s, l;
	l = 0.5;

	var color = new THREE.Color();

	var r, a, r2;

	r = 0;
	var ad = 1000, rd = 200;

	var offset = 0;
	var midx = width / 2; // 400
	var midy = height / 2; // 400
	var radius = box / 3; // 200
	var ringThickness = radius / 6; // 40

	for (h=0;h<height;h++) {
		for (w=0;w<width;w++) {
			offset = (h * width + w) * 4;

			var c = colorAt(w, h);
			if (!c) continue;

			data[ offset + 0 ] = c.r * 255;
			data[ offset + 1 ] = c.g * 255;
			data[ offset + 2 ] = c.b * 255;
			data[ offset + 3 ] = 255;

		}
	}



	var startHue = 0;
	var currentHue = 0;
	var touchedHue = 0;

	var lastColor = new THREE.Color(1, 1, 1);
	var k = 0;
	var diff = 0;
	var follow = false;

	// [0..1] -> [0..1] 0 -> 1 = +1, 1 -> 0 = -1. 0.1 -> 0.9 = 0.8 (-0.2), 0.9 -> 0.1 = -0.8 (0.2)

	function inout ( k ) {

		if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
		return - 0.5 * ( --k * ( k - 2 ) - 1 );

	}

	function expOut( k ) {

		return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
	}

	function expIn( k ) {
		return k === 0 ? 0 : Math.pow( 1024, k - 1 );
	}

	function ease( x ) {
		// return Math.min(Math.log(x + 1) * 2.4, 1);
		// return Math.min(1.4 * (1 - (1 - x) * (1- x) * (1 - x)), 1);
		return Math.min(1 - Math.pow( 1 - x, 4), 1);
	}

	var redraw = true;

	function draw() {

		if (!redraw) return;

		if (k > 1.0) {
			redraw = false;
			return;
		}
		
		ctx.putImageData(imageData, 0, 0);

		// 0..1 (1-diff)

		
		if (follow) {
			// currentHue =  touchedHue;
			// currentHue += (startHue + diff - currentHue) * 0.5;
			// currentHue = startHue + diff * expOut(k);
			currentHue = startHue + diff * ease(k);
		} else {
			currentHue = startHue + diff * inout(k);
		}

		// k += 1/30 * 6;

		currentHue = startHue + diff * k;
		k += (1 - k) * 0.5;

		var angle = currentHue * 2 * Math.PI;
		
		

		// console.log(currentColor.getHexString(), ctx.fillStyle);
		

		var nudge = 0.05;

		innerRadius = radius - (1 + nudge) * ringThickness;
		outerRadius = radius - (1 - nudge) * ringThickness;
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#cccccc'
		ctx.fillStyle = '#ffe3db'
		ctx.beginPath();
		ctx.arc(midx, midy, innerRadius, 0, Math.PI * 2 );
		ctx.arc(midx, midy, outerRadius, 0, Math.PI * 2, true );
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

		innerRadius = radius + (0. + nudge) * ringThickness;
		outerRadius = radius + (0. - nudge) * ringThickness;
		ctx.fillStyle = '#ffe3db'
		ctx.beginPath();
		ctx.arc(midx, midy, innerRadius, 0, Math.PI * 2 );
		ctx.arc(midx, midy, outerRadius, 0, Math.PI * 2, true );
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

		// 
		x = midx + Math.cos(angle) * (radius - ringThickness / 2);
		y = midy + Math.sin(angle) * (radius - ringThickness / 2);
		innerRadius = ringThickness / 2 + 10;
		outerRadius = ringThickness / 2 + 16;
		ctx.fillStyle = '#fff'
		ctx.beginPath();
		ctx.arc(x, y, innerRadius, 0, Math.PI * 2 );
		ctx.arc(x, y, outerRadius, 0, Math.PI * 2, true );
		ctx.stroke();
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = '#' + lastColor.getHexString();
		ctx.arc(x, y, innerRadius, 0, Math.PI * 2 );
		ctx.fill();
		ctx.closePath();


	}


	function colorAt(w, h, lenient) {

		var distance;

		dx = midx - w;
		dy = midy - h;

		if (!lenient) {
			
			distance = Math.sqrt( dx * dx + dy * dy );
			
			if (distance > radius) return;
			if (distance < (radius - ringThickness) ) return;

			s = distance / radius;

		} else {
			s = 0.9;
		}

		hue = Math.atan2(dy, dx) / Math.PI / 2 + 0.5;
		

		color.setHSL(hue, s, l);
		color.hue = hue;

		return color;

	}

	var innerRadius, outerRadius;
	var lastx, lasty;

	var me = this;;

	function touchAt(x, y) {

		if (!enabled) return;

		lastx = x;
		lasty = y;

		var c = colorAt(lastx, lasty, true);
		if (c) {
			lastColor = c.clone();
			touchedHue = c.hue;
			startHue = currentHue;
			if (startHue > 1) startHue -= 1;
			if (startHue < 0) startHue += 1;
			// console.log('Convert hue', currentHue, '>', startHue, 'touched', hue);

			k = 0;

			diff = touchedHue - startHue;
			// console.log('b4', diff);
			if (diff > 0.5) diff = diff - 1;
			if (diff < -0.5) diff = 1 + diff;
			// console.log('after', diff);


			follow = Math.abs(diff < 0.3);

			if (me.listener) me.listener(lastColor);

			redraw = true;

		}

	}



	setInterval(draw, 60);


	// document.addEventListener( 'mousemove', function ( event ) {
	// 	touchAt(event.pageX, event.pageY);
	// }, false );

	document.addEventListener( 'mousedown', function ( event ) {
		touchAt(event.pageX, event.pageY);
	}, false );


	document.addEventListener( 'touchstart', function ( event ) {
		if (event.touches.length) {
			var t = event.touches[0];
			touchAt(t.pageX, t.pageY);
		}

		event.preventDefault();
	}, false );


	document.addEventListener( 'touchmove', function ( event ) {
		if (event.touches.length == 1) {

			var t = event.touches[0];

			touchAt(t.pageX, t.pageY);
		}

		event.preventDefault();
	}, false );

}