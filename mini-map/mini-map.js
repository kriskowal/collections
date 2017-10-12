"use strict";

module.exports = MiniMap;

function MiniMap() {
    this.keys = [];
    this.values = [];
    this.length = 0;
}

MiniMap.prototype.has = function (key) {
    var index = this.keys.indexOf(key);
    return index >= 0;
};

MiniMap.prototype.get = function (key) {
    var index = this.keys.indexOf(key);
    if (index >= 0) {
        return this.values[index];
    }
};

MiniMap.prototype.set = function (key, value) {
    var index = this.keys.indexOf(key);
    if (index < 0) {
        index = this.keys.length;
        this.length++;
    }
    this.keys[index] = key;
    this.values[index] = value;
};

MiniMap.prototype["delete"] = function (key) {
    var index = this.keys.indexOf(key);
    if (index >= 0) {
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        this.length--;
        return true;
    }
    return false;
};

MiniMap.prototype.clear = function () {
    var length = this.keys.length;
    this.keys.length = 0;
    this.values.length = 0;
    this.length = 0;
    return length;
};
