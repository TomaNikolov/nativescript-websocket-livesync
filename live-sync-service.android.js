const connectionManager = require("./websocket-connection-manager");

android.app.Service.extend('org.nativescript.LiveSyncIntentService', {
    onStartCommand: function (intent, flags, startId) {
        console.log('onHandleIntent');
        //TODO: get url from intent
        var serverUrl = 'https://d2cfb948.ngrok.io';
        connectionManager.openConnection(serverUrl);
        return android.app.Service.START_STICKY;
    }
});
