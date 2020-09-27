/* global describe, xdescribe, ddescribe, it, xit, iit,
   expect, beforeEach, afterEach, spyOn, getCurrentSuite,
   setCurrentSuite, getCurrentTest, setCurrentTest,
   getCurrentReport, setCurrentReport, jasmine */

var any = require("./any");
var createSpy = require("./spy");
var createSpyObject = require("./spy-object");

// DEPRECATED
jasmine = {
    createSpy: createSpy,
    createSpyObj: createSpyObject,
    any: any
};

// During declaration
var currentSuite;
// During execution
var currentReport;
var currentTest;

describe = function (name, callback) {
    if (!currentSuite) {
        throw new Error("Can't call describe when there is no active suite");
    }
    var suite = currentSuite.nestSuite(name);
    suite.describe(callback);
};

xdescribe = function (name, callback) {
    if (!currentSuite) {
        throw new Error("Can't call xdescribe when there is no active suite");
    }
    var suite = currentSuite.nestSuite(name);
    suite.skip = true;
    suite.describe(callback);
};

ddescribe = function (name, callback) {
    if (!currentSuite) {
        throw new Error("Can't call ddescribe when there is no active suite");
    }
    var suite = currentSuite.nestSuite(name);
    suite.setExclusive();
    suite.describe(callback);
};

it = function (name, callback) {
    if (!currentSuite) {
        throw new Error("Can't call it when there is no active suite");
    }
    currentSuite.nestTest(name, callback);
};

iit = function (name, callback) {
    if (!currentSuite) {
        throw new Error("Can't call iit when there is no active suite");
    }
    var test = currentSuite.nestTest(name, callback);
    currentSuite.setExclusive();
    test.exclusive = true;
};

xit = function (name, callback) {
    if (!currentSuite) {
        throw new Error("Can't call xit when there is no active suite");
    }
    var test = currentSuite.nestTest(name, callback);
    test.skip = true;
};

beforeEach = function (callback) {
    if (!currentSuite) {
        throw new Error("Cannot use `beforeEach` outside of a 'define' block");
    }
    currentSuite.beforeEach = callback;
};

afterEach = function (callback) {
    if (!currentSuite) {
        throw new Error("Cannot use `afterEach` outside of a 'define' block");
    }
    currentSuite.afterEach = callback;
};

expect = function (value) {
    if (!currentReport) {
        throw new Error("Cannot declare an expectation outside of an 'it' block");
    }
    if (value && typeof value.expect === "function") {
        return value.expect(currentReport);
    } else {
        return new currentTest.suite.Expectation(
            value,
            currentReport
        );
    }
};

spyOn = function (object, name) {
    object[name] = createSpy(name, object[name]);
    return object[name];
};

// For internal linkage

getCurrentSuite = function () {
    if (currentSuite) {
        return currentSuite;
    } else if (currentTest) {
        return currentTest.suite;
    }
};

setCurrentSuite = function (suite) {
    currentSuite = suite;
};

getCurrentReport = function () {
    return currentReport;
};

setCurrentReport = function (report) {
    currentReport = report;
};

getCurrentTest = function () {
    return currentTest;
};

setCurrentTest = function (test) {
    currentTest = test;
};

