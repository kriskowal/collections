/* global it, expect */
"use strict";

var has = require("@collections/has");

it("delegates to has methods", function () {
    var any = {equals: function () {return true;}};
    expect(has([1], any)).toBe(true);
    expect(has([], any)).toBe(false);
});
