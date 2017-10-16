/* global describe, it, expect */
"use strict";

var SortedMap = require("@collections/sorted-map");
var describeDict = require("../specs/dict");

describe("SortedMap", function () {
    describeDict(SortedMap);

    describe("reduceRight", function () {
        it("reduces entries from right to left", function () {
            var map = SortedMap([
                [1, 2],
                [2, 4],
                [3, 6],
                [4, 8]
            ]);
            expect(map.reduceRight(function (valid, value, key) {
                return valid && key * 2 === value;
            }, true)).toBe(true);
        });
    });

});
