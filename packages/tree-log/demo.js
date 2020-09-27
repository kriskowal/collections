"use strict";

var TreeLog = require("@collections/tree-log");
var SortedSet = require("@collections/sorted-set");
var set = new SortedSet([3, 1, 4, 2]);
set.log();
set.log(TreeLog.ascii);
set.log(TreeLog.unicodeSharp);
