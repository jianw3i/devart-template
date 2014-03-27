"use strict";

var ws = new WebSocket("ws://" + location.hostname + ":20143/transmitter");

var width, height, remoteWidth, remoteHeight;
var ready = false;

ws.addEventListener('open', function(e) {
	ready = true;
});

ws.addEventListener('close', function(e) {
	ready = false;
	ws = null;
});


ws.addEventListener('message', function(e) {
	var data = e.data;

	var d = data.split('\n');

	switch (d[0]) {
		case 'p':
			ws.send('pp\n'  + d[1]);
			break;
		case 'r':
			// sendDimension();
			break;
		case 'rr':
			var dimensions = JSON.parse(d[1]);
			remoteWidth = dimensions[0];
			remoteHeight = dimensions[1];

			var remoteRatio = remoteWidth / remoteHeight;
			var currentRatio = width / height;

			// if (remoteRatio > currentRatio) {
			// 	// remote width is wider. // currentHeight should be restricted
			// } else {
			// 	//
			// }
			send('ratio: ' + remoteRatio + ' vs ' + currentRatio);
			break;

	}

});

ws.addEventListener('error', function(e) {
	console.log('error', e);
});

function send(e) {
	if (ws && ready) ws.send(e);
}

function convert(touches) {
	var i, len, px, py, touch;
	var a = [];
	for (i=0, len = touches.length; i<len; i++) {
		touch = touches[i];
		px = touch.pageX;
		py = touch.pageY;
		a.push(px, py);
	}

	return JSON.stringify(a);
}



// window.addEventListener('touchend', function(event) {
// 	touches = event.touches;
// 	send('te\n' + convert(touches));
// }, false);

// window.addEventListener('touchmove', function(event) {
// 	event.preventDefault();
// 	send('tm\n' + convert(touches));
// }, false);

// window.addEventListener('touchstart', function(event) {
// 	touches = event.touches;
// 	send('ts\n' + convert(touches));
// }, false);

// window.addEventListener('touchcancel', function(event) {
// 	touches = event.touches;
// 	send('tc\n' + convert(touches));
// }, false);