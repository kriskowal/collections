"use strict";

var Suite = require("jasminum/suite");

var suite = new Suite("Collections").describe(function () {
  require("./tests");
});

suite.runAndReport({Promise: Promise});
