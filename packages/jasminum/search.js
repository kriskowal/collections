
var Q = require("q");
var glob = Q.denodeify(require("glob"));
var fs = require("fs");
var path = require("path");

module.exports = search;
function search(args) {
    return args.reduceRight(function (next, arg) {
        return function (list) {
            return Q.ninvoke(fs, "stat", arg)
            .then(function (stats) {
                if (stats.isFile()) {
                    return Q.ninvoke(fs, "realpath", arg)
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
        return Q(list);
    })([]);
}

