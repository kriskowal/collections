/* global describe */
"use strict";

var describeDeque = require("./deque");
var describeCollection = require("./collection");
var describeOrder = require("./order");
var toArray = require("@collections/to-array");

describe("Array", function () {
    describeDeque(toArray);
    describeCollection(toArray, [1, 2, 3, 4]);
    describeCollection(toArray, [{id: 0}, {id: 1}, {id: 2}, {id: 3}]);
    describeOrder(toArray);
});
