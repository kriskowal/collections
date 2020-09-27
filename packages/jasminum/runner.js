#!/usr/bin/env node

var search = require("./search");
var optimist = require("optimist");

var Suite = require("./jasminum");
var Reporter = require("./reporter");

var argv = optimist
    .boolean(["p", "passes"])
    .boolean(["f", "failures"])
    .argv;

Error.stackTraceLimit = Infinity;

search(argv._).then(function (files) {

    var suite = new Suite("").describe(function () {
        files.forEach(function (file) {
            describe(file, function () {
                if (process.stdout.isTTY) {
                    console.log(file.grey);
                } else {
                    console.log(file);
                }
                require(file);
            });
        });
    });

    var options = {
        showFails: argv.f || argv.failures,
        showPasses: argv.p || argv.passes
    };

    var report = new Reporter(options);

    return suite.runAndReport({
        report: report
    });
})
.done();

