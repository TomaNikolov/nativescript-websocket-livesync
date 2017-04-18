const application = require("application");
const applicationSetting = require("application-settings");
const connectionMAnager = require("./websocket-connection-manager");

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
            const conectionUrl = NSUserDefaults.standardUserDefaults().objectForKey(serverUrl);
            if (conectionUrl) {
                applicationSetting.setString(serverUrl, conectionUrl);
            }
        }

        const socketurl = applicationSetting.getString(serverUrl);
        if (serverUrl) {
            connectionMAnager.openConnection(serverUrl);
        }
    };

    MyDelegate.ObjCProtocols = [UIApplicationDelegate];

    return MyDelegate;
})(UIResponder);

application.ios.delegate - MyDelegate;


function saveUrl(url, schema) {
    const socketurl = url.toString().replace(schema, "");
    applicationSetting.setString(serverUrl, socketurl);
}

function enableLiveSyncPlugin(url) {
    const liveSync = require("nativescript-plugin-livesync");
    liveSync.enable(true);
    return liveSync(url);
}
