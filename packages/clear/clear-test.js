/* global describe, it, expect */
"use strict";

var clear = require("@collections/clear");

describe("clear", function () {
    it("deletes all entries", function () {
        var object = {a: 10, b: 20};
        expect(clear(object)).toBe(undefined);
        expect(Object.keys(object)).toEqual([]);
    });
    it("delegates to clear method", function () {
        var called = false;
        var object = {clear: function () { called = true; }};
        clear(object);
        expect(called).toBe(true);
    });
    it("cannot delete from null object", function () {
        expect(function () {
            clear(null);
        }).toThrow();
    });
});
