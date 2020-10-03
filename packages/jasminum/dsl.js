"use strict";

var any = require("./any");
var createSpy = require("./spy");
var createSpyObject = require("./spy-object");

function getGlobalThis() {
  if (typeof globalThis === "object") {
    return globalThis;
  } else if (typeof global === "object") {
    return global;
  } else if (typeof self === "object") {
    return self;
  }
  throw new TypeError("Cannot find a candidate stand-in for `globalThis`, neither that nor `global` nor `self` are in scope");
}

var root = getGlobalThis();

// DEPRECATED
root.jasmine = {
  createSpy: createSpy,
  createSpyObj: createSpyObject,
  any: any
};

// During declaration
var currentSuite;
// During execution
var currentReport;
var currentTest;

root.describe = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call describe when there is no active suite");
  }
  var suite = currentSuite.nestSuite(name);
  suite.describe(callback);
};

root.xdescribe = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call xdescribe when there is no active suite");
  }
  var suite = currentSuite.nestSuite(name);
  suite.skip = true;
  suite.describe(callback);
};

root.ddescribe = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call ddescribe when there is no active suite");
  }
  var suite = currentSuite.nestSuite(name);
  suite.setExclusive();
  suite.describe(callback);
};

root.it = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call it when there is no active suite");
  }
  currentSuite.nestTest(name, callback);
};

root.iit = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call iit when there is no active suite");
  }
  var test = currentSuite.nestTest(name, callback);
  currentSuite.setExclusive();
  test.exclusive = true;
};

root.xit = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call xit when there is no active suite");
  }
  var test = currentSuite.nestTest(name, callback);
  test.skip = true;
};

root.beforeEach = function (callback) {
  if (!currentSuite) {
    throw new Error("Cannot use `beforeEach` outside of a 'define' block");
  }
  currentSuite.beforeEach = callback;
};

root.afterEach = function (callback) {
  if (!currentSuite) {
    throw new Error("Cannot use `afterEach` outside of a 'define' block");
  }
  currentSuite.afterEach = callback;
};

root.expect = function (value) {
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

root.spyOn = function (object, name) {
  object[name] = createSpy(name, object[name]);
  return object[name];
};

// For internal linkage

root.getCurrentSuite = function () {
  if (currentSuite) {
    return currentSuite;
  } else if (currentTest) {
    return currentTest.suite;
  }
};

root.setCurrentSuite = function (suite) {
  currentSuite = suite;
};

root.getCurrentReport = function () {
  return currentReport;
};

root.setCurrentReport = function (report) {
  currentReport = report;
};

root.getCurrentTest = function () {
  return currentTest;
};

root.setCurrentTest = function (test) {
  currentTest = test;
};
