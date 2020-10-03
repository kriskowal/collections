/* global describe, it, expect */
"use strict";

// Tests that are equally applicable to Map, unbounded LruMap, FastMap.
// These do not apply to SortedMap since keys are not comparable.

module.exports = describeMiniMap;
function describeMiniMap(Map, values) {

  describe("as MiniMap", function () {

    values = values || [];
    var a = values[0] || {};
    var b = values[1] || {};
    var c = values[2] || {};

    function expectTheUsualContent(map) {
      expect(map.has(a)).toBe(true);
      expect(map.has(b)).toBe(true);
      expect(map.has(c)).toBe(false);
      expect(map.length).toBe(2);
      expect(map.get(a)).toBe(10);
      expect(map.get(b)).toBe(20);
      expect(map.get(c)).toBe(undefined);
    }

    describe("set", function () {
      it("sets values", function () {
        var map = new Map();
        map.set(a, 10);
        map.set(b, 20);
        expectTheUsualContent(map);
      });
      it("overwrites values", function () {
        var map = new Map();
        map.set(a, 10);
        map.set(b, 10);
        map.set(b, 20);
        expectTheUsualContent(map);
      });
    });

    describe("delete", function () {
      it("removes one entry", function () {
        var map = new Map();
        map.set(a, 10);
        map.set(b, 20);
        map.set(c, 30);
        expect(map.delete(c)).toBe(true);
        expectTheUsualContent(map);
      });
      it("fails to remove a non-existant key", function () {
        var map = new Map();
        map.set(a, 10);
        map.set(b, 20);
        expect(map.delete({})).toBe(false);
        expectTheUsualContent(map);
      });
    });

    describe("clear", function () {
      it("removes all entries", function () {
        var map = new Map();
        map.set(a, 10);
        map.set(b, 20);
        map.set(c, 30);
        expect(map.clear()).toBe(3);
      });
    });

  });
}
