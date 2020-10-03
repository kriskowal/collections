#!/usr/bin/env node
/* eslint no-console: [0] */
"use strict";

var search = require("./search");
var optimist = require("optimist");

var Suite = require("./jasminum");
var Reporter = require("./reporter");

var colors = require("./colors");

var argv = optimist
  .boolean(["p", "passes"])
  .boolean(["f", "failures"])
  .argv;

Error.stackTraceLimit = Infinity;

search(argv._).then(function (files) {
  var suite = new Suite("").describe(function () {
    files.forEach(function (file) {
      describe(file, function () {
        if (process.stdout.isTTY) {
          console.log(colors.color(file, "black+bold"));
        } else {
          console.log(file);
        }
        require(file);
      });
    });
  });

  var options = {
    showFails: argv.f || argv.failures,
    showPasses: argv.p || argv.passes
  };

  var report = new Reporter(options);

  return suite.runAndReport({
    report: report
  });
}).catch(function (err) {
  console.error(err);
  process.exitCode = 1;
});

