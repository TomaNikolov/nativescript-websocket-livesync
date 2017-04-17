package com.telerik.websocketlivesync;

import android.content.Intent;
import android.util.Log;

import java.io.IOException;
import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class ConnectionService extends android.app.Service {
    private Socket socket;
    private WebSocketLiveSync liveSync;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try{
            String url = this.getUrl(intent);
            this.liveSync = new WebSocketLiveSync(this);
            this.socket = IO.socket(url);
            this.attachEvents();
        } catch (URISyntaxException ex) {
            Log.i("ConnectionService", "exception", ex);
        }

        return android.app.Service.START_STICKY;
    }

    @Override
    public android.os.IBinder onBind(android.content.Intent intent) {
        return null;
    }

    private String getUrl(Intent intent) {
        //TODO:
        return "";
    }

    private void attachEvents(){
        this.socket.on(Socket.EVENT_CONNECT, new Emitter.Listener(){
            @Override
            public void call(Object... args) {

            }
        });

        this.socket.on("livesync.create", new Emitter.Listener(){
            @Override
            public void call(Object... args) {
                String base64Encoded = (String)args[0];
                try {
                    ConnectionService.this.liveSync.syncApplication(base64Encoded);
                } catch (IOException ex) {
                    Log.i("ConnectionService", "exception", ex);
                }

            }
        });

        this.socket.on("livesync.delete", new Emitter.Listener(){
            @Override
            public void call(Object... args) {
                //TODO:
            }
        });

        this.socket.on("livesync.rename", new Emitter.Listener(){
            @Override
            public void call(Object... args) {
                //TODO:
            }
        });

        this.socket.on("livesync.restart", new Emitter.Listener(){
            @Override
            public void call(Object... args) {
                ConnectionService.this.liveSync.restarApp();
            }
        });
    }
}
