let dl = require('delivery').server;
let SocketIO = require('nativescript-socket.io');
let liveSync = require('./live-sync');

function openConnection(socketUrl) {
	let socketIO = SocketIO.connect(socketUrl, {});
	socketIO.on('connect', () => {
		let delivery = dl.listen(socketIO);
		delivery.on('receive.success', (file) => {
			livesync(file.buffer);
		});

		delivery.on('receive.start', (fileUID) => {
			console.log('receiving a file!');
		});

		delivery.on('receive.error', (fileUID) => {
			console.log('receiving a error!' + fileUID.toString());
		});
	})

}

exports.openConnection = openConnection;