require('./live-sync-service');

function startService(context) {
    var manager = context.getSystemService(android.content.Context.ACTIVITY_SERVICE);
    var runningServices = manager.getRunningServices(java.lang.Integer.MAX_VALUE);
    var isRunning = false;
    for (var i = 0; i < runningServices.size(); i++) {
        var service = runningServices.get(i).service;
        if ("com.telerik.websocketlivesync.ConnectionService" == service.getClassName()) {
            isRunning = true;
            break;
        }
    }

    if (!isRunning) {
        /*
        * Creates a new Intent to start the RSSPullService
        * IntentService. Passes a URI in the
        * Intent's "data" field.
        * intent.setData(Uri.parse(dataUrl));
        */
        var intent = new android.content.Intent(context, org.nativescript.LiveSyncIntentService.class);
        console.log(intent);
        context.startService(intent);
    }
}



module.exports.startService = startService;
