"use strict";

var SortedSet = require("@collections/sorted-set");
var GenericCollection = require("@collections/generic-collection");
var GenericMap = require("@collections/generic-map");
var ObservableObject = require("@collections/observable/object");
var equalsOperator = require("@collections/equals");
var compareOperator = require("@collections/compare");
var copy = require("@collections/copy");

module.exports = SortedMap;

function SortedMap(values, equals, compare, getDefault) {
  if (!(this instanceof SortedMap)) {
    return new SortedMap(values, equals, compare, getDefault);
  }
  equals = equals || equalsOperator;
  compare = compare || compareOperator;
  getDefault = getDefault || this.getDefault;
  this.contentEquals = equals;
  this.contentCompare = compare;
  this.getDefault = getDefault;
  this.store = new SortedSet(
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

copy(SortedMap.prototype, GenericCollection.prototype);
copy(SortedMap.prototype, GenericMap.prototype);
copy(SortedMap.prototype, ObservableObject.prototype);

SortedMap.prototype.constructClone = function (values) {
  return new this.constructor(
    values,
    this.contentEquals,
    this.contentCompare,
    this.getDefault
  );
};

SortedMap.prototype.log = function (charmap, logNode, callback, thisp) {
  logNode = logNode || this.logNode;
  this.store.log(charmap, function (node, log, logBefore) {
    logNode(node.value, log, logBefore);
  }, callback, thisp);
};

SortedMap.prototype.logNode = function (node, log) {
  log(" key: " + node.key);
  log(" value: " + node.value);
};

