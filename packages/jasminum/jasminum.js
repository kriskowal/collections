"use strict";

var BaseSuite = require("./suite");
module.exports = Suite;

function Suite() {
  BaseSuite.apply(this, arguments);
}

Suite.prototype = Object.create(BaseSuite.prototype);
Suite.prototype.constructor = Suite;
Suite.prototype.Promise = Promise;

