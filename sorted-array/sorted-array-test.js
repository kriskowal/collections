/* global describe, it, expect */
"use strict";

var SortedArray = require("@collections/sorted-array");
var describeCollection = require("../specs/collection");
var describeDeque = require("../specs/deque");
var describeOrder = require("../specs/order");

describe("SortedArray", function () {

    function newSortedArray(values) {
        return new SortedArray(values);
    }

    newSortedArray.prototype = SortedArray.prototype;

    [SortedArray, newSortedArray].forEach(function (SortedArray) {
        describeDeque(SortedArray);
        describeCollection(SortedArray, [1, 2, 3, 4]);
        describeOrder(SortedArray);
    });

    describe("non-uniqueness", function () {
        it("should sort non-unique values", function () {
            var array = SortedArray([1, 2, 3, 1, 2, 3]);
            expect(array.slice()).toEqual([1, 1, 2, 2, 3, 3]);
        });
    });

    // TODO test stability

});

