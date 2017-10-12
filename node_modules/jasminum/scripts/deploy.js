
var config = require("../package.json");
var NodeReader = require("q-io/node/reader");
var FS = require("q-io/fs");
var ChildProcess = require("child_process");
var knox = require("knox");
var URL = require("url");
var Q = require("q");
var build = require("mr/build");
var env = require("./env");

module.exports = deploy;
function deploy() {
    return getDeploymentReference().then(function (reference) {
        var s3 = knox.createClient({
            bucket: env.S3_BUCKET,
            key: env.S3_ACCESS_KEY_ID,
            secret: env.S3_ACCESS_KEY
        });
        return build(FS.join(__dirname, "..", "test", "index.js"))
        .then(function (bundle) {
            bundle = Buffer(bundle, "utf-8");
            return put(s3, URL.resolve(reference.path, "test.js"), bundle, {
                "Content-Length": bundle.length,
                "Content-type": "application/json",
                "x-amz-acl": "public-read"
            });
        }).then(function () {
            var page = "<body><script src=\"test.js\"></script></body>";
            return put(s3, URL.resolve(reference.path, "test.html"), page, {
                "Content-Length": page.length,
                "Content-type": "text/html",
                "x-amz-acl": "public-read"
            });
        }).then(function () {
            return {
                type: reference.type,
                path: reference.path,
                tags: [reference.type],
                build: reference.build,
                custom: reference,
                testLocation: URL.resolve(URL.resolve(env.S3_WEBSITE, reference.path), "test.html")
            }
        });
    });
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

function getDeploymentReference() {
    return getGitHash("HEAD").then(function (hash) {
        return gitIsClean().then(function (gitIsClean) {
            if (gitIsClean) {
                return getGitHash("v" + config.version).then(function (vHash) {
                    if (hash === vHash) {
                        return {
                            type: "release",
                            hash: hash,
                            version: config.version,
                            build: "v" + config.version,
                            path: "/release/" + config.version + "/"
                        }
                    } else {
                        return {
                            type: "integration",
                            hash: hash,
                            build: hash.slice(0, 7),
                            path: "/integration/" + hash + "/"
                        }
                    }
                });
            } else {
                var nonce = Math.random().toString(36).slice(2, 7);
                return {
                    type: "development",
                    hash: hash,
                    nonce: nonce,
                    build: hash.slice(0, 7) + "-" + nonce,
                    path: "/development/" + hash + "-" + nonce + "/"
                };
            }
        })
    });
}

function getGitHash(rev) {
    var git = ChildProcess.spawn("git", ["rev-parse", rev]);
    var out = NodeReader(git.stdout, "utf-8");
    return out.read().then(function (line) {
        return line.trim();
    });
}

function gitIsClean() {
    var git = ChildProcess.spawn("git", ["status", "--porcelain"]);
    var out = NodeReader(git.stdout, "utf-8");
    return out.read().then(function (line) {
        return line.trim() === "";
    });
}

if (require.main === module) {
    return deploy().done(console.log);
}

