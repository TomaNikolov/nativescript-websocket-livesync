"use strict";

const application = require("application");
const applicationSetting = require("application-settings");
const serviceHelper = require('./service-helper');

const serverUrl = "serverUrl";

application.android.on(application.AndroidApplication.activityCreatedEvent, function (args) {
	if (args.activity.getIntent().getBooleanExtra("isAppetize", false)) {
		const conectionUrl = args.activity.getIntent().getStringExtra(serverUrl);
		if (conectionUrl) {
			applicationSetting.setString(serverUrl, conectionUrl);
		}
	}

	if (new String(args.activity.getIntent().getAction()).valueOf() == new String(android.content.Intent.ACTION_VIEW).valueOf()) {
		// TODO: get schema from intent
		const url = args.activity.getIntent().getData();
		if (url) {
			enableLiveSyncPlugin(url);
		}
	} else {

	}

	const socketurl = applicationSetting.getString(serverUrl);
	console.log('*******', socketurl, '*******')
	if (serverUrl) {
		//connectionMAnager.openConnection(serverUrl);
		serviceHelper.startService(args.activity);
	}
});

function saveUrl(url, schema) {
	const socketurl = url.toString().replace(schema, "");
	applicationSetting.setString(serverUrl, socketurl);
}

function enableLiveSyncPlugin(url) {
	const liveSync = require("nativescript-plugin-livesync");
	liveSync.enable(true);
	return liveSync(url);
}
