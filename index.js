"use strict";

const application = require("application");
const applicationSetting = require("application-settings");
const connectionMAnager = require("./websocket-connection-manager");

const serverUrl = "serverUrl";

if (application.ios) {
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
			if(NSUserDefaults.standardUserDefaults().objectForKey("isAppetize")) {
				const conectionUrl = NSUserDefaults.standardUserDefaults().objectForKey(serverUrl);
				if(conectionUrl) {
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
} else {
	application.android.on(application.AndroidApplication.activityCreatedEvent, function (args) {
		if (args.activity.getIntent().getBooleanExtra("isAppetize")) {
			const conectionUrl = args.activity.getIntent().getStringExtra(serverUrl);
			if (conectionUrl) {
				applicationSetting.setString(serverUrl, conectionUrl);
			}
		}

		if (new String(args.activity.getIntent().getAction()).valueOf() == new String(android.content.Intent.ACTION_VIEW).valueOf()) {
			// TODO: get schema from intent
			const url = args.activity.getIntent().getData();
			if (url){

			}
		} else {
			enableLiveSyncPlugin(url);
		}
	});
}

function saveUrl(url, schema) {
	const socketurl = url.toString().replace(schema, "");
	applicationSetting.setString(serverUrl, socketurl);
}

function enableLiveSyncPlugin(url) {
	const liveSync = require("nativescript-plugin-livesync");
	liveSync.enable(true);
	return liveSync(url);
}
