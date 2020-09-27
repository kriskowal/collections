
var BaseSuite = require("./suite");
var Q = require("q");

function Promise(setup) {
    var deferred = Q.defer();
    setup(deferred.resolve, deferred.reject);
    return deferred.promise;
}

Promise.resolve = Q;

module.exports = Suite;

function Suite() {
    BaseSuite.apply(this, arguments);
}

Suite.prototype = Object.create(BaseSuite.prototype);
Suite.prototype.constructor = Suite;
Suite.prototype.Promise = Promise;

