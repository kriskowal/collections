/* global describe, it, expect */
"use strict";

var sinon = require("sinon");
var is = require("@collections/operators").is;
var extendSpyExpectation = require("../specs/spy-expectation");
var describeCollection = require("../specs/collection");
var describeSet = require("../specs/set");
var Set = require("@collections/set");

describe("Set", function () {

  describe("as Set", function () {

    extendSpyExpectation();

    function newSet(values) {
      return new Set(values);
    }

    [Set, newSet].forEach(function (Set) {
      describeCollection(Set, [1, 2, 3, 4], true);
      describeCollection(Set, [{id: 0}, {id: 1}, {id: 2}, {id: 3}], true);
      describeSet(Set);
    });

    describeCollection(function (values) {
      return Set(values, is);
    }, [{}, {}, {}, {}], true);

    it("pops and shifts", function () {
      var a = {i: 2};
      var b = {i: 1};
      var c = {i: 0};
      var set = Set([a, b, c], is);
      expect(set.pop()).toBe(c);
      expect(set.shift()).toBe(a);
    });

    it("dispatches range change on clear", function () {
      var set = Set([1, 2, 3]);
      var spy = sinon.spy();
      set.observeRangeChange(function (plus, minus, index, _set) {
        spy(plus, minus, index);
        expect(_set).toBe(set);
      });
      expect(set.clear()).toBe(3);
      expect(spy).toHaveBeenCalledWith([], [1, 2, 3], 0);
    });

    it("dispatches range change on add", function () {
      var set = Set([1, 3]);
      var spy = sinon.spy();
      set.observeRangeChange(function (plus, minus, index, _set) {
        spy(plus, minus, index);
        expect(_set).toBe(set);
      });
      set.add(2);
      expect(set.toArray()).toEqual([1, 3, 2]);
      expect(spy).toHaveBeenCalledWith([2], [], 2);
    });

    it("dispatches range change on delete", function () {
      var set = Set([1, 2, 3]);
      var spy = sinon.spy();
      set.observeRangeChange(function (plus, minus, index, _set) {
        spy(plus, minus, index);
        expect(_set).toBe(set);
      });
      set["delete"](2);
      expect(set.toArray()).toEqual([1, 3]);
      expect(spy).toHaveBeenCalledWith([], [2], 1);
    });

    it("dispatches range change on pop", function () {
      var set = Set([1, 3, 2]);
      var spy = sinon.spy();
      set.observeRangeChange(function (plus, minus, index, _set) {
        spy(plus, minus, index);
        expect(_set).toBe(set);
      });
      expect(set.pop()).toEqual(2);
      expect(set.toArray()).toEqual([1, 3]);
      expect(spy).toHaveBeenCalledWith([], [2], 2);
    });

    it("dispatches range change on shift", function () {
      var set = Set([1, 3, 2]);
      var spy = sinon.spy();
      set.observeRangeChange(function (plus, minus, index, _set) {
        spy(plus, minus, index);
        expect(_set).toBe(set);
      });
      expect(set.shift()).toEqual(1);
      expect(set.toArray()).toEqual([3, 2]);
      expect(spy).toHaveBeenCalledWith([], [1], 0);
    });

        // Need to reevaluate whether sets fully support range changes, or whether
        // they support merely set changes (no index).
    it("dispatches range change on shift then pop", function () {
      var set = Set([1, 3]);
      set.observeRangeChange(function (plus, minus, index, _set) {
        spy(plus, minus, index);
        expect(_set).toBe(set);
      });

      var spy = sinon.spy();
      expect(set.add(2)).toEqual(true);
      expect(set.toArray()).toEqual([1, 3, 2]);
      expect(spy).toHaveBeenCalledWith([2], [], 2);

      spy = sinon.spy();
      expect(set.shift()).toEqual(1);
      expect(set.toArray()).toEqual([3, 2]);
      expect(spy).toHaveBeenCalledWith([], [1], 0);

      expect(set.pop()).toEqual(2);
      expect(set.toArray()).toEqual([3]);
      expect(spy).toHaveBeenCalledWith([], [2], 1);

      spy = sinon.spy();
      expect(set.delete(3)).toEqual(true);
      expect(set.toArray()).toEqual([]);
      expect(spy).toHaveBeenCalledWith([], [3], 0);
    });

  });
});

