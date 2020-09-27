
var body = document.querySelector("body");
body.classList.add("testing");

module.exports = Reporter;
function Reporter() {
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
    child.depth = this.depth + 1;
    child.failed = test.shouldFail;
    child.skipped = false;
    console.group(test.type + " " + test.name);
    return child;
};

Reporter.prototype.end = function (test) {
    if (this.failed && this.parent && this.parent.parent) {
        this.parent.failed = true;
    }
    if (test.type === "it") {
        if (this.failed) {
            this.root.failed++;
            body.classList.add("fail");
            console.error("FAIL");
        } else if (this.skipped) {
            this.root.skipped++;
        } else {
            this.root.passed++;
        }
    }
    console.groupEnd();
};

Reporter.prototype.skip = function () {
    this.skipped = true;
    this.root.skipped++;
};

Reporter.prototype.assert = function (guard, isNot, messages, objects) {
    var passed = !guard === isNot;
    if ((!passed && !this.test.shouldFail) || this.showPasses) {
        var interleaved = [];
        var format = [];
        for (var index = 0; index < Math.max(messages.length, objects.length); index++) {
            if (index < messages.length) {
                var message = "" + messages[index];
                if (isNot) {
                    message = message.replace(/\[not\] /, "not ");
                } else {
                    message = message.replace(/\[not\] /, "");
                }
                format.push("%s");
                interleaved.push(message);
            }
            if (index < objects.length) {
                format.push("%O");
                interleaved.push(objects[index]);
            }
        }
        //interleaved.unshift(format.join(" "));
        console.log.apply(console, interleaved);
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
    this.failed = true;
    this.root.errors++;
    if (this.test.shouldFail) {
        this.failed = false;
    } else if (error && typeof error.stack === "string") {
        console.log(error.stack);
    } else {
        console.log(error);
    }
};

Reporter.prototype.summarize = function (suite) {
    if (!this.failed) {
        body.classList.add("pass");
    }
    console.log(this.passed + " passed tests");
    console.log(this.passedAssertions + " passed assertions");
    if (this.failed) {
        console.error(this.failed + " failed tests");
    } else {
        console.log(this.failed + " failed tests");
    }
    if (this.failedAssertions) {
        console.error(this.failedAssertions + " failed assertions");
    } else {
        console.log(this.failedAssertions + " failed assertions");
    }
    console.log(this.errors + " errors");
    var skipped = suite.testCount - this.passed - this.failed;
    console.log(skipped + " skipped tests");

    global.global_test_results = {
        passed: this.passed,
        passedAssertions: this.passedAssertions,
        failed: this.failed,
        failedAssertions: this.failedAssertions,
        skipped: skipped
    };
};

