let dl = require('delivery').server;
let SocketIO = require('nativescript-socket.io');
let liveSync = require('./live-sync');
console.log('************%', JSON.stringify(SocketIO))
function openConnection(socketUrl) {
	let socketIO = SocketIO.connect(/*socketUrl.trim() ||*/ 'https://d2cfb948.ngrok.io', {});
	let delivery = dl.listen(socketIO);
	socketIO.on('connect', () => {
		delivery.on('receive.success', (file) => {
			liveSync.syncApplication(file.buffer);
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
