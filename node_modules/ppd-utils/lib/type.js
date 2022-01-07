function isArray(value) {
    return isType(value, "[object Array]");
}
function isObject(value) {
    return isType(value, "[object Object]");
}
function isString(value) {
    return isType(value, "[object String]");
}
function isNumber(value) {
    return isType(value, "[object number]");
}
function isBoolean(value) {
    return isType(value, "[object Boolean]");
}
function isUndefined(value) {
    return isType(value, "[object Undefined]");
}
function isNull(value) {
    return isType(value, "[object Null]");
}
function isFunction(value) {
    return isType(value, "[object Function]");
}

function isType(value, type) {
    const valueType = Object.prototype.toString.call(value);
    return valueType === type;
}

exports.isArray = isArray;
exports.isObject = isObject;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isBoolean = isBoolean;
exports.isUndefined = isUndefined;
exports.isNull = isNull;
exports.isFunction = isFunction;
exports.isType = isType;