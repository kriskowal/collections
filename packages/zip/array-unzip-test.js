/* global it, expect */
"use strict";

var unzip = require("./array-unzip");
var specs = require("./specs");

it("unzip (illustrative)", function () {
    expect(unzip([
        ["a", "b", "c"],
        [1, 2, 3],
        ["x", "y", "z"]
    ])).toEqual([
        ["a", 1, "x"],
        ["b", 2, "y"],
        ["c", 3, "z"]
    ]);
});

Object.keys(specs).forEach(function (name) {
    var test = specs[name];
    it(name, function () {
        expect(unzip(test.input)).toEqual(test.output);
    });
});
