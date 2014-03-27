/*
 * @author https://github.com/zz85
 */

"use strict";

var websockets_port = 20143;
// Start contact.js Websocket Server

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: websockets_port});

var fs = require('fs')
var connections = [];
var receivers = [];
var transmitters = [];

var captures = []; // Captured emotions
var CAPTURES_FILE = 'captures.json';

var TYPE_RECEIVER = 'receiver', // Canvas App
	TYPE_TRANSMITTER = 'transmitter'; // Emo App

// Recover data after restart
try {
	var json = fs.readFileSync(CAPTURES_FILE, 'utf8');
	captures = JSON.parse(json);
} catch (e) {

}

function sendToReceivers(message) { // Does a broadcast
	var i;
	for (i=0; i < receivers.length; i++) {
		receivers[i].send(message);
	}
}

function sendToTransmitters(message) {
	var i;
	for (i=0; i < transmitters.length; i++) {
		transmitters[i].send(message);
	}
}

function removeReceiver(receiver) {
	var i = receivers.indexOf(receiver);
	if (i > -1) {
		receivers.splice(i, 1);
	}
}

function removeTransmitter(transmitter) {
	var i = transmitters.indexOf(transmitter);
	if (i > -1) {
		transmitters.splice(i, 1);
	}
}

function addReceiver(receiver) {
	receivers.push(receiver);
}

function addTransmitter(transmitter) {
	transmitters.push(transmitter);
}

wss.on('connection', function(ws) {
	var info = ws.upgradeReq;
	console.log('Received websocket connection to ', info.url );

	if (info.url == '/transmitter') {
		ws.type = 'transmitter';
		addTransmitter(ws);
		// sendToReceivers('t');

	} else if (info.url == '/receiver') {
		// receiver
		addReceiver(ws);
		ws.type = TYPE_RECEIVER;
		console.log('Receiver connected.');
		// sendToTransmitters('t');

		ws.send('batch\n' + JSON.stringify(captures))
	}

	// ws.send('r');

	ws.on('message', processMessage);

	ws.on('close', function(e) {
		console.log('socket closed');
		if (ws.type==TYPE_TRANSMITTER) removeTransmitter(ws);
		else if (ws.type==TYPE_RECEIVER) removeReceiver(ws);
	});

	function processMessage(data) {
		var d = data.split('\n');
		switch (d[0]) {
			case 'bc':
				console.log('Received bird data', data);

				var msg = {
					r: +d[1],
					g: +d[2],
					b: +d[3],
					time: Date.now()
				};

				sendToReceivers('bc\n' + JSON.stringify(msg));
				captures.push(msg);

				// Persist if neccessary
				fs.writeFileSync(CAPTURES_FILE, JSON.stringify(captures),'utf8');
				break;
			case 'ts': // receives touch data
			case 'tm':
			case 'te':
			case 'tc':
				sendToReceivers(data);
				break;

			case 'r': // handle receiver resizing
				var dimensions = JSON.parse(d[1]);
				ws.w = dimensions[0];
				ws.h = dimensions[1];
				ws.wh = d[1];
				// if (ws.type==TYPE_RECEIVER) transmitter && transmitter.send('rr\n' + receiver.wh);
				// if (ws.type==TYPE_TRANSMITTER) receiver && receiver.send('rr\n' + transmitter.wh);
				break;
			default:
				// We just dump stuff for logging
				console.log(data);
				break;
		}

	}

});

// End of contact.js Websocket Server