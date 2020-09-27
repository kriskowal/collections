/* global describe */
"use strict";

// TODO test insertion order

var Map = require("@collections/map");
var describeMap = require("../specs/map");

describe("Map", function () {
    describeMap(Map); // Subsumes describeDict
});
