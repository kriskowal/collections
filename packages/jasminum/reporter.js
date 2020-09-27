
var util = require("util");
require("colors");

// TODO consider piping isTTY through querystring to disable colors if phantom
// results are piped on the Node.js side.

var colors = (
    typeof window !== "undefined" &&
    window.isTTY || // PhantomJS
    typeof process !== "undefined" && // Node.js attached to terminal
    typeof process.stdout !== "undefined" &&
    process.stdout.isTTY
);

function getStackTrace() {
    var stack = new Error("").stack;
    if (typeof stack === "string") {
        stack = stack.replace(/^[^\n]*\n[^\n]\n/, "");
        stack = annotateStackTrace(stack);
    }
    return stack;
}

function annotateStackTrace(stack) {
    if (stack && colors) {
        stack = stack.replace(/\n    ([^\n]+\-(?:spec|test)\.js[^\n]+)/g, function ($0, $1) {
            return ("\n  → " + $1).bold;
        });
    }
    return stack;
}

module.exports = Reporter;
function Reporter(options) {
    options = options || {};
    this.showFails = !!options.showFails;
    this.showPasses = !!options.showPasses;
    this.root = this;
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.errors = 0;
    this.passedAssertions = 0;
    this.failedAssertions = 0;
    this.depth = 0;
}

Reporter.prototype.start = function (test) {
    var child = Object.create(this);
    child.test = test;
    child.parent = this;
    child.depth = this.depth + 1;
    // A test passes if all assertions pass.
    // A test that should fail passes if any assertion fails.
    // Tests that [should fail] exist only for validating the test runner
    // itself and is only necessarily implemented by this test reporter.
    child.failed = test.shouldFail;
    child.skipped = false;
    var message = (Array(child.depth + 1).join("❯") + " " + test.type + " " + test.name + (test.async ? " async".white : ""));
    if (test.skip) {
        message = message + " (skipped)";
        if (colors) {
            message = message.cyan;
        }
    } else {
        if (colors) {
            message = message.grey;
        }
    }
    child.message = message;
    if (!this.showFails) {
        console.log(child.message);
    }
    return child;
};

Reporter.prototype.end = function (test) {
    if (this.showFails && this.failed) {
        console.log((Array(this.depth + 1).join("↑") + " " + test.type + " " + test.name).grey);
    }
    if (this.failed && this.parent && this.parent.parent) {
        this.parent.failed = true;
    }
    if (test.type === "it") {
        if (this.failed) {
            this.root.failed++;
        } else if (this.skipped) {
            this.root.skipped++;
        } else {
            this.root.passed++;
        }
    }
};

Reporter.prototype.skip = function (test) {
    this.skipped = true;
    this.root.skipped++;
};

Reporter.prototype.assert = function (guard, isNot, messages, objects) {
    var passed = !guard === isNot;
    if ((!passed && !this.test.shouldFail) || this.showPasses) {
        for (var index = 0; index < Math.max(messages.length, objects.length); index++) {
            if (index < messages.length) {
                var message = "" + messages[index];
                if (isNot) {
                    message = message.replace(/\[not\] /, "not ");
                } else {
                    message = message.replace(/\[not\] /, "");
                }
                if (colors) {
                    if (passed !== this.test.shouldFail) {
                        message = message.green;
                    } else {
                        message = message.red;
                    }
                }
                console.log(message);
            }
            if (index < objects.length) {
                console.log(util.inspect(objects[index], {colors: colors, depth: null}));
            }
        }
    }
    if (!passed && !this.test.shouldFail) {
        var stack = annotateStackTrace(getStackTrace());
        if (stack) {
            console.log(stack);
        }
    }
    if (passed) { // passed
        if (this.test.shouldFail) { // but should fail
            this.failed = false;
        } else { // and passed
            this.root.passedAssertions++;
        }
    } else { // failed
        if (!this.test.shouldFail) { // but should pass
            this.failed = true;
            this.root.failedAssertions++;
        } else { // and should fail
            this.failed = false;
            this.root.passedAssertions++;
        }
    }
};

Reporter.prototype.error = function (error, test) {
    if (this.test.shouldFail) {
        this.failed = false;
    } else {
        console.log(colors ? "error".red : "error");
        if (typeof error.stack === "string") {
            console.log(annotateStackTrace(error.stack));
        } else if (error) {
            console.log(error);
        }
        this.failed = true;
        this.root.errors++;
    }
};

Reporter.prototype.enter = function () {
    if (typeof alert === "undefined") {
        var self = this;
        this.exitListener = function (code) {
            self.failed++;
            if (colors) {
                console.log("test never completes".red);
            } else {
                console.log("test never completes");
            }
            self.exit(code !== 0);
        };
        process.on("exit", this.exitListener);
    }
};

Reporter.prototype.summarize = function (suite) {
    if (colors && !this.failed && this.passed) {
        console.log((this.passed + " passed tests").green);
    } else {
        console.log(this.passed + " passed tests");
    }
    if (colors && !this.failedAssertions && this.passedAssertions && !this.failed && this.passed) {
        console.log((this.passedAssertions + " passed assertions").green);
    } else {
        console.log(this.passedAssertions + " passed assertions");
    }
    if (colors && this.failed) {
        console.log((this.failed + " failed tests").red);
    } else {
        console.log(this.failed + " failed tests");
    }
    if (colors && this.failedAssertions) {
        console.log((this.failedAssertions + " failed assertions").red);
    } else {
        console.log(this.failedAssertions + " failed assertions");
    }
    if (colors && this.errors) {
        console.log((this.errors + " errors").red);
    } else {
        console.log(this.errors + " errors");
    }
    var skipped = suite.testCount - this.passed - this.failed;
    if (colors && skipped) {
        console.log((skipped + " skipped tests").cyan);
    } else if (skipped) {
        console.log(skipped + " skipped tests");
    }
};

Reporter.prototype.exit = function (exiting) {
    if (typeof alert === "undefined") {
        // Node.js
        process.removeListener("exit", this.exitListener);
        if (!exiting) {
            process.exit(this.failed ? -1 : 0);
        }
    } else {
        // PhantomJS
        if (this.failed) {
            alert("Jasminum tests failed.");
        } else {
            alert("Jasminum tests completed.");
        }
    }
};

