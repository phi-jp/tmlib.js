/*
 * object.js
 */

(function() {
    
    /**
     * @class Object
     * オブジェクト
     */
    
    /**
     * @method defineVariable
     * 変数を追加
     * @param   {String} key name
     * @param   {Object} param
     */
    Object.defineProperty(Object.prototype, "defineVariable", {
        value: function(name, val) {
            Object.defineProperty(this, name, {
                value: val,
                enumerable: true,
                writable: true
            });
        }
    });
    
    /**
     * @method defineFunction
     * 関数を追加
     * @param   {String} key name
     * @param   {Function} function
     */
    Object.defineProperty(Object.prototype, "defineFunction", {
        value: function(name, fn) {
            Object.defineProperty(this, name, {
                value: fn,
                enumerable: false,
                writable: true
            });
        }
    });
    
    
    Object.prototype.defineFunction("defineInstanceVariable", function(name, val){
        Object.defineProperty(this.prototype, name, {
            value: val,
            enumerable: true,
            writable: true
        });
    });
    
    Object.prototype.defineFunction("defineInstanceMethod", function(name, fn){
        Object.defineProperty(this.prototype, name, {
            value: fn,
            enumerable: false,
            writable: true
        });
    });
    
    Object.defineInstanceMethod("setter", function(name, fn){
        Object.defineProperty(this, name, {
            set: fn,
            enumerable: false
        });
        // this.__defineSetter__(name, fn);
    });
    
    Object.defineInstanceMethod("getter", function(name, fn){
        Object.defineProperty(this, name, {
            get: fn,
            enumerable: false
        });
        // this.__defineGetter__(name, fn);
    });
    
    Object.defineInstanceMethod("accessor", function(name, param)
    {
        Object.defineProperty(this, name, {
            set: param["set"],
            get: param["get"],
            enumerable: false
        });
        // (param["get"]) && this.getter(name, param["get"]);
        // (param["set"]) && this.setter(name, param["set"]);
    });
    
    Object.defineInstanceMethod("extend", function() {
        for (var i=0,len=arguments.length; i<len; ++i) {
            var source = arguments[i];
            for (var property in source) {
                this[property] = source[property];
            }
        }
        return this;
    });
    
    /**
     * @method  extendSafe
     * 安全拡張
     * 上書きしない
     */
    Object.defineInstanceMethod("extendSafe", function(source) {
        for (var property in source) {
            if (!this[property]) {
                this[property] = source[property];
            }
        }
        return this;
    });
    
    
    /**
     * @method  extendStrict
     * 厳格拡張
     * すでにあった場合は警告
     */
    Object.defineInstanceMethod("extendStrict", function(source) {
        for (var property in source) {
            console.assert(!this[property], "TM Error: {0} is Already".format(property));
            this[property] = source[property];
        }
        
        return this;
    });
    
    if (window) {
        /**
         * @method  globalize
         * グローバル化
         */
        Object.defineInstanceMethod("globalize", function(key) {
            if (key) {
                window[key] = this[key];
            }
            else {
                window.extendStrict(this);
            }
            return this;
        });
    }
    
    
    
})();

