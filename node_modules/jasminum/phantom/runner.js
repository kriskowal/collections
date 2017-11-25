#!/usr/bin/env node

var ChildProcess = require("child_process");
var Q = require("q");
var QS = require("qs");
var Fs = require("q-io/fs");
var Joey = require("joey");
var Require = require("mr");
var optimist = require("optimist");
var search = require("../search");

var argv = optimist
    .boolean(["p", "passes"])
    .boolean(["f", "failures"])
    .argv;

search(argv._).then(function (files) {
    return Require.findPackageLocationAndModuleId(files[0])
    .then(function (found) {
        return Require.loadPackage(found.location)
        .then(function (package) {
            return package.loadPackage({name: "jasminum"})
            .then(function () {
                return run(package);
            });
        });
    });

    function run(found) {
        var path = Require.locationToPath(found.location);
        var modules = files.map(function (file) {
            return Fs.relativeFromDirectory(path, file);
        });

        var mrLocation = found.getPackage({name: "mr"}).location;
        var mrPath = Require.locationToPath(mrLocation);
        var mrRelPath = Fs.relativeFromDirectory(path, mrPath);
        var bootPath = Fs.join("/", mrRelPath, "boot.js");

        var jasminum = found.getPackage({name: "jasminum"});
        var indexId = found.identify("phantom/index", jasminum);

        var index = [
            "<!DOCTYPE html>",
            "<head>",
            "<meta charset=\"utf-8\">",
            // TODO protect against HTML injection
            "<script src=\"" + bootPath + "\" data-module=\"" + indexId + "\"></script>",
            "</head>",
            "<body>",
            "</body>",
            "</html>"
        ];

        var server = Joey
        .route(function ($) {
            $("").method("GET").content(index, "text/html");
        })
        .fileTree(path, {followInsecureSymbolicLinks: true})
        .server();

        return server.listen(0)
        .then(function (server) {
            var codeDeferred = Q.defer();
            var port = server.address().port;
            var child = ChildProcess.spawn("phantomjs", [
                Fs.join(__dirname, "script.js"),
                "http://localhost:" + port + "/?" + QS.stringify({
                    modules: modules,
                    failures: argv.f || argv.failures ? "show" : "hide",
                    passes: argv.p || argv.passes ? "show" : "hide",
                    tty: process.stdout.isTTY ? "yes" : "no"
                })
            ], {
                stdio: [
                    process.stdin,
                    process.stdout,
                    process.stderr
                ]
            });
            child.on("error", function (cause) {
                var error;
                if (cause.code === "ENOENT") {
                    error = new Error("Can't run tests. Install PhantomJS");
                    error.code = cause.code;
                    throw error;
                } else {
                    error = cause;
                }
                codeDeferred.reject(error);
            });
            child.on("close", function (code, signal) {
                codeDeferred.resolve(code);
            });
            return codeDeferred.promise;
        })
        .finally(server.stop);
    }
})
.done(process.exit);

