// vim:ts=4:sts=4:sw=4:

require("./dsl");

var Test = require("./test");
var Expectation = require("./expectation");
var Reporter = require("./platform-reporter");

module.exports = Suite;

function Suite(name) {
    this.name = name;
    this.parent = null;
    this.root = this; // Unless overridden
    this.children = [];
    this.exclusive = false;
    this.beforeEach = null;
    this.afterEach = null;
    this.testCount = 0;
    this.skip = false;
}

Suite.prototype.type = "describe";

// To be overriden if desired
Suite.prototype.Promise = null;

Suite.prototype.describe = function (callback) {
    if (!callback) {
        this.skip = true;
        return this;
    }
    setCurrentSuite(this);
    try {
        callback();
    } finally {
        setCurrentSuite(this.parent);
    }
    return this;
};

Suite.prototype.nestSuite = function (name) {
    var child = new this.constructor();
    child.root = this.root;
    child.parent = this;
    child.name = name;
    child.children = [];
    child.exclusive = false;
    this.children.push(child);

    // Specialize the Expectation
    function SuiteExpectation(value, report) {
        Expectation.call(this, value, report);
    }
    SuiteExpectation.prototype = Object.create(this.Expectation.prototype);
    child.Expectation = SuiteExpectation;

    return child;
};

Suite.prototype.nestTest = function (name, callback) {
    var child = new this.Test(name, callback, this, this.root);
    this.root.testCount++;
    child.exclusive = false;
    this.children.push(child);
    return child;
};

Suite.prototype.setExclusive = function () {
    var child = this;
    while (child) {
        child.exclusive = true;
        child = child.parent;
    }
};

Suite.prototype.run = function (report, Promise) {
    var self = this;
    Promise = Promise || this.Promise;
    var suiteReport = report.start(this);
    return Promise.resolve().then(function () {
        if (!self.skip) {
            var exclusiveChildren = self.children.filter(function (child) {
                return child.exclusive;
            });
            var children = exclusiveChildren.length ? exclusiveChildren : self.children;
            return children.reduce(function (ready, child) {
                return ready.then(function () {
                    return child.run(suiteReport, Promise);
                });
            }, Promise.resolve())
        } else {
            suiteReport.skip(self);
        }
    })
    .finally(function () {
        suiteReport.end(self);
    });

};

Suite.prototype.runSync = function (report) {
    var suiteReport = report.start(this);
    if (!this.skip) {
        var exclusiveChildren = this.children.filter(function (child) {
            return child.exclusive;
        });
        var children = exclusiveChildren.length ? exclusiveChildren : this.children;
        try {
            for (var index = 0; index < children.length; index++) {
                var child = children[index];
                child.runSync(suiteReport);
            }
        } finally {
            suiteReport.end(this);
        }
    } else {
        suiteReport.skip(this);
        suiteReport.end(this);
    }
};

Suite.prototype.runAndReport = function (options) {
    options = options || {};
    var report = options.report || new (options.Reporter || this.Reporter)(options);
    var self = this;
    if (report.enter) {
        report.enter();
    }
    return this.run(report, options.Promise)
    .then(function () {
        report.summarize(self, options)
        if (report.exit) {
            return report.exit();
        }
    });
};

Suite.prototype.runAndReportSync = function (options) {
    options = options || {};
    var report = options.report || new (options.Reporter || this.Reporter)(options);
    var self = this;
    if (report.enter) {
        report.enter();
    }
    this.runSync(report, options)
    report.summarize(self, options)
    if (report.exit) {
        report.exit();
    }
};

Suite.prototype.Test = Test;
Suite.prototype.Expectation = Expectation;
Suite.prototype.Reporter = Reporter;

