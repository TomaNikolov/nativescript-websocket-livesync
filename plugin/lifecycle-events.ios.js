const application = require("application");
const applicationSetting = require("application-settings");
const connectionManager = require("./websocket-connection-manager");

const serverUrl = "serverUrl";

const MyDelegate = (function (_super) {
    __extends(MyDelegate, _super);
    function MyDelegate() {
        _super.apply(this, arguments);
    }

    MyDelegate.prototype.applicationOpenURLSourceApplicationAnnotation = function (application, url, sourceApplication, annotation) {
        const bundleURLTypes = NSBundle.mainBundle.infoDictionary.objectForKey("CFBundleURLTypes");
        const appScheme = bundleURLTypes.firstObject.objectForKey("CFBundleURLSchemes").firstObject;
        const schema = `${appScheme}://socketurl=`;
        if (url.toString().indexOf(schema) > -1) {
            saveUrl(url, schema);
        } else {
            try {
                enableLiveSyncPlugin(url);
            } catch (err) {
                console.log(JSON.stringify(err));
            }
        }
    };

    MyDelegate.prototype.applicationDidBecomeActive = function (application) {
        if (NSUserDefaults.standardUserDefaults().objectForKey("isAppetize")) {
            const connectionUrl = NSUserDefaults.standardUserDefaults().objectForKey(serverUrl);
            if (connectionUrl) {
                applicationSetting.setString(serverUrl, connectionUrl);
            }
        }

        const connectionUrl = applicationSetting.getString(serverUrl);
        if (serverUrl) {
            connectionManager.openConnection(serverUrl);
        }
    };

    MyDelegate.ObjCProtocols = [UIApplicationDelegate];

    return MyDelegate;
})(UIResponder);

application.ios.delegate - MyDelegate;


function saveUrl(url, schema) {
    const socketUrl = url.toString().replace(schema, "");
    applicationSetting.setString(serverUrl, socketUrl);
}

function enableLiveSyncPlugin(url) {
    const liveSync = require("nativescript-plugin-livesync");
    liveSync.enable(true);
    return liveSync(url);
}
