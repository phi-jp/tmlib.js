/*
 * object.js
 */

(function() {
    
    /**
     * @class global.Object
     * Objectの拡張
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
    
    /**
     * @method defineInstanceVariable
     * インスタンス変数を定義する
     */
    Object.prototype.defineFunction("defineInstanceVariable", function(name, val){
        Object.defineProperty(this.prototype, name, {
            value: val,
            enumerable: true,
            writable: true
        });
    });
    
    /**
     * @method defineInstanceMethod
     * インスタンスメソッドを定義する
     */
    Object.prototype.defineFunction("defineInstanceMethod", function(name, fn){
        Object.defineProperty(this.prototype, name, {
            value: fn,
            enumerable: false,
            writable: true
        });
    });
    
    /**
     * @method setter
     * セッターを定義する
     */
    Object.defineInstanceMethod("setter", function(name, fn){
        Object.defineProperty(this, name, {
            set: fn,
            enumerable: false,
            configurable: true
        });
        // this.__defineSetter__(name, fn);
    });
    
    /**
     * @method getter
     * ゲッターを定義する
     */
    Object.defineInstanceMethod("getter", function(name, fn){
        Object.defineProperty(this, name, {
            get: fn,
            enumerable: false,
            configurable: true
        });
        // this.__defineGetter__(name, fn);
    });
    
    /**
     * @method accessor
     * アクセッサ(セッター/ゲッター)を定義する
     */
    Object.defineInstanceMethod("accessor", function(name, param) {
        Object.defineProperty(this, name, {
            set: param["set"],
            get: param["get"],
            enumerable: false,
            configurable: true
        });
        // (param["get"]) && this.getter(name, param["get"]);
        // (param["set"]) && this.setter(name, param["set"]);
    });
    
    /**
     * @method $forIn
     * オブジェクト用ループ処理
     */
    Object.defineInstanceMethod("$forIn", function(fn, self) {
        self = self || this;

        Object.keys(this).forEach(function(key, index) {
            var value = this[key];

            fn.call(self, key, value, index);
        }, this);

        return this;
    });

    /**
     * @method  $has
     * そのプロパティを持っているかを判定する
     */
    Object.defineInstanceMethod("$has", function(key) {
        return this.hasOwnProperty(key);
    });

    /**
     * @method  $extend
     * 他のライブラリと競合しちゃうので extend -> $extend としました
     */
    Object.defineInstanceMethod("$extend", function() {
        Array.prototype.forEach.call(arguments, function(source) {
            for (var property in source) {
                this[property] = source[property];
            }
        }, this);
        return this;
    });
    
    /**
     * @method  $safe
     * 安全拡張
     * 上書きしない
     */
    Object.defineInstanceMethod("$safe", function(source) {
        Array.prototype.forEach.call(arguments, function(source) {
            for (var property in source) {
                if (this[property] === undefined) this[property] = source[property];
            }
        }, this);
        return this;
    });
    
    
    /**
     * @method  $strict
     * 厳格拡張
     * すでにあった場合は警告
     */
    Object.defineInstanceMethod("$strict", function(source) {
        Array.prototype.forEach.call(arguments, function(source) {
            for (var property in source) {
                console.assert(!this[property], "tm error: {0} is Already".format(property));
                this[property] = source[property];
            }
        }, this);
        return this;
    });

    /**
     * @method  $pick
     * ピック
     */
    Object.defineInstanceMethod("$pick", function() {
        var temp = {};

        Array.prototype.forEach.call(arguments, function(key) {
            if (key in this) temp[key] = this[key];
        }, this);

        return temp;
    });

    /**
     * @method  $omit
     * オミット
     */
    Object.defineInstanceMethod("$omit", function() {
        var temp = {};

        for (var key in this) {
            if (Array.prototype.indexOf.call(arguments, key) == -1) {
                temp[key] = this[key];
            }
        }

        return temp;
    });
    
    /**
     * @method  using
     * 使う
     */
    Object.defineInstanceMethod("$using", function(source) {
        // TODO:
        
        return this;
    });
    
    /**
     * @method  globalize
     * グローバル化
     */
    Object.defineInstanceMethod("$globalize", function(key) {
        if (key) {
            tm.global[key] = this[key];
        }
        else {
            tm.global.$strict(this);
        }
        return this;
    });
    
    
})();

