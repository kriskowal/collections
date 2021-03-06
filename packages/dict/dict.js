"use strict";

var GenericCollection = require("@collections/generic-collection");
var GenericMap = require("@collections/generic-map");
var Iteration = require("@collections/iterate/iteration");
var ObjectIterator = require("@collections/iterate/object");
var ObservableObject = require("@collections/observable/object");
var copy = require("@collections/copy");

// Burgled from https://github.com/domenic/dict

module.exports = Dict;
function Dict(values, getDefault) {
  if (!(this instanceof Dict)) {
    return new Dict(values, getDefault);
  }
  getDefault = getDefault || this.getDefault;
  this.getDefault = getDefault;
  this.store = {};
  this.length = 0;
  this.addEach(values);
}

function mangle(key) {
  return "$" + key;
}

function unmangle(mangled) {
  return mangled.slice(1);
}

copy(Dict.prototype, GenericCollection.prototype);
copy(Dict.prototype, GenericMap.prototype);
copy(Dict.prototype, ObservableObject.prototype);

Dict.prototype.isDict = true;

Dict.prototype.constructClone = function (values) {
  return new this.constructor(values, this.mangle, this.getDefault);
};

Dict.prototype.get = function (key, defaultValue) {
  var mangled = mangle(key);
  if (mangled in this.store) {
    return this.store[mangled];
  } else if (arguments.length > 1) {
    return defaultValue;
  } else {
    return this.getDefault(key);
  }
};

Dict.prototype.set = function (key, value) {
  var mangled = mangle(key);
  var from;
  if (mangled in this.store) { // update
    if (this.dispatchesMapChanges) {
      from = this.store[mangled];
      this.dispatchMapWillChange("update", key, value, from);
    }
    this.store[mangled] = value;
    if (this.dispatchesMapChanges) {
      this.dispatchMapChange("update", key, value, from);
    }
    return false;
  } else { // create
    if (this.dispatchesMapChanges) {
      this.dispatchMapWillChange("create", key, value);
    }
    this.length++;
    this.store[mangled] = value;
    if (this.dispatchesMapChanges) {
      this.dispatchMapChange("create", key, value);
    }
    return true;
  }
};

Dict.prototype.has = function (key) {
  var mangled = mangle(key);
  return mangled in this.store;
};

Dict.prototype["delete"] = function (key) {
  var mangled = mangle(key);
  var from;
  if (mangled in this.store) {
    if (this.dispatchesMapChanges) {
      from = this.store[mangled];
      this.dispatchMapWillChange("delete", key, void 0, from);
    }
    delete this.store[mangle(key)];
    this.length--;
    if (this.dispatchesMapChanges) {
      this.dispatchMapChange("delete", key, void 0, from);
    }
    return true;
  }
  return false;
};

Dict.prototype.clear = function () {
  var key, mangled, from;
  for (mangled in this.store) {
    key = unmangle(mangled);
    if (this.dispatchesMapChanges) {
      from = this.store[mangled];
      this.dispatchMapWillChange("delete", key, void 0, from);
    }
    delete this.store[mangled];
    if (this.dispatchesMapChanges) {
      this.dispatchMapChange("delete", key, void 0, from);
    }
  }
  this.length = 0;
};

Dict.prototype.reduce = function (callback, basis, thisp) {
  for (var mangled in this.store) {
    basis = callback.call(thisp, basis, this.store[mangled], unmangle(mangled), this);
  }
  return basis;
};

Dict.prototype.reduceRight = function (callback, basis, thisp) {
  var self = this;
  var store = this.store;
  return Object.keys(this.store).reduceRight(function (basis, mangled) {
    return callback.call(thisp, basis, store[mangled], unmangle(mangled), self);
  }, basis);
};

Dict.prototype.one = function () {
  var key;
  for (key in this.store) {
    return this.store[key];
  }
};

Dict.prototype.iterate = function () {
  return new this.Iterator(new ObjectIterator(this.store));
};

Dict.prototype.Iterator = DictIterator;

function DictIterator(storeIterator) {
  this.storeIterator = storeIterator;
}

DictIterator.prototype.next = function () {
  var iteration = this.storeIterator.next();
  if (iteration.done) {
    return iteration;
  } else {
    return new Iteration(
      iteration.value,
      false,
      unmangle(iteration.index)
    );
  }
};
