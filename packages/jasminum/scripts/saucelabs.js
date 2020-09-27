
// NOTE hung selenium/sauce {"browserName": "chrome", "version": 33, "platform": "Windows XP"},

// TODO back out early if the version is not 0.10, to avoid running browser
// tests for every version of Node.js covered by Travis-CI.

var configuration = require("../.saucelabs.json");
var Q = require("q");
var webdriver = require("wd");
var SauceLabs = require("saucelabs");
var URL = require("url");
var knox = require("knox");
var deploy = require("./deploy");
var HTTP = require("q-io/http");
var env = require("./env");

var sauce = Q(new SauceLabs({
    username: env.SAUCE_USERNAME,
    password: env.SAUCE_ACCESS_KEY
}));

var s3 = knox.createClient({
    bucket: env.S3_BUCKET,
    key: env.S3_ACCESS_KEY_ID,
    secret: env.S3_ACCESS_KEY
});

//return sauce.ninvoke("getWebDriverBrowsers")
//.then(function (browsers) {
//    console.log(browsers.length);
//})
//.done();

return deploy()
.then(function (parameters) {
    return configuration.configurations.reduce(function (failed, configuration) {
        return failed.then(function (failed) {
            return runConfiguration(configuration, parameters, failed);
        });
    }, Q(false))
    .then(function (failed) {
        // Capture a snapshot of the test matrix and upload it to the appropriate container
        return HTTP.request("https://saucelabs.com/browser-matrix/kriskowal-jasminum.svg")
        .get("body").invoke("read")
        .then(function (content) {
            return put(s3, URL.resolve(parameters.path, "saucelabs-matrix.svg"), content, {
                "Content-Length": content.length,
                "Content-type": "image/svg+xml",
                "x-amz-acl": "public-read"
            }).then(function () {
                if (parameters.type === "release" && parameters.version.split(".")[0] === 2) {
                    return put(s3, "/v2-saucelabs-matrix.svg", content, {
                        "Content-Length": content.length,
                        "Content-type": "image/svg+xml",
                        "x-amz-acl": "public-read"
                    });
                }
            });
        })
    });
    if (failed) {
        process.exit(-1);
    }
}).done();

function runConfiguration(configuration, parameters, failed) {
    var browser = webdriver.promiseRemote(
        "ondemand.saucelabs.com",
        80,
        env.SAUCE_USERNAME,
        env.SAUCE_ACCESS_KEY
    );

    browser.on('status', function(info){
      console.log("WD-STATUS>", info);
    });

    browser.on('command', function(meth, path){
      console.log("WD-COMMAND>", meth, path);
    });

    configuration.name = "Jasminum";
    configuration.tags = parameters.tags;
    configuration.build = parameters.build;
    configuration["custom-data"] = parameters.custom;
    return browser.init(configuration)
    .then(function (session) {
        var sessionId = session[0];
        console.log("SESSION", sessionId);

        return browser.get(parameters.testLocation)
        .then(function () {
            return poll(function () {
                return browser.eval("window.global_test_results")
                .then(function (results) {
                    return slurpLogs(browser)
                    .thenResolve(results);
                });
            }, 100)
            .then(function(results) {
                console.log(results);
            })
        })
        .then(function () {
            return slurpLogs();
        })
        .timeout(10 * 1000)
        .then(function () {
            return sauce.ninvoke("updateJob", sessionId, {
                passed: true,
                public: true
            });
        }, function (error) {
            failed = true;
            return sauce.ninvoke("updateJob", sessionId, {
                passed: false,
                public: true,
                "custom-data": {
                    "error": error.stack
                }
            });
        });
    })
    .finally(function () {
        return browser.quit();
    })
    .then(function () {
        return failed;
    });
}

function slurpLogs(browser) {
    return Q();
    // TODO
    return browser.log("browser")
    .then(function (logs) {
        logs.forEach(function (log) {
            console.log(log.message);
        });
    }, function () {
        // I'm not even angry
    });
}

function poll(callback, ms) {
    return callback().then(function (value) {
        if (value) {
            return value;
        } else {
            return Q().delay(ms).then(function () {
                return poll(callback, ms);
            });
        }
    })
}

function put(s3, path, content, headers) {
    var deferred = Q.defer();
    var request = s3.put(path, headers);
    request.on("response", function (response) {
        if (response.statusCode === 200) {
            deferred.resolve();
        } else {
            deferred.reject("Can't post " + response.statusCode);
        }
    });
    request.end(content);
    return deferred.promise;
}

