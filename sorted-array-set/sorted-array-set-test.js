/* global describe, it, expect */
"use strict";

var SortedArraySet = require("@collections/sorted-array-set");
var describeDeque = require("../specs/deque");
var describeCollection = require("../specs/collection");
var describeSet = require("../specs/set");

describe("SortedArraySet", function () {

    function newSortedArraySet(values) {
        return new SortedArraySet(values);
    }

    newSortedArraySet.prototype.isSorted = true;

    [SortedArraySet, newSortedArraySet].forEach(function (SortedArraySet) {
        describeDeque(SortedArraySet);
        describeCollection(SortedArraySet, [1, 2, 3, 4]);
        describeSet(SortedArraySet, true);
    });

    describe("constructor", function () {
        it("only allows unique values", function () {
            var set = SortedArraySet([1, 2, 3, 1, 2, 3]);
            expect(set.slice()).toEqual([1, 2, 3]);
        });
    });

});

