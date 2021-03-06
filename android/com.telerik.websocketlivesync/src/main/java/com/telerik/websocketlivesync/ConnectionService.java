package com.telerik.websocketlivesync;

import android.content.Intent;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.UUID;

import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class ConnectionService extends android.app.Service {
    private Socket socket;
    private WebSocketLiveSync liveSync;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try {
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
        return "https://30548558.ngrok.io";
    }

    private void attachEvents() {
        this.socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                String uuid = UUID.randomUUID().toString();
                ConnectionService.this.socket.emit("handshake", uuid);
            }
        });

        this.socket.on("livesync.create", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                String base64Encoded = (String) args[0];
                Ack ack = ConnectionService.this.getAck(args);
                try {
                    ConnectionService.this.liveSync.syncApplication(base64Encoded, ack);
                } catch (IOException ex) {
                    ConnectionService.this.handleException(ex, ack);
                }
            }
        });

        this.socket.on("livesync.delete", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                Ack ack = ConnectionService.this.getAck(args);
                JSONArray filesToDelete = (JSONArray) args[0];
                try {
                    ConnectionService.this.liveSync.delete(filesToDelete,ack);
                } catch (Exception ex) {
                    ConnectionService.this.handleException(ex, ack);
                }
            }
        });

        this.socket.on("livesync.rename", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                Ack ack = ConnectionService.this.getAck(args);
                JSONArray filesToRename = (JSONArray) args[0];
                try {
                    ConnectionService.this.liveSync.rename(filesToRename, ack);
                } catch (Exception ex) {
                    ConnectionService.this.handleException(ex, ack);
                }
            }
        });

        this.socket.on("livesync.restart", new Emitter.Listener() {
            @Override
            public void call(Object... args) {
                Ack ack = ConnectionService.this.getAck(args);
                ConnectionService.this.liveSync.restartApp(ack);
            }
        });

        this.socket.connect();
    }

    private Ack getAck(Object... args) {
        return (Ack) args[args.length - 1];
    }

    private void handleException(Exception ex, Ack ack) {
        ack.call("error: " + ex.getMessage());
        Log.i("ConnectionService", "exception", ex);
    }
}
