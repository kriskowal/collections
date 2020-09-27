
var Q = require("q");
var ChildProcess = require("child_process");
var NodeReader = require("q-io/node/reader");
var env = require("../env.json");

Object.keys(env).reduce(function (done, key) {
    return done.then(function () {
        var value = env[key];
        console.log(key);
        return encrypt(key, value);
    });
}, Q())
.done();

function encrypt(key, value) {
    var deferred = Q.defer();
    var git = ChildProcess.spawn("travis", [
         "encrypt",
         "--add",
         "env.global",
         key + "=" + value
    ], {
        stdio: [0, 1, 2]
    });
    git.on("exit", function (code) {
        if (code) {
            deferred.reject(new Error("Exit with status " + code));
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}

