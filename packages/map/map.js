"use strict";

var Set = require("@collections/set");
var GenericCollection = require("@collections/generic-collection");
var GenericMap = require("@collections/generic-map");
var ObservableObject = require("@collections/observable/object");
var equalsOperator = require("@collections/equals");
var hashOperator = require("@collections/hash");
var copy = require("@collections/copy");

module.exports = Map;

function Map(values, equals, hash, getDefault) {
    if (!(this instanceof Map)) {
        return new Map(values, equals, hash, getDefault);
    }
    equals = equals || equalsOperator;
    hash = hash || hashOperator;
    getDefault = getDefault || this.getDefault;
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    this.store = new Set(
        undefined,
        function keysEqual(a, b) {
            return equals(a.key, b.key);
        },
        function keyHash(item) {
            return hash(item.key);
        }
    );
    this.length = 0;
    this.addEach(values);
}

copy(Map.prototype, GenericCollection.prototype);
copy(Map.prototype, GenericMap.prototype); // overrides GenericCollection
copy(Map.prototype, ObservableObject.prototype);

Map.prototype.constructClone = function (values) {
    return new this.constructor(
        values,
        this.contentEquals,
        this.contentHash,
        this.getDefault
    );
};

Map.prototype.log = function (charmap, logNode, callback, thisp) {
    logNode = logNode || this.logNode;
    this.store.log(charmap, function (node, log, logBefore) {
        logNode(node.value.value, log, logBefore);
    }, callback, thisp);
};

Map.prototype.logNode = function (node, log) {
    log(" key: " + node.key);
    log(" value: " + node.value);
};
