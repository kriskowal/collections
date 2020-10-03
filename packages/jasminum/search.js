"use strict";

var glob = require("glob-promise");
var fs = require("fs").promises;
var path = require("path");

module.exports = search;
function search(args) {
  return args.reduceRight(function (next, arg) {
    return function (list) {
      return fs.stat(arg)
        .then(function (stats) {
          if (stats.isFile()) {
            return fs.realpath(arg)
              .then(function (realpath) {
                list.push(realpath);
                return next(list);
              });
          } else if (stats.isDirectory()) {
            return glob(path.join(process.cwd(), arg, "**/*-{spec,test}.js"))
              .then(function (files) {
                list.push.apply(list, files);
                return list;
              });
          } else {
            throw new Error("Arg must be a directory or file: " + arg);
          }
        });
    };
  }, function (list) {
    return Promise.resolve(list);
  })([]);
}

