"use strict";

var List = require("@collections/list");
var FastSet = require("@collections/fast-set");
var GenericCollection = require("@collections/generic-collection");
var GenericSet = require("@collections/generic-set");
var ObservableObject = require("@collections/observable/object");
var ObservableRange = require("@collections/observable/range");
var equalsOperator = require("@collections/equals");
var hashOperator = require("@collections/hash");
var copy = require("@collections/copy");

module.exports = Set;

function Set(values, equals, hash, getDefault) {
    if (!(this instanceof Set)) {
        return new Set(values, equals, hash, getDefault);
    }
    equals = equals || equalsOperator;
    hash = hash || hashOperator;
    getDefault = getDefault || noop;
    this.contentEquals = equals;
    this.contentHash = hash;
    this.getDefault = getDefault;
    // a list of values in insertion order, used for all operations that depend
    // on iterating in insertion order
    this.order = new this.Order(undefined, equals);
    // a set of nodes from the order list, indexed by the corresponding value,
    // used for all operations that need to quickly seek  value in the list
    this.store = new this.Store(
        undefined,
        function (a, b) {
            return equals(a.value, b.value);
        },
        function (node) {
            return hash(node.value);
        }
    );
    this.length = 0;
    this.addEach(values);
}

copy(Set.prototype, GenericCollection.prototype);
copy(Set.prototype, GenericSet.prototype);
copy(Set.prototype, ObservableObject.prototype);
copy(Set.prototype, ObservableRange.prototype);

Set.prototype.Order = List;
Set.prototype.Store = FastSet;

Set.prototype.constructClone = function (values) {
    return new this.constructor(values, this.contentEquals, this.contentHash, this.getDefault);
};

Set.prototype.has = function (value) {
    var node = new this.order.Node(value);
    return this.store.has(node);
};

Set.prototype.get = function (value) {
    var node = new this.order.Node(value);
    node = this.store.get(node);
    if (node) {
        return node.value;
    } else {
        return this.getDefault(value);
    }
};

Set.prototype.add = function (value) {
    var node = new this.order.Node(value);
    if (!this.store.has(node)) {
        var index = this.length;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeWillChange([value], [], index);
        }
        this.order.add(value);
        node = this.order.head.prev;
        this.store.add(node);
        this.length++;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([value], [], index);
        }
        return true;
    }
    return false;
};

Set.prototype["delete"] = function (value) {
    var node = new this.order.Node(value);
    if (this.store.has(node)) {
        node = this.store.get(node);
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeWillChange([], [value], node.index);
        }
        this.store["delete"](node); // removes from the set
        this.order.splice(node, 1); // removes the node from the list
        this.length--;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([], [value], node.index);
        }
        return true;
    }
    return false;
};

Set.prototype.pop = function () {
    if (this.length) {
        var result = this.order.head.prev.value;
        this["delete"](result);
        return result;
    }
};

Set.prototype.shift = function () {
    if (this.length) {
        var result = this.order.head.next.value;
        this["delete"](result);
        return result;
    }
};

Set.prototype.one = function () {
    if (this.length > 0) {
        return this.store.one().value;
    }
};

Set.prototype.clear = function () {
    var clearing;
    if (this.dispatchesRangeChanges) {
        clearing = this.toArray();
        this.dispatchRangeWillChange([], clearing, 0);
    }
    this.store.clear();
    this.order.clear();
    var length = this.length;
    this.length = 0;
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange([], clearing, 0);
    }
    return length;
};

Set.prototype.reduce = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var list = this.order;
    var index = 0;
    return list.reduce(function (basis, value) {
        return callback.call(thisp, basis, value, index++, this);
    }, basis, this);
};

Set.prototype.reduceRight = function (callback, basis /*, thisp*/) {
    var thisp = arguments[2];
    var list = this.order;
    var index = this.length - 1;
    return list.reduceRight(function (basis, value) {
        return callback.call(thisp, basis, value, index--, this);
    }, basis, this);
};

Set.prototype.toArray = function () {
    return this.order.toArray();
};

Set.prototype.iterate = function () {
    return this.order.iterate();
};

Set.prototype.log = function () {
    var set = this.store;
    return set.log.apply(set, arguments);
};

Set.prototype.makeRangeChangesObservable = function () {
    this.order.makeRangeChangesObservable();
};

function noop() {}

