"use strict";
var fs = require("fs");
var os_1 = require("os");
var path = require("path");
var hookHelper = require("./hooks/hook-helper");
var projectDir = hookHelper.findProjectDir();


if (projectDir) {
    var hooksDir = hookHelper.getHooksDir(),
        afterPrepareHookDir = hookHelper.getAfterPrepareHookDir(),
        content = 'module.exports = require("nativescript-websocket-livesync/hooks/after-prepare");';

    if (!fs.existsSync(hooksDir)) {
        fs.mkdirSync(hooksDir);
    }
    if (!fs.existsSync(afterPrepareHookDir)) {
        fs.mkdirSync(afterPrepareHookDir);
    }
    fs.writeFileSync(hookHelper.getHookFilePath(), content + os_1.EOL);
}
