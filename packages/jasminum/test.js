// vim:ts=4:sts=4:sw=4:

module.exports = Test;

function Test(name, callback, suite) {
    this.name = name;
    this.callback = callback;
    this.children = [];
    this.suite = suite;
    this.skip = !callback;
    // The [should fail] directive in a test name exists solely for the purpose
    // of testing the test runner itself.
    this.shouldFail = /\[should fail\]/.test(name);
}

Test.prototype.type = "it";

Test.prototype.run = function (report, Promise) {
    var self = this;
    var report = report.start(self);
    setCurrentTest(self);
    setCurrentReport(report);
    return Promise.resolve().then(function () {
        if (!self.skip) {
            var context = {};
            return Promise.resolve().then(function () {
                return self.beforeEach(Promise, context, report);
            })
            .then(function () {
                return self.call(self.callback, Promise, context, report, "during");
            })
            .finally(function () {
                return self.afterEach(Promise, context, report);
            })
        } else {
            report.skip(self);
        }
    })
    .then(function (value) {
        report.assert(value === undefined, false, ["expected test to return or resolve undefined but got"], [value]);
    }, function (error) {
        report.error(error, self);
    })
    .finally(function () {
        report.end(self);
        setCurrentTest();
        setCurrentReport();
    });
};

Test.prototype.beforeEach = function (Promise, context, report) {
    var self = this;
    var heritage = this.heritage();
    return heritage.reduceRight(function (ready, suite) {
        return ready.then(function () {
            if (suite.beforeEach) {
                return self.call(suite.beforeEach, Promise, context, report, "before");
            }
        });
    }, Promise.resolve());
};

Test.prototype.afterEach = function (Promise, context, report) {
    var self = this;
    var heritage = this.heritage();
    return heritage.reduceRight(function (ready, suite) {
        return ready.then(function () {
            if (suite.afterEach) {
                return self.call(suite.afterEach, Promise, context, report, "after");
            }
        });
    }, Promise.resolve());
};

Test.prototype.heritage = function () {
    var heritage = [];
    var suite = this.suite;
    while (suite) {
        heritage.push(suite);
        suite = suite.parent;
    }
    return heritage;
};

Test.prototype.call = function (callback, Promise, context, report, phase) {
    if (callback.length === 1) {
        return new Promise(function (resolve, reject) {
            var isDone;
            function done(error) {
                if (isDone) {
                    report.error(new Error("`done` called multiple times " + phase + " " + JSON.stringify(test.name)), test);
                }
                isDone = true;
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
            callback.call(context, done);
        });
    } else {
        return callback.call(context);
    }
};

Test.prototype.runSync = function (report) {
    var report = report.start(this)
    setCurrentTest(this);
    setCurrentReport(report);
    try {
        if (!this.skip) {
            if (this.callback.length > 0) {
                throw new Error(
                    "Can't run asynchronous tests without providing a " +
                    "Promise constructor to 'run'"
                );
            }
            var context = {};
            try {
                this.beforeEachSync(context);
                this.callback.call(context);
            } finally {
                this.afterEachSync(context);
            }
        } else {
            report.skip(this);
        }
    } catch (error) {
        report.error(error, this);
    } finally {
        report.end(this);
        setCurrentTest();
        setCurrentReport();
    }
};

Test.prototype.beforeEachSync = function (context) {
    var heritage = this.heritage();
    for (var index = heritage.length - 1; index >= 0; index--) {
        var suite = heritage[index];
        if (suite.beforeEach) {
            suite.beforeEach.call(context);
        }
    }
};

Test.prototype.afterEachSync = function (context) {
    var heritage = this.heritage();
    for (var index = heritage.length - 1; index >= 0; index--) {
        var suite = heritage[index];
        if (suite.afterEach) {
            suite.afterEach.call(context);
        }
    }
};

