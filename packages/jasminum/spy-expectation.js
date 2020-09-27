
var Expectation = require("./expectation");
var has = require("pop-has");

module.exports = SpyExpectation;
function SpyExpectation(value, report) {
    Expectation.call(this, value, report);
}

SpyExpectation.prototype = Object.create(Expectation.prototype);

SpyExpectation.prototype.constructor = SpyExpectation;

SpyExpectation.prototype.toHaveBeenCalled = function () {
    if (this.value.displayName) {
        this.assert(this.value.argsForCall.length > 0, [
            "expected function", "[not] to have been called"
        ], [
            this.value.displayName
        ]);
    } else {
        this.assert(this.value.argsForCall.length > 0, [
            "expected function [not] to have been called"
        ], []);
    }
};

SpyExpectation.prototype.toHaveBeenCalledWith = function () {
    var args = Array.prototype.slice.call(arguments);
    var guard = has(this.value.argsForCall, args);
    if (this.value.displayName) {
        this.assert(
            guard,
            [
                "expected function",
                "[not] to have been called with",
                "but had only these calls"
            ],
            [
                this.value.displayName,
                args,
                this.value.argsForCall
            ]
        );
    } else {
        this.assert(
            guard,
            [
                "expected function " +
                "[not] to have been called with",
                "but had only these calls"
            ],
            [
                args,
                this.value.argsForCall
            ]
        );
    }
};

