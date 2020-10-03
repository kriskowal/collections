"use strict";

var glob = require("glob-promise");
var fs = require("fs");
var path = require("path");

function promisify(f) {
  return function g(path) {
    return new Promise(function (resolve, reject) {
      f(path, function (err, value) {
        if (err != null) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  };
}

var stat = promisify(fs.stat);
var realpath = promisify(fs.realpath);

module.exports = search;
function search(args) {
  return args.reduceRight(function (next, arg) {
    return function (list) {
      return stat(arg)
        .then(function (stats) {
          if (stats.isFile()) {
            return realpath(arg)
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

