
/**
 * @classdesc An object that considers itself equivalent to any object of the
 * same type.
 */
module.exports = Any;
function Any(constructor) {
    if (!(this instanceof Any)) {
        return new Any(constructor);
    }
    this.constructor = constructor;
}

Any.prototype.equals = function (other) {
    if (typeof other === "object") {
        return other instanceof this.constructor;
    } else {
        return typeof other === typeof this.constructor();
    }
};

