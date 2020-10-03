/* global describe */
"use strict";

var FastMap = require("@collections/fast-map");
var describeDict = require("../specs/dict");
var describeMap = require("../specs/map");

describe("FastMap", function () {
  describeDict(FastMap);
  describeMap(FastMap);
});

