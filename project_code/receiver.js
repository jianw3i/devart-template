(function Recevier() {

	"use strict";

	var ws;

	window.addEventListener('load', function() {
		// new contact.Recevier(location.hostname + ':20143');
	});

	connect(location.hostname + ':20143');

	function connect(destination) {

		ws = new WebSocket("ws://" + destination + "/receiver");

		ws.addEventListener('open', function(e) {
			console.log('Connected to ' + ws.URL);
			sendDimension();
		});
		ws.addEventListener('close', function(e) {
			console.log('Disconnected from ' + ws.URL + ' (' + e.reason + ')');
			ws = null;
		});

		ws.addEventListener('message', onMessage);

		ws.addEventListener('error', function(e) {
			console.log('error', e);
			ws = null;
		});
	}

	window.addEventListener('resize', sendDimension, false);

	window.onerror = function(message, file, line) {
		send([message, file, line].join('\t'));
	}

	var tmaps = {
		'ts': 'touchstart',
		'te': 'touchend',
		'tm': 'touchmove',
		'tc': 'touchcancel',
	};

	function createEvents(a, b) {

		var x, y, i, j, len, target;
		var touches = [];
		var targets = [];
		var uniqueTargets = [];

		for (i=0, len = a.length / 2;i<len;i++) {
			x = a[i * 2];
			y = a[i * 2 + 1];

			x = x / scaleWidth * width;
			y = y / scaleHeight * height;

			touches.push({
				pageX: x,
				pageY: y
			});

			target = document.elementFromPoint(x, y);
			targets.push(target);
		}

		for (i=0;i<len;i++) {

			var target = targets[i];
			var count = 0;
			var duplicated = false;
			var currentTouches = [];

			for (j=0;j<len;j++) {
				if (targets[j] == target) {
					if (j<i) duplicated = true;
					count++;
					currentTouches.push(touches[j]);
				}
			}

			if (!duplicated) {
				uniqueTargets.push({
					target: target,
					count: count,
					touches: currentTouches
				})
			}
		}

		var touchEvent = new CustomEvent(tmaps[b], {
			bubbles: true,
			cancelable: true
		}); // DOM level 4

		touchEvent.touches = touches;

		var len=uniqueTargets.length;

		if (len) {
			// for (i=0; i<len; i++) {
			// 	uniqueTargets[i].target.dispatchEvent(touchEvent);
			// }

			// For simplicity now, fire off to the first target
			target = uniqueTargets[0];
			touchEvent.targetTouches = target.touches;
			touchEvent.currentTarget = target.target;
			target.target.dispatchEvent(touchEvent);

		} else {
			window.dispatchEvent(touchEvent);
		}

		// debug({touches:touches});

	}


	var scaleWidth, scaleHeight;
	var width, height;

	function onMessage(e) {

		console.log(e);
		var data = e.data;

		var d = data.split('\n');

		switch (d[0]) {
			case 'bc':
				var tmpBird = JSON.parse(d[1]);
				// showBirds(kkk++, true);
				console.log(tmpBird);
				setBird(kkk++, tmpBird.r, tmpBird.g, tmpBird.b, true);
				break;
			case 'batch':
				var captures = JSON.parse(d[1]);
				var tmpBird;
				for (var i = 0; i < captures.length; i++) {
					tmpBird = captures[i];

					(function(tmpBird) {
						setTimeout(function() {
							setBird(kkk++, tmpBird.r, tmpBird.g, tmpBird.b, true);
						}, i * 1000)
					})(tmpBird);
					
				}

				console.log(captures.length);
				
				break;
			case 'p':
				ws.send('pp\n'  + d[1]);
				break;
			case 't':
				console.log('transmitter is ready');
				break;
			case 'r':
				// sendDimension();
				break;
			case 'ts':
			case 'tm':
			case 'te':
			case 'tc':
				var a = JSON.parse(d[1]);
				createEvents(a, d[0]);
				break;
			case 'rr':
				var dimensions = JSON.parse(d[1]);
				scaleWidth = dimensions[0];
				scaleHeight = dimensions[1];
				break;
		}
	}

	function send(e) {
		if (ws) ws.send(e);
	}

	function sendDimension() {
		width = window.innerWidth;
		height = window.innerHeight;
		send('r\n['+width+','+height+']');
	}

})();