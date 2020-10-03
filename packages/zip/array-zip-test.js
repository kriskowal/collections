/* global it, expect */
"use strict";

var zip = require("./array-zip");
var specs = require("./specs");

it("zips (illustrative)", function () {
  expect(zip(
    ["a", "b", "c"],
    [1, 2, 3],
    ["x", "y", "z"]
  )).toEqual([
    ["a", 1, "x"],
    ["b", 2, "y"],
    ["c", 3, "z"]
  ]);
});

Object.keys(specs).forEach(function (name) {
  var test = specs[name];
  it(name, function () {
    expect(zip.apply(this, test.input)).toEqual(test.output);
  });
});
