/* global describe, it, expect */
"use strict";

var clear = require("@collections/clear/object");

describe("clear", function () {
    it("deletes all entries", function () {
        var object = {a: 10, b: 20};
        expect(clear(object)).toBe(undefined);
        expect(Object.keys(object)).toEqual([]);
    });
});
