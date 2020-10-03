/* global describe */
"use strict";

var Dict = require("@collections/dict");
var describeDict = require("../specs/dict");
var describeObservableMap = require("../specs/observable-map");

describe("Dict", function () {
  describeDict(Dict);
  describeObservableMap(Dict);
});
