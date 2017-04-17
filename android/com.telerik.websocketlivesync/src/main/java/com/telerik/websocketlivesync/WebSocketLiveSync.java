package com.telerik.websocketlivesync;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class WebSocketLiveSync {

    private final Context context;

    public WebSocketLiveSync(Context context) {
        this.context = context;
    }

    public void syncApplication(String base64Encoded) throws IOException {
        ByteArrayInputStream inputStream = FileUtil.createInputStream(base64Encoded);
        ZipInputStream zipStream = null;
        try {
            zipStream = new ZipInputStream(inputStream);
            File outputPath = this.context.getFilesDir();
            ZipEntry zipEntry = null;
            while ((zipEntry = zipStream.getNextEntry()) != null) {
                Log.v("Telerik", "Unzipping " + zipEntry.getName());
                File file = new File(outputPath, zipEntry.getName());
                File parentDirectory = file.getParentFile();
                if (!parentDirectory.exists()) {
                    parentDirectory.mkdirs();
                }
                FileUtil.extractFile(zipStream, false, file.getAbsolutePath());

                zipStream.closeEntry();
            }
        }  finally {
            if (zipStream != null) {
                zipStream.close();
            }
        }
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
    public void restarApp() {
        this.purgeNativeScriptRuntimeProxies();

        Intent launchIntent = this.context.getPackageManager().getLaunchIntentForPackage(this.context.getPackageName());
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK
                | Intent.FLAG_ACTIVITY_NEW_TASK);

        PendingIntent pendingIntent = PendingIntent.getActivity(this.context, 123456, launchIntent,
                PendingIntent.FLAG_CANCEL_CURRENT);
        AlarmManager mgr = (AlarmManager) this.context.getSystemService(Context.ALARM_SERVICE);
        mgr.set(AlarmManager.RTC, System.currentTimeMillis() + 1000, pendingIntent);

        // finish current activity and all below it first
        if (this.context instanceof Activity) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                ((Activity) this.context).finishAffinity();
            } else {
                throw new UnsupportedOperationException("Method not supported for API Level < 16");
            }
        }

        // kill the process explicitly (this is needed to reset the state of the V8 VM)
        // TODO: We may want to implement a "restart" routine in the runtime itself to enable such scenarios without killing the process
        android.os.Process.killProcess(android.os.Process.myPid());
    }

    private void purgeNativeScriptRuntimeProxies() {
        try {
            final Class<?> platform = Class.forName("com.tns.Platform");
            final Method purgeAllProxies = platform.getMethod("purgeAllProxies");
            purgeAllProxies.invoke(null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
