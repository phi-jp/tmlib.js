/*
 * type.js
 */

/**
 * @class tm.util.Type
 * 型チェック
 */
tm.namespace("tm.util.Type", function() {
    var self = this;
    var toString = Object.prototype.toString;

    /**
     * @static
     * @method  isObject
     * is object
     */
    this.defineFunction("isObject", function(obj) {
        return obj === Object(obj);
    });

    /**
     * @static
     * @method  isArray
     * is array
     */
    this.defineFunction("isArray", function(obj) {
        return toString.call(obj) == '[object Array]';
    });

    /**
     * @static
     * @method  isArguments
     * is arguments
     */
    this.defineFunction("isArguments", function(obj) {
        return toString.call(obj) == '[object Arguments]';
    });

    /**
     * @static
     * @method  isFunction
     * is function
     */
    this.defineFunction("isFunction", function(obj) {
        return toString.call(obj) == '[object Function]';
    });

    /**
     * @static
     * @method  isString
     * is string
     */
    this.defineFunction("isString", function(obj) {
        return toString.call(obj) == '[object String]';
    });

    /**
     * @static
     * @method  isNumber
     * is number
     */
    this.defineFunction("isNumber", function(obj) {
        return toString.call(obj) == '[object Number]';
    });

    /**
     * @static
     * @method  isDate
     * is date
     */
    this.defineFunction("isDate", function(obj) {
        return toString.call(obj) == '[object Date]';
    });

    /**
     * @static
     * @method  isRegExp
     * is RegExp
     */
    this.defineFunction("isRegExp", function(obj) {
        return toString.call(obj) == '[object RegExp]';
    });

    /**
     * @static
     * @method  isEmpty
     * is empty
     */
    this.defineFunction("isEmpty", function(obj) {
        if (!obj) return true;
        if (self.isArray(obj) || self.isString(obj) || self.isArguments(obj)) return obj.length === 0;
        for (var key in obj) {
            if (key) return false;
        }
        return true;
    });

});
