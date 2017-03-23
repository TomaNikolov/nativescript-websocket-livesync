var path = require("path"),
    fs = require("fs"),
    hookHelper = require("./hook-helper"),
    requireModules = ["require('nativescript-websocket-livesync/index.js');"];

module.exports = function ($platformsData, hookArgs) {
    var platformData = $platformsData.getPlatformData(hookArgs.platform),
        tnsModulesPath = path.join(platformData.appDestinationDirectoryPath, 'app/tns_modules'),

    // Inject console-via-logger and ion-info-generator modules at app entry point
    var applicationFilePath = path.join(tnsModulesPath, 'tns-core-modules', 'application', 'application.js'),
        applicationFileContent = fs.readFileSync(applicationFilePath).toString();

    // Check if the custom requires are not injected yet, because the after-prepare hook will be invoked twice (On prepare command and on build command which will invoke prepare internally)
    if (!applicationFileContent.endsWith(requireModules[requireModules.length - 1])) {
        fs.writeFileSync(applicationFilePath, applicationFileContent.concat("\n", requireModules.join("\n")));
    }
};
