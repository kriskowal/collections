/* global describe */
"use strict";

var SortedArrayMap = require("@collections/sorted-array-map");
var describeDict = require("../specs/dict");
var describeMap = require("../specs/map");
var describeObservableMap = require("../specs/observable-map");

describe("SortedArrayMap", function () {
    describeDict(SortedArrayMap);
    describeMap(SortedArrayMap, [1, 2, 3]);
    describeObservableMap(SortedArrayMap);
});

