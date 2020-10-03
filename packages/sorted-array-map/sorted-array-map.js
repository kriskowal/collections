"use strict";

var SortedArraySet = require("@collections/sorted-array-set");
var GenericCollection = require("@collections/generic-collection");
var GenericMap = require("@collections/generic-map");
var ObservableObject = require("@collections/observable/object");
var equalsOperator = require("@collections/equals");
var compareOperator = require("@collections/compare");
var copy = require("@collections/copy");

module.exports = SortedArrayMap;

function SortedArrayMap(values, equals, compare, getDefault) {
  if (!(this instanceof SortedArrayMap)) {
    return new SortedArrayMap(values, equals, compare, getDefault);
  }
  equals = equals || equalsOperator;
  compare = compare || compareOperator;
  getDefault = getDefault || this.getDefault;
  this.contentEquals = equals;
  this.contentCompare = compare;
  this.getDefault = getDefault;
  this.store = new SortedArraySet(
    null,
    function keysEqual(a, b) {
      return equals(a.key, b.key);
    },
    function compareKeys(a, b) {
      return compare(a.key, b.key);
    }
  );
  this.length = 0;
  this.addEach(values);
}

copy(SortedArrayMap.prototype, GenericCollection.prototype);
copy(SortedArrayMap.prototype, GenericMap.prototype);
copy(SortedArrayMap.prototype, ObservableObject.prototype);

SortedArrayMap.prototype.constructClone = function (values) {
  return new this.constructor(
    values,
    this.contentEquals,
    this.contentCompare,
    this.getDefault
  );
};

