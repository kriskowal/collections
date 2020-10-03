"use strict";

var Oa = require("./array");
var Oo = require("./object");
var Or = require("./range");
var Om = require("./map");

exports.makeArrayObservable = Oa.makeArrayObservable;

var name;
for (name in Oo) {
  exports[name] = Oo[name];
}
for (name in Or) {
  exports[name] = Or[name];
}
for (name in Om) {
  exports[name] = Om[name];
}
