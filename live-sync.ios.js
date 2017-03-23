"use strict";

const packageZip = "package.zip";

function syncApplication(nsData) {
	const tempPath = NSTemporaryDirectory() + packageZip;
	let err;
	nsData.writeToFileAtomically(tempPath, true);
	livesyncFolderPath = TLKConstants.getLiveSyncFolderPath();
	TLKExtractor.extractArchiveAtPathToDestinationProgressHandlerCompconstionHandler(tempPath, livesyncFolderPath, null, (err) => {
		if (err) {
			console.log(err);
		}

		//TNSAppManager.refreshApplication();
		TNSAppManager.restartApplication()
	})
}

exports.syncApplication = syncApplication;