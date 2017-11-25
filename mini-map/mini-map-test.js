/* global describe, it, expect */
"use strict";

var MiniMap = require("@collections/mini-map");
var describeMiniMap = require("../specs/mini-map");

describe("MiniMap", function () {
    describeMiniMap(MiniMap);

    it("sets, gets, and has an object key", function () {
        var map = new MiniMap();
        var key = {};
        expect(map.has(key)).toBe(false);
        map.set(key, 10);
        expect(map.get(key)).toBe(10);
        expect(map.has(key)).toBe(true);
        map.delete(key);
        expect(map.has(key)).toBe(false);
    });

    describe("clear", function () {
        it("clears a map", function () {
            var map = new MiniMap();
            map.set(10, 10);
            map.set(20, 20);
            map.clear();
            expect(map.has(10)).toBe(false);
            expect(map.has(20)).toBe(false);
        });
    });
});

