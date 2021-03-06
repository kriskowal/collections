/* global describe, it, expect */
"use strict";

var toArray = require("@collections/to-array");
var iterate = require("@collections/iterate");
var compare = require("@collections/compare");
var equals = require("@collections/equals");
var clone = require("@collections/clone");

module.exports = describeOrder;
function describeOrder(Collection) {

    /*
        The following tests are from Montage.
        Copyright (c) 2012, Motorola Mobility LLC.
        All Rights Reserved.
        BSD License.
    */

    // contains 10, 20, 30
  function FakeArray() {
    this[0] = 10;
    this[1] = 20;
    this[2] = 30;
    this.length = 3;
  }
  FakeArray.prototype.toArray = function () {
    return [10, 20, 30];
  };
  FakeArray.prototype.compare = function (that) {
    return -compare(that, Array.prototype.slice.call(this));
  };
  FakeArray.prototype.equals = function (that) {
    return equals(that, this.toArray());
  };
  var fakeArray = new FakeArray();

  describe("addEach", function () {
    it("adds values of key value pairs from an object", function () {
      if (!Collection.prototype.addEach) {
        return;
      }

      var collection = Collection();
      collection.addEach({0: "a"});
      expect(collection.toArray()).toEqual(["a"]);
    });
  });

  describe("equals", function () {
    if (!Collection.prototype.equals) {
      return;
    }

    it("identifies itself", function () {
      var collection = Collection([1, 2]);
      expect(collection.equals(collection)).toBe(true);
    });

    it("distinguishes incomparable objects", function () {
      expect(Collection([]).equals(null)).toEqual(false);
    });

    it("compares itself to an array-like collection", function () {
      expect(Collection([10, 20, 30]).equals(fakeArray)).toEqual(true);
    });

  });

  describe("compare", function () {
    if (!Collection.prototype.compare)
      return;

    it("compares to itself", function () {
      var collection = Collection([1, 2]);
      expect(collection.compare(collection)).toBe(0);
    });

        // contains 10, 20, 30
    it("a fake array should be equal to collection", function () {
            // The oddest thing happens here because of a negative zero
      expect(-compare(fakeArray, Collection([10, 20, 30]))).toBe(0);
    });

    it("a fake array should be less than a collection", function () {
      expect(compare(fakeArray, Collection([10, 30]))).toBeLessThan(0);
    });

    it("a fake array should be greater than a real array because it is longer", function () {
      expect(compare(fakeArray, Collection([10, 20]))).toBeGreaterThan(0);
    });

    it("a fake array should be less than a longer but otherwise equal", function () {
      expect(compare(fakeArray, Collection([10, 20, 30, 40]))).toBeLessThan(0);
    });

    it("an array should be equal to a fake array", function () {
      expect(Collection([10, 20, 30]).compare(fakeArray)).toBe(0);
    });

    it("an array should be greater than a fake array", function () {
      expect(Collection([10, 30]).compare(fakeArray)).toBeGreaterThan(0);
    });

    it("an array should be less than a fake array because it is shorter but otherwise equal", function () {
      expect(Collection([10, 20]).compare(fakeArray)).toBeLessThan(0);
    });

    it("an array should be less than a fake array because it is longer but otherwise equal", function () {
      expect(Collection([10, 20, 30, 40]).compare(fakeArray)).toBeGreaterThan(0);
    });

  });

  describe("indexOf", function () {
    if (!Collection.prototype.indexOf)
      return;

    it("finds first value", function () {
      var collection = Collection([1, 2, 3]);
      expect(collection.indexOf(2)).toBe(1);
    });

    it("finds first identical value", function () {
      if (Collection.prototype.isSet)
        return;
      var collection = Collection([1, 1, 2, 2, 3, 3]);
      expect(collection.indexOf(2)).toBe(2);
    });

    it("finds first value after index", function () {
      if (Collection.prototype.isSet || Collection.prototype.isSorted)
        return;
      var collection = Collection([1, 2, 3, 1, 2, 3]);
      expect(collection.indexOf(2, 3)).toBe(4);
    });

    it("finds first value after negative index", function () {
      if (Collection.prototype.isSet || Collection.prototype.isSorted)
        return;
      var collection = Collection([1, 2, 3, 1, 2, 3]);
      expect(collection.indexOf(2, -3)).toBe(4);
    });

  });

  describe("lastIndexOf", function () {
    if (!Collection.prototype.lastIndexOf)
      return;

    it("finds last value", function () {
      var collection = Collection([1, 2, 3]);
      expect(collection.lastIndexOf(2)).toBe(1);
    });

    it("finds last identical value", function () {
      if (Collection.prototype.isSet)
        return;
      var collection = Collection([1, 1, 2, 2, 3, 3]);
      expect(collection.lastIndexOf(2)).toBe(3);
    });

    it("finds the last value before index", function () {
      if (Collection.prototype.isSet || Collection.prototype.isSorted)
        return;
      var collection = Collection([1, 2, 3, 1, 2, 3]);
      expect(collection.lastIndexOf(2, 3)).toBe(1);
    });

    it("finds the last value before negative index", function () {
      if (Collection.prototype.isSet || Collection.prototype.isSorted)
        return;
      var collection = Collection([1, 2, 3, 1, 2, 3]);
      expect(collection.lastIndexOf(2, -3)).toBe(1);
    });

  });

  describe("findValue", function () {
    if (!Collection.prototype.findValue)
      return;

    it("finds equivalent values", function () {
      expect(Collection([10, 10, 10]).findValue(10)).toEqual(0);
    });

    it("finds equivalent values", function () {
      expect(Collection([10, 10, 10]).findValue(10)).toEqual(0);
    });

  });

  describe("findLastValue", function () {
    if (!Collection.prototype.findLastValue)
      return;

    it("finds equivalent values", function () {
      expect(Collection([10, 10, 10]).findLastValue(10)).toEqual(2);
    });

  });

  describe("has", function () {
    if (!Collection.prototype.has)
      return;

    it("finds equivalent values", function () {
      expect(Collection([10]).has(10)).toBe(true);
    });

    it("does not find absent values", function () {
      expect(Collection([]).has(-1)).toBe(false);
    });

    it("finds a value", function () {
      var collection = Collection([1, 2, 3]);
      expect(collection.has(2)).toBe(true);
    });

    it("does not find an absent value", function () {
      var collection = Collection([1, 2, 3]);
      expect(collection.has(4)).toBe(false);
    });

    it("makes use of equality override", function () {
      var collection = Collection([1, 2, 3]);
      expect(collection.has(4, function (a, b) {
        return a - 1 === b;
      })).toBe(true);
    });

  });


  describe("any", function () {
    if (!Collection.prototype.any)
      return;

    var tests = [
      [[0, false], false],
      [["0"], true],
      [[{}], true],
      [[{a: 10}], true],
      [[0, 1, 0], true],
      [[1, 1, 1], true],
      [[true, true, true], true],
      [[0, 0, 0, true], true],
      [[], false],
      [[false, false, false], false]
    ];

    tests.forEach(function (test) {
      it(JSON.stringify(test[0]) + ".any() should be " + test[1], function () {
        expect(Collection(test[0]).some(Boolean)).toEqual(test[1]);
      });
    });

  });

  describe("all", function () {
    if (!Collection.prototype.all)
      return;

    var tests = [
      [[], true],
      [[true], true],
      [[1], true],
      [[{}], true],
      [[false, true, true, true], false]
    ];

    tests.forEach(function (test) {
      it(JSON.stringify(test[0]) + ".all() should be " + test[1], function () {
        expect(Collection(test[0]).every(Boolean)).toEqual(test[1]);
      });
    });

  });

  describe("min", function () {
    if (!Collection.prototype.min)
      return;

    it("finds the minimum of numeric values", function () {
      expect(Collection([1, 2, 3]).min()).toEqual(1);
    });

  });

  describe("max", function () {
    if (!Collection.prototype.max)
      return;

    it("finds the maximum of numeric values", function () {
      expect(Collection([1, 2, 3]).max()).toEqual(3);
    });

  });

  describe("sum", function () {
    if (!Collection.prototype.sum)
      return;

    it("computes the sum of numeric values", function () {
      expect(Collection([1, 2, 3]).sum()).toEqual(6);
    });

        // sum has deprecated behaviors for implicit flattening and
        // property path mapping, not tested here

  });

  describe("average", function () {
    if (!Collection.prototype.average)
      return;

    it("computes the arithmetic mean of values", function () {
      expect(Collection([1, 2, 3]).average()).toEqual(2);
    });

  });

  describe("flatten", function () {
    if (!Collection.prototype.flatten)
      return;

    it("flattens an array one level", function () {
      var collection = Collection([
        [[1, 2, 3], [4, 5, 6]],
        Collection([[7, 8, 9], [10, 11, 12]])
      ]);
      expect(collection.flatten()).toEqual([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12]
      ]);
    });

  });

  describe("one", function () {
    if (!Collection.prototype.one)
      return;

    it("gets the first value", function () {
      expect(Collection([0]).one()).toEqual(0);
    });

    it("throws if empty", function () {
      expect(Collection([]).one()).toBe(undefined);
    });

  });

  describe("only", function () {
    if (!Collection.prototype.only)
      return;

    it("gets the first value", function () {
      expect(Collection([0]).only()).toEqual(0);
    });

    it("is undefined if empty", function () {
      expect(Collection([]).only()).toBeUndefined();
    });

    it("is undefined if more than one value", function () {
      expect(Collection([1, 2]).only()).toBeUndefined();
    });

  });

  describe("clone", function () {

        // should have been adequately covered by Object.clone tests

    it("should clone with indefinite depth", function () {
      var collection = Collection([[[]]]);
      var cloned = clone(collection);
      expect(cloned).toEqual(collection);
      expect(cloned).not.toBe(collection);
    });

    it("should clone with depth 0", function () {
      var collection = Collection([]);
      expect(clone(collection, 0)).toBe(collection);
    });

    it("should clone with depth 1", function () {
      var collection = [Collection(null)];
      expect(clone(collection, 1)).not.toBe(collection);
      expect(clone(collection, 1)[0]).toBe(collection[0]);
    });

    it("should clone with depth 2", function () {
      var collection = Collection([{a: 10}]);
      expect(clone(collection, 2)).not.toBe(collection);
      if (Array.isArray(collection)) {
        expect(clone(collection, 2)[0]).not.toBe(collection[0]);
        expect(clone(collection, 2)[0]).toEqual(collection[0]);
      } else {
        expect(clone(collection, 2).one()).not.toBe(collection.one());
        expect(clone(collection, 2).one()).toEqual(collection.one());
      }
    });

  });

  describe("iterate", function () {
    it("iterates a slice", function () {
      var collection = Collection([1, 2, 3, 4]);
      expect(toArray(collection)).toEqual([1, 2, 3, 4]);
      var iterator = iterate(collection, 1, 3);

      for (var index = 1; index < 3; index++) {
        var iteration = iterator.next();
        expect(iteration.value).toBe(index + 1);
        expect(iteration.index).toBe(index);
        expect(iteration.done).toBe(false);
      }
      expect(iterator.next()).toEqual({done: true});
      expect(iterator.next()).toEqual({done: true});
    });
  });

  describe("enumerate", function () {
    it("enumerates values", function () {
      var collection = Collection([1, 2, 3, 4]);
      if (!collection.enumerate) {
        return;
      }
      expect(collection.enumerate()).toEqual([[0, 1], [1, 2], [2, 3], [3, 4]]);
    });
    it("enumerates values from other base", function () {
      var collection = Collection([1, 2, 3, 4]);
      if (!collection.enumerate) {
        return;
      }
      expect(collection.enumerate(1)).toEqual([[1, 1], [2, 2], [3, 3], [4, 4]]);
    });
  });

  describe("group", function () {
    it("groups like values", function () {
      var collection = Collection([1, 2, 3, 4]);
      if (!collection.group) {
        return;
      }
      expect(collection.group(function (n) {
        return n % 2 === 0;
      }).filter(function (entry) {
        return entry[0] === true;
      })).toEqual([
        [true, [2, 4]]
      ]);
    });
  });

  describe("reversed", function () {
    it("reverses in place", function () {
      var collection = Collection([1, 2, 3, 4]);
      if (!collection.reverse || !collection.reversed) {
        return;
      }
      expect(collection.reversed().toArray()).toEqual([4, 3, 2, 1]);
    });
  });

  describe("join", function () {
    it("degenerates when empty", function () {
      var collection = Collection();
      expect(collection.join(", ")).toEqual("");
    });
    it("degenerates when lonely", function () {
      var collection = Collection(["a"]);
      expect(collection.join(", ")).toEqual("a");
    });
    it("concatenates strings", function () {
      var collection = Collection(["a", "b"]);
      expect(collection.join(", ")).toEqual("a, b");
    });
  });

  describe("toObject", function () {
    it("creates an object", function () {
      var collection = Collection(["a", "b"]);
      if (collection.toObject) {
        expect(collection.toObject()).toEqual({
          0: "a",
          1: "b"
        });
      }
    });
  });

}
