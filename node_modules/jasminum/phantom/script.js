
var system = require("system");
var Page = require("webpage");
var page = Page.create();

page.onConsoleMessage = function (message) {
    system.stdout.writeLine(message);
};

page.onAlert = function (message) {
    if (message === "Jasminum tests completed.") {
        phantom.exit(0);
    } else if (message === "Jasminum tests failed.") {
        phantom.exit(-1);
    }
};

page.onError = function (message, trace) {
    console.error(message);
    trace.forEach(function (frame) {
        console.log(frame.file + ":" + frame.line, frame.function);
    });
    phantom.exit(-1);
};

page.onResourceError = function (resourceError) {
    console.log("PhantomJS can't load resource " + resourceError.url);
};

page.open(system.args[1], function (status) {
    if (status !== "success") {
        console.log("Can't load " + system.args[1]);
        phantom.exit();
    }
});

