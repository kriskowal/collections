"use strict";

var any = require("./any");
var createSpy = require("./spy");
var createSpyObject = require("./spy-object");

// DEPRECATED
globalThis.jasmine = {
  createSpy: createSpy,
  createSpyObj: createSpyObject,
  any: any
};

// During declaration
var currentSuite;
// During execution
var currentReport;
var currentTest;

globalThis.describe = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call describe when there is no active suite");
  }
  var suite = currentSuite.nestSuite(name);
  suite.describe(callback);
};

globalThis.xdescribe = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call xdescribe when there is no active suite");
  }
  var suite = currentSuite.nestSuite(name);
  suite.skip = true;
  suite.describe(callback);
};

globalThis.ddescribe = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call ddescribe when there is no active suite");
  }
  var suite = currentSuite.nestSuite(name);
  suite.setExclusive();
  suite.describe(callback);
};

globalThis.it = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call it when there is no active suite");
  }
  currentSuite.nestTest(name, callback);
};

globalThis.iit = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call iit when there is no active suite");
  }
  var test = currentSuite.nestTest(name, callback);
  currentSuite.setExclusive();
  test.exclusive = true;
};

globalThis.xit = function (name, callback) {
  if (!currentSuite) {
    throw new Error("Can't call xit when there is no active suite");
  }
  var test = currentSuite.nestTest(name, callback);
  test.skip = true;
};

globalThis.beforeEach = function (callback) {
  if (!currentSuite) {
    throw new Error("Cannot use `beforeEach` outside of a 'define' block");
  }
  currentSuite.beforeEach = callback;
};

globalThis.afterEach = function (callback) {
  if (!currentSuite) {
    throw new Error("Cannot use `afterEach` outside of a 'define' block");
  }
  currentSuite.afterEach = callback;
};

globalThis.expect = function (value) {
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

globalThis.spyOn = function (object, name) {
  object[name] = createSpy(name, object[name]);
  return object[name];
};

// For internal linkage

globalThis.getCurrentSuite = function () {
  if (currentSuite) {
    return currentSuite;
  } else if (currentTest) {
    return currentTest.suite;
  }
};

globalThis.setCurrentSuite = function (suite) {
  currentSuite = suite;
};

globalThis.getCurrentReport = function () {
  return currentReport;
};

globalThis.setCurrentReport = function (report) {
  currentReport = report;
};

globalThis.getCurrentTest = function () {
  return currentTest;
};

globalThis.setCurrentTest = function (test) {
  currentTest = test;
};
