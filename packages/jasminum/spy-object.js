
var createSpy = require("./spy");

module.exports = createSpyObj;
function createSpyObj(name, names) {
    var object = {};
    names.forEach(function (name) {
        object[name] = createSpy(object, name);
    });
    return object;
}

