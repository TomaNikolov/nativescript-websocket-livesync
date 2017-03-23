"use strict";

function livesync(syncApplication) {
	const zipStream = new java.util.zip.ZipInputStream(byteArrayInputStream);
	const context = com.tns.NativeScriptApplication.getInstance();
	const outputPath = context.getFilesDir();
	let zipEntry;
	while ((zipEntry = zipStream.getNextEntry()) != null) {
		console.log("Telerik Unzipping: " + zipEntry.getName());
		if (zipEntry.isDirectory()) {
			continue;
		}

		const file = new java.io.File(outputPath, zipEntry.getName());
		const parentDirectory = file.getParentFile();
		if (!parentDirectory.exists()) {
			parentDirectory.mkdirs();
		}

		com.telerik.LiveSync.FileUtil.extractFile(zipStream, false, file.getAbsolutePath());
		zipStream.closeEntry();
	}

	com.telerik.LiveSync.CloudSync.restartNativeScriptApp(context);
}

exports.syncApplication = syncApplication;
