/*
 * tmlib.js 0.1.9
 * http://github.com/phi1618/tmlib.js
 * MIT Licensed
 * 
 * Copyright (C) 2010 phi, http://tmlife.net
 */

(function() { "use strict"; })();

/*
 * tm namespace
 */
var tm = tm || {};
tm.global = window || global || this;

// node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = tm;
}


(function() {

    /**
     * バージョン
     */
    tm.VERSION = "0.1.8";

    /**
     * tmlib.js のルートパス
     */
    tm.LIB_ROOT = (function(){
        if (!window.document) return ;

        var scripts = document.getElementsByTagName("script");
        for (var i=0, len=scripts.length; i<len; ++i) {

        }
    })();

    /**
     * ブラウザ
     */
    tm.BROWSER = (function() {
        if (!window.navigator) return ;

        if      (/chrome/i.test(navigator.userAgent))   { return "Chrome";  }
        else if (/safari/i.test(navigator.userAgent))   { return "Safari";  }
        else if (/firefox/i.test(navigator.userAgent))  { return "Firefox"; }
        else if (/opera/i.test(navigator.userAgent))    { return "Opera";   }
        else if (/getcko/i.test(navigator.userAgent))   { return "Getcko";  }
        else if (/msie/i.test(navigator.userAgent))     { return "IE";      }
        else { return null; }
    })();

    /**
     * ベンダープレフィックス
     */
    tm.VENDER_PREFIX = (function() {
        if (!window) return ;

        var map = {
            "Chrome"    : "webkit",
            "Safari"    : "webkit",
            "Firefox"   : "moz",
            "Opera"     : "o",
            "IE"        : "ms"
        };

        return map[tm.BROWSER] || "";
    })();


    /**
     * モバイルかどうかの判定フラグ
     */
    tm.isMobile = (function() {
        if (!window.navigator) return ;

        var ua = navigator.userAgent;
        return (ua.indexOf("iPhone") > 0 || ua.indexOf("iPad") > 0 || ua.indexOf("Android") > 0);
    })();


    /**
     * クラス定義
     */
    tm.createClass = function(prop) {
        // デフォルト値
        prop.init = prop.init || function() {};
        prop.superClass = prop.superClass || null;

        // クラス作成
        var tm_class = function() {
            var temp = new tm_class.prototype.creator();
            tm_class.prototype.init.apply(temp, arguments);
            return temp
        };

        // 継承
        if (prop.superClass) {
            prop.init.owner = tm_class;
            tm_class.prototype = Object.create(prop.superClass.prototype);
            tm_class.prototype.superInit = function() {
                var caller    = this.superInit.caller; // 呼び出しもと
                var subclass  = caller.owner; // 呼び出しもとを持っているクラス
                var superclass= subclass.prototype.superClass; // 呼び出しもとクラスの親クラス
                var superInit = superclass.prototype.init; // 呼び出しもとクラスの親クラスの init
//                var superMethod = this.superInit.caller.owner.prototype.superClass.prototype.init;

                superInit.apply(this, arguments);
            };
            tm_class.prototype.constructor = tm_class;
        }

        tm_class.prototype.selfClass = tm_class;

        // プロパティを追加
        for (var key in prop) {
            tm_class.prototype[key] = prop[key];
        }

        // クリエイタの生成
        tm_class.prototype.creator = function() { return this; };
        // クリエイタの継承
        tm_class.prototype.creator.prototype = tm_class.prototype;

        tm_class._class = true;

        return tm_class;
    };

    tm.classes = {};
    var _calssDefinedCallback = {};

    /**
     * クラス定義
     * phi クラス定義 <http://jsdo.it/phi/eEmj>
     * new と apply を同時に使う <http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible>
     */
    tm.define = function(path, prop) {
        var index       = path.lastIndexOf(".");
        var nsName      = path.substring(0, index);
        var ns          = (nsName) ? tm.using(nsName) : tm.global;
        var className   = (nsName) ? path.substring(index+1) : path;
        var bind        = Function.prototype.bind;
        var unshift     = Array.prototype.unshift;

        var _class = null;
        var superClass = prop.superClass;

        if (superClass && typeof superClass == "string") {
            var superClassName = superClass;
            superClass = tm.using(superClass);

            if (superClass._class) {
                prop.superClass = superClass;
                _class = tm.createClass(prop);
            }
            else {
                // 親クラスが呼ばれた際に再度実行する
                if (!_calssDefinedCallback[superClassName]) {
                    _calssDefinedCallback[superClassName] = [];
                }

                _calssDefinedCallback[superClassName].push(function() {
                    tm.define(path, prop);
                });

                return ;
            }
        }
        else {
            _class = tm.createClass(prop);
        }

        // キャッシュしておく
        ns[className] = tm.classes[path] = _class;

        if (_calssDefinedCallback[path]) {
            var list = _calssDefinedCallback[path];
            for (var i=0,len=list.length; i<len; ++i) {
                list[i]();
            }
            delete _calssDefinedCallback[path];
        }

        return _class;
    };


    /**
     * 名前空間
     * typescript の mudle 機能を参考
     * https://sites.google.com/site/jun1sboardgames/programming/typescript
     */
    tm.namespace = function(ns, fn) {
        var ns = tm.using(ns);

        fn.call(ns, ns);
    };

    /**
     * 使用
     */
    tm.using = function(ns) {
        if (tm.classes[ns]) return tm.classes[ns];

        var path = ns.split(/[,.\/ ]|::/);
        var current = tm.global;

        for (var i=0,len=path.length; i<len; ++i) {
            var dir = path[i];
            current = current[dir] || (current[dir]={});
        }

        // キャッシュ
        tm.classes[ns] = current;

        return current;
    };
    
    tm.globalize = function(obj) {
        tm.global.$strict(obj);
        
        return this;
    };
    
    tm.import = function(namespace) {
        var target = tm[namespace];
        tm.global.$strict(target);
        
        return this;
    };

    /**
     * ループ
     */
    tm.setLoop = function(fn, delay) {
        var temp = function() {
            // 開始時間
            var start = (new Date()).getTime();

            // 実行
            fn();

            // 経過時間
            var progress = (new Date()).getTime() - start;
            // 次回までの待ち時間を計算
            var newDelay = delay-progress;
            newDelay = (newDelay > 0) ? newDelay : 0;

            // 次回呼び出し登録
            setTimeout(arguments.callee, newDelay);
        };
        setTimeout(temp, delay);
    };

    tm.inform = function(parent){
        parent = parent || document.body;

        var eInfo = document.createElement("div");
        eInfo.setAttribute("class", "tm-info");
        eInfo.addEventListener("mouseover", function(){
            this.style.opacity = 0.9;
        }, false);
        eInfo.addEventListener("mouseout", function(){
            this.style.opacity = 0.25;
        }, false);

        with(eInfo.style) {
            position    = "absolute";
            width       = "100%";
            // top         = "0px";
            bottom      = "0px";
            left        = "0px";
            right       = "0px";
            margin      = "0px";
            padding     = "10px 0px";
            zIndex      = "0";
            textAlign   = "center";
            fontFamily  = '"Meiryo", "メイリオ", "ヒラギノ角ゴ Pro W3", sans-serif';
            fontSize    = "13px";
            opacity     = "0.25";
            backgroundColor = "rgb(230,230,255)";
            background  = "-webkit-linear-gradient(top, hsla(0, 100%, 100%, 0.8) 0%, hsla(0, 100%, 100%, 0.3) 50%, hsla(0, 100%, 100%, 0.1) 51%, hsla(0, 100%, 100%, 0.2) 100%), rgb(190,190,210)";
            background  = "-moz-linear-gradient(top, hsla(0, 100%, 100%, 0.8) 0%, hsla(0, 100%, 100%, 0.3) 50%, hsla(0, 100%, 100%, 0.1) 51%, hsla(0, 100%, 100%, 0.2) 100%), rgb(190,190,210)";
            WebkitTransition = "1s";
            MozTransition = "1s";
        }

        /*
        eInfo.innerHTML = "このプログラムで利用している JavaScript ライブラリ 『tmlib.js』 は<a href='{tmlibLink}'>こちら</a>からダウンロードできます. 詳しくは<a href='{blogLink}'>Blog</a>に書いています.".format({
            "tmlibLink": "http://code.google.com/p/tmlib-js/downloads/list",
            "blogLink" : "http://tmlife.net/tmlib"
        });
        */
        eInfo.innerHTML = "このプログラムで利用している JavaScript ライブラリ 『tmlib.js』 については<a href='{projectLink}'>こちら</a>.".format({
            "projectLink" : "https://github.com/phi1618/tmlib.js"
        });
        parent.appendChild(eInfo);
    };

})();


(function() {

    if (!window) return ;

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window[tm.VENDER_PREFIX + "RequestAnimationFrame"] || function(callback) {
            window.setTimeout(callback, 1000/60);
        };
    }

    if (!window.cancelRequestAnimationFrame) {
        window.cancelRequestAnimationFrame = window[tm.VENDER_PREFIX + "CancelRequestAnimationFrame"] || window.clearTimeout;
    }

})();



(function() {
    if (!window.document) return ;

    _loadCheckList = [];
    tm.addLoadCheckList = function(obj) {
        console.assert(obj.isLoaded !== undefined, "isLoaded が定義されていません!!");

        _loadCheckList.push(obj);
    };

    _preloadListners = [];
    _mainListners = [];

    tm.preload = function(fn) { _preloadListners.push(fn); };
    tm.main    = function(fn) { _mainListners.push(fn); };

    var _preload = function() {

        for (var i=0,len=_preloadListners.length; i<len; ++i) {
            _preloadListners[i]();
        }
        _preloadListners = [];
    };

    var _main = function() {
        for (var i=0,len=_loadCheckList.length; i<len; ++i) {
            var c = _loadCheckList[i];
            if (c.isLoaded() == false) {
                setTimeout(arguments.callee, 0);
                return ;
            }
        }

        for (var i=0,len=_mainListners.length; i<len; ++i) {
            _mainListners[i]();
        }

        _mainListners = [];
    };

    window.addEventListener("load", function() {

        _preload();

        _main();

    }, false);

})();
/*
 * object.js
 */

(function() {
    
    /**
     * @class Object
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
     * @TODO ?
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
     * @TODO ?
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
     * @TODO ?
     */
    Object.defineInstanceMethod("setter", function(name, fn){
        Object.defineProperty(this, name, {
            set: fn,
            enumerable: false,
        });
        // this.__defineSetter__(name, fn);
    });
    
    /**
     * @method getter
     * @TODO ?
     */
    Object.defineInstanceMethod("getter", function(name, fn){
        Object.defineProperty(this, name, {
            get: fn,
            enumerable: false,
        });
        // this.__defineGetter__(name, fn);
    });
    
    /**
     * @method accessor
     * @TODO ?
     */
    Object.defineInstanceMethod("accessor", function(name, param) {
        Object.defineProperty(this, name, {
            set: param["set"],
            get: param["get"],
            enumerable: false,
        });
        // (param["get"]) && this.getter(name, param["get"]);
        // (param["set"]) && this.setter(name, param["set"]);
    });

    /**
     * @method  $has
     * text
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
                if (!this[property]) this[property] = source[property];
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
     * text
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
     * text
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


/*
 * array.js
 */

(function() {
    
    /**
     * @class   Array
     * Arrayの拡張
     */
    
    /**
     * @property    first
     * 最初の要素
     */
    Array.prototype.accessor("first", {
        "get": function()   { return this[0]; },
        "set": function(v)  { this[0] = v; }
    });
    
    /**
     * @property    last
     * 最後の要素
     */
    Array.prototype.accessor("last", {
        "get": function()   { return this[this.length-1]; },
        "set": function(v)  { this[this.length-1] = v; }
    });
    
    /**
     * @method  equals
     * 渡された配列と等しいかどうかをチェック
     */
    Array.defineInstanceMethod("equals", function(arr) {
        // 長さチェック
        if (this.length !== arr.length) return false;
        
        for (var i=0,len=this.length; i<len; ++i) {
            if (this[i] !== arr[i]) {
                return false;
            }
        }
        return true;
    });
    
    /**
     * @method  deepEquals
     * ネストされている配列含め渡された配列と等しいかどうかをチェック
     * equalsDeep にするか検討. (Java では deepEquals なのでとりあえず合わせとく)
     */
    Array.defineInstanceMethod("deepEquals", function(arr) {
        // 長さチェック
        if (this.length !== arr.length) return false;
        
        for (var i=0,len=this.length; i<len; ++i) {
            var result = (this[i].deepEquals) ? this[i].deepEquals(arr[i]) : (this[i] === arr[i]);
            if (result === false) {
                return false;
            }
        }
        return true;
    });
    
    /**
     * @method  at
     * ループ添字アクセス(Ruby っぽいやつ)
     */
    Array.defineInstanceMethod("at", function(i) {
        i%=this.length;
        i+=this.length;
        i%=this.length;
        return this[i];
    });
    
    
    /**
     * @method  swap
     * a番目 と b番目 を入れ替える
     */
    Array.defineInstanceMethod("swap", function(a, b) {
        var temp = this[a];
        this[a] = this[b];
        this[b] = temp;
        
        return this;
    });
    
    
    /**
     * @method  erase
     * elm と一致する要素を削除
     */
    Array.defineInstanceMethod("erase", function(elm) {
        var index  = this.indexOf(elm);
        this.splice(index, 1);
        return this;
    });
    
    /**
     * @method  eraseAll
     * elm と一致する要素を全て削除
     */
    Array.defineInstanceMethod("eraseAll", function(elm) {
        for (var i=0,len=this.length; i<len; ++i) {
            if (this[i] == elm) {
                this.splice(i--, 1);
            }
        }
        return this;
    });
    
    /**
     * @method  eraseIf
     * 条件にマッチした要素を削除
     */
    Array.defineInstanceMethod("eraseIf", function(fn) {
        for (var i=0,len=this.length; i<len; ++i) {
            if ( fn(this[i], i, this) ) {
                this.splice(i, 1);
                break;
            }
            // if ( fn(this[i], i, this) ) { this.splice(i--, 1); }
        }
        return this;
    });
    
    /**
     * @method  eraseIfAll
     * 条件にマッチした要素を削除
     */
    Array.defineInstanceMethod("eraseIfAll", function(fn) {
        for (var i=0,len=this.length; i<len; ++i) {
            if ( fn(this[i], i, this) ) {
                this.splice(i, 1);
            }
        }
        return this;
    });
    
    /**
     * @method  random
     * 要素の中からランダムで取り出す
     */
    Array.defineInstanceMethod("random", function(min, max) {
        min = min || 0;
        max = max || this.length-1;
        return this[ Math.rand(min, max) ];
    });
    
    /**
     * @method  pickup
     * 要素の中からランダムで取り出す
     */
    Array.defineInstanceMethod("pickup", function(min, max) {
        min = min || 0;
        max = max || this.length-1;
        return this[ Math.rand(min, max) ];
    });
    
    /**
     * @method  uniq
     * 重複削除
     */
    Array.defineInstanceMethod("uniq", function(deep) {
        var arr = [];
        for (var i=0,len=this.length; i<len; ++i) {
            var value = this[i];
            if (value in arr == false) {
                arr.push(value);
            }
        }
        return arr;
    });
    

    /**
     * @method  flatten
     * フラット.
     * Ruby のやつ.
     */
    Array.defineInstanceMethod("flatten", function(deep) {
        var temp = Array.flatten(this);
        
        this.clear().concat(temp);
        for (var i=0,len=temp.length; i<len; ++i) this[i] = temp[i];
        
        return this;
    });
    
    /**
     * @method  clone
     * 配列をクローン
     */
    Array.defineInstanceMethod("clone", function(deep) {
        if (deep == true) {
            var a = Array(this.length);
            for (var i=0,len=this.length; i<len; ++i) {
                a[i] = (this[i].clone) ? this[i].clone(deep) : this[i];
            }
            return a;
        };
        
        return Array.prototype.slice.apply(this);
    });
    
    /**
     * @method  clear
     * クリア
     */
    Array.defineInstanceMethod("clear", function() {
        this.length = 0;
        return this;
    });
    
    /**
     * @method  fill
     * 特定の値で満たす
     */
    Array.defineInstanceMethod("fill", function(value, start, end) {
        start = start || 0;
        end   = end   || (this.length);
        
        for (var i=start; i<end; ++i) {
            this[i] = value;
        }
        
        return this;
    });
    

    /**
     * @method  range
     * python のやつ
     */
    Array.defineInstanceMethod("range", function(start, end, step) {
        if (arguments.length == 1) {
            this.clear();
            for (var i=0; i<start; ++i) this[i] = i;
        }
        else if (start < end){
            step  = step || 1;
            this.clear();
            for (var i=start, index=0; i<end; i+=step, ++index) {
                this[index] = i;
            }
        }
        else {
            step  = step || -1;
            this.clear();
            for (var i=start, index=0; i>end; i+=step, ++index) {
                this[index] = i;
            }
        }
        
        return this;
    });
    
    /**
     * @method  shuffle
     * シャッフル
     */
    Array.defineInstanceMethod("shuffle", function() {
        for (var i=0,len=this.length; i<len; ++i) {
            var j = Math.rand(0, len-1);
            
            if (i != j) {
                this.swap(i, j);
            }
        }
        
        return this;
    });

    /**
     * @method  sum
     * 合計
     */
    Array.defineInstanceMethod("sum", function() {
        var sum = 0;
        for (var i=0,len=this.length; i<len; ++i) {
            sum += this[i];
        }
        return sum;
    });

    /**
     * @method  average
     * 平均
     */
    Array.defineInstanceMethod("average", function() {
        var sum = 0;
        var len = this.length;
        for (var i=0; i<len; ++i) {
            sum += this[i];
        }
        return sum/len;
    });

    /**
     * @method  each
     * 繰り返し
     * チェーンメソッド対応
     */
    Array.defineInstanceMethod("each", function() {
        this.forEach.apply(this, arguments);
        return this;
    });

    
    /**
     * @method  toULElement
     * ULElement に変換
     */
    Array.defineInstanceMethod("toULElement", function(){
        // TODO: 
    });

    /**
     * @method  toOLElement
     * OLElement に変換
     */
    Array.defineInstanceMethod("toOLElement", function(){
        // TODO:
    });


    
    /**
     * @static
     * @method  uniq
     * 重複削除
     */
    Array.defineFunction("uniq", function(arr) {
        var temp = [];
        for (var i=0,len=arr.length; i<len; ++i) {
            var value = arr[i];
            if (temp.indexOf(value) == -1) {
                temp.push(value);
            }
        }
        return temp;
    });

    
    /**
     * @static
     * @method  flatten
     * フラット.
     * Ruby のやつ.
     */
    Array.flatten = function(array, deep) {
        var arr = [];
        
        for (var i=0,len=array.length; i<len; ++i) {
            var value = array[i];
            if (value instanceof Array) {
                arr = arr.concat(Array.flatten(value));
            }
            else {
                arr.push(value);
            }
        }
        return arr;
    };

    
    /**
     * @static
     * @method  range
     * range
     */
    Array.defineFunction("range", function(start, end, step) {
        return Array.prototype.range.apply([], arguments);
    });
    
})();


/*
 * date.js
 */

(function() {
    
    /**
     * @class   Date
     * Date(日付)の拡張
     */
    
    var MONTH = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    
    var WEEK = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    
    /**
     * @method  format
     * 日付フォーマットに合わせた文字列を返す
     */
    Date.prototype.format = function(pattern) {
        /*
        var str = "{y}/{m}/{d}".format({
            y: this.getYear()+1900,
            m: this.getMonth()+1,
            d: this.getDate(),
        });
        
        return str;
        */
        
        var year    = this.getFullYear();
        var month   = this.getMonth();
        var date    = this.getDate();
        var day     = this.getDay();
        var hours   = this.getHours();
        var minutes = this.getMinutes();
        var seconds = this.getSeconds();
        var str = "";
        
        for (var i=0,len=pattern.length; i<len; ++i) {
            var ch = pattern.charAt(i);
            var temp = "";
            switch(ch) {
                // 日
                case "d": temp = date.padding(2, '0'); break;
                case "D": temp = WEEK[day].substr(0, 3); break;
                case "j": temp = date; break;
                case "l": temp = WEEK[day]; break;
                // case "N": temp = ; break;
                // case "S": temp = ; break;
                // case "w": temp = ; break;
                // case "z": temp = ; break;
                
                // 月
                case "F": temp = MONTH[month]; break;
                case "m": temp = (month+1).padding(2, '0'); break;
                case "M": temp = MONTH[month].substr(0, 3); break;
                case "n": temp = (month+1); break;
                // case "t": temp = (month+1); break;
                
                // 年
                // case "L": temp = ; break;
                // case "o": temp = ; break;
                case "Y": temp = year; break;
                case "y": temp = year.toString().substr(2, 2); break;
                
                
                // 時間
                // case "a": temp = ; break;
                // case "A": temp = ; break;
                // case "B": temp = ; break;
                // case "g": temp = ; break;
                case "G": temp = hours; break;
                // case "h": temp = ; break;
                case "H": temp = hours.padding(2, '0'); break;
                case "i": temp = minutes.padding(2, '0'); break;
                case "s": temp = seconds.padding(2, '0'); break;
                
                default : temp = ch; break;
            }
            str += temp;
        }
        return str;
    };
    
})();


/*
 * function.js
 */

(function() {
    
    /**
     * @class   Function
     * Functionの拡張
     */
    if (!Function.prototype.bind) {
        /**
         * @member  Function
         * @method  bind
         * バインド
         */
        Function.defineInstanceMethod("bind", function(obj) {
            var self = this;
            
            return function() {
                self.apply(obj, arguments);
            };
        });
    }
    
    
    /**
     * @method  toArrayFunction
     * 関数を配列対応関数に変換.
     * forEach の逆アプローチ的な感じ.
     * 配列を継承したクラスなどに使用する.
     * ## Example
     *      var hoge = function(n) { console.log(this*n); return this*n; };
     *      var arr = [5, 10, 15];
     *      arr.hogeArray = hoge.toArrayFunction();
     *      var result = arr.hogeArray(100);
     *      console.log(result);
     */
    Function.defineInstanceMethod("toArrayFunction", function() {
        var self = this;
        return function() {
            var resultList = [];
            for (var i=0,len=this.length; i<len; ++i) {
                resultList.push( self.apply(this[i], arguments) );
            }
            return resultList;
        }
    });
    
    // forEach や map はもう標準化されてきてるので実装しないよん♪
    
})();


/*
 * math.js
 */

(function() {
    
    /**
     * @class Math
     * Mathの拡張
     */
    
    /**
     * @method
     * クランプ
     */
    Math.clamp = function(x, a, b) {
//        return ( Math.max( Math.min(x, ), min ) )
        return (x < a) ? a : ( (x > b) ? b : x );
    };
    
    /**
     * @property    DEG_TO_RAD
     * Degree to Radian.
     */
    Math.DEG_TO_RAD = Math.PI/180;
    
    
    /**
     * @property    RAD_TO_DEG
     * Radian to Degree.
     */
    Math.RAD_TO_DEG = 180/Math.PI;
    
    /**
     * @method
     * Degree を Radian に変換
     */
    Math.degToRad = function(deg) {
        return deg * Math.DEG_TO_RAD;
    };
    
    /**
     * @method
     * Radian を Degree に変換
     */
    Math.radToDeg = function(rad) {
        return rad * Math.RAD_TO_DEG;
    };
    
    
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    Math.rand = function(min, max) {
        return window.Math.floor( Math.random()*(max-min+1) ) + min;
    };
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    Math.randf= function(min, max) {
        return window.Math.random()*(max-min)+min;
    };

    /**
     * @method
     * 長さを取得
     */
    Math.magnitude = function() {
        return Math.sqrt(Math.magnitudeSq.apply(null, arguments));
    };
    
    
    /**
     * @method
     * 長さの２乗を取得
     */
    Math.magnitudeSq = function() {
        var n = 0;
        
        for (var i=0,len=arguments.length; i<len; ++i) {
            n += arguments[i]*arguments[i];
        }
        
        return n;
    };


    /**
     * @method
     * a <= x <= b のとき true を返す
     */
    Math.inside = function(x, a, b) {
        return (x >= a) && (x) <= b;
    };
    
})();


/*
 * number.js
 */

(function() {
    
    /**
     * @class   Number
     * Numberの拡張
     */
    
    /**
     * @method  round
     * 四捨五入
     * 桁数指定版
     */
    Number.defineInstanceMethod("round", function(figure) {
        figure = figure || 0;
        var base = Math.pow(10, figure);
        var temp = this * base;
        temp = Math.round(temp);
        return temp/base;
    });
    
    /**
     * @method  ceil
     * 切り上げ.
     * 桁数指定版
     */
    Number.defineInstanceMethod("ceil",  function(figure) {
        figure = figure || 0;
        var base = Math.pow(10, figure);
        var temp = this * base;
        temp = Math.ceil(temp);
        return temp/base;
    });
    /**
     * @method  floor
     * 切り捨て
     * 桁数指定版
     */
    Number.defineInstanceMethod("floor",  function(figure) {
        figure = figure || 0;
        var base = Math.pow(10, figure);
        var temp = this * base;
        temp = Math.floor(temp);
        
        // ~~this
        // this|0
        
        return temp/base;
    });
    
    /**
     * @method  toInt
     * integer 型に変換する
     */
    Number.defineInstanceMethod("toInt",  function() {
        return (this | 0);
    });
    
    /**
     * @method  toHex
     * 16進数化
     */
    Number.defineInstanceMethod("toHex",  function() {
        return this.toString(16);
    });
    
    /**
     * @method  toBin
     * 2進数化
     */
    Number.defineInstanceMethod("toBin",  function() {
        return this.toString(2);
    });
    
    
    /**
     * @method  toUnsigned
     * unsigned 型に変換する
     */
    Number.defineInstanceMethod("toUnsigned",  function() {
        return this >>> 0;
    });
    
    /**
     * @method  padding
     * 文字埋め
     */
    Number.defineInstanceMethod("padding",  function(n, ch) {
        var str = this+'';
        n  = n-str.length;
        ch = ch || '0';
        
        while(n-- > 0) { str = ch + str; }
        
        return str;
    });
    
})();


/*
 * string.js
 */

(function() {
    
    /**
     * @class String
     * Stringの拡張
     * `String` is a global object that may be used to construct String instances.
     */
    
    
    /**
     * @method  format
     * 
     * フォーマット
     * 
     * ## example
     * 
     *      document.write("{0} + {1} = {2}".format(5, 10, 5+10));   // "5 + 10 = 15"
     *      document.write("rgb({r}, {g}, {b})".format({             // "rgb(128, 0, 255)"
     *          r: 128,
     *          g: 0,
     *          b: 255
     *      }));
     */
    String.defineInstanceMethod("format", function(arg) {
        // 置換ファンク
        var rep_fn = undefined;
        
        // オブジェクトの場合
        if (typeof arg == "object") {
            /** @ignore */
            rep_fn = function(m, k) { return arg[k]; }
        }
        // 複数引数だった場合
        else {
            var args = arguments;
            /** @ignore */
            rep_fn = function(m, k) { return args[ parseInt(k) ]; }
        }
        
        return this.replace( /\{(\w+)\}/g, rep_fn );
    });
    
    /**
     * @method  trim
     * トリム
     * 
     * <a href="http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/">Reference</a>
     * 
     */
    String.defineInstanceMethod("trim", function() {
        return this.replace(/^\s+|\s+$/g, "");
    });
    
    /**
     * @method  capitalize
     * キャピタライズ
     * 
     * ## Reference
     * 
     * - [キャピタライズ(単語の先頭の大文字化)を行う - oct inaodu](http://d.hatena.ne.jp/brazil/20051212/1134369083)
     * - [デザインとプログラムの狭間で: javascriptでキャピタライズ（一文字目を大文字にする）](http://design-program.blogspot.com/2011/02/javascript.html)
     * 
     */
    String.defineInstanceMethod("capitalize", function() {
        return this.replace(/\w+/g, function(word){
            return word.capitalizeFirstLetter();
        });
    });
    
    /**
     * @method  capitalizeFirstLetter
     * 先頭文字のみキャピタライズ
     */
    String.defineInstanceMethod("capitalizeFirstLetter", function() {
        return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
    });
    
    /**
     * @method  toDash
     * ダッシュ
     */
    String.defineInstanceMethod("toDash", function() {
        return this.replace(/([A-Z])/g, function(m){ return '-'+m.toLowerCase(); });
    });
    
    
    /**
     * @method toHash
     * ハッシュ値に変換
     */
    String.defineInstanceMethod("toHash", function() {
        return this.toCRC32();
    });
    
    /**
     * @method  padding
     * 左側に指定された文字を詰めて右寄せにする
     */
    String.defineInstanceMethod("padding", function(n, ch) {
        var str = this.toString();
        n  = n-str.length;
        ch = ch || ' ';
        
        while(n-- > 0) { str = ch + str; }
        
        return str;
    });
    
    /**
     * @method  paddingLeft
     * 左側に指定された文字を詰めて右寄せにする
     */
    String.defineInstanceMethod("paddingLeft", function(n, ch) {
        var str = this.toString();
        n  = n-str.length;
        ch = ch || ' ';
        
        while(n-- > 0) { str = ch + str; }
        
        return str;
    });
    
    /**
     * @method  paddingRight
     * 右側に指定された文字を詰めて左寄せにする
     */
    String.defineInstanceMethod("paddingRight", function(n, ch) {
        var str = this.toString();
        n  = n-str.length;
        ch = ch || ' ';
        
        while(n-- > 0) { str = str + ch; }
        
        return str;
    });
    
    /**
     * @method  repeat
     * リピート
     */
    String.defineInstanceMethod("repeat", function(n) {
        // TODO: 確認する
        var arr = Array(n);
        for (var i=0; i<n; ++i) arr[i] = this;
        return arr.join('');
    });
    
    
    
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".split(' ');
    
    /**
     * @method  toCRC32
     * CRC32 変換
     */
    String.defineInstanceMethod("toCRC32", function() {
        var crc = 0, x=0, y=0;
        
        crc = crc ^ (-1);
        for (var i=0, iTop=this.length; i<iTop; ++i) {
            y = (crc ^ this.charCodeAt(i)) & 0xff;
            x = "0x" + table[y];
            crc = (crc >>> 8) ^ x;
        }
        
        return (crc ^ (-1)) >>> 0;
    });
    
    
})();

/*
 * list.js
 */

(function() {
    
    /**
     * @class tm.Item
     * Item クラス
     */
    tm.Item = tm.createClass({
        
        prev: null,
        next: null,
        data: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
        }
    });
    
    /**
     * @class tm.List
     * List クラス
     * ### Reference
     * - <http://java.sun.com/javase/ja/6/docs/ja/api/java/util/LinkedList.html>
     * - <http://www.javadrive.jp/start/linkedlist/>
     * - <http://www5c.biglobe.ne.jp/~ecb/cpp/07_08.html>
     * - <http://hextomino.tsukuba.ch/e30895.html>
     * - <http://www.nczonline.net/blog/2009/04/21/computer-science-in-javascript-doubly-linked-lists/>
     * - <http://www.nczonline.net/blog/2009/04/13/computer-science-in-javascript-linked-list/>
     */
    tm.List = tm.createClass({
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this._length = 0;
            this._head = tm.Item();
            this._tail = tm.Item();
            
            this._head.next = this._tail;
            this._tail.prev = this._head;
        },
        
        /**
         * @property
         * 追加
         */
        add: function(data) {
            var item = tm.Item();
            item.data = data;
            
            item.prev = this._tail.prev;
            item.next = this._tail;
            
            this._tail.prev.next = item;
            this._tail.prev = item;
            
            ++this._length;
            
            return this;
        },
        
        /**
         * @property
         * 削除
         */
        remove: function(index) {
            var current = this.getItem(index);
            
            current.prev.next = current.next;
            current.next.prev = current.prev;
            
            --this._length;
            
            return current;
        },
        
        /**
         * @property
         * ゲット
         */
        get: function(index) {
            return this.getItem(index).data;
        },
        
        /**
         * @property
         * アイテムを取得
         */
        getItem: function(index) {
            var current = this._head.next;
            var i=0;
            
            while (i++ < index) {
                current = current.next;
            }
            
            return current;
        },
        
        /**
         * @property
         * 繰り返し
         */
        forEach: function(fn) {
            // TODO:
        },
        
        /**
         * @property
         * クリア
         */
        clear: function() {
            // TODO:
        },
        
        /**
         * @property
         * クローン
         */
        clone: function() {
            // TODO:
        },
        
        /**
         * @property
         * 最初の要素を取得
         */
        getFirst: function() {
            // TODO:
        },
        
        /**
         * @property
         * 最後の要素を取得
         */
        getLast: function() {
            // TODO:
        },
        
        /**
         * @property
         * 最初に一致した位置のインデックスを取得
         */
        indexOf: function(obj) {
            // TODO:
        },
        
        /**
         * @property
         * 最後に一致した位置のインデックスを取得
         */
        lastIndexOf: function(obj) {
            // TODO:
        },
        
        /**
         * @property
         * 配列に変換
         */
        toArray: function() {
            if (this._length <= 0) return [];
            
            var current = this._head.next;
            var arr = [];
            
            while (current.data != null) {
                arr.push(current.data);
                current = current.next;
            }
            
            return arr;
        },
        
        /**
         * @property
         * 文字列に変換
         */
        toString: function() {
            var arr = this.toArray();
            for (var i=0,len=arr.length; i<len; ++i) {
                arr[i] = arr[i].toString();
            }
            
            return arr.join(',');
        },
    });
    
})();


/*
 * random.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.Random
     * ランダムクラス
     * 
     * ## Reference
     * - <http://www.python.jp/doc/2.5/lib/module-random.html>
     * - <http://www.yukun.info/blog/2008/06/python-random.html>
     * - <http://www.python-izm.com/contents/application/random.shtml>
     * - <http://libcinder.org/docs/v0.8.3/classcinder_1_1_rand.html>
     * - <http://libcinder.org/docs/v0.8.3/_rand_8h_source.html>
     */
    tm.util.Random = {
        
        /**
         * @property
         * Dummy
         */
        randint: function(min, max) {
            return window.Math.floor( Math.random()*(max-min+1) ) + min;
        },
        
        /**
         * @property
         * Dummy
         */
        randfloat: function(min, max) {
            return window.Math.random()*(max-min)+min;
        },
        
        /**
         * @property
         * Dummy
         */
        randbool: function() {
            return this.randint(0, 1) === 1;
        },
    };
    
})();

/*
 * ajax.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @enum
     * @TODO ?
     * @private
     */
    var AJAX_DEFAULT_SETTINGS = {
        /** @property type */
        type :"GET",
        /** @property async */
        async: true,
        /** @property data */
        data: null,
        /** @property contentType */
        contentType: 'application/x-www-form-urlencoded',
        /** @property dataType */
        dataType: 'text',
        /** @property username */
        username: null,
        /** @property password */
        password: null,
        /** @property success */
        success : function(data){ alert("success!!\n"+data); },
        /** @property error */
        error   : function(data){ alert("error!!"); }
    };
    
    /**
     * @class tm.util.Ajax
     * @TODO ?
     */
    tm.util.Ajax = {
        /**
         * @property load
         */
        load: function(params) {
            for (var key in AJAX_DEFAULT_SETTINGS) {
                params[key] = params[key] || AJAX_DEFAULT_SETTINGS[key];
            }
            
            var httpRequest = new XMLHttpRequest();
            var ajax_params = "";
            var conv_func = tm.util.Ajax.DATA_CONVERTE_TABLE[params.dataType];
            
            // コールバック
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState == 4) {
                    // 成功
                    if (httpRequest.status === 200) {
                        // タイプ別に変換をかける
                        var data = conv_func(httpRequest.responseText);
                        params.success(data);
                    }
                    // status === 0 はローカルファイル用
                    else if (httpRequest.status === 0) {
                        // タイプ別に変換をかける
                        var data = conv_func(httpRequest.responseText);
                        params.success(data);
                    }
                    else {
                        params.error(httpRequest.responseText);
                    }
                }
                else {
                    //console.log("通信中");
                }
            };
            
            httpRequest.open(params.type, params.url, params.async, params.username, params.password);   // オープン
            httpRequest.setRequestHeader('Content-Type', params.contentType);        // ヘッダをセット
            httpRequest.send(null);
        },
        
        /**
         * @property loadJSONP
         */
        loadJSONP: function(url, callback) {
            var g = tm.global;
            g.tmlib_js_dummy_func_count = tm.global.tmlib_js_dummy_func || 0;
            var dummy_func_name = "tmlib_js_dummy_func" + (g.tmlib_js_dummy_func_count++);
            g[dummy_func_name]  = callback;
            
            var elm = document.createElement("script");
            elm.type = "text/javascript";
            elm.charset = "UTF-8";
            elm.src = url + "&callback=" + dummy_func_name;
            elm.setAttribute("defer", true);
            document.getElementsByTagName("head")[0].appendChild(elm);
        }
    };
    
    /**
     * @enum tm.util.Ajax.DATA_CONVERTE_TABLE
     * データコンバータテーブル
     */
    tm.util.Ajax.DATA_CONVERTE_TABLE = {
        /** @property */
        undefined: function(data) {
            return data;
        },
        
        /** @property */
        text: function(data) {
            return data;
        },
        
        /** @property */
        xml: function(data) {
            var div = document.createElement("div");
            div.innerHTML = data;
            return div;
        },
        
        /** @property */
        dom: function(data) {
            var div = document.createElement("div");
            div.innerHTML = data;
            return tm.dom.Element(div);
        },
        
        /** @property */
        json: function(data) {
            try {
                return JSON.parse(data);
            }
            catch(e) {
                console.dir(e);
                console.dir(data);
            }
        },
        
        /** @property */
        script: function(data) {
            eval(data);
            return data;
        },
        
        /**
         * @property
         * ### Reference
         * - <http://efcl.info/adiary/Javascript/treat-binary>
         * @param {Object} data
         */
        bin: function(data) {
            var bytearray = [];
            for (var i=0, len=data.length; i<len; ++i) {
                bytearray[i] = data.charCodeAt(i) & 0xff;
            }
            return bytearray;
        },
        
    };
    
})();

/*
 * file.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.File
     * @TODO ?
     */
    tm.util.File = tm.createClass({

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(params) {
            this.loaded = false;
            if (arguments.length == 1) {
                this.loadFile(params);
            }
        },
        
        /**
         * @property
         * @TODO ?
         */
        loadFile: function(params) {
            if (typeof params == "string") {
                var url = params;
                params = { url: url, };
            }
            
            var self = this;
            params.success = function(data) {
                self.loaded = true;
                self.data = data;
            };
            tm.util.Ajax.load(params);
        },
        
        /**
         * @property
         * @TODO ?
         */
        loadLocalStorage: function() {
            
        },
        
    });
    
    
})();



(function() {
    
    /**
     * @class tm.util.FileManager
     * ファイルマネージャ
     */
    tm.util.FileManager = {
        files: {}
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.FileManager.load = function(key, params) {
        var file = tm.util.File(params);
        this.files[key] = file;
        return file;
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.FileManager.get = function(key) {
        return this.files[key];
    };
    
    /**
     * @static
     * @method  isLoaded
     * ロードチェック
     */
    tm.util.FileManager.isLoaded = function() {
        for (var key in this.files) {
            var file = this.files[key];
            
            if (file.loaded == false) {
                return false;
            }
        }
        return true;
    };
    
    tm.addLoadCheckList(tm.util.FileManager);
    
})();
/*
 * tmline.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.Timeline
     * タイムラインクラス
     */
    tm.util.Timeline = tm.createClass({
        
        target  : null,
        tasks   : null,
        
        fps     : 30,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.tasks = [];
            this.time = 0;
        },
        
        /**
         * @property
         * @TODO ?
         */
        at: function(time, action) {
            this.tasks.push({
                time: time,
                action: action,
            });
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        after: function(time, action) {
            this.at(this.time + time, action);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        clear: function() {
            this.tasks = [];
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        removeTime: function(time) {
            // TODO: 
        },

        /**
         * @property
         * @TODO ?
         */
        removeAction: function(action) {
            // TODO: 
        },
        
        /**
         * @property
         * @TODO ?
         */
        start: function() {
            this.isPlaying = true;
            this._startTime();
            this._updateTime();
        },

        /**
         * @property
         * @TODO ?
         */
        resume: function() {
            this.isPlaying = true;
            this._resumeTime();
            this._updateTime();
        },

        /**
         * @property
         * @TODO ?
         */
        stop: function() {
            this.isPlaying = false;
        },

        /**
         * @property
         * @TODO ?
         */
        rewind: function() {
            this.time = 0;
        },

        /**
         * @property
         * @TODO ?
         */
        update: function() {
            // タスク更新
            if (this.tasks.length > 0) {
                for (var i=0,len=this.tasks.length; i<len; ++i) {
                    var task = this.tasks[i];
                    if (this.prev <= task.time && task.time < this.time) {
                        task.action();
                        // this.tasks.erase(task);
                        // break;
                    }
                }
            }
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _startTime: function() {
            this.startTime = (new Date()).getTime();
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _resumeTime: function() {
            this.startTime = (new Date()).getTime() - this.time;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateTime: function() {
            if (this.isPlaying) {
                this._nextTime();
                setTimeout(arguments.callee.bind(this), 1000/this.fps);
            }
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _nextTime: function() {
            // 前回の時間
            this.prev = this.time;
            // 今回の時間
            this.time = (new Date()).getTime() - this.startTime;
            // 更新
            this.update();
        },
        
    });
    
})();


/*
 * util/data.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.DataManager
     * データマネージャ
     */
    tm.util.DataManager = {
        data: {}
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.DataManager.save = function() {
        // TODO: ローカルストレージ?
        for (var key in this.data) {
            var data = this.data[key];
            localStorage[key] = JSON.stringify( data );
        }
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.DataManager.load = function(key) {
        // TODO: ローカルストレージ?
        for (var key in localStorage) {
            this.data[key] = JSON.parse(localStorage[key]);
        }
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.DataManager.set = function(key, value) {
        this.data[key] = value;
        return this;
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.DataManager.get = function(key) {
        return this.data[key];
    };
    
    
    // tm.addLoadCheckList(tm.util.DataManager);
    
})();
/*
 * script.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.Script
     * スクリプトクラス
     */
    tm.util.Script = tm.createClass({
        
        element: null,
        loaded: false,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(src, callback) {
            this.loaded = false;
            this.element = document.createElement("script");
            this.element.type = "text/javascript";
            this.element.src = src;
            this.element.charset = "UTF-8";
            this.element.setAttribute("defer", true);
            document.head.appendChild(this.element);
            
            var self = this;
            this.element.onload = function() {
                if (callback) callback.call(this);
                self.loaded = true;
            };
        },
        
        getElement: function() {
            return this.element;
        },
        
    });
    
})();

(function(){
    
    /**
     * @class tm.util.ScriptManager
     * スクリプトマネージャクラス
     */
    tm.util.ScriptManager = {
        scriptList: {},
        loaded: true,
    };
    
    /**
     * @static
     * @method
     * 追加
     */
    tm.util.ScriptManager.load = function(src, callback) {
        this.scriptList[src] = tm.util.Script(src, callback);
    };

    /**
     * @static
     * @method
     * stats.js を動的ロード
     */
    tm.util.ScriptManager.loadStats = function(version) {
        version = version || "r11";
        var path = null;
        if (["r6", "r7", "r8", "r9", "10"].indexOf(version) != -1) {
            path = "http://rawgithub.com/mrdoob/stats.js/" + version + "/build/Stats.js";
        }
        else {
            path = "http://rawgithub.com/mrdoob/stats.js/" + version + "/build/stats.min.js";
        }
        this.load(path);
    };

    /**
     * @static
     * @method
     * Dat GUI を動的ロード
     */
    tm.util.ScriptManager.loadDatGUI = function(version) {
        // http://dat-gui.googlecode.com/git/build/dat.gui.min.js
        // https://dat-gui.googlecode.com/git-history/0.5/build/dat.gui.min.js

        version = version || "0.5";
//        var path = "https://dat-gui.googlecode.com/git-history/" + version + "/build/dat.gui.min.js";
//        var path = "http://dat-gui.googlecode.com/git/build/dat.gui.min.js";
        var path = "http://dat-gui.googlecode.com/git/build/dat.gui.js";
        this.load(path);
    };

    /**
     * @static
     * @method
     * Three.js を動的ロード
     */
    tm.util.ScriptManager.loadThree = function(version) {
        var THREE_JS_URL = "http://rawgithub.com/mrdoob/three.js/{version}/build/three.js";
//        var THREE_JS_URL = "https://raw.github.com/mrdoob/three.js/{version}/build/three.min.js";
        version = version || "r55";

        var path = THREE_JS_URL.format({version: version});

        this.load(path);
    };

    /**
     * @static
     * @method
     * BulletML を動的ロード
     */
    tm.util.ScriptManager.loadBulletML = function(version) {
        var BULLETML_FOR_TMLIB_JS_URL   = "http://rawgithub.com/daishihmr/bulletml.js/{version}/target/bulletml.for.tmlib.js";
        version = version || "v0.4.1";
        var path = BULLETML_FOR_TMLIB_JS_URL.format({version: version});        
        this.load(path);
    };
    
    /**
     * @static
     * @method
     * ロードチェック
     */
    tm.util.ScriptManager.isLoaded = function() {
        if (this.scriptList.length <= 0) return true;

        for (var key in this.scriptList) {
            if (this.scriptList[key].loaded == false) {
                return false;
            }
        }
        return true;
    };
    
    tm.addLoadCheckList(tm.util.ScriptManager);
    
})();



/*
 * querystring.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.QueryString
     * @TODO ?
     */
    tm.util.QueryString = {
        /**
         * @property
         * @TODO ?
         */
        parse: function(str, sep, eq) {
            sep = sep || '&';
            eq  = eq  || '=';
            
            var obj = {};
            var params = str.split(sep);
            for (var i=0,len=params.length; i<len; ++i) {
                var param = params[i];
                var pos = param.indexOf(eq);
                if (pos>0) {
                    var key = param.substring(0, pos);
                    var val = param.substring(pos+1);
                    obj[key] = val;
                }
            }
            
            return obj;
        },
        
        /**
         * @property
         * @TODO ?
         */
        stringify: function(obj, sep, eq) {
            sep = sep || '&';
            eq  = eq  || '=';
            
            
            var strList = [];
            for (var key in obj) {
                var value = encodeURIComponent(obj[key]);
                strList.push(key + eq + value);
            }
            
            return strList.join(sep);
        },
    };
    
})();




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

/*
 * vector2.js
 */

/*
 * 幾何学
 */
tm.geom = tm.geom || {};


(function() {
    
    /**
     * @class tm.geom.Vector2
     * 2次元ベクトル
     */
    tm.geom.Vector2 = tm.createClass({
        /**
         * x 座標
         */
        x: 0,
        /**
         * y 座標
         */
        y: 0,
        
        /**
         * @constructor
         * 初期化
         */
        init: function(x, y) {
            this.set(x, y);
        },
        
        
        /**
         * @property
         * 複製
         */
        clone: function() {
            return tm.geom.Vector2(this.x, this.y);
        },
        
        
        /**
         * @property
         * 等しいかどうかをチェック
         * @param   {tm.geom.Vector2}   v   比較対象となる２次元ベクトル
         */
        equals: function(v) {
            return (this.x === v.x && this.y === v.y) ? true : false;
        },
        
        /**
         * @property
         * 数値と等しいかどうかをチェック
         * @param   {Number}   x    比較対象となる x 値
         * @param   {Number}   y    比較対象となる y 値
         */
        equalsNumber: function(x, y) {
            return (this.x === x && this.y === y) ? true : false;
        },
        
        /**
         * @property
         * 配列と等しいかどうかをチェック
         * @param   {Number}   arr  比較対象となる配列
         */
        equalsArray: function(arr) {
            return (this.x === arr[0] && this.y === arr[1]) ? true : false;
        },
        
        
        /**
         * @property
         * セッター
         */
        set: function(x, y) {
            this.x = x;
            this.y = y;
        },
        
        /**
         * @property
         * 数値からセット
         */
        setNumber: function(x, y) {
            this.x = x;
            this.y = y;
            
            return this;
        },
        
        /**
         * @property
         * 配列からセット
         */
        setArray: function(arr) {
            this.x = arr[0];
            this.y = arr[1];
            
            return this;
        },
        
        /**
         * @property
         * オブジェクトからセット
         */
        setObject: function(obj) {
            this.x = obj.x;
            this.y = obj.y;
            
            return this;
        },
        
        /**
         * @property
         * 文字列からセット
         */
        setString: function(str) {
            var m = str.match(/(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?)/);
            this.x = parseFloat(m[1]);
            this.y = parseFloat(m[3]);
            
            return this;
        },
        
        /**
         * @property
         * 賢いセット
         */
        setSmart: function(x, y) {
            var v = arguments[0];
            // xyz
            if (arguments.length === 2) {
                this.x = x;
                this.y = y;
            }
            // Array
            else if (v instanceof Array) {
                this.x = v[0];
                this.y = v[1];
            }
            // Object
            else if (v instanceof Object) {
                this.x = v.x;
                this.y = v.y;
            }
            // String
            else if (typeof(v) == "string") {
                var m = v.match(/(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?)/);
                this.x = parseFloat(m[1]);
                this.y = parseFloat(m[3]);
            }
            
            return this;
        },
        
        /**
         * @property
         * 角度と長さでベクトルをセット
         * Angle は Degree 値で指定
         */
        setAngle: function(angle, len) {
            var rad = angle*Math.DEG_TO_RAD;
            
            len = len || 1;
            this.x = Math.cos(rad)*len;
            this.y = Math.sin(rad)*len;
            
            return this;
        },
        
        /**
         * @property
         * 角度(radian)と長さでベクトルをセット
         */
        setRadian: function(radian, len) {
            len = len || 1;
            this.x = Math.cos(radian)*len;
            this.y = Math.sin(radian)*len;
            
            return this;
        },
        
        /**
         * @property
         * 角度(degree)と長さでベクトルをセット
         */
        setDegree: function(degree, len) {
            var rad = degree*Math.DEG_TO_RAD;
            
            len = len || 1;
            this.x = Math.cos(rad)*len;
            this.y = Math.sin(rad)*len;
            
            return this;
        },
        
        /**
         * @property
         * ランダムベクトルをセット
         */
        setRandom: function(min, max, len) {
            min = min || 0;
            max = max || 360;
            len = len || 1;
            this.setDegree(Math.randf(min, max), len);
            return this;
        },
        
        /**
         * @property
         * 加算
         */
        add: function(v) {
            this.x += v.x;
            this.y += v.y;
            
            return this;
        },
        
        /**
         * @property
         * 減算
         */
        sub: function(v) {
            this.x -= v.x;
            this.y -= v.y;
            
            return this;
        },
        
        /**
         * @property
         * 乗算
         */
        mul: function(n) {
            this.x *= n;
            this.y *= n;
            
            return this;
        },
        
        /**
         * @property
         * 除算
         */
        div: function(n) {
            //console.assert(n != 0, "0 division!!");
            n = n || 0.01;
            this.x /= n;
            this.y /= n;
            
            return this;
        },
        
        /**
         * @property
         * 反転
         */
        negate: function() {
            this.x = -this.x;
            this.y = -this.y;
            
            return this;
        },
        
        /**
         * @property
         * 長さを取得
         * ### memo
         * magnitude って名前の方が良いかも. 検討中.
         */
        length: function() {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        },
        
        /**
         * @property
         * 2乗された長さを取得
         * C# の名前を引用
         * or lengthSquare or lengthSqrt
         */
        lengthSquared: function() {
            return this.x*this.x + this.y*this.y;
        },
        
        /**
         * @property
         * ２点間の距離を返す
         */
        distance: function(v) {
            return Math.sqrt( Math.pow(this.x-v.x, 2) + Math.pow(this.y-v.y, 2) );
        },
        
        /**
         * @property
         * ２点間の距離を返す
         */
        distanceSquared: function(v) {
            return Math.pow(this.x-v.x, 2) + Math.pow(this.y-v.y, 2);
        },
        
        /**
         * @property
         * 正規化
         */
        normalize: function() {
            var length = this.length();
            this.div(length);
            
            return this;
        },
        
        /**
         * @property
         * 角度(radian)に変換
         */
        toAngle: function() {
            return Math.atan2(this.y, this.x);
        },

        /**
         * @property
         * @TODO ?
         */
        toStyleString: function() {
            return "{x:{x}, y:{y}}".format(this);
        },

        /**
         * @property
         * @TODO ?
         */
        toString: function() {
            return "{x:{x}, y:{y}}".format(this);
        },
        
        /**
         * @property
         * X値をセット
         * チェーンメソッド用セッター
         */
        setX: function(x) {
            this.x = x;
            return this;
        },
        
        /**
         * @property
         * Y値をセット
         * チェーンメソッド用セッター
         */
        setY: function(y) {
            this.y = y;
            return this;
        },
        
    });
    
    
    /**
     * @method
     * @static
     * min
     */
    tm.geom.Vector2.min = function(lhs, rhs) {
        return tm.geom.Vector2(
            (lhs.x < rhs.x) ? lhs.x : rhs.x,
            (lhs.y < rhs.y) ? lhs.y : rhs.y
        );
    };
    
    /**
     * @method
     * @static
     * max
     */
    tm.geom.Vector2.max = function(lhs, rhs) {
        return tm.geom.Vector2(
            (lhs.x > rhs.x) ? lhs.x : rhs.x,
            (lhs.y > rhs.y) ? lhs.y : rhs.y
        );
    };
    
    /**
     * @method
     * @static
     * 加算
     */
    tm.geom.Vector2.add = function(lhs, rhs) {
        return tm.geom.Vector2(lhs.x+rhs.x, lhs.y+rhs.y);
    };
    
    /**
     * @method
     * @static
     * 減算
     */
    tm.geom.Vector2.sub = function(lhs, rhs) {
        return tm.geom.Vector2(lhs.x-rhs.x, lhs.y-rhs.y);
    };
    
    /**
     * @method
     * @static
     * 乗算
     */
    tm.geom.Vector2.mul = function(v, n) {
        return tm.geom.Vector2(v.x*n, v.y*n);
    };
    
    /**
     * @method
     * @static
     * 割算
     */
    tm.geom.Vector2.div = function(v, n) {
        return tm.geom.Vector2(v.x/n, v.y/n);
    };
    
    /**
     * @method
     * @static
     * 反転
     */
    tm.geom.Vector2.negate = function() {
        return tm.geom.Vector2(-this.x, -this.y);
    };
    
    /**
     * @method
     * @static
     * 内積.
     * 投影ベクトルを求めたり, 類似度に使ったり.
     */
    tm.geom.Vector2.dot = function(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    };
    

    /**
     * @method
     * @static
     * 外積
     */
    tm.geom.Vector2.cross = function(lhs, rhs) {
        return (lhs.x*rhs.y) - (lhs.y*rhs.x);
    };
    
    /**
     * @method
     * @static
     * ２点間の距離を返す
     */
    tm.geom.Vector2.distance = function(lhs, rhs) {
        return Math.sqrt( Math.pow(lhs.x-rhs.x, 2) + Math.pow(lhs.y-rhs.y, 2) );
    };
    
    /**
     * @method
     * @static
     * ２点間の距離を返す
     */
    tm.geom.Vector2.distanceSquared = function(lhs, rhs) {
        return Math.pow(lhs.x-rhs.x, 2) + Math.pow(lhs.y-rhs.y, 2);
    };

    /**
     * @method
     * @static
     * マンハッタン距離
     */
    tm.geom.Vector2.manhattanDistance = function(lhs, rhs) {
        return Math.abs(lhs.x-rhs.x) + Math.abs(lhs.y-rhs.y);
    };
    
    /**
     * @method
     * @static
     * 反射ベクトル
     */
    tm.geom.Vector2.reflect = function(v, normal) {
        var len = Vector2.dot(v, normal);
        var temp= Vector2.mul(normal, 2*len);
        
        return tm.geom.Vector2.sub(v, temp);
    };

    /**
     * @method
     * @static
     * 補間.
     * 0.5 で lhs と rhs の中間ベクトルを求めることができます.
     */
    tm.geom.Vector2.lerp = function(lhs, rhs, t) {
        // TODO: 
        return tm.geom.Vector2(
            lhs.x + (rhs.x-lhs.x)*t,
            lhs.y + (rhs.y-lhs.y)*t
        );
    };
    
    
    /**
     * @method
     * @static
     * 補間
     */
    tm.geom.Vector2.slerp = function(lhs, rhs, t) {
        // TODO:
        // cos...
    };
    

    /**
     * @method
     * @static
     * min ~ max の間でランダムな方向のベクトルを生成する. len で長さ指定.
     */
    tm.geom.Vector2.random = function(min, max, len) {
        min = min || 0;
        max = max || 360;
        len = len || 1;
        return tm.geom.Vector2().setDegree(Math.randf(min, max), len);
    };
    
    
    /**
     * @property
     * @static
     * zero
     */
    tm.geom.Vector2.ZERO    = tm.geom.Vector2( 0, 0);
    
    /**
     * @property
     * @static
     * left
     */
    tm.geom.Vector2.LEFT    = tm.geom.Vector2(-1, 0);
    
    
    /**
     * @property
     * @static
     * right
     */
    tm.geom.Vector2.RIGHT   = tm.geom.Vector2( 1, 0);
    
    /**
     * @property
     * @static
     * up
     */
    tm.geom.Vector2.UP      = tm.geom.Vector2( 0, 1);
    
    /**
     * @property
     * @static
     * down
     */
    tm.geom.Vector2.DOWN    = tm.geom.Vector2( 0,-1);
    
})();


/*
 * vector3.js
 */

/*
 * 幾何学
 */
tm.geom = tm.geom || {};


(function() {
    
    /**
     * @class tm.geom.Vector3
     * 3次元ベクトル
     */
    tm.geom.Vector3 = tm.createClass({
        /**
         * x 座標
         */
        x: 0,
        /**
         * y 座標
         */
        y: 0,
        /**
         * z 座標
         */
        z: 0,
        

        /**
         * @constructor
         * ３次元ベクトル
         * 
         * - [Test Program](http://tmlib-js.googlecode.com/svn/trunk/test/geom/vector-test.html)
         */
        init: function(x, y, z) {
            this.set(x, y, z);
        },
        
        /**
         * @property
         * セット
         */
        set: function(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            
            return this;
        },
        
        /**
         * @property
         * 数値からセット
         */
        setNumber: function(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            
            return this;
        },
        
        /**
         * @property
         * 配列からセット
         */
        setArray: function(arr) {
            this.x = arr[0];
            this.y = arr[1];
            this.z = arr[2];
            
            return this;
        },
        
        /**
         * @property
         * オブジェクトからセット
         */
        setObject: function(obj) {
            this.x = obj.x;
            this.y = obj.y;
            this.z = obj.z;
            
            return this;
        },
        
        /**
         * @property
         * 文字列からセット
         */
        setString: function(str) {
            var m = str.match(/(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?)/);
            this.x = parseFloat(m[1]);
            this.y = parseFloat(m[3]);
            this.z = parseFloat(m[5]);
            
            return this;
        },
        
        /**
         * @property
         * 角度(radian)と長さでベクトルをセット
         */
        setAngle: function(thetaRad, phiRad, len) {
            len = len || 1;
            
            this.x = len * Math.cos(thetaRad) * Math.sin(phiRad);
            this.y = len * Math.sin(thetaRad);
            this.z = len * Math.cos(thetaRad) * Math.cos(phiRad);
            
            return this;
        },
        
        /**
         * @property
         * 角度(radian)と長さでベクトルをセット
         */
        setRadian: function(thetaRad, phiRad, len) {
            return this.setFromAngle(thetaRad, phiRad, len);
        },
        
        /**
         * @property
         * 角度(degree)と長さでベクトルをセット
         */
        setDegree: function(thetaDegree, phiDegree, len) {
            return this.setFromAngle(thetaDegree*Math.PI/180, phiDegree*Math.PI/180, len);
        },
        
        /**
         * @property
         * 賢いセット
         */
        setSmart: function(x, y, z) {
            var v = arguments[0];
            // xyz
            if (arguments.length === 3) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            // Array
            else if (v instanceof Array) {
                this.x = v[0];
                this.y = v[1];
                this.z = v[2];
            }
            // Object
            else if (v instanceof Object) {
                this.x = v.x;
                this.y = v.y;
                this.z = v.z;
            }
            // String
            else if (typeof(v) == "string") {
                var m = v.match(/(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?)/);
                this.x = parseFloat(m[1]);
                this.y = parseFloat(m[3]);
                this.z = parseFloat(m[5]);
            }
            
            return this;
        },
        
        /**
         * @property
         * 加算
         */
        add: function(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            
            return this;
        },
        
        /**
         * @property
         * 減算
         */
        sub: function(v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            
            return this;
        },
        
        /**
         * @property
         * 乗算
         */
        mul: function(n) {
            this.x *= n;
            this.y *= n;
            this.z *= n;
            
            return this;
        },
        
        /**
         * @property
         * 除算
         */
        div: function(n) {
            console.assert(n != 0, "0 division!!");
            this.x /= n;
            this.y /= n;
            this.z /= n;
            
            return this;
        },
        
        /**
         * @property
         * 反転
         */
        negate: function() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            
            return this;
        },
        
        /**
         * @property
         * 長さを取得
         * or magnitude
         */
        length: function() {
            return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        },
        
        /**
         * @property
         * 2乗された長さを取得
         * C# の名前を引用
         * or lengthSquare or lengthSqrt
         */
        lengthSquared: function() {
            return this.x*this.x + this.y*this.y + this.z*this.z;
        },
        
        /**
         * @property
         * 正規化
         */
        normalize: function() {
            var length = this.length();
            this.div(length);
            
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        toVector2: function() {
            // TODO:
        },
        

        /**
         * @property
         * 角度(radian)に変換
         */
        toAngleXY: function() {
            return Math.atan2(this.y, this.x);
        },
        
        
        /**
         * @property
         * 3D化する
         */
        to3D: function() {
            // TODO: 3d化する
        },
        
        /**
         * @property
         * 等しいか
         */
        equals: function(x, y, z) {
            return ( (this.x === x) && (this.y === y) && (this.z === z) );
        },
        // equals: function(obj) {
            // return this.equals(obj.x, obj.y, obj.z);
        // },
        
        /**
         * @property
         * 配列と等しいか
         */
        equalsArray: function(arr) {
            return this.equals(arr[0], arr[1], arr[2]);
        },
        
        /**
         * @property
         * オブジェクトと等しいか
         */
        equalsObject: function(obj) {
            return this.equals(obj.x, obj.y, obj.z);
        },
        
        /**
         * @property
         * 賢い比較
         */
        equalsSmart: function() {
            // TODO: 
        },

        /**
         * @property
         * @TODO ?
         */
        toStyleString: function() {
            return "{x:{x}, y:{y}, z:{z}}".format(this);
        },

        /**
         * @property
         * @TODO ?
         */
        toString: function() {
            return "{x:{x}, y:{y}, z:{z}}".format(this);
        },
        
        
        /**
         * @property
         * X値をセット
         * チェーンメソッド用セッター
         */
        setX: function(x) {
            this.x = x;
            return this;
        },
        
        /**
         * @property
         * Y値をセット
         * チェーンメソッド用セッター
         */
        setY: function(y) {
            this.y = y;
            return this;
        },
        
        /**
         * @property
         * Z値をセット
         * チェーンメソッド用セッター
         */
        setZ: function(z) {
            this.z = z;
            return this;
        }
    });
    
    
    
    /**
     * @method
     * @static
     * min
     */
    tm.geom.Vector3.min = function(lhs, rhs) {
        return Vector3(
            (lhs.x < rhs.x) ? lhs.x : rhs.x,
            (lhs.y < rhs.y) ? lhs.y : rhs.y,
            (lhs.z < rhs.z) ? lhs.z : rhs.z
        );
    };
    
    /**
     * @method
     * @static
     * max
     */
    tm.geom.Vector3.max = function(lhs, rhs) {
        return Vector3(
            (lhs.x > rhs.x) ? lhs.x : rhs.x,
            (lhs.y > rhs.y) ? lhs.y : rhs.y,
            (lhs.z > rhs.z) ? lhs.z : rhs.z
        );
    };
    
    /**
     * @method
     * @static
     * 加算
     */
    tm.geom.Vector3.add = function(lhs, rhs) {
        return tm.geom.Vector3(lhs.x+rhs.x, lhs.y+rhs.y, lhs.z+rhs.z);
    };
    
    /**
     * @method
     * @static
     * 減算
     */
    tm.geom.Vector3.sub = function(lhs, rhs) {
        return tm.geom.Vector3(lhs.x-rhs.x, lhs.y-rhs.y, lhs.z-rhs.z);
    };
    
    /**
     * @method
     * @static
     * 乗算
     */
    tm.geom.Vector3.mul = function(v, n) {
        return tm.geom.Vector3(v.x*n, v.y*n, v.z*n);
    };
    
    /**
     * @method
     * @static
     * 割算
     */
    tm.geom.Vector3.div = function(v, n) {
        return tm.geom.Vector3(v.x/n, v.y/n, v.z/n);
    };
    
    /**
     * @method
     * @static
     * 内積.
     * 投影ベクトルを求めたり, 類似度に使ったり.
     */
    tm.geom.Vector3.dot = function(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    };
    

    /**
     * @method
     * @static
     * 外積
     */
    tm.geom.Vector3.cross = function(lhs, rhs) {
        return tm.geom.Vector3(
            lhs.y*rhs.z - lhs.z*rhs.y,
            lhs.z*rhs.x - lhs.x*rhs.z,
            lhs.x*rhs.y - lhs.y*rhs.x
        );
    };
    
    /**
     * @method
     * @static
     * 反転
     */
    tm.geom.Vector3.negate = function(v) {
        return tm.geom.Vector3(-v.x, -v.y, -v.z);
    };
    
    /**
     * @method
     * @static
     * ２点間の距離を返す
     */
    tm.geom.Vector3.distance = function(lhs, rhs) {
        return Math.sqrt( Math.pow(lhs.x-rhs.x, 2) + Math.pow(lhs.y-rhs.y, 2) + Math.pow(lhs.z-rhs.z, 2) );
    };
    
    /**
     * @method
     * @static
     * ２点間の距離を返す
     */
    tm.geom.Vector3.distanceSquared = function(lhs, rhs) {
        return Math.pow(lhs.x-rhs.x, 2) + Math.pow(lhs.y-rhs.y, 2) + Math.pow(lhs.z-rhs.z, 2);
    };

    /**
     * @method
     * @static
     * マンハッタン距離
     */
    tm.geom.Vector3.manhattanDistance = function(lhs, rhs) {
        return Math.abs(lhs.x-rhs.x) + Math.abs(lhs.y-rhs.y) + Math.abs(lhs.z-rhs.z);
    };
    
    /**
     * @method
     * @static
     * 反射ベクトル
     */
    tm.geom.Vector3.reflect = function(v, normal) {
        var len = Vector3.dot(v, normal);
        var temp= Vector3.mul(normal, 2*len);
        
        return Vector3.sub(v, temp);
    };

    /**
     * @method
     * @static
     * 補間.
     * 0.5 で lhs と rhs の中間ベクトルを求めることができます.
     */
    tm.geom.Vector3.lerp = function(lhs, rhs, t) {
        return tm.geom.Vector3(
            lhs.x + (rhs.x-lhs.x)*t,
            lhs.y + (rhs.y-lhs.y)*t,
            lhs.z + (rhs.z-lhs.z)*t
        );
    };
    
    
    /**
     * @method
     * @static
     * 補間
     */
    tm.geom.Vector3.slerp = function(lhs, rhs, t) {
        // TODO:
        // cos...
    };
    
    /**
     * @method
     * @static
     * min ~ max の間でランダムな方向のベクトルを生成する. len で長さ指定.
     */
    tm.geom.Vector3.random = function(thetaMin, thetaMax, phiMin, phiMax, len) {
        thetaMin= thetaMin || 0;
        thetaMax= thetaMax || 360;
        phiMin  = phiMin || 0;
        phiMax  = phiMax || 360;
        len = len || 1;
        return TM.Geom.Vector3().setFromDegree(TM.randomf(thetaMin, thetaMax), TM.randomf(phiMin, phiMax), len);
    };
    
    
    
    /*
    Vector3.prototype.accessor("length", {
        "get": function()    { return this.length(); },
        "set": function(len) { this.normalize().mul(len); }
    });
    */
    
    
    /**
     * @property
     * @static
     * zero
     */
    tm.geom.Vector3.ZERO    = tm.geom.Vector3( 0, 0, 0);
    
    /**
     * @property
     * @static
     * left
     */
    tm.geom.Vector3.LEFT    = tm.geom.Vector3(-1, 0, 0);
    
    /**
     * @property
     * @static
     * right
     */
    tm.geom.Vector3.RIGHT   = tm.geom.Vector3( 1, 0, 0);
    
    /**
     * @property
     * @static
     * up
     */
    tm.geom.Vector3.UP      = tm.geom.Vector3( 0, 1, 0);
    
    /**
     * @property
     * @static
     * down
     */
    tm.geom.Vector3.DOWN    = tm.geom.Vector3( 0,-1, 0);
    
    /**
     * @property
     * @static
     * forward
     */
    tm.geom.Vector3.FORWARD = tm.geom.Vector3( 0, 0,-1);
    
    /**
     * @property
     * @static
     * backward
     */
    tm.geom.Vector3.BACKWARD= tm.geom.Vector3( 0, 0, 1);
    
})();


/*
 * matrix33.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class   tm.geom.Matrix33
     * 3*3 マトリックスクラス
     */
    tm.define("tm.geom.Matrix33", {
        /**
         * 要素
         */
        m: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.m = [];
            if (arguments.length >= 9) {
                this.set.apply(this, arguments);
            }
            else {
                this.identity();
            }
        },
        
        /**
         * @property
         * クローン
         */
        clone: function() {
            var m = this.m;
            return tm.geom.Matrix33(
                m[0], m[3], m[6],
                m[1], m[4], m[7],
                m[2], m[5], m[8]
            );
        },
        
        /**
         * @property
         * セッター
         */
        set: function(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
            console.assert(arguments.length>=9, "");
            
            // |m00, m01, m02|
            // |m10, m11, m12|
            // |m20, m21, m22|
            
            // |m[0], m[3], m[6]|
            // |m[1], m[4], m[7]|
            // |m[2], m[5], m[8]|
            
            // |a, b, tx|
            // |c, d, ty|
            // |0, 0,  1|
            
            this.m00 = m00; this.m01 = m01; this.m02 = m02;
            this.m10 = m10; this.m11 = m11; this.m12 = m12;
            this.m20 = m20; this.m21 = m21; this.m22 = m22;
            
            return this;
        },
        
        /**
         * @property
         * 配列からセット
         */
        setArray: function(arr) {
            this.set(
                arr[0], arr[3], arr[6],
                arr[1], arr[4], arr[7],
                arr[2], arr[5], arr[8]
            );
            
            return this;
        },
        
        /**
         * @property
         * オブジェクトからセット
         */
        setObject: function(obj) {
            this.set(
                obj.m00, obj.m01, obj.m02,
                obj.m10, obj.m11, obj.m12,
                obj.m20, obj.m21, obj.m22
            );
            
            return this;
        },
        
        /**
         * @property
         * 単位行列
         */
        identity: function() {
            var m = this.m;
            
            m[0] = 1; m[3] = 0; m[6] = 0;
            m[1] = 0; m[4] = 1; m[7] = 0;
            m[2] = 0; m[5] = 0; m[8] = 1;
            
            return this;
        },
        
        /**
         * @property
         * 転置
         */
        transpose: function() {
            this.m.swap(1, 3);
            this.m.swap(2, 6);
            this.m.swap(5, 7);
            
            return this;
        },
        
        /**
         * @property
         * 逆行列
         */
        invert: function() {
            var m = this.m;
            var m00 = m[0], m01 = m[3], m02 = m[6];
            var m10 = m[1], m11 = m[4], m12 = m[7];
            var m20 = m[2], m21 = m[5], m22 = m[8];
            var det = this.determinant();
            
            // |m00, m01, m02|
            // |m10, m11, m12|
            // |m20, m21, m22|
            
            this.m00 = (m11*m22-m12*m21)/det;
            this.m01 = (m10*m22-m12*m20)/det*-1;
            this.m02 = (m10*m21-m11*m20)/det;
            
            this.m10 = (m01*m22-m02*m21)/det*-1;
            this.m11 = (m00*m22-m02*m20)/det;
            this.m12 = (m00*m21-m01*m20)/det*-1;
            
            this.m20 = (m01*m12-m02*m11)/det;
            this.m21 = (m00*m12-m02*m10)/det*-1;
            this.m22 = (m00*m11-m01*m10)/det;
            
            this.transpose();
            
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        determinant: function() {
            var m = this.m;
            
            var m00 = m[0], m01 = m[3], m02 = m[6];
            var m10 = m[1], m11 = m[4], m12 = m[7];
            var m20 = m[2], m21 = m[5], m22 = m[8];
            
            return m00*m11*m22 + m10*m21*m02 + m01*m12*m20 - m02*m11*m20 - m01*m10*m22 - m12*m21*m00;
        },
        
        /**
         * @property
         * ゼロクリア
         */
        zero: function() {
            this.set(
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            );
            
            return this;
        },
        
        /**
         * @property
         * 移動
         */
        translate: function(x, y) {
            var m = this.m;
            
            m[6] = m[0] * x + m[3] * y + m[6];
            m[7] = m[1] * x + m[4] * y + m[7];
            m[8] = m[2] * x + m[5] * y + m[8];
            
            return this;
            
            return this.multiply( tm.geom.Matrix33.translate(x, y) );
        },
        
        /**
         * @property
         * X軸回転
         */
        rotateX: function(rad) {
            return this.multiply( tm.geom.Matrix33.rotateX(rad) );
        },
        
        /**
         * @property
         * Y軸回転
         */
        rotateY: function(rad) {
            return this.multiply( tm.geom.Matrix33.rotateY(rad) );
        },
        
        /**
         * @property
         * Z軸回転
         */
        rotateZ: function(rad) {
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            var m = this.m;
            
            var m00 = m[0];
            var m10 = m[1];
            var m20 = m[2];
            var m01 = m[3];
            var m11 = m[4];
            var m21 = m[5];
            
            
            return this.multiply( tm.geom.Matrix33.rotateZ(rad) );
        },
        
        /**
         * @property
         * スケーリング
         */
        scale: function(x, y) {
            var m = this.m;
            
            m[0] *= x; m[3] *= y;
            m[1] *= x; m[4] *= y;
            m[2] *= x; m[5] *= y;
            
            return this;
            return this.multiply( tm.geom.Matrix33.scale(x, y) );
        },
        
        /**
         * @property
         * 掛け算
         */
        multiply: function(mat) {
            var tm = this.m;
            var om = mat.m;
            
            var a00 = tm[0], a01 = tm[3], a02 = tm[6];
            var a10 = tm[1], a11 = tm[4], a12 = tm[7];
            var a20 = tm[2], a21 = tm[5], a22 = tm[8];
            var b00 = om[0], b01 = om[3], b02 = om[6];
            var b10 = om[1], b11 = om[4], b12 = om[7];
            var b20 = om[2], b21 = om[5], b22 = om[8];
            
            
            tm[0] = a00*b00 + a01*b10 + a02*b20;
            tm[3] = a00*b01 + a01*b11 + a02*b21;
            tm[6] = a00*b02 + a01*b12 + a02*b22;
            
            tm[1] = a10*b00 + a11*b10 + a12*b20;
            tm[4] = a10*b01 + a11*b11 + a12*b21;
            tm[7] = a10*b02 + a11*b12 + a12*b22;
            
            tm[2] = a20*b00 + a21*b10 + a22*b20;
            tm[5] = a20*b01 + a21*b11 + a22*b21;
            tm[8] = a20*b02 + a21*b12 + a22*b22;
            
            return this;
        },
        
        /**
         * @property
         * ベクトルとの掛け算
         */
        multiplyVector2: function(v) {
            var vx = this.m00*v.x + this.m01*v.y + this.m02;
            var vy = this.m10*v.x + this.m11*v.y + this.m12;
            
            return tm.geom.Vector2(vx, vy);
        },
        
        /**
         * @property
         * ベクトルとの掛け算
         */
        multiplyVector3: function(v) {
            var vx = this.m00*v.x + this.m01*v.y + this.m02*v.z;
            var vy = this.m10*v.x + this.m11*v.y + this.m12*v.z;
            var vz = this.m20*v.x + this.m21*v.y + this.m22*v.z;
            
            return tm.geom.Vector3(vx, vy, vz);
        },
        
        /**
         * @property
         * 配列に変換
         */
        toArray: function() {
            return this.m.slice();
        },
        
        /**
         * @property
         * 文字列化
         */
        toString: function() {
            return "|{m00}, {m01}, {m02}|\n|{m10}, {m11}, {m12}|\n|{m20}, {m21}, {m22}|".format(this);
        },
        
    });
    
    
    
    /**
     * @property    m00
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m00", {
        "get": function()   { return this.m[0]; },
        "set": function(v)  { this.m[0] = v;    }
    });
    /**
     * @property    m10
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m10", {
        "get": function()   { return this.m[1]; },
        "set": function(v)  { this.m[1] = v;    }
    });
    /**
     * @property    m20
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m20", {
        "get": function()   { return this.m[2]; },
        "set": function(v)  { this.m[2] = v;    }
    });
    
    /**
     * @property    m01
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m01", {
        "get": function()   { return this.m[3]; },
        "set": function(v)  { this.m[3] = v;    }
    });
    /**
     * @property    m11
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m11", {
        "get": function()   { return this.m[4]; },
        "set": function(v)  { this.m[4] = v;    }
    });
    /**
     * @property    m21
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m21", {
        "get": function()   { return this.m[5]; },
        "set": function(v)  { this.m[5] = v;    }
    });
    
    /**
     * @property    m02
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m02", {
        "get": function()   { return this.m[6]; },
        "set": function(v)  { this.m[6] = v;    }
    });
    /**
     * @property    m12
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m12", {
        "get": function()   { return this.m[7]; },
        "set": function(v)  { this.m[7] = v;    }
    });
    /**
     * @property    m22
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m22", {
        "get": function()   { return this.m[8]; },
        "set": function(v)  { this.m[8] = v;    }
    });

    /**
     * @property    a
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("a", {
        "get": function()   { return this.m[0]; },
        "set": function(v)  { this.m[0] = v;    }
    });
    /**
     * @property    b
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("b", {
        "get": function()   { return this.m[3]; },
        "set": function(v)  { this.m[3] = v;    }
    });
    /**
     * @property    c
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("c", {
        "get": function()   { return this.m[1]; },
        "set": function(v)  { this.m[1] = v;    }
    });
    /**
     * @property    d
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("d", {
        "get": function()   { return this.m[4]; },
        "set": function(v)  { this.m[4] = v;    }
    });
    /**
     * @property    tx
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("tx", {
        "get": function()   { return this.m[6]; },
        "set": function(v)  { this.m[6] = v;    }
    });
    /**
     * @property    ty
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("ty", {
        "get": function()   { return this.m[7]; },
        "set": function(v)  { this.m[7] = v;    }
    });
    

    /**
     * @static
     * @method
     * 移動
     */
    tm.geom.Matrix33.translate = function(x, y) {
        return tm.geom.Matrix33(
            1, 0, x,
            0, 1, y,
            0, 0, 1
        );
    };
    
    /**
     * @static
     * @method
     * X軸回転
     */
    tm.geom.Matrix33.rotateX = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix33(
            1, 0, 0,
            0, c,-s,
            0, s, c
        );
    };
    
    /**
     * @static
     * @method
     * Y軸回転
     */
    tm.geom.Matrix33.rotateY = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix33(
             c, 0, s,
             0, 1, 0,
            -s, 0, c
        );
    };
    
    /**
     * @static
     * @method
     * Z軸回転
     */
    tm.geom.Matrix33.rotateZ = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix33(
            c,-s, 0,
            s, c, 0,
            0, 0, 1
        );
    };
    
    /**
     * @static
     * @method
     * スケーリング
     */
    tm.geom.Matrix33.scale = function(x, y) {
        var mat = tm.geom.Matrix33();
        
        if (y == undefined) y = x;
        
        mat.set(
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        );
        
        return mat;
    };
    
})();










/*
 * matrix44.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class
     * 4*4 マトリックスクラス
     */
    tm.geom.Matrix44 = tm.createClass({
        /**
         * 要素
         */
        m: null,
        

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.m = [];
            if (arguments.length >= 16) {
                this.set.apply(this, arguments);
            }
            else {
                this.identity();
            }
        },
        
        /**
         * @property
         * セット
         */
        set: function(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
            console.assert(arguments.length>=16, "");
            
            // |m00, m01, m02, m03|
            // |m10, m11, m12, m13|
            // |m20, m21, m22, m23|
            // |m30, m31, m32, m33|
            
            this.m00 = m00; this.m01 = m01; this.m02 = m02; this.m03 = m03;
            this.m10 = m10; this.m11 = m11; this.m12 = m12; this.m13 = m13;
            this.m20 = m20; this.m21 = m21; this.m22 = m22; this.m23 = m23;
            this.m30 = m30; this.m31 = m31; this.m32 = m32; this.m33 = m33;
            
            return this;
        },
        
        /**
         * @property
         * 配列からセット
         */
        setArray: function(arr) {
            this.set(
                arr[0], arr[4],  arr[8], arr[12],
                arr[1], arr[5],  arr[9], arr[13],
                arr[2], arr[6], arr[10], arr[14],
                arr[3], arr[7], arr[11], arr[15]
            );
            
            return this;
        },
        
        /**
         * @property
         * オブジェクトからセット.
         * Matrix44 もこいつでいける!!
         */
        setObject: function(obj) {
            this.set(
                obj.m00, obj.m01, obj.m02, obj.m03,
                obj.m10, obj.m11, obj.m12, obj.m13,
                obj.m20, obj.m21, obj.m22, obj.m23,
                obj.m30, obj.m31, obj.m32, obj.m33
            );
            
            return this;
        },
        
        
        /**
         * @property
         * 単位行列
         */
        identity: function() {
            this.set(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            return this;
        },
        
        /**
         * @property
         * 転置
         */
        transpose: function() {
            this.m.swap(1, 4);
            this.m.swap(2, 8);
            this.m.swap(3, 12);
            this.m.swap(6, 9);
            this.m.swap(7, 13);
            this.m.swap(11, 14);
            
            return this;
        },
        
        /**
         * @property
         * 移動
         */
        translate: function(x, y, z) {
            return this.multiply( tm.geom.Matrix44.translate(x, y, z) );
        },
        
        /**
         * @property
         * 回転
         */
        rotate: function(angle) {
            // TODO: いつか実装する
            console.error("Unimplemented");
        },
        
        /**
         * @property
         * X軸を基軸に回転する
         */
        rotateX: function(rad) {
            return this.multiply( tm.geom.Matrix44.rotateX(rad) );
        },
        
        /**
         * @property
         * Y軸を基軸に回転する
         */
        rotateY: function(rad) {
            return this.multiply( tm.geom.Matrix44.rotateY(rad) );
        },
        
        /**
         * @property
         * Z軸を基軸に回転する
         */
        rotateZ: function(rad) {
            return this.multiply( tm.geom.Matrix44.rotateZ(rad) );
        },
        
        /**
         * @property
         * スケーリング
         */
        scale: function(x, y, z) {
            return this.multiply( tm.geom.Matrix44.scale(x, y, z) );
        },
        
        /**
         * @property
         * ゼロ
         */
        zero: function() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            return this;
        },
        
        /**
         * @property
         * 乗算
         * this * mat
         */
        multiply: function(mat) {
            var m00 = this.m00*mat.m00 + this.m01*mat.m10 + this.m02*mat.m20 + this.m03*mat.m30;
            var m01 = this.m00*mat.m01 + this.m01*mat.m11 + this.m02*mat.m21 + this.m03*mat.m31;
            var m02 = this.m00*mat.m02 + this.m01*mat.m12 + this.m02*mat.m22 + this.m03*mat.m32;
            var m03 = this.m00*mat.m03 + this.m01*mat.m13 + this.m02*mat.m23 + this.m03*mat.m33;
            
            var m10 = this.m10*mat.m00 + this.m11*mat.m10 + this.m12*mat.m20 + this.m13*mat.m30;
            var m11 = this.m10*mat.m01 + this.m11*mat.m11 + this.m12*mat.m21 + this.m13*mat.m31;
            var m12 = this.m10*mat.m02 + this.m11*mat.m12 + this.m12*mat.m22 + this.m13*mat.m32;
            var m13 = this.m10*mat.m03 + this.m11*mat.m13 + this.m12*mat.m23 + this.m13*mat.m33;
            
            var m20 = this.m20*mat.m00 + this.m21*mat.m10 + this.m22*mat.m20 + this.m23*mat.m30;
            var m21 = this.m20*mat.m01 + this.m21*mat.m11 + this.m22*mat.m21 + this.m23*mat.m31;
            var m22 = this.m20*mat.m02 + this.m21*mat.m12 + this.m22*mat.m22 + this.m23*mat.m32;
            var m23 = this.m20*mat.m03 + this.m21*mat.m13 + this.m22*mat.m23 + this.m23*mat.m33;
            
            var m30 = this.m30*mat.m00 + this.m31*mat.m10 + this.m32*mat.m20 + this.m33*mat.m30;
            var m31 = this.m30*mat.m01 + this.m31*mat.m11 + this.m32*mat.m21 + this.m33*mat.m31;
            var m32 = this.m30*mat.m02 + this.m31*mat.m12 + this.m32*mat.m22 + this.m33*mat.m32;
            var m33 = this.m30*mat.m03 + this.m31*mat.m13 + this.m32*mat.m23 + this.m33*mat.m33;
            
            return this.set(
                m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                m30, m31, m32, m33
            );
        },
        
        /*
        getAxisX: function() { return TM.Geom.Vector3(this.m00, this.m10, this.m20); },
        getAxisY: function() { return TM.Geom.Vector3(this.m01, this.m11, this.m21); },
        getAxisZ: function() { return TM.Geom.Vector3(this.m02, this.m12, this.m22); },
        */
        
        /**
         * @property
         * @TODO ?
         */
        getAxisX: function() { return TM.Geom.Vector3(this.m00, this.m01, this.m02); },
        /**
         * @property
         * @TODO ?
         */
        getAxisY: function() { return TM.Geom.Vector3(this.m10, this.m11, this.m12); },
        /**
         * @property
         * @TODO ?
         */
        getAxisZ: function() { return TM.Geom.Vector3(this.m20, this.m21, this.m22); },

        /**
         * @property
         * @TODO ?
         */
        setAxisX: function(v) { this.m00=v.x, this.m01=v.y, this.m02=v.z; },
        /**
         * @property
         * @TODO ?
         */
        setAxisY: function(v) { this.m10=v.x, this.m11=v.y, this.m12=v.z; },
        /**
         * @property
         * @TODO ?
         */
        setAxisZ: function(v) { this.m20=v.x, this.m21=v.y, this.m22=v.z; },
        
        /**
         * @property
         * Matrix33 に変換
         */
        toMatrix33: function() {
            // TODO:
        },
        
        /**
         * @property
         * 配列に変換
         */
        toArray: function() {
            return this.m.slice();
        },
        
        /**
         * @property
         * 文字列化
         */
        toString: function() {
            return "|{m00}, {m01}, {m02}, {m03}|\n|{m10}, {m11}, {m12}, {m13}|\n|{m20}, {m21}, {m22}, {m23}|\n|{m30}, {m31}, {m32}, {m33}|".format(this);
        }
        
    });
    
    
    /**
     * @property    m00
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m00", {
        "get": function()   { return this.m[0]; },
        "set": function(v)  { this.m[0] = v;    }
    });
    /**
     * @property    m01
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m10", {
        "get": function()   { return this.m[1]; },
        "set": function(v)  { this.m[1] = v;    }
    });
    /**
     * @property    m02
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m20", {
        "get": function()   { return this.m[2]; },
        "set": function(v)  { this.m[2] = v;    }
    });
    /**
     * @property    m03
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m30", {
        "get": function()   { return this.m[3]; },
        "set": function(v)  { this.m[3] = v;    }
    });
    
    /**
     * @property    m10
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m01", {
        "get": function()   { return this.m[4]; },
        "set": function(v)  { this.m[4] = v;    }
    });
    /**
     * @property    m11
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m11", {
        "get": function()   { return this.m[5]; },
        "set": function(v)  { this.m[5] = v;    }
    });
    /**
     * @property    m12
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m21", {
        "get": function()   { return this.m[6]; },
        "set": function(v)  { this.m[6] = v;    }
    });
    /**
     * @property    m13
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m31", {
        "get": function()   { return this.m[7]; },
        "set": function(v)  { this.m[7] = v;    }
    });
    
    /**
     * @property    m20
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m02", {
        "get": function()   { return this.m[8]; },
        "set": function(v)  { this.m[8] = v;    }
    });
    /**
     * @property    m21
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m12", {
        "get": function()   { return this.m[9]; },
        "set": function(v)  { this.m[9] = v;    }
    });
    /**
     * @property    m22
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m22", {
        "get": function()   { return this.m[10]; },
        "set": function(v)  { this.m[10] = v;    }
    });
    /**
     * @property    m23
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m32", {
        "get": function()   { return this.m[11]; },
        "set": function(v)  { this.m[11] = v;    }
    });
        
    /**
     * @property    m30
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m03", {
        "get": function()   { return this.m[12]; },
        "set": function(v)  { this.m[12] = v;    }
    });
    /**
     * @property    m31
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m13", {
        "get": function()   { return this.m[13]; },
        "set": function(v)  { this.m[13] = v;    }
    });
    /**
     * @property    m32
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m23", {
        "get": function()   { return this.m[14]; },
        "set": function(v)  { this.m[14] = v;    }
    });
    /**
     * @property    m33
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m33", {
        "get": function()   { return this.m[15]; },
        "set": function(v)  { this.m[15] = v;    }
    });
    
    
    
    

    /**
     * @static
     * @method
     * 移動
     */
    tm.geom.Matrix44.translate = function(x, y, z) {
        return tm.geom.Matrix44(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        );
    };
    
    /**
     * @static
     * @method
     * X軸回転
     */
    tm.geom.Matrix44.rotateX = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix44(
            1, 0, 0, 0,
            0, c,-s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        );
    };
    
    /**
     * @static
     * @method
     * Y軸回転
     */
    tm.geom.Matrix44.rotateY = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix44(
             c, 0, s, 0,
             0, 1, 0, 0,
            -s, 0, c, 0,
             0, 0, 0, 1
        );
    };
    
    /**
     * @static
     * @method
     * Z軸回転
     */
    tm.geom.Matrix44.rotateZ = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix44(
            c,-s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    };
    
    /**
     * @static
     * @method
     * スケーリング
     */
    tm.geom.Matrix44.scale = function(x, y, z) {
        var mat = tm.geom.Matrix44();
        
        if (y == undefined) y = x;
        if (z == undefined) z = x;
        
        mat.set(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        );
        
        return mat;
    };

    /**
     * @static
     * @method
     * perspective
     */
    tm.geom.Matrix44.perspective = function(fovy, aspect, znear, zfar) {
        var yscale = 1.0 / Math.tan(0.5*fovy*Math.PI/180);
        var xscale = yscale / aspect;

        return tm.geom.Matrix44(
            xscale, 0.0, 0.0, 0.0,
            0.0, yscale, 0.0, 0.0,
            0.0, 0.0, zfar/(zfar-znear), znear*zfar/(znear-zfar),
            0.0, 0.0, 1.0, 0.0
        );
    };
    
    /**
     * @static
     * @method
     * ortho
     */
    tm.geom.Matrix44.ortho = function(left, right, bottom, top, near, far) {
        /*
        var lr = 1 / (left - right),
            bt = 1 / (bottom - top),
            nf = 1 / (near - far);
        
        return tm.geom.Matrix44(
            -2*lr, 0, 0, 0,
            0, -2*bt, 0, 0,
            0, 0, 2*nf, 0,
            (left+right)*lr, (top+bottom)*bt, (far+near)*nf, 1
        );
        */
        
        var rl = (right - left),
            tb = (top - bottom),
            fn = (far - near);
        return tm.geom.Matrix44(
            2.0/rl,      0,     0, 0,
               0.0, 2.0/tb,     0, 0,
                 0,      0, -2.0/fn, 0,
            -(left+right)/rl, -(top+bottom)/tb, -(far+near)/fn, 1
        ).transpose();
    };

    
    /**
     * @static
     * @method
     * lookAt
     */
    tm.geom.Matrix44.lookAt = function(eye, target, up) {
        var axis_z = tm.geom.Vector3.sub(eye, target).normalize();
        var axis_x = tm.geom.Vector3.cross(up, axis_z).normalize();
        var axis_y = tm.geom.Vector3.cross(axis_z, axis_x).normalize();
        
        /*
        return tm.geom.Matrix44(
            axis_x.x, axis_x.y, axis_x.z, -tm.geom.Vector3.dot(eye, axis_x),
            axis_y.x, axis_y.y, axis_y.z, -tm.geom.Vector3.dot(eye, axis_y),
            axis_z.x, axis_z.y, axis_z.z, -tm.geom.Vector3.dot(eye, axis_z),
            0, 0, 0, 1
        );
        */
        
        /*
        return tm.geom.Matrix44(
            axis_x.x, axis_y.x, axis_z.x, 0,
            axis_x.y, axis_y.y, axis_z.y, 0,
            axis_x.z, axis_y.z, axis_z.z, 0,
            -tm.geom.Vector3.dot(eye, axis_x), -tm.geom.Vector3.dot(eye, axis_y), -tm.geom.Vector3.dot(eye, axis_z), 1
        );
        */
        
        var orientation = tm.geom.Matrix44(
            axis_x.x, axis_y.x, axis_z.x, 0,
            axis_x.y, axis_y.y, axis_z.y, 0,
            axis_x.z, axis_y.z, axis_z.z, 0,
            0, 0, 0, 1
        );
        var translation = tm.geom.Matrix44(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -eye.x, -eye.y, -eye.z, 1
        );

        return translation.multiply(orientation);
    };
    
})();


























/*
 * rect.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class tm.geom.Rect
     * 四角形クラス
     */
    tm.geom.Rect = tm.createClass({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(x, y, width, height) {
            this.set(x, y, width, height);
        },
        
        /**
         * @property
         * セッター
         */
        set: function(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            
            return this;
        },
        

        /**
         * @property
         * 移動
         */
        move: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        
        /**
         * @property
         * 現在位置を基準に移動
         */
        moveBy: function(x, y) {
            this.x += x;
            this.y += y;
            return this;
        },
        
        /**
         * @property
         * リサイズ
         */
        resize: function(w, h) {
            this.width = w;
            this.height= h;
            return this;
        },
        
        /**
         * @property
         * 現在のサイズを基準にリサイズ
         */
        resizeBy: function(w, h) {
            this.width += w;
            this.height+= h;
            return this;
        },
        
        /**
         * @property
         * パディング.
         * 縮めたりなど. 画面ハミ出しチェック時などに便利
         * ## example
         *     var circle = TM.$Circle(10, 10, 10);
         *     var windowRect = TM.$Rect(0, 0, window.innerWidth, window.innerHiehgt);
         *     windowRect.padding(circle.radius);
         *     if (circle.x < windowRect.left) {
         *         // 左にはみ出した時の処理
         *     }
         */
        padding: function(top, right, bottom, left) {
            // css の padding に合わせて時計回りにパラメータ調整
            switch (arguments.length) {
                case 1:
                    top = right = bottom = left = arguments[0];
                    break;
                case 2:
                    top     = bottom= arguments[0];
                    right   = left  = arguments[1];
                    break;
                case 3:
                    top     = arguments[0];
                    right   = left = arguments[1];
                    bottom  = arguments[2];
                    break;
            }
            
            this.x += left;
            this.y += top;
            this.width -= left+right;
            this.height-= top +bottom;
            
            return this;
        },

        /**
         * @property
         * クローン
         */
        clone: function() {
            
        },
        
        /**
         * @property
         * @TODO ?
         */
        toCircle: function() {
            return tm.geom.Circle(
                this.centerX,
                this.centerY,
                (this.width < this.height) ? this.width : this.height
                );
        },

        /**
         * @property
         * @TODO ?
         */
        toArray: function() {
            return [this.x, this.y, this.width, this.height];
        },
        
    });
    
    
    /**
     * @property    left
     * left
     */
    tm.geom.Rect.prototype.accessor("left", {
        "get": function()   { return this.x; },
        "set": function(v)  { this.width -= v-this.x; this.x = v; }
    });
    
    /**
     * @property    top
     * top
     */
    tm.geom.Rect.prototype.accessor("top", {
        "get": function()   { return this.y; },
        "set": function(v)  { this.height -= v-this.y; this.y = v; }
    });
    
    /**
     * @property    right
     * right
     */
    tm.geom.Rect.prototype.accessor("right", {
        "get": function()   { return this.x + this.width; },
        "set": function(v)  { this.width += v-this.right; }
    });
    
    /**
     * @property    bottom
     * bottom
     */
    tm.geom.Rect.prototype.accessor("bottom", {
        "get": function()   { return this.y + this.height; },
        "set": function(v)  { this.height += v-this.bottom; }
    });
    
    /**
     * @property    centerX
     * centerX
     */
    tm.geom.Rect.prototype.accessor("centerX", {
        "get": function()   { return this.x + this.width/2; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
    
    /**
     * @property    centerY
     * centerY
     */
    tm.geom.Rect.prototype.accessor("centerY", {
        "get": function()   { return this.y + this.height/2; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
    
})();


/*
 * circle.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class tm.geom.Circle
     * 円クラス
     */
    tm.define("tm.geom.Circle", {
        x: 0,
        y: 0,
        radius: 0,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(x, y, radius) {
            this.set(x, y, radius);
        },
        
        /**
         * @property
         * セッター
         */
        set: function(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            
            return this;
        },
        
        /**
         * @property
         * 移動
         */
        move: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        
        /**
         * @property
         * 現在位置を基準に移動
         */
        moveBy: function(x, y) {
            this.x += x;
            this.y += y;
            return this;
        },
        
        /**
         * @property
         * リサイズ
         */
        resize: function(size) {
            this.radius = size;
            return this;
        },
        
        /**
         * @property
         * 現在のサイズを基準にリサイズ
         */
        resizeBy: function(size) {
            this.radius += size;
            return this;
        },

        /**
         * @property
         * クローン作成
         */
        clone: function() {
            // TODO
        },
        
        /**
         * @property
         * 四角形に変換
         */
        toRectangle: function() {
            return tm.geom.Rectangle(this.x, this.y, this.radius*2, this.radius*2);
        },
        
        /**
         * @property
         * 配列に変換
         */
        toArray: function() {
            return [this.x, this.y, this.radius];
        }
    });
    
    /**
     * @property    left
     * left
     */
    tm.geom.Circle.prototype.getter("left", function() {
        return this.x - this.radius;
    });
    
    /**
     * @property    top
     * top
     */
    tm.geom.Circle.prototype.getter("top", function() {
        return this.y - this.radius;
    });
    
    /**
     * @property    right
     * right
     */
    tm.geom.Circle.prototype.getter("right", function() {
        return this.x + this.radius;
    });
    
    /**
     * @property    bottom
     * bottom
     */
    tm.geom.Circle.prototype.getter("bottom", function() {
        return this.y + this.radius;
    });
    
})();


/*
 * collision.js
 */

tm.collision = tm.collision || {};
 
(function() {

    /**
     * @class tm.collision
     * 衝突判定
     */
    tm.collision;
    
    /**
     * @method testCircleCircle
     * 円同士の衝突判定
     */
    tm.collision.testCircleCircle = function(circle0, circle1) {
        var distanceSquared = tm.geom.Vector2.distanceSquared(circle0, circle1);
        return distanceSquared <= Math.pow(circle0.radius + circle1.radius, 2);
    }
    
    /**
     * @method testRectRect
     * 矩形同士の衝突判定
     */
    tm.collision.testRectRect = function(rect0, rect1) {
        return (rect0.left < rect1.right) && (rect0.right > rect1.left) &&
               (rect0.top < rect1.bottom) && (rect0.bottom > rect1.top);
    }
 
})();
/*
 * element.js
 */


tm.dom = tm.dom || {};

(function() {
    
    /**
     * @class
     * Element クラス
     */
    tm.dom.Element = tm.createClass({
        
        /**
         * @property
         * エレメント
         */
        element: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.set.apply(this, arguments);
        },
        
        /**
         * @property
         * セッター
         */
        set: function(q) {
            if (typeof q === "string") {
                this.element = document.querySelector(q);
            }
            else if (q != undefined) {
                this.element = q;
            }
            else {
                // デフォルトはドキュメント
                this.element = document;
            }
        },
        

        /**
         * @property
         * 子供の最後尾に追加
         */
        append: function(child) {
            this.element.appendChild(child.element);
            return this;
        },
        
        /**
         * @property
         * 子供の先頭に追加
         */
        prepend: function(child) {
            this.element.insertBefore(child.element, this.element.firstChild);
            return this;
        },
        
        /**
         * @property
         * 自分の後に追加
         */
        after: function(child) {
            this.element.parentNode.insertBefore(child.element, this.element.nextSibling);
            return this;
        },
        
        /**
         * @property
         * 自分の前に追加
         */
        before: function(child) {
            this.element.parentNode.insertBefore(child.element, this.element);
            return this;
        },
        
        /**
         * @property
         * 引数に渡された要素に自分を append
         */
        appendTo: function(parent) {
            parent.append(this);
            return this;
        },
        
        /**
         * @property
         * 引数に渡された要素に自分を prepend
         */
        prependTo: function(parent) {
            parent.prepend(this);
            return this;
        },
        
        /**
         * @property
         * 複製
         */
        clone: function() {
            return tm.dom.Element(this.element.cloneNode(true));
        },
        
        /**
         * @property
         * 親から自分を引っぺがす
         */
        remove: function() {
            this.element.parentNode.removeChild(this.element);
            return this;
        },
        
        /**
         * @property
         * 要素生成
         */
        create: function(tag, addFuncName) {
            // 要素を生成
            var element = tm.dom.Element(document.createElement(tag));
            // デフォルトの追加方法は append
            if (!addFuncName) { addFuncName="append"; }
            // 自分の子供として追加
            this[addFuncName](element);
            
            return element;
        },
        
        /**
         * @property
         * query
         */
        query: function(query, index) {
            var elm = (index) ?
                this.element.querySelectorAll(query)[index] : 
                this.element.querySelector(query);
            
            return tm.dom.Element(elm);
        },
        
        /**
         * @property
         * queryAll
         */
        queryAll: function(query) {
            var list = this.element.querySelectorAll(query);
            return tm.dom.ElementList(list);
        },
        
        /**
         * @property
         * 固定化
         */
        fixed: function(x, y, width, height) {
            this.style.set("position", "fixed");
            if (x) this.x = x;
            if (y) this.y = y;
            if (width) this.width = width;
            if (height) this.height = height;
            return this;
        },
        
        /**
         * @property
         * absolute 化
         */
        absolute: function(x, y, width, height) {
            this.style.set("position", "absolute");
            if (x) this.x = x;
            if (y) this.y = y;
            if (width) this.width = width;
            if (height) this.height = height;
            return this;
        },
        
        /**
         * @property
         * フルスクリーン化
         */
        fullScreen: function() {
            this.element.webkitRequestFullScreen();
        },

        /**
         * @property
         * @TODO ?
         */
        show: function() {
            this.visible = true;
        },

        /**
         * @property
         * @TODO ?
         */
        hide: function() {
            this.visible = false;
        },
        
        /**
         * @property
         * @TODO ?
         */
        toString: function() {
            return "tm.dom.element";
        },
        
        /**
         * @property
         * @TODO ?
         */
        getElement: function() {
            return this.element;
        },
        
    });
    
    
    
    /**
     * @property    html
     * html の値
     */
    tm.dom.Element.prototype.accessor("html", {
        "get": function()       { return this.element.innerHTML; },
        "set": function(html)   { this.element.innerHTML = html; }
    });
    
    
    /**
     * @property    value
     * value の値
     */
    tm.dom.Element.prototype.accessor("value", {
        "get": function()       { return this.element.value; },
        "set": function(value)   { this.element.value = value; }
    });
    
    
    /**
     * @property    x
     * x値
     */
    tm.dom.Element.prototype.accessor("x", {
        "get": function()   { return Number( this.element.style.left.replace("px", '') ); },
        "set": function(x)  { this.element.style.left = x+"px"; }
    });
    
    /**
     * @property    y
     * y値
     */
    tm.dom.Element.prototype.accessor("y", {
        "get": function()   { return Number( this.element.style.top.replace("px", '') ); },
        "set": function(y)  { this.element.style.top = y+"px"; }
    });
    
    
    /**
     * @property    width
     * 幅
     */
    tm.dom.Element.prototype.accessor("width", {
        "get": function()   { return Number( this.element.style.width.replace("px", '') ); },
        "set": function(w)  { this.element.style.width = w+"px"; }
    });
    
    
    /**
     * @property    height
     * 高さ
     */
    tm.dom.Element.prototype.accessor("height", {
        "get": function()   { return Number( this.element.style.height.replace("px", '') ); },
        "set": function(h)  { this.element.style.height = h+"px"; }
    });
    
    
    /**
     * @property    color
     * 色
     */
    tm.dom.Element.prototype.accessor("color", {
        "get": function()       { return this.element.style.color; },
        "set": function(color)  { this.element.style.color = color; }
    });
    
    
    /**
     * @property    backgroundColor
     * 背景色
     */
    tm.dom.Element.prototype.accessor("backgroundColor", {
        "get": function()       { return this.element.style.backgroundColor; },
        "set": function(color)  { this.element.style.backgroundColor = color; }
    });
    
    /**
     * @property    visible
     * 表示/非表示
     */
    tm.dom.Element.prototype.accessor("visible", {
        "get": function()   { return this.element.style.visibility != "hidden"; },
        "set": function(v)  { this.element.style.visibility = (v==true) ? "visible" : "hidden"; }
    });
    
    /**
     * @property    text
     * テキスト
     */
    tm.dom.Element.prototype.accessor("text", {
        "get": function()   { return this.element.innerText || this.element.textContent; },
        "set": function(v)  {
            if (this.element.innerText) {
                this.element.innerText = v;
            } else {
                this.element.textContent = v;
            }
        }
    });
    
    
    /**
     * @property    classList
     * クラスリスト
     */
    tm.dom.Element.prototype.getter("classList", function()   { return this.element.classList; });
    
    tm.dom.Element.prototype.getter("parent", function(){
        return (this.element.parentNode != undefined) ? tm.dom.Element(this.element.parentNode) : null;
    });
    tm.dom.Element.prototype.getter("prev", function(){
        return (this.element.previousSibling != undefined) ? tm.dom.Element(this.element.previousSibling) : null;
    });
    tm.dom.Element.prototype.getter("next", function(){
        return (this.element.nextSibling != undefined) ? tm.dom.Element(this.element.nextSibling) : null;
    });
    tm.dom.Element.prototype.getter("children", function(){
        return tm.dom.ElementList(this.element.children);
    });
    
    
})();





(function(){
    
    /**
     * @class
     * エレメントリスト
     */
    tm.dom.ElementList = tm.createClass({
        superClass: Array,
        
        /**
         * @constructor
         * コンストラクタ
         * TM.DOM.Element 用配列
         */
        init: function(arr) {
            if (typeof arguments[0] == "string") {
                var query = arguments[0];
                arr = document.querySelectorAll(query);
            }
            else if (arr == undefined) {
                return ;
            }
            
            for (var i=0,len=arr.length; i<len; ++i) {
                this.push( tm.dom.Element(arr[i]) );
            }
        },
        
        /**
         * @property
         * @TODO ?
         */
        toString: function() {
            return "";
        }
    });
    
})();


/*
 * dom/evnet.js
 */

tm.dom = tm.dom || {};

(function() {
    
    /**
     * @class Event
     * 既存のEventオブジェクト拡張
     */
    
    // 仕方なしの IE 対応(これ引っかかったら他のもダメだから必要ないかも)
    if (!Event.prototype.stopPropagation) {
        Event.prototype.stopPropagation = function() {
            this.cancelBubble = true;
        };
    }
    if (!Event.prototype.preventDefault) {
        Event.prototype.preventDefault = function() {
            this.returnValue = false;
        };
    }
    
    /**
     * @method
     * イベントのデフォルト処理 & 伝達を止める
     */
    Event.prototype.stop = function() {
        // イベントキャンセル
        this.preventDefault();
        // イベント伝達を止める
        this.stopPropagation();
    };
    
})();


(function() {
    
    /**
     * @class KeyboardEvent
     * KeyboardEvent クラス
     */
    
    /**
     * @property    character
     * 押したキーの文字を取得
     */
    KeyboardEvent.prototype.getter("character", function(){
        return String.fromCharCode(this.keyCode);
    });
    
})();


(function() {
    
    /**
     * @class MouseEvent
     * MouseEvent クラス
     */
    
    /**
     * @property    pointX
     * マウスのX座標.
     */
    MouseEvent.prototype.getter("pointX", function() {
        return this.clientX - this.target.getBoundingClientRect().left;
//        return this.pageX - this.target.getBoundingClientRect().left - window.scrollX;
    });
    
    /**
     * @property    pointY
     * マウスのY座標.
     */
    MouseEvent.prototype.getter("pointY", function() {
        return this.clientY - this.target.getBoundingClientRect().top;
//        return this.pageY - this.target.getBoundingClientRect().top - window.scrollY;
    });
    
})();




(function() {
    
    if (window.TouchEvent === undefined) { return ; }
    
    
    /**
     * @class TouchEvent
     * TouchEvent クラス
     */
    
    /**
     * @property    pointX
     * タッチイベント.
     */
    TouchEvent.prototype.getter("pointX", function() {
        return this.touches[0].clientX - this.target.getBoundingClientRect().left;
//        return this.touches[0].pageX - this.target.getBoundingClientRect().left - tm.global.scrollX;
    });
    
    /**
     * @property    pointY
     * タッチイベント.
     */
    TouchEvent.prototype.getter("pointY", function() {
        return this.touches[0].clientY - this.target.getBoundingClientRect().top;
//        return this.touches[0].pageY - this.target.getBoundingClientRect().top - tm.global.scrollY;
    });
    
    
})();


(function() {
    
    /**
     * @class tm.dom.Event
     * Event クラス
     */
    tm.dom.Event = tm.createClass({

        /**
         * @property
         * DOMエレメント
         */
        element     : null,

        /**
         * @property
         * イベント発火時に実行する関数リスト
         */
        funcList    : null,

        /**
         * @property
         * 関数リストのインデックス　未使用？
         */
        funcIndex   : 0,
        
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element;
            this.domElement = element.element;
            this.funcList = {};
        },
        
        /**
         * @property
         * イベントを追加
         */
        add: function(type, fn, id) {
            var self = this;
            var elm  = this.element;
            
            var temp_fn = function(e) {
                // return fn.apply(self, arguments);
                var result = fn.apply(elm, arguments);
                
                if (result === false) {
                    // デフォルトイベントをキャンセル
                    e.preventDefault();
                    e.returnValue = false;  // IE
                    // イベント伝達をキャンセル
                    e.stopPropagation();
                }
                
                return result;
            }
            
            this._funcIndex = this._funcIndex || 0;
            id = id || this._funcIndex++;
            this.funcList[type] = this.funcList[type] || {};
            this.funcList[type][id] = temp_fn;
            fn._id = id;    // しれっと記録
            
            this.domElement.addEventListener(type, temp_fn, false);
            return this;
        },
        
        /**
         * @property
         * イベントを解除
         */
        remove: function(type, fn_or_id) {
            var id = (typeof(fn_or_id) === "function") ? fn_or_id._id : fn_or_id;
            var fn = this.getFunc(type, id);
            
            this.domElement.removeEventListener(type, fn, false);
            delete this.funcList[type][id];
        },
        
        /**
         * @property
         * クリックイベント
         */
        click: function(fn, id) {
            this.add("click", fn, id);
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        mdlclick: function(fn, id) {
            var temp_fn = function(e) {
                if (e.button == 1) {
                    fn(e);
                }
            }
            this.add("click", temp_fn, id);
        },
        
        /**
         * @property
         * ポインティングスタート
         */
        pointstart: function(fn, id) {
            this.add(tm.dom.Event.POINT_START, fn, id);
        },
        /**
         * @property
         * ポインティング中
         */
        pointmove: function(fn, id) {
            this.add(tm.dom.Event.POINT_MOVE, fn, id);
        },
        /**
         * @property
         * ポインティングエンド
         */
        pointend: function(fn, id) {
            this.add(tm.dom.Event.POINT_END, fn, id);
        },
        
        /**
         * @property
         * ホバーイベント
         */
        hover: function(fn, id) {
            this.add("mouseover", fn, id);
            return this;
        },
        
        /**
         * @property
         * 一度だけ呼ばれるイベントを登録
         */
        one: function(type, fn, id) {
            var self = this;
            var elm  = this.element;
            
            var temp_fn = function() {
                var result = fn.apply(elm, arguments);
                self.remove(type, temp_fn);
                return result;
            };
            
            this.add(type, temp_fn, id);
            
            return this;
        },
        
        /**
         * @property
         * トグルイベント登録
         */
        toggle: function(type, fn_list) {
            var self = this;
            var elm  = this.element;
            var temp_list = [];
            
            for (var i=0; i<fn_list.length; ++i) {
                var temp_fn = (function(i){
                    return function(){
                        var result = fn_list[i].apply(elm, arguments);
                        
                        if (result !== false) {
                            var index = (i+1)%fn_list.length;
                            self.one(type, temp_list[index]);
                        }
                    }
                })(i);
                temp_list.push(temp_fn);
            }
            
            this.one(type, temp_list[0]);
            
            return this;
        },
        
        /**
         * @property
         * 指定したイベントタイプ & id の関数を取得
         */
        getFunc: function(type, id) {
            return this.funcList[type][id];
        },
        
    });
    
    tm.dom.Event.POINT_START    = (tm.isMobile) ? "touchstart" : "mousedown";
    tm.dom.Event.POINT_MOVE     = (tm.isMobile) ? "touchmove" : "mousemove";
    tm.dom.Event.POINT_END      = (tm.isMobile) ? "touchend" : "mouseup";
    
    
    /**
     * @property    event
     * スタイルクラス
     */
    tm.dom.Element.prototype.getter("event", function(){
        return this._event || ( this._event = tm.dom.Event(this) );
    });
    
})();




/*
 * attr.js
 */

tm.dom = tm.dom || {};

(function(){
    
    /**
     * @class tm.dom.Attr
     * @TODO ?
     */
    tm.dom.Attr = tm.createClass({
        
        /**
         * @property
         * エレメント
         */
        element: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * @property
         * 属性をセット
         */
        set: function(name, value) {
            this.element.setAttribute(name, value);
            return this;
        },
        
        /**
         * @property
         * 属性を追加
         */
        add: function(name, value) {
            var now = this.get(name);
            value = (now) ? now + ' ' + value : value;
            this.element.setAttribute(name, value);
        },
        
        /**
         * @property
         * 属性を削除
         */
        remove: function(name, value) {
            var now = this.get(name);
            var next= (now) ? now.replace(value, '').replace('  ', ' ') : '';
            this.element.setAttribute(name, next.trim());
//            this.element.removeAttribute(name);
        },
        
        /**
         * @property
         * 属性を取得
         */
        get: function(name) {
            return this.element.getAttribute(name);
        },

        /**
         * @property
         * 属性の存在チェック
         */
        contains: function(name, value) {
            var now = this.get(name);
            if (arguments.length == 1) {
                return now != null;
            }
            else if (arguments.length == 2) {
                return (' '+now+' ').indexOf(' '+value+' ') > -1;
            }

            return false;
        },

        /**
         * @property
         * @TODO ?
         */
        toggle: function(name, value) {
            if (this.contains(name, value)) {
                this.remove(name, value);
            } else {
                this.add(name, value);
            }
            return this;
        }
    });
    
    /**
     * Attr クラス
     * @property    attr
     */
    tm.dom.Element.prototype.getter("attr", function(){
        return this._attr || ( this._attr = tm.dom.Attr(this.element) );
    });
    
})();


/*
 * style.js
 */

tm.dom = tm.dom || {};

(function(){
    
    /**
     * @class tm.dom.Style
     * スタイル
     */
    tm.dom.Style = tm.createClass({
        
        /**
         * @property
         * エレメント
         */
        element: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * @property
         * セット
         */
        set: function(name, value) {
            this.element.style[name] = value;
            return this;
        },
        
        /**
         * @property
         * 削除
         */
        remove: function(name) {
            this.element.style.removeProperty(name);
            // delete this.element.style[name];
            return this;
        },
        
        /**
         * @property
         * クリア
         */
        clear: function(name) {
            
            return this;
        },
        
        /**
         * @property
         * 取得
         */
        get: function(name) {
            return this.element.style[name];
        },
        
        /**
         * @property
         * CSS の値も考慮した上での値を取得
         */
        getPropValue: function(prop_name) {
            return document.defaultView.getComputedStyle(this.element, '').getPropertyValue(prop_name);
        },
    });
    
    /**
     * スタイルクラス
     * @property    style
     */
    tm.dom.Element.prototype.getter("style", function(){
        return this._style || ( this._style = tm.dom.Style(this.element) );
    });
    
})();


/*
 * anim.js
 */

tm.dom = tm.dom || {};

(function() {
    
    var prefix = tm.VENDER_PREFIX;
    
    var ANIMATION                   = prefix + "Animation";
    var ANIMATION_END               = prefix + "AnimationEnd";
    var ANIMATION_PLAY_STATE        = prefix + "AnimationPlayState";
    var ANIMATION_NAME              = prefix + "AnimationName";
    var ANIMATION_DURATION          = prefix + "AnimationDuration";
    var ANIMATION_TIMING_FUNCTION   = prefix + "AnimationTimingFunction";
    var ANIMATION_DELAY             = prefix + "AnimationDelay";
    var ANIMATION_DIRECTION         = prefix + "AnimationDirection";
    var ANIMATION_ITERATION_COUNT   = prefix + "AnimationIterationCount";
    
    /**
     * @class tm.dom.Anim
     * アニメーションクラス
     */
    tm.dom.Anim = tm.createClass({
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element;
            
            // アニメーションが終了したらステートを "paused" にする(何度も再生できるようにする為)
            var self = this;
            this.element.addEventListener(ANIMATION_END, function() {
                self.stop();
            }, false);
        },
        
        
        /**
         * @property
         * アニメーション開始
         */
        start: function() {
            this.element.style[ANIMATION_PLAY_STATE] = "running";
            return this;
        },
        
        /**
         * @property
         * アニメーション終了
         */
        stop: function() {
            this.element.style[ANIMATION_PLAY_STATE] = "paused";
            return this;
        },
        
        /**
         * @property
         * プロパティをセット
         */
        setProperty: function(prop) {
            if (typeof prop == "string") {
                this.element.style[ANIMATION] = prop;
            }
            else {
                for (var key in prop) {
                    var fn = ANIM_SETTER_FUNC_NAME_MAP[key];
                    var value = prop[key];
                    fn.call(this, value);
                }
            }
            return this;
        },
        
        /**
         * @property
         * 名前をセット
         */
        setName: function(name) {
            this.element.style[ANIMATION_NAME] = name;
            return this;
        },
        
        /**
         * @property
         * アニメーション時間の長さをセット
         */
        setDuration: function(s) {
            this.element.style[ANIMATION_DURATION] = s;
            return this;
        },
        
        /**
         * @property
         * 補間関数をセット
         */
        setTimingFunction: function(func) {
            this.element.style[ANIMATION_TIMING_FUNCTION] = func;
            return this;
        },
        
        /**
         * @property
         * イテレータカウントをセット
         */
        setIterationCount: function(n) {
            this.element.style[ANIMATION_ITERATION_COUNT] = n;
            return this;
        },
        
        /**
         * @property
         * アニメーション開始待ち時間をセット
         */
        setDelay: function(s) {
            this.element.style[ANIMATION_DELAY] = s;
            return this;
        },
        
        /**
         * @property
         * 判定再生させるかどうかを指定
         * "normal" or "alternate"
         */
        setDirection: function(t) {
            this.element.style[ANIMATION_DURATION] = t;
            return this;
        },
    });
    
    /**
     * @enum
     */
    var ANIM_SETTER_FUNC_NAME_MAP = {
        // 小文字対応
        "name"          : tm.dom.Anim.prototype.setName,
        "duration"      : tm.dom.Anim.prototype.setDuration,
        "timingFunction": tm.dom.Anim.prototype.setTimingFunction,
        "iterationCount": tm.dom.Anim.prototype.setIterationCount,
        "delay"         : tm.dom.Anim.prototype.setDelay,
        
        // 大文字対応
        "Name"          : tm.dom.Anim.prototype.setName,
        "Duration"      : tm.dom.Anim.prototype.setDuration,
        "TimingFunction": tm.dom.Anim.prototype.setTimingFunction,
        "IterationCount": tm.dom.Anim.prototype.setIterationCount,
        "Delay"         : tm.dom.Anim.prototype.setDelay,
    };
    
    /**
     * @property    anim
     * アニメーション
     */
    tm.dom.Element.prototype.getter("anim", function() {
        return this._anim || (this._anim = tm.dom.Anim(this.element));
    });
    
})();


(function(){
    
    /**
     * @class tm.dom.Trans
     * @TODO ?
     */
    tm.dom.Trans = tm.createClass({
        
        /**
         * @property
         * エレメント
         */
        element: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * @property
         * @TODO ?
         */
        to: function(props, t) {
            this.set(props).duration(t||1000);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        set: function(props) {
            var style = this.element.style;
            var names = [];
            
            for (var key in props) {
                var name = _checkStyleProperty(key);
                names.push( name.toDash() );
                style[name] = props[key] + "";
            }
            
            style[tm.dom.Trans.PROPERTY] = names.join(', ');   // none;
            
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        duration: function(t) {
            var style = this.element.style;
            if (typeof t == "number") t = t + "ms";
            style[tm.dom.Trans.DURATION] = t;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        easing: function(ease) {
            var style = this.element.style;
            style[tm.dom.Trans.TIMING_FUNCTION] = func;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        end: function(fn) {
            var elm  = tm.dom.Element(this.element);
            elm.event.add(tm.dom.Trans.END_EVENT, fn);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        reset: function() {
            var style = this.element.style;
            style[tm.dom.Trans.PROPERTY] = "none";
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        translate: function(x, y, t) {
            this.to({"transform": "translate({0}px,{1}px)".format(x, y)}, t);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        translate3d: function(x, y, z, t) {
            this.to({"transform": "translate3d({0}px,{1}px,{2}px)".format(x, y, z)}, t);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        rotate: function(deg, t) {
            this.to({"transform": "rotate({0}deg)".format(deg)}, t);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        rotate3d: function(x, y, z, deg, t) {
            this.to({"transform": "rotate3d({0},{1},{2},{3}deg)".format(x, y, z, deg)}, t);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        scale: function(x, y, t) {
            this.to({"transform": "scale({0},{1})".format(x, y)}, t);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        transform: function() {
            // TODO: 実装する
        },
        
        // -------------------------------------
        
        /**
         * @property
         * @TODO ?
         */
        setProp: function(prop) {
            var style = this.element.style;
            var prop_list = [];
            
            for (var key in prop) {
                var name = _checkStyleProperty(key);
                prop_list.push( name.toDash() );
                style[name] = prop[key];
            }
            
            style[tm.dom.Trans.PROPERTY] = prop_list.join(', ');   // none;
            
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setDuration: function(t) {
            var style = this.element.style;
            style[tm.dom.Trans.DURATION] = t;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setTimingFunction: function(func) {
            var style = this.element.style;
            style[tm.dom.Trans.TIMING_FUNCTION] = func;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        resetProp: function() {
            var style = this.element.style;
            style[tm.dom.Trans.PROPERTY] = "none";
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setEndFunction: function(fn) {
            var elm  = tm.dom.Element(this.element);
            elm.event.add(tm.dom.Trans.END_EVENT, fn);
            return this;
        },
    });
    
    tm.dom.Trans.PROPERTY        = tm.VENDER_PREFIX + "TransitionProperty";
    tm.dom.Trans.DURATION        = tm.VENDER_PREFIX + "TransitionDuration";
    tm.dom.Trans.TIMING_FUNCTION = tm.VENDER_PREFIX + "TransitionTimingFunction";
    tm.dom.Trans.DELAY           = tm.VENDER_PREFIX + "TransitionDelay";
    tm.dom.Trans.END_EVENT       = (function(){
        return {
            "webkit": "webkitTransitionEnd",
            "moz"   : "transitionend",
            "o"     : "oTransitionEnd",
        }[tm.VENDER_PREFIX];
    })();
    
    /**
     * @property    trans
     */
    tm.dom.Element.prototype.getter("trans", function(){
        return this._trans || ( this._trans = tm.dom.Trans(this.element) );
    });
    
    var _styleList = {
        "transform": true,
    };
    var _checkStyleProperty = function(name) {
        if (_styleList[name] === true) {
            return '-'+tm.VENDER_PREFIX + name.capitalizeFirstLetter();
        }
        return name;
    };
})();
/*
 * dom/data.js
 */

(function(){
    
    /**
     * @class tm.dom.Data
     * @TODO ?
     */
    tm.define("tm.dom.Data", {

        /**
         * @property
         * エレメント
         */
        element: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * @property
         * 属性をセット
         */
        set: function(name, value) {
        	var key = "data-" + name.toDash();
            this.element.setAttribute(key, value);

            return this;
        },
        
        /**
         * @property
         * 属性をゲット
         */
        get: function(name, value) {
        	var key = "data-" + name.toDash();
        	return this.element.attributes[key].value;
        },
    });
    
    /**
     * Attr クラス
     * @property    data
     */
    tm.dom.Element.prototype.getter("data", function(){
        return this._data || ( this._data = tm.dom.Data(this.element) );
    });

})();
/*
 * event/event.js
 */

tm.event = tm.event || {};

(function() {
    
    /**
     * @class tm.event.Event
     * イベントクラス
     */
    tm.event.Event = tm.createClass({
        
        /**
         * @property
         * タイプ
         */
        type: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type) {
            this.type = type;
        },
        
    });
    
})();


(function() {
    
    /**
     * @class tm.event.TweenEvent
     * Tween Event
     * @extends tm.event.Event
     */
    tm.event.TweenEvent = tm.createClass({
        
        superClass: tm.event.Event,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type, time, now) {
            this.superInit(type);
            
            this.time = time;
            this.now  = now;
        }
        
    });
    
    tm.event.TweenEvent.CHANGE    = "change";
    tm.event.TweenEvent.FINISH    = "finish";
    tm.event.TweenEvent.LOOP      = "loop";
    tm.event.TweenEvent.RESUME    = "resume";
    tm.event.TweenEvent.START     = "start";
    tm.event.TweenEvent.STOP      = "stop";
    
})();




(function() {
    
    /**
     * @class tm.event.MouseEvent
     * Pointing Event
     * @extends tm.event.Event
     */
    tm.event.MouseEvent = tm.createClass({
        
        superClass: tm.event.Event,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type, app, pointing) {
            this.superInit(type);
            
            this.app = app;
            this.pointing = pointing;
        }
        
    });
    
})();




(function() {
    
    /**
     * @class tm.event.TouchEvent
     * Pointing Event
     * @extends tm.event.Event
     */
    tm.event.TouchEvent = tm.createClass({
        
        superClass: tm.event.Event,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type, app, pointing) {
            this.superInit(type);
            
            this.app = app;
            this.pointing = pointing;
        }
        
    });
    
})();



(function() {
    
    /**
     * @class tm.event.PointingEvent
     * Pointing Event
     * @extends tm.event.Event
     */
    tm.event.PointingEvent = tm.createClass({
        
        superClass: tm.event.Event,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type, app, pointing) {
            this.superInit(type);
            
            this.app = app;
            this.pointing = pointing;
        }
        
    });
    
    // tm.event.PointingEvent.CHANGE    = "change";
    // tm.event.PointingEvent.FINISH    = "finish";
    // tm.event.PointingEvent.LOOP      = "loop";
    // tm.event.PointingEvent.RESUME    = "resume";
    // tm.event.PointingEvent.START     = "start";
    // tm.event.PointingEvent.STOP      = "stop";
    
})();



/*
 * eventdispatcher.js
 */

tm.event = tm.event || {};

(function() {
    
    /**
     * @class tm.event.EventDispatcher
     * Event Dispatcher
     * ### Reference
     * -(EventDispatcher - ActionScript 3.0 コンポーネントリファレンスガイド)[http://livedocs.adobe.com/flash/9.0_jp/ActionScriptLangRefV3/flash/events/EventDispatcher.html]
     */
    tm.event.EventDispatcher = tm.createClass({

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this._listeners = {};
        },

        /**
         * @property
         * イベントリスナー追加(addEventListenerと同様)
         */
        on: function(type, listener) {
            if (this._listeners[type] === undefined) {
                this._listeners[type] = [];
            }
            
            this._listeners[type].push(listener);
            return this;
        },
        
        /**
         * @property
         * イベントリスナー追加
         */
        addEventListener: function(type, listener) {
            if (this._listeners[type] === undefined) {
                this._listeners[type] = [];
            }
            
            this._listeners[type].push(listener);
            return this;
        },
        
        /**
         * @property
         * イベント起動
         */
        dispatchEvent: function(e) {
            e.target = this;
            var oldEventName = 'on' + e.type;
            if (this[oldEventName]) this[oldEventName](e);
            
            var listeners = this._listeners[e.type];
            if (listeners) {
                for (var i=0,len=listeners.length; i<len; ++i) {
                    listeners[i].call(this, e);
                }
            }
        },
        
        /**
         * @property
         * 登録されたイベントがあるかをチェック
         */
        hasEventListener: function(type) {
            if (this._listeners[type] === undefined && !this["on" + type]) return false;
            return true;
        },
        
        /**
         * @property
         * リスナーを削除
         */
        removeEventListener: function(type, listener) {
            var listeners = this._listeners[type];
            var index = listeners.indexOf(listener);
            if (index != -1) {
                listeners.splice(index,1);
            }
            return this;
        },
        
        /**
         * @property
         * リスナーを全てクリア
         */
        clearEventListener: function(type) {
            this._listeners[type] = [];
            return this;
        },
    });
    
})();

/*
 * texture.js
 */

(function() {
    
    /**
     * @class tm.asset.Texture
     * テクスチャクラス
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.asset.Texture", {
        superClass: "tm.event.EventDispatcher",
        
        /**
         * @property
         * window.document.Image
         */
        element: null,

        /**
         * @property
         * ロード済みかどうか
         */
        loaded: false,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(src) {
            this.superInit();
            
            this.element = new Image();
            this.element.src = src;
            
            var self = this;
            this.element.onload = function() {
                self.loaded = true;
                var e = tm.event.Event("load");
                self.dispatchEvent( e );
            };
        },
        
        /**
         * @property
         * window.document.Imageクラスのインスタンスを返す
         */
        getElement: function() {
            return this.element;
        },
    });
    
    /**
     * @property    width
     * 幅
     */
    tm.asset.Texture.prototype.getter("width", function() {
        return this.element.width;
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.asset.Texture.prototype.getter("height", function() {
        return this.element.height;
    });
    
})();

(function(){

    /*
     * @static
     * @method
     * ### ref
     * http://dummyimage.com/
     */
    /*
    tm.graphics.TextureManager.loadDummy = function(key, param) {
        param = param || {};

        var paths = ["http://dummyimage.com"];
        paths.push(param.size || 256);
        paths.push(param.bgColor || "aaa");
        paths.push(param.color || "000");
        paths.push(param.format || "png");

        var src = paths.join('/');
        if (param.text) {
            src += '&text=' + param.text;
        }

        this.textures[key] = tm.graphics.Texture(src);
        this.loaded = false;
    };
    */

})();



/*
 * spritesheet.js
 */

(function() {
    
    /**
     * @class tm.asset.SpriteSheet
     * マップシート
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.asset.SpriteSheet", {
        superClass: "tm.event.EventDispatcher",

        /**
         * @property
         * コンストラクタ
         */
        init: function(src) {
            this.superInit();

            if (typeof src == "string") {
            	this.load(src);
            }
            else {
	            this.parse(src);
    			this.loaded = true;
    			this.dispatchEvent(tm.event.Event("load"));
            }

        },

        /**
         * @property
         * @TODO ?
         */
        load: function(path) {
        	tm.util.Ajax.load({
        		url: path,
        		dataType: "json",
        		success: function(d) {
        			this.parse(d);
        			this.loaded = true;
        			this.dispatchEvent(tm.event.Event("load"));
        		}.bind(this),
        	});
        },

        /**
         * @property
         * @TODO ?
         */
        parse: function(param) {
            this.frame = param.frame;

            if (typeof param.image == "string") {
                if (!tm.asset.AssetManager.contains(param.image)) {
                    tm.asset.AssetManager.load(param.image);
                }
                this.image = tm.asset.AssetManager.get(param.image);
            }
            else {
                this.image = param.image;
            }

            if (this.image.loaded === false) {
                this.image.addEventListener("load", function() {
                    this._calcFrames(param.frame);
                    var e = tm.event.Event("load");
                    this.dispatchEvent(e);
                }.bind(this), false);
            }
            else {
                this._calcFrames(param.frame);
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }

            this._calcAnim(param.animations);
        },

        /**
         * @property
         * @TODO ?
         */
        getFrame: function(index) {
            return this.frames[index];
        },
        
        /**
         * @property
         * @TODO ?
         */
        getAnimation: function(name) {
            return this.animations[name];
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _calcFrames: function(frame) {
            var frames = this.frames = [];
            
            var w = frame.width;
            var h = frame.height;
            var row = ~~(this.image.width / w);
            var col = ~~(this.image.height/ h);
            
            if (!frame.count) frame.count = row*col;

            for (var i=0,len=frame.count; i<len; ++i) {
                var x   = i%row;
                var y   = (i/row)|0;
                var rect = {
                    x:x*w,
                    y:y*h,
                    width: w,
                    height: h
                };
                frames.push(rect);
            }
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _calcAnim: function(animations) {
            this.animations = {};
            for (var key in animations) {
                var anim = animations[key];

                if (anim instanceof Array) {
                    this.animations[key] = {
                        frames: [].range(anim[0], anim[1]),
                        next: anim[2],
                        frequency: anim[3] || 1
                    };
                }
                else if (typeof anim == "number") {
                    this.animations[key] = {
                        frames: [anim],
                        next: null,
                        frequency: 1
                    };
                }
                else {
                    this.animations[key] = {
                        frames: anim.frames,
                        next: anim.next,
                        frequency: anim.frequency || 1
                    };
                }
            }
            
            // デフォルトアニメーション
            this.animations["default"] = {
                frames: [].range(0, this.frame.count),
                next: "default",
                frequency: 1,
            };
        }

    });

})();

/*
 * mapsheet.js
 */

(function() {

    /**
     * @class tm.asset.MapSheet
     * マップシート
     */
    tm.define("tm.asset.MapSheet", {
        superClass: "tm.event.EventDispatcher",
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(path) {
            this.superInit();
            
            this.loaded = false;

            if (typeof path == "string") {
                tm.util.Ajax.load({
                    url: path,
                    success: function(e) {
                        var d = this._parse(e);
                        this.$extend(d);
                        this._checkImage();
                    }.bind(this),
                });
            }
            else {
                this.$extend(arguments[0]);
                
                this._checkImage();
            }
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _parse: function(str) {
            var each = Array.prototype.forEach;
            var data = {};
            var parser = new DOMParser();
            var xml = parser.parseFromString(str, 'text/xml');
            var map = this._attrToJSON(xml.getElementsByTagName('map')[0]);

            this.$extend(map);

            // tilesets(image)
            data.tilesets = this._parseTilesets(xml);

            // layer
            data.layers = this._parseLayers(xml);
            
            return data;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _parseTilesets: function(xml) {
            var each = Array.prototype.forEach;
            var self = this;
            var data = [];
            var tilesets = xml.getElementsByTagName('tileset');
            each.call(tilesets, function(tileset) {
                var t = {};
                var props = self._propertiesToJson(tileset);
                
                if (props.src) {
                    t.image = props.src;
                }
                else {
                    t.image = tileset.getElementsByTagName('image')[0].getAttribute('source');
                }
                data.push(t);
            });
            
            return data;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _parseLayers: function(xml) {
            var each = Array.prototype.forEach;
            var data = [];

            var map = xml.getElementsByTagName("map")[0];
            var layers = [];
            each.call(map.childNodes, function(elm) {
                if (elm.tagName == "layer" || elm.tagName == "objectgroup") {
                    layers.push(elm);
                }
            });

            layers.each(function(layer) {
                if (layer.tagName == "layer") {
                    var d = layer.getElementsByTagName('data')[0];
                    var encoding = d.getAttribute("encoding");
                    var l = {
                        type: "layer",
                        name: layer.getAttribute("name"),
                    };

                    if (encoding == "csv") {
                        l.data = this._parseCSV(d.textContent);
                    }
                    else if (encoding == "base64") {
                        l.data = this._parseBase64(d.textContent);
                    }

                    data.push(l);
                }
                else if (layer.tagName == "objectgroup") {
                    var l = {
                        type: "objectgroup",
                        objects: [],
                        name: layer.getAttribute("name"),
                    };
                    each.call(layer.childNodes, function(elm) {
                        if (elm.nodeType == 3) return ;
                        
                        var d = this._attrToJSON(elm);
                        d.properties = this._propertiesToJson(elm);
                        
                        l.objects.push(d);
                    }.bind(this));
                    
                    data.push(l);
                }
            }.bind(this));

            return data;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _parseCSV: function(data) {
            var dataList = data.split(',');
            var layer = [];

            dataList.each(function(elm, i) {
                var num = parseInt(elm, 10) - 1;
                layer.push(num);
            });

            return layer;
        },

        /**
         * @property
         * http://thekannon-server.appspot.com/herpity-derpity.appspot.com/pastebin.com/75Kks0WH
         * @private
         */
        _parseBase64: function(data) {
            var dataList = atob(data.trim());
            var rst = [];

            dataList = dataList.split('').map(function(e) {
                return e.charCodeAt(0);
            });

            for (var i=0,len=dataList.length/4; i<len; ++i) {
                var n = dataList[i*4];
                rst[i] = parseInt(n, 10) - 1;
            }
            
            return rst;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _propertiesToJson: function(elm) {
            var obj = {};
            var properties = elm.getElementsByTagName('property');
            for (var k = 0;k < properties.length;k++) {
                obj[properties[k].getAttribute('name')] = properties[k].getAttribute('value');
            }
            
            return obj;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _attrToJSON: function(source) {
            var obj = {};
            for (var i = 0; i < source.attributes.length; i++) {
                var val = source.attributes[i].value;
                val = isNaN(parseFloat(val))? val: parseFloat(val);
                obj[source.attributes[i].name] = val;
            }
            
            return obj;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _checkImage: function() {
            var self = this;
            if (this.tilesets.length) {
                var i = 0;
                var len = this.tilesets.length;
                
                var _onloadimage = function() {
                    i++;
                    if (i==len) {
                        this.loaded = true;
                        var e = tm.event.Event("load");
                        this.dispatchEvent(e);
                    }
                }.bind(this);
                
                this.tilesets.each(function(elm) {
                    var image = tm.asset.AssetManager.get(elm.image)
                    
                    if (image) {
                        if (image.loaded) {
                            // ロード済み
                            ++i;
                            if (i==len) {
                                this.loaded = true;
                                var e = tm.event.Event("load");
                                self.dispatchEvent(e);
                            }
                        }
                        else {
                            image.addEventListener("load", _onloadimage);
                        }
                    }
                    else {
                        tm.asset.AssetManager.load(elm.image);
                        var texture = tm.asset.AssetManager.get(elm.image);
                        texture.addEventListener("load", _onloadimage);
                    }
                });
                
            }
            else {
                this.loaded = true;
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }
        },
    });

})();
/*
 * assetmanger.js
 */

(function() {

    tm.asset = tm.asset || {};

    /**
     * @class tm.asset.AssetManager
     * マップシート
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.asset.AssetManager", {
        superClass: "tm.event.EventDispatcher",

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.superInit();

            this.assets = [];

            this._funcs = [];
            this._loadedCounter = 0;
        },

        /**
         * @property
         * アセットのロード
         * @param {Object} key
         * @param {Object} path
         */
        load: function(key, path) {
            if (typeof arguments[0] == 'string') {
                path = (arguments.length < 2) ? key : path;
                this._load(key, path);
            }
            else {
                var hash = arguments[0];
                for (var key in hash) {
                    var path = hash[key];
                    this._load(key, path);
                }
            }

            // 重複ロード対応
            if (this.isLoaded()) {
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }

            return this;
        },

        /**
         * @property
         * アセットのロード
         * private
         * @param {Object} key
         * @param {Object} path
         */
        _load: function(key, path) {
            if (this.contains(key)) return ;

            var pathes = path.split('.');
            var ext = pathes.last;

            var asset = this._funcs[ext](path);
            asset.addEventListener("load", this._checkLoadedFunc.bind(this));
            this.assets[key] = asset;

            return this;
        },

        /**
         * @property
         * アセットのゲット
         * @param {Object} key
         */
        get: function(key) {
            return this.assets[key];
        },

        /**
         * @property
         * アセットのセット
         * @param {Object} key
         * @param {Object} asset
         */
        set: function(key, asset) {
            this.assets[key] = asset;
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @param {Object} key
         */
        contains: function(key) {
            return (this.assets[key]) ? true : false;
        },

        /**
         * @property
         * アセットのセット
         * @param {Object} key
         * @param {Object} asset
         */
        register: function(type, fn) {
            this._funcs[type] = fn;
        },

        /**
         * @property
         * ロード済みか調べる
         */
        isLoaded: function() {
            return (this._loadedCounter == Object.keys(this.assets).length);
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _checkLoadedFunc: function() {
            this._loadedCounter++;

            if (this.isLoaded()) {
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }
        }

    });

    tm.asset.AssetManager = tm.asset.AssetManager();

    var _textureFunc = function(path) {
        var texture = tm.asset.Texture(path);
        return texture;
    };
    var _soundFunc = function(path) {
        var audio = tm.sound.WebAudio(path);
        return audio;
    };
    
    var _tmxFunc = function(path) {
        var mapSheet = tm.asset.MapSheet(path);
        return mapSheet;
    };
    
    var _tmssFunc = function(path) {
        var mapSheet = tm.asset.SpriteSheet(path);
        return mapSheet;
    };

    tm.asset.AssetManager.register("png", _textureFunc);
    tm.asset.AssetManager.register("gif", _textureFunc);
    tm.asset.AssetManager.register("jpg", _textureFunc);
    tm.asset.AssetManager.register("jpeg", _textureFunc);

    tm.asset.AssetManager.register("wav", _soundFunc);
    tm.asset.AssetManager.register("mp3", _soundFunc);
    tm.asset.AssetManager.register("ogg", _soundFunc);
    
    tm.asset.AssetManager.register("tmx", _tmxFunc);
    
    tm.asset.AssetManager.register("tmss", _tmssFunc);
    
})();











/*
 * keyboard.js
 */

tm.input = tm.input || {};


(function() {
    
    /**
     * @class tm.input.Keyboard
     * キーボードクラス
     */
    tm.input.Keyboard = tm.createClass({
        
        /**
         * target element
         */
        element: null,
        
        key: null,
        
        press   : null, // 押しているキー
        down    : null, // 押したキー
        up      : null, // 離したキー
        last    : null, // 押していたキー
        
        /**
         * @constructor
         * <a href="http://tmlib-js.googlecode.com/svn/trunk/test/input/keyboard-test.html">Test Program</a>.
         * ### Example
         * TM.loadScript("input", "keyboard");
         *  
         * TM.main(function() {
         *     var k = TM.$Key(document);
         *     k.run();
         *     TM.setLoop(function(){
         *         if (k.getKey('a')) { console.log("press 'a'!!"); }
         *     });
         * });
         */
        init: function(element) {
            this.element = element || document;
            
            this.key = {};
            
            this.press  = {};
            this.down   = {};
            this.up     = {};
            this.last   = {};
            
            var self = this;
            this.element.addEventListener("keydown", function(e){
                self.key[e.keyCode] = true;
            });
            this.element.addEventListener("keyup", function(e){
                // delete self.key[e.keyCode];
                self.key[e.keyCode] = false;
                // self.button |= 1<<e.button;
            });
            this.element.addEventListener("keypress", function(e){
                // self.button &= ~(1<<e.button);
            });
        },
        
        /**
         * @property
         * run.
         * 自動でマウス情報を更新したい際に使用する
         */
        run: function(fps) {
            var self = this;
            fps = fps || 30;
            tm.setLoop(function(){
                self._update();
                if (self.update) self.update();
            }, 1000/fps);
        },
        
        /**
         * @property
         * 情報更新処理
         * マイフレーム呼んで下さい.
         * @private
         */
        _update: function() {
            // TODO: 一括ビット演算で行うよう修正する
            for (var k in this.key) {
                this.last[k]    = this.press[k];
                this.press[k]   = this.key[k];
                
                this.down[k] = (this.press[k] ^ this.last[k]) & this.press[k];
                this.up[k] = (this.press[k] ^ this.last[k]) & this.last[k];
            }
            
            return this;
        },
        
        /**
         * @property
         * キーを押しているかをチェック
         * @param   {Number/String} key keyCode or keyName
         * @returns {Boolean}   チェック結果
         */
        getKey: function(key) {
            if (typeof(key) == "string") {
                key = KEY_CODE[key];
            }
            return this.press[key] == true;
        },
        
        /**
         * @property
         * キーを押したかをチェック
         * @param   {Number/String} key keyCode or keyName
         * @returns {Boolean}   チェック結果
         */
        getKeyDown: function(key) {
            if (typeof(key) == "string") {
                key = KEY_CODE[key];
            }
            return this.down[key] == true;
        },
        
        /**
         * @property
         * キーを離したかをチェック
         * @param   {Number/String} key keyCode or keyName
         * @returns {Boolean}   チェック結果
         */
        getKeyUp: function(key) {
            if (typeof(key) == "string") {
                key = KEY_CODE[key];
            }
            return this.up[key] == true;
        },
        
        /**
         * @property
         * キーの方向を Angle(Degree) で取得
         * @returns {Boolean}   角度(Degree)
         */
        getKeyAngle: function() {
            var angle = null;
            var arrowBit =
                (this.getKey("left")   << 3) | // 1000
                (this.getKey("up")     << 2) | // 0100
                (this.getKey("right")  << 1) | // 0010
                (this.getKey("down"));         // 0001
            
            if (arrowBit != 0 && ARROW_BIT_TO_ANGLE_TABLE.hasOwnProperty(arrowBit)) {
                angle = ARROW_BIT_TO_ANGLE_TABLE[arrowBit];
            }
            
            return angle;
        },
        
        /**
         * キーの状態を設定する
         */
        setKey: function(key, flag) {
            if (typeof(key) == "string") {
                key = KEY_CODE[key];
            }
            return this.press[key] = flag;
        },

        /**
         * キーを全て離したことにする
         */
        clearKey: function() {
            this.press = {};
        }
        
    });

    /*
     * @enum ARROW_BIT_TO_ANGLE_TABLE
     * 方向のアングル jsduckでは数字をプロパティに指定できない？
     * @private
     */
    var ARROW_BIT_TO_ANGLE_TABLE = {
        /* @property 下 */
        0x01: 270,
        /* @property 右 */
        0x02:   0,
        /* @property 上 */
        0x04:  90,
        /* @property 左 */
        0x08: 180,

        /* @property 右上 */
        0x06:  45,
        /* @property 右下 */
        0x03: 315,
        /* @property 左上 */
        0x0c: 135,
        /* @property 左下 */
        0x09: 225,

        // 三方向同時押し対応
        // 想定外の操作だが対応しといたほうが無難
        /* @property 右上左 */
        0x0e:  90,
        /* @property 上左下 */
        0x0d: 180,
        /* @property 左下右 */
        0x0b: 270,
        /* @property 下右上 */
        0x07:   0,
    };

    /**
     * @enum KEY_CODE
     * キー番号
     * @private
     */
    var KEY_CODE = {
        /** @property */
        "backspace" : 8,
        /** @property */
        "tab"       : 9,
        /** @property */
        "enter"     : 13,
        /** @property */
        "return"    : 13,
        /** @property */
        "shift"     : 16,
        /** @property */
        "ctrl"      : 17,
        /** @property */
        "alt"       : 18,
        /** @property */
        "pause"     : 19,
        /** @property */
        "capslock"  : 20,
        /** @property */
        "escape"    : 27,
        /** @property */
        "pageup"    : 33,
        /** @property */
        "pagedown"  : 34,
        /** @property */
        "end"       : 35,
        /** @property */
        "home"      : 36,
        /** @property */
        "left"      : 37,
        /** @property */
        "up"        : 38,
        /** @property */
        "right"     : 39,
        /** @property */
        "down"      : 40,
        /** @property */
        "insert"    : 45,
        /** @property */
        "delete"    : 46,
        
        /** @property */
        "0" : 48,
        /** @property */
        "1" : 49,
        /** @property */
        "2" : 50,
        /** @property */
        "3" : 51,
        /** @property */
        "4" : 52,
        /** @property */
        "5" : 53,
        /** @property */
        "6" : 54,
        /** @property */
        "7" : 55,
        /** @property */
        "8" : 56,
        /** @property */
        "9" : 57,
        /** @property */
        
        "a" : 65,
        /** @property */
        "A" : 65,
        /** @property */
        "b" : 66,
        /** @property */
        "B" : 66,
        /** @property */
        "c" : 67,
        /** @property */
        "C" : 67,
        /** @property */
        "d" : 68,
        /** @property */
        "D" : 68,
        /** @property */
        "e" : 69,
        /** @property */
        "E" : 69,
        /** @property */
        "f" : 70,
        /** @property */
        "F" : 70,
        /** @property */
        "g" : 71,
        /** @property */
        "G" : 71,
        /** @property */
        "h" : 72,
        /** @property */
        "H" : 72,
        /** @property */
        "i" : 73,
        /** @property */
        "I" : 73,
        /** @property */
        "j" : 74,
        /** @property */
        "J" : 74,
        /** @property */
        "k" : 75,
        /** @property */
        "K" : 75,
        /** @property */
        "l" : 76,
        /** @property */
        "L" : 76,
        /** @property */
        "m" : 77,
        /** @property */
        "M" : 77,
        /** @property */
        "n" : 78,
        /** @property */
        "N" : 78,
        /** @property */
        "o" : 79,
        /** @property */
        "O" : 79,
        /** @property */
        "p" : 80,
        /** @property */
        "P" : 80,
        /** @property */
        "q" : 81,
        /** @property */
        "Q" : 81,
        /** @property */
        "r" : 82,
        /** @property */
        "R" : 82,
        /** @property */
        "s" : 83,
        /** @property */
        "S" : 83,
        /** @property */
        "t" : 84,
        /** @property */
        "T" : 84,
        /** @property */
        "u" : 85,
        /** @property */
        "U" : 85,
        /** @property */
        "v" : 86,
        /** @property */
        "V" : 86,
        /** @property */
        "w" : 87,
        /** @property */
        "W" : 87,
        /** @property */
        "x" : 88,
        /** @property */
        "X" : 88,
        /** @property */
        "y" : 89,
        /** @property */
        "Y" : 89,
        /** @property */
        "z" : 90,
        /** @property */
        "Z" : 90,
        
        /** @property */
        "numpad0" : 96,
        /** @property */
        "numpad1" : 97,
        /** @property */
        "numpad2" : 98,
        /** @property */
        "numpad3" : 99,
        /** @property */
        "numpad4" : 100,
        /** @property */
        "numpad5" : 101,
        /** @property */
        "numpad6" : 102,
        /** @property */
        "numpad7" : 103,
        /** @property */
        "numpad8" : 104,
        /** @property */
        "numpad9" : 105,
        /** @property */
        "multiply"      : 106,
        /** @property */
        "add"           : 107,
        /** @property */
        "subtract"      : 109,
        /** @property */
        "decimalpoint"  : 110,
        /** @property */
        "divide"        : 111,

        /** @property */
        "f1"    : 112,
        /** @property */
        "f2"    : 113,
        /** @property */
        "f3"    : 114,
        /** @property */
        "f4"    : 115,
        /** @property */
        "f5"    : 116,
        /** @property */
        "f6"    : 117,
        /** @property */
        "f7"    : 118,
        /** @property */
        "f8"    : 119,
        /** @property */
        "f9"    : 120,
        /** @property */
        "f10"   : 121,
        /** @property */
        "f11"   : 122,
        /** @property */
        "f12"   : 123,
        
        /** @property */
        "numlock"   : 144,
        /** @property */
        "scrolllock": 145,
        /** @property */
        "semicolon" : 186,
        /** @property */
        "equalsign" : 187,
        /** @property */
        "comma"     : 188,
        /** @property */
        "dash"      : 189,
        /** @property */
        "period"    : 190,
        /** @property */
        "forward slash" : 191,
        /** @property */
        "/": 191,
        /** @property */
        "grave accent"  : 192,
        /** @property */
        "open bracket"  : 219,
        /** @property */
        "back slash"    : 220,
        /** @property */
        "close braket"  : 221,
        /** @property */
        "single quote"  : 222,
        /** @property */
        "space"         : 32
    };
    
    
})();


/*
 * mouse.js
 */

tm.input = tm.input || {};


(function() {
    
    /**
     * @class tm.input.Mouse
     * マウスクラス
     */
    tm.input.Mouse = tm.createClass({
        
        element: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element || window.document;
            
            this.position       = tm.geom.Vector2(0, 0);
            this.deltaPosition  = tm.geom.Vector2(0, 0);
            this.prevPosition   = tm.geom.Vector2(0, 0);
            
            var self = this;
            this.element.addEventListener("mousemove", function(e){
                // 座標更新
                self._mousemove(e);
            });
            this.element.addEventListener("mousedown", function(e){
                self.button |= 1<<e.button;
            });
            this.element.addEventListener("mouseup", function(e){
                self.button &= ~(1<<e.button);
            });
            this.element.addEventListener("mouseover", function(e){
                // 座標更新
                self._mousemove(e);
                self.prevPosition.setObject(self.position);
            });
        },
        
        /**
         * @property
         * run
         * 自動でマウス情報を更新したい際に使用する
         */
        run: function(fps) {
            var self = this;
            fps = fps || 30;
            
            tm.setLoop(function() {
                self.update();
            }, 1000/fps);
            
            return this;
        },
        
        /**
         * @property
         * 情報更新処理
         * マイフレーム呼んで下さい.
         */
        update: function() {
            this.last = this.press;
            
            this.press = this.button;
            
            this.down = (this.press ^ this.last) & this.press;
            this.up   = (this.press ^ this.last) & this.last;
            
            // 変化値を保存
            this.deltaPosition.setObject(this.position).sub(this.prevPosition);
            
            // 前回の座標を保存
            this.prevPosition.setObject(this.position);
        },
        
        /**
         * @property
         * ボタン取得
         */
        getButton: function(button) {
            if (typeof(button) == "string") {
                button = BUTTON_MAP[button];
            }
            
            return (this.press & button) != 0;
        },
        
        /**
         * @property
         * ボタンダウン取得
         */
        getButtonDown: function(button) {
            if (typeof(button) == "string") {
                button = BUTTON_MAP[button];
            }
            
            return (this.down & button) != 0;
        },
        
        /**
         * @property
         * ボタンアップ取得
         */
        getButtonUp: function(button) {
            if (typeof(button) == "string") {
                button = BUTTON_MAP[button];
            }
            
            return (this.up & button) != 0;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _mousemove: function(e) {
            var rect = e.target.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _mousemoveNormal: function(e) {
            var rect = e.target.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _mousemoveScale: function(e) {
            var rect = e.target.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
            
            //if (e.target instanceof HTMLCanvasElement) {
                // スケールを考慮した拡縮
                if (e.target.style.width) {
                    this.x *= e.target.width / parseInt(e.target.style.width);
                }
                if (e.target.style.height) {
                    this.y *= e.target.height / parseInt(e.target.style.height);
                }
            //}
        },
        
    });
    
    
    tm.input.Mouse.BUTTON_LEFT      = 0x1;
    tm.input.Mouse.BUTTON_MIDDLE    = 0x2;
    tm.input.Mouse.BUTTON_RIGHT     = 0x4;
    
    var BUTTON_MAP = {
        "left"  : tm.input.Mouse.BUTTON_LEFT,
        "middle": tm.input.Mouse.BUTTON_MIDDLE,
        "right" : tm.input.Mouse.BUTTON_RIGHT
    };
    
    
    /**
     * @property    x
     * x座標値
     */
    tm.input.Mouse.prototype.accessor("x", {
        "get": function()   { return this.position.x; },
        "set": function(v)  { this.position.x = v; }
    });
    
    /**
     * @property    y
     * y座標値
     */
    tm.input.Mouse.prototype.accessor("y", {
        "get": function()   { return this.position.y; },
        "set": function(v)  { this.position.y = v; }
    });
    
    /**
     * @property    dx
     * dx値
     */
    tm.input.Mouse.prototype.accessor("dx", {
        "get": function()   { return this.deltaPosition.x; },
        "set": function(v)  { this.deltaPosition.x = v; }
    });
    
    /**
     * @property    dy
     * dy値
     */
    tm.input.Mouse.prototype.accessor("dy", {
        "get": function()   { return this.deltaPosition.y; },
        "set": function(v)  { this.deltaPosition.y = v; }
    });
    
    
    /**
     * @method getPointing
     * ポインティング状態取得(touch との差異対策)
     */
    tm.input.Mouse.prototype.getPointing        = function() { return this.getButton("left"); };
    /**
     * @method getPointingStart
     * ポインティングを開始したかを取得(touch との差異対策)
     */
    tm.input.Mouse.prototype.getPointingStart   = function() { return this.getButtonDown("left"); };
    /**
     * @method getPointingEnd
     * ポインティングを終了したかを取得(touch との差異対策)
     */
    tm.input.Mouse.prototype.getPointingEnd     = function() { return this.getButtonUp("left"); };
    
    
})();


/*
 * touch.js
 */

tm.input = tm.input || {};


(function() {
    
    /**
     * @class tm.input.Touch
     * タッチクラス
     */
    tm.input.Touch = tm.createClass({
        
        element: null,
        touched: false,
        
        /**
         * @constructor
         * <a href="http://tmlib-js.googlecode.com/svn/trunk/test/input/touch-test.html">Test Program</a>.
         */
        init: function(element) {
            this.element = element || window.document;
            
            this.position       = tm.geom.Vector2(0, 0);
            this.deltaPosition  = tm.geom.Vector2(0, 0);
            this.prevPosition   = tm.geom.Vector2(0, 0);
            
            // var self = this;
            // this.element.addEventListener("touchstart", function(e) {
            //     if (self._touch) return ;
            //     self._touch = e.changedTouches[0];

            //     // changedTouches;
            //     // targetTouches;
            //     self._touchmove(e);
            //     self.prevPosition.setObject(self.position);

            //     self.touched = true;
            // });
            // this.element.addEventListener("touchend", function(e){
            //     if (self._touch == e.changedTouches[0]) {
            //         self.touched = false;
            //     }
            // });
            // this.element.addEventListener("touchmove", function(e){
            //     self._touchmove(e);
            //     // 画面移動を止める
            //     e.stop();
            // });
        },
        
        /**
         * @property
         * run.
         * 自動でマウス情報を更新したい際に使用する
         */
        run: function(fps) {
            var self = this;
            fps = fps || 30;
            
            tm.setLoop(function() {
                
                self.update();
                
            }, 1000/fps);
            
            return this;
        },
        
        /**
         * @property
         * 情報更新処理
         * マイフレーム呼んで下さい.
         */
        update: function() {
            this.last   = this.now;
            this.now    = Number(this.touched);
            
            this.start  = (this.now ^ this.last) & this.now;
            this.end    = (this.now ^ this.last) & this.last;
            
            // 変化値を保存
            this.deltaPosition.setObject(this.position).sub(this.prevPosition);
            
            // 前回の座標を保存
            this.prevPosition.setObject(this.position);
        },
        
        /**
         * @property
         * タッチしているかを判定
         */
        getTouch: function() {
            return this.touched != 0;
        },
        
        /**
         * @property
         * タッチ開始時に true
         */
        getTouchStart: function() {
            return this.start != 0;
        },
        
        /**
         * @property
         * タッチ終了時に true
         */
        getTouchEnd: function() {
            return this.end != 0;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _touchmove: function(e) {
            var t = this._touch;
            var r = e.target.getBoundingClientRect();
            this.x = t.clientX - r.left;
            this.y = t.clientY - r.top;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _touchmoveScale: function(e) {
            var t = this._touch;
            var r = e.target.getBoundingClientRect();
            this.x = t.clientX - r.left;
            this.y = t.clientY - r.top;
            
            if (e.target.style.width) {
                this.x *= e.target.width / parseInt(e.target.style.width);
            }
            if (e.target.style.height) {
                this.y *= e.target.height / parseInt(e.target.style.height);
            }
        },
        
    });
    
    

    /**
     * @property    x
     * x座標値
     */
    tm.input.Touch.prototype.accessor("x", {
        "get": function()   { return this.position.x; },
        "set": function(v)  { this.position.x = v; }
    });
    
    /**
     * @property    y
     * y座標値
     */
    tm.input.Touch.prototype.accessor("y", {
        "get": function()   { return this.position.y; },
        "set": function(v)  { this.position.y = v; }
    });
    
    /**
     * @property    dx
     * dx値
     */
    tm.input.Touch.prototype.accessor("dx", {
        "get": function()   { return this.deltaPosition.x; },
        "set": function(v)  { this.deltaPosition.x = v; }
    });
    
    /**
     * @property    dy
     * dy値
     */
    tm.input.Touch.prototype.accessor("dy", {
        "get": function()   { return this.deltaPosition.y; },
        "set": function(v)  { this.deltaPosition.y = v; }
    });
    
    
    
    /**
     * @method
     * ポインティング状態取得(mouse との差異対策)
     */
    tm.input.Touch.prototype.getPointing        = tm.input.Touch.prototype.getTouch;
    /**
     * @method
     * ポインティングを開始したかを取得(mouse との差異対策)
     */
    tm.input.Touch.prototype.getPointingStart   = tm.input.Touch.prototype.getTouchStart;
    /**
     * @method
     * ポインティングを終了したかを取得(mouse との差異対策)
     */
    tm.input.Touch.prototype.getPointingEnd     = tm.input.Touch.prototype.getTouchEnd;
    
})();



(function() {

    /**
     * @class tm.input.Touches
     * マルチタッチ対応クラス
     */
    tm.define("tm.input.Touches", {
        superClass: Array,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(elm, length) {
            this.element = elm;
            for (var i=0; i<length; ++i) {
                var touch = tm.input.Touch(this.element);
                this.push(touch);
            }

            var self = this;
            this.element.addEventListener("touchstart", function(e) {
                var target = null;
                for (var i=0; i<length; ++i) {
                    if (!self[i]._touch) {
                        target = self[i];
                        break;
                    }
                }
                if (!target) return ;

                target._touch = e.changedTouches[0];

                target._touchmove(e);
                target.prevPosition.setObject(target.position);

                target.touched = true;
                // changedTouches;
                // targetTouches;
            });
            this.element.addEventListener("touchend", function(e){
                for (var i=0; i<length; ++i) {
                    if (self[i]._touch == e.changedTouches[0]) {
                        self[i]._touch = null;
                        self[i].touched = false;
                    }
                }
            });
            this.element.addEventListener("touchmove", function(e){
                for (var i=0; i<length; ++i) {
                    if (self[i]._touch) {
                        self[i]._touchmove(e);
                    }
                }
                // 画面移動を止める
                e.stop();
            });
        },

        /**
         * @property
         * @TODO ?
         */
        update: function() {
            this.each(function(touch) {
                touch.update();
            });
        }
    });

})();






/*
 * accelerometer.js
 */

tm.input = tm.input || {};


(function() {
    
    /**
     * @class tm.input.Accelerometer
     * @TODO ?
     */
    tm.input.Accelerometer = tm.createClass({
        
        /**
         * @constructor
         * ### Example
         * <a href="http://tmlib-js.googlecode.com/svn/trunk/test/input/touch-test.html">Test Program</a>.
         * 
         * ### Reference
         * - <http://tmlife.net/programming/javascript/javascript-iphone-acceleration.html>
         * - <http://hidekatsu.com/html5/archives/113>
         * - <http://d.hatena.ne.jp/nakamura001/20110209/1297229062>
         * - <http://d.hatena.ne.jp/nakamura001/20101128/1290946966>
         */
        init: function(element) {
            
            this.gravity        = tm.geom.Vector3(0, 0, 0);
            this.acceleration   = tm.geom.Vector3(0, 0, 0);
            this.orientation    = tm.geom.Vector3(0, 0, 0);
            
            var self = this;
            window.addEventListener("devicemotion", function(e) {
                var acceleration = self.acceleration;
                var gravity = self.gravity;
                
                if (e.acceleration) {
                    acceleration.x = e.acceleration.x;
                    acceleration.y = e.acceleration.y;
                    acceleration.z = e.acceleration.z;
                }
                if (e.accelerationIncludingGravity) {
                    gravity.x = e.accelerationIncludingGravity.x;
                    gravity.y = e.accelerationIncludingGravity.y;
                    gravity.z = e.accelerationIncludingGravity.z;
                }
            });
            
            window.addEventListener("deviceorientation", function(e) {
                var orientation = self.orientation;
                orientation.alpha   = e.alpha;  // z(0~360)
                orientation.beta    = e.beta;   // x(-180~180)
                orientation.gamma   = e.gamma;  // y(-90~90)
            });
        },
        
    });
    
})();


/*
 * color.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class tm.graphics.Color
     * カラークラス
     */
    tm.graphics.Color = tm.createClass({
        
        /**
         * @property
         * R値
         */
        r: 255,
        
        /**
         * @property
         * G値
         */
        g: 255,
        
        /**
         * @property
         * B値
         */
        b: 255,
        
        /**
         * @property
         * A値
         */
        a: 1.0,
        
        /**
         * @constructor
         * 初期化
         */
        init: function(r, g, b, a) {
            this.set.apply(this, arguments);
        },

        /**
         * @property
         * セッター.
         */
        set: function(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = (a !== undefined) ? a : 1.0;
            return this;
        },
        
        /**
         * @property
         * 数値によるセッター.
         */
        setFromNumber: function(r, g, b, a) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = (a !== undefined) ? a : 1.0;
            return this;
        },
        
        /**
         * @property
         * 配列によるセッター
         */
        setFromArray: function(arr) {
            return this.set.apply(this, arr);
        },
        
        /**
         * @property
         * オブジェクトによるセッター
         */
        setFromObject: function(obj) {
            return this.set(obj.r, obj.g, obj.b, obj.a);
        },
        
        /**
         * @property
         * 文字列によるセッター
         */
        setFromString: function(str) {
            var color = tm.graphics.Color.stringToNumber(str);
            return this.set(color[0], color[1], color[2], color[3]);
        },
        
        /**
         * @property
         * 賢いセッター
         */
        setSmart: function() {
            var arg = arguments[0];
            if (arguments.length >= 3) {
                this.set(arguments.r, arguments.g, arguments.b, arguments.a);
            }
            else if (arg instanceof Array) {
                this.setFromArray(arg);
            }
            else if (arg instanceof Object) {
                this.setFromObject(arg);
            }
            else if (typeof(arg) == "string") {
                this.setFromString(arg);
            }
            return this;
        },

        /**
         * @property
         * CSS 用 16進数文字列に変換
         */
        toStyleAsHex: function() {
            return "#{0}{1}{2}".format(
                this.r.toString(16).padding(2, '0'),
                this.g.toString(16).padding(2, '0'),
                this.b.toString(16).padding(2, '0')
            );
        },
        
        /**
         * @property
         * CSS 用 RGB文字列に変換
         */
        toStyleAsRGB: function() {
            return "rgb({r},{g},{b})".format({
                r: ~~this.r,
                g: ~~this.g,
                b: ~~this.b
            });
        },
        
        
        /**
         * @property
         * CSS 用 RGBA文字列に変換
         */
        toStyleAsRGBA: function() {
            return "rgba({r},{g},{b},{a})".format({
                r: ~~this.r,
                g: ~~this.g,
                b: ~~this.b,
                a: this.a
            });
        },

        /**
         * @property
         * CSS 用 RGBA 文字列に変換
         */
        toStyle: function() {
            return "rgba({r},{g},{b},{a})".format({
                r: ~~this.r,
                g: ~~this.g,
                b: ~~this.b,
                a: this.a
            });
        },
        
    });
    
    /**
     * @enum
     * @TODO ?
     * @private
     */
    var MATCH_SET_LIST = {
        /** @property hex111 */
        "hex111": {
            reg: /^#(\w{1})(\w{1})(\w{1})$/,
            exec: function(m) {
                return [
                    parseInt(m[1]+m[1], 16),
                    parseInt(m[2]+m[2], 16),
                    parseInt(m[3]+m[3], 16)
                ];
            }
        },
        /** @property hex222 */
        "hex222": {
            reg: /^#(\w{2})(\w{2})(\w{2})$/,
            exec: function(m) {
                return [
                    parseInt(m[1], 16),
                    parseInt(m[2], 16),
                    parseInt(m[3], 16)
                ];
            }
        },
        /** @property rgb */
        "rgb": {
            reg: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            exec: function(m) {
                return [
                    parseInt(m[1]),
                    parseInt(m[2]),
                    parseInt(m[3])
                ];
            }
        },
        /** @property rgba */
        "rgba": {
            reg: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1}(\.{1}\d+)?)\)$/,
            exec: function(m) {
                return [
                    parseInt(m[1]),
                    parseInt(m[2]),
                    parseInt(m[3]),
                    parseFloat(m[4])
                ];
            }
        },
        /** @property hsl */
        "hsl": {
            reg: /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/,
            exec: function(m) {
                return tm.graphics.Color.HSLtoRGB(m[1], m[2], m[3]);
            }
        },

        /** @property hsla */
        "hsla": {
            reg: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1}(\.{1}\d+)?)\)$/,
            exec: function(m) {
                return Color.HSLAtoRGBA(m[1], m[2], m[3], m[4]);
            }
        },
    };

    /**
     * @property
     * @TODO ?
     */
    tm.graphics.Color.COLOR_LIST = {
        /** @property black */
        "black"     : [0x00, 0x00, 0x00],
        /** @property silver */
        "silver"    : [0xc0, 0xc0, 0xc0],
        /** @property gray */
        "gray"      : [0x80, 0x80, 0x80],
        /** @property white */
        "white"     : [0xff, 0xff, 0xff],
        /** @property maroon */
        "maroon"    : [0x80, 0x00, 0x00],
        /** @property red */
        "red"       : [0xff, 0x00, 0x00],
        /** @property purple */
        "purple"    : [0x80, 0x00, 0x80],
        /** @property fuchsia */
        "fuchsia"   : [0xff, 0x00, 0xff],
        /** @property green */
        "green"     : [0x00, 0x80, 0x00],
        /** @property lime */
        "lime"      : [0x00, 0xff, 0x00],
        /** @property olive */
        "olive"     : [0x80, 0x80, 0x00],
        /** @property yellow */
        "yellow"    : [0xff, 0xff, 0x00],
        /** @property navy */
        "navy"      : [0x00, 0x00, 0x80],
        /** @property blue */
        "blue"      : [0x00, 0x00, 0xff],
        /** @property teal */
        "teal"      : [0x00, 0x80, 0x80],
        /** @property aqua */
        "aqua"      : [0x00, 0xff, 0xff],
    };

    /**
     * @property
     * @TODO ?
     */
    tm.graphics.Color.strToNum = tm.graphics.Color.stringToNumber = function(str){
        var vlaue = null;
        var type = null;
        
        if (str[0] === '#') {
            type = (str.length == 4) ?  "hex111" : "hex222";
        }
        else if (str[0] === 'r' && str[1] === 'g' && str[2] === 'b') {
            type = (str[3] == 'a') ? "rgba" : "rgb";
        }
        else if (str[0] === 'h' && str[1] === 's' && str[2] === 'l') {
            type = (str[3] == 'a') ? "hsla" : "hsl";
        }
        
        if (type) {
            var match_set = MATCH_SET_LIST[type];
            var m = str.match( match_set.reg );
            value = match_set.exec(m);
        }
        else if (Color.COLOR_LIST[str]){
            value = Color.COLOR_LIST[str];
        }
        
        return value;
    };

    /**
     * @property
     * @TODO ?
     */
    tm.graphics.Color.HSLtoRGB = function(h, s, l) {
        var r, g, b;
        
        h%=360;
        h+=360;
        h%=360;
        s *= 0.01;
        l *= 0.01;
        
        if (s == 0) {
            var l = Math.round(l * 255);
            return [l, l, l];
        }
        var m2 = (l < 0.5) ? l * (1+s) : l + s - l*s;
        var m1 = l*2 - m2;
        
        // red
        var temp = (h + 120)%360;
        if      (temp < 60) { r = m1 + (m2-m1) * temp/60; }
        else if (temp < 180){ r = m2; }
        else                { r = m1; }
        
        // green
        temp = h;
        if      (temp < 60) { g = m1 + (m2-m1) * temp/60; }
        else if (temp < 180){ g = m2; }
        else if (temp < 240){ g = m1 + (m2-m1) * (240-temp)/60; }
        else                { g = m1; }
        
        // blue
        temp = ((h-120)+360)%360;
        if      (temp < 60) { b = m1 + (m2-m1) * temp/60; }
        else if (temp < 180){ b = m2; }
        else if (temp < 240){ b = m1 + (m2-m1) * (240-temp)/60; }
        else                { b = m1; }
        
        return [
            parseInt(r*255),
            parseInt(g*255),
            parseInt(b*255)
            ];
    };

    /**
     * @property
     * @TODO ?
     */
    tm.graphics.Color.HSLAtoRGBA = function(h, s, l, a) {
        var temp = Color.HSLtoRGB(h, s, l); temp[3] = a;
        return rgb;
    };

    /**
     * @property
     * rgb 値を作成
     */
    tm.graphics.Color.createStyleRGB = function(r, g, b) {
        return "rgba(" + r + "," + g + "," + b + ")";
    };
    
    /**
     * @property
     * rgba 値を作成
     */
    tm.graphics.Color.createStyleRGBA = function(r, g, b, a) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };

    /**
     * @property
     * hsl 値を作成
     */
    tm.graphics.Color.createStyleHSL = function(h, s, l) {
        return "hsl(" + h + "," + s + "%," + l + "%)";
    };
    
    /**
     * @property
     * hsla 値を作成
     */
    tm.graphics.Color.createStyleHSLA = function(h, s, l, a) {
        return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
    };
})();

/*
 * canvas.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class tm.graphics.Canvas
     * キャンバス
     */
    tm.graphics.Canvas = tm.createClass({
        
        /**
         * 要素
         */
        element: null,
        
        /**
         * キャンバス
         */
        canvas: null,
        
        /**
         * コンテキスト
         */
        context: null,
        
        /**
         * @constructor
         * 初期化
         */
        init: function(canvas) {
            this.canvas = null;
            if (typeof canvas == "string") {
                this.canvas = document.querySelector(canvas);
            }
            else {
                this.canvas = canvas || document.createElement("canvas");
            }
            this.element            = this.canvas;
            this.context            = this.canvas.getContext("2d");
            this.context.lineCap    = "round";
            this.context.lineJoin   = "round";
        },
        
        /**
         * @property
         * リサイズする
         */
        resize: function(width, height) {
            this.canvas.width   = width;
            this.canvas.height  = height;
            return this;
        },
        
        /**
         * @property
         * リサイズウィンドウ
         */
        resizeWindow: function() {
            this.canvas.style.position  = "fixed";
            this.canvas.style.margin    = "0px";
            this.canvas.style.padding   = "0px";
            this.canvas.style.left      = "0px";
            this.canvas.style.top       = "0px";
            return this.resize(window.innerWidth, window.innerHeight);
        },
        
        /**
         * @property
         * フィット
         */
        resizeToFitScreen: function() {
            this.canvas.style.position  = "fixed";
            this.canvas.style.margin    = "0px";
            this.canvas.style.padding   = "0px";
            this.canvas.style.left      = "0px";
            this.canvas.style.top       = "0px";
            return this.resize(window.innerWidth, window.innerHeight);
        },
        
        /**
         * @property
         * 拡縮で画面にフィットさせる
         * 名前は仮. 検討する
         */
        fitWindow: function(everFlag) {
            var _fitFunc = function() {
                everFlag = everFlag === undefined ? true : everFlag;
                var e = this.element;
                var s = e.style;
                
                s.position = "absolute";
                s.margin = "auto";
                s.left = "0px";
                s.top  = "0px";
                s.bottom = "0px";
                s.right = "0px";

                var rateWidth = e.width/window.innerWidth;
                var rateHeight= e.height/window.innerHeight;
                var rate = e.height/e.width;
                
                if (rateWidth > rateHeight) {
                    s.width  = innerWidth+"px";
                    s.height = innerWidth*rate+"px";
                }
                else {
                    s.width  = innerHeight/rate+"px";
                    s.height = innerHeight+"px";
                }
            }.bind(this);
            
            // 一度実行しておく
            _fitFunc();
            // リサイズ時のリスナとして登録しておく
            if (everFlag) {
                window.addEventListener("resize", _fitFunc, false);
            }
        },
        
        /**
         * @property
         * クリア
         */
        clear: function(x, y, width, height) {
            x = x || 0;
            y = y || 0;
            width = width || this.width;
            height= height|| this.height;
            this.context.clearRect(x, y, width, height);
            return this;
        },
        
        
        /**
         * @property
         * 色指定クリア
         * @param {String}  fillStyle
         * @param {Number}  [x=0]
         * @param {Number}  [y=0]
         * @param {Number}  [width=this.width]
         * @param {Number}  [height=this.height]
         */
        clearColor: function(fillStyle, x, y, width, height) {
            x = x || 0;
            y = y || 0;
            width = width || this.width;
            height= height|| this.height;
            
            this.save();
            this.resetTransform();          // 行列初期化
            this.fillStyle = fillStyle;     // 塗りつぶしスタイルセット
            this.context.fillRect(x, y, width, height);
            this.restore();
            
            return this;
        },
                
        /**
         * @property
         * パスを開始(リセット)
         */
        beginPath: function() {
            this.context.beginPath();
            return this;
        },
                
        /**
         * @property
         *  パスを閉じる
         */
        closePath: function() {
            this.context.closePath();
            return this;
        },
        

        /**
         * @property
         *  新規パス生成
         */
        moveTo: function(x, y) {
            this.context.moveTo(x, y);
            return this;
        },
        
        /**
         * @property
         * パスに追加
         */
        lineTo: function(x, y) {
            this.context.lineTo(x, y);
            return this;
        },
        
        /**
         * @property
         * パス内を塗りつぶす
         */
        fill: function() {
            this.context.fill();
            return this;
        },
        
        /**
         * @property
         * パス上にラインを引く
         */
        stroke: function() {
            this.context.stroke();
            return this;
        },
        
        /**
         * @property
         * クリップ
         */
        clip: function() {
            this.context.clip();
            return this;
        },
        
        /**
         * @property
         * 点描画
         */
        drawPoint: function(x, y) {
            return this.strokeRect(x, y, 1, 1);
            // return this.beginPath().moveTo(x-0.5, y-0.5).lineTo(x+0.5, y+0.5).stroke();
        },

        /**
         * @property
         * ラインパスを作成
         */
        line: function(x0, y0, x1, y1) {
            return this.moveTo(x0, y0).lineTo(x1, y1);
        },
        
        /**
         * @property
         * ラインを描画
         */
        drawLine: function(x0, y0, x1, y1) {
            return this.beginPath().line(x0, y0, x1, y1).stroke();
        },
        
        /**
         * @property
         * ダッシュラインを描画
         */
        drawDashLine: function(x0, y0, x1, y1, pattern) {
            var patternTable = null;
            if (typeof(pattern) == "string") {
                patternTable = pattern;
            }
            else {
                pattern = pattern || 0xf0f0;
                patternTable = pattern.toString(2);
            }
            patternTable = patternTable.padding(16, '1');
            
            var vx = x1-x0;
            var vy = y1-y0;
            var len = Math.sqrt(vx*vx + vy*vy);
            vx/=len; vy/=len;
            
            var x = x0;
            var y = y0;
            for (var i=0; i<len; ++i) {
                if (patternTable[i%16] == '1') {
                    this.drawPoint(x, y);
                    // this.fillRect(x, y, this.context.lineWidth, this.context.lineWidth);
                }
                x += vx;
                y += vy;
            }
            
            return this;
        },
        
        /**
         * @property
         * v0(x0, y0), v1(x1, y1) から角度を求めて矢印を描画
         * http://hakuhin.jp/as/rotation.html
         */
        drawArrow: function(x0, y0, x1, y1, arrowRadius) {
            var vx = x1-x0;
            var vy = y1-y0;
            var angle = Math.atan2(vy, vx)*180/Math.PI;
            
            this.drawLine(x0, y0, x1, y1);
            this.fillPolygon(x1, y1, arrowRadius || 5, 3, angle);
            
            return this;
        },
        
        
        /**
         * @property
         * lines
         */
        lines: function() {
            this.moveTo(arguments[0], arguments[1]);
            for (var i=1,len=arguments.length/2; i<len; ++i) {
                this.lineTo(arguments[i*2], arguments[i*2+1]);
            }
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        strokeLines: function() {
            this.beginPath();
            this.lines.apply(this, arguments);
            this.stroke();
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        fillLines: function() {
            this.beginPath();
            this.lines.apply(this, arguments);
            this.fill();
            return this;
        },
        
        /**
         * @property
         * 四角形パスを作成する
         */
        rect: function(x, y, width, height) {
            this.context.rect.apply(this.context, arguments);
            return this;
        },
        
        /**
         * @property
         * 四角形塗りつぶし描画
         */
        fillRect: function() {
            this.context.fillRect.apply(this.context, arguments);
            return this;
        },
        
        /**
         * @property
         * 四角形ライン描画
         */
        strokeRect: function() {
            this.context.strokeRect.apply(this.context, arguments);
            return this;
        },
        
        /**
         * @property
         * 角丸四角形パス
         */
        roundRect: function(x, y, width, height, radius) {
            var l = x + radius;
            var r = x + width - radius;
            var t = y + radius;
            var b = y + height - radius;
            
            /*
            var ctx = this.context;
            ctx.moveTo(l, y);
            ctx.lineTo(r, y);
            ctx.quadraticCurveTo(x+width, y, x+width, t);
            ctx.lineTo(x+width, b);
            ctx.quadraticCurveTo(x+width, y+height, r, y+height);
            ctx.lineTo(l, y+height);
            ctx.quadraticCurveTo(x, y+height, x, b);
            ctx.lineTo(x, t);
            ctx.quadraticCurveTo(x, y, l, y);
            /**/
            
            this.context.arc(l, t, radius,     -Math.PI, -Math.PI*0.5, false);  // 左上
            this.context.arc(r, t, radius, -Math.PI*0.5,            0, false);  // 右上
            this.context.arc(r, b, radius,            0,  Math.PI*0.5, false);  // 右下
            this.context.arc(l, b, radius,  Math.PI*0.5,      Math.PI, false);  // 左下
            this.closePath();
            
            return this;
        },
        /**
         * @property
         * 角丸四角形塗りつぶし
         */
        fillRoundRect: function(x, y, width, height, radius) {
            return this.beginPath().roundRect(x, y, width, height, radius).fill();
        },
        /**
         * @property
         * 角丸四角形ストローク描画
         */
        strokeRoundRect: function(x, y, width, height, radius) {
            return this.beginPath().roundRect(x, y, width, height, radius).stroke();
        },
        
        /**
         * @property
         * ポリゴンパス
         */
        polygon: function(x, y, size, sides, offsetAngle) {
            var radDiv = (Math.PI*2)/sides;
            var radOffset = (offsetAngle!=undefined) ? offsetAngle*Math.PI/180 : -Math.PI/2;
            
            this.moveTo(x + Math.cos(radOffset)*size, y + Math.sin(radOffset)*size);
            for (var i=1; i<sides; ++i) {
                var rad = radDiv*i+radOffset;
                this.lineTo(
                    x + Math.cos(rad)*size,
                    y + Math.sin(rad)*size
                );
            }
            this.closePath();
            return this;
        },
        /**
         * @property
         * ポリゴン塗りつぶし
         */
        fillPolygon: function(x, y, radius, sides, offsetAngle) {
            return this.beginPath().polygon(x, y, radius, sides, offsetAngle).fill();
        },
        /**
         * @property
         * ポリゴンストローク描画
         */
        strokePolygon: function(x, y, radius, sides, offsetAngle) {
            return this.beginPath().polygon(x, y, radius, sides, offsetAngle).stroke();
        },
        
        /**
         * @property
         * star
         */
        star: function(x, y, radius, sides, sideIndent, offsetAngle) {
            var sideIndentRadius = radius * (sideIndent || 0.38);
            var radOffset = (offsetAngle) ? offsetAngle*Math.PI/180 : -Math.PI/2;
            var radDiv = (Math.PI*2)/sides/2;
            
            this.moveTo(
                x + Math.cos(radOffset)*radius,
                y + Math.sin(radOffset)*radius
            );
            for (var i=1; i<sides*2; ++i) {
                var rad = radDiv*i + radOffset;
                var len = (i%2) ? sideIndentRadius : radius;
                this.lineTo(
                    x + Math.cos(rad)*len,
                    y + Math.sin(rad)*len
                );
            }
            this.closePath();
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        fillStar: function(x, y, radius, sides, sideIndent, offsetAngle) {
            return this.beginPath().star(x, y, radius, sides, sideIndent, offsetAngle).fill();
        },

        /**
         * @property
         * @TODO ?
         */
        strokeStar: function(x, y, radius, sides, sideIndent, offsetAngle) {
            return this.beginPath().star(x, y, radius, sides, sideIndent, offsetAngle).stroke();
        },

        /*
         * @property
         * heart
         */
        heart: function(x, y, radius, angle) {
            var half_radius = radius*0.5;
            var rad = (angle === undefined) ? Math.PI/4 : Math.degToRad(angle);

            // 半径 half_radius の角度 angle 上の点との接線を求める
            var p = Math.cos(rad)*half_radius;
            var q = Math.sin(rad)*half_radius;

            // 円の接線の方程式 px + qy = r^2 より y = (r^2-px)/q
            var x2 = -half_radius;
            var y2 = (half_radius*half_radius-p*x2)/q;

            // 中心位置調整
            var height = y2 + half_radius;
            var offsetY = half_radius-height/2;

            // パスをセット
            this.moveTo(0+x, y2+y+offsetY);

            this.arc(-half_radius+x, 0+y+offsetY, half_radius, Math.PI-rad, Math.PI*2);
            this.arc(half_radius+x, 0+y+offsetY, half_radius, Math.PI, rad);
            this.closePath();

            return this;
        },

        /*
         * @property
         * fill heart
         */
        fillHeart: function(x, y, radius, angle) {
            return this.beginPath().heart(x, y, radius, angle).fill();
        },

        /*
         * @property
         * stroke heart
         */
        strokeHeart: function(x, y, radius, angle) {
            return this.beginPath().heart(x, y, radius, angle).stroke();
        },
        
        /**
         * @property
         * 円のパスを設定
         */
        circle: function(x, y, radius) {
            this.context.arc(x, y, radius, 0, Math.PI*2, false);
            return this;
        },
        
        /**
         * @property
         * 塗りつぶし円を描画
         */
        fillCircle: function(x, y, radius) {
            var c = this.context;
            c.beginPath();
            c.arc(x, y, radius, 0, Math.PI*2, false);
            c.closePath();
            c.fill();
            return this;
            // return this.beginPath().circle(x, y, radius).fill();
        },
        
        /**
         * @property
         * ストローク円を描画
         */
        strokeCircle: function(x, y, radius) {
            return this.beginPath().circle(x, y, radius).stroke();
        },
        
        
        /**
         * @property
         * 円弧のパスを設定
         */
        arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
            this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            return this;
        },
        
        /**
         * @property
         * 塗りつぶし円弧を描画
         */
        fillArc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
            return this.beginPath().arc(x, y, radius, startAngle, endAngle, anticlockwise).fill();
        },
        
        /**
         * @property
         * ストローク円弧を描画
         */
        strokeArc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
            return this.beginPath().arc(x, y, radius, startAngle, endAngle, anticlockwise).stroke();
        },
        
        /**
         * @property
         * 三角形パスを設定
         */
        triangle: function(x0, y0, x1, y1, x2, y2) {
            this.moveTo(x0, y0).lineTo(x1, y1).lineTo(x2, y2);
            this.closePath();
            return this;
        },
        
        /**
         * @property
         * 塗りつぶし三角形を描画
         */
        fillTriangle: function(x0, y0, x1, y1, x2, y2) {
            return this.beginPath().triangle(x0, y0, x1, y1, x2, y2).fill();
        },
        
        /**
         * @property
         * ストローク三角形を描画
         */
        strokeTriangle: function(x0, y0, x1, y1, x2, y2) {
            return this.beginPath().triangle(x0, y0, x1, y1, x2, y2).stroke();
        },
        

        /**
         * @property
         * 塗りつぶしテキストを描画
         */
        fillText: function(text, x, y) {
            return this.context.fillText.apply(this.context, arguments);
        },
        
        /**
         * @property
         * ストロークテキスト
         */
        strokeText: function(text, x, y) {
            return this.context.strokeText.apply(this.context, arguments);
        },
        
        /**
         * @property
         * 塗りつぶしテキスト
         */
        fillTextList: function(text_list, x, y, offsetX, offsetY) {
            offsetX = offsetX || 0;
            offsetY = offsetY || 20;
            
            for (var i=0,len=text_list.length; i<len; ++i) {
                this.fillText(text_list[i], x+offsetX*i, y+offsetY*i);
            }
            
            return this;
        },
        
        /**
         * @property
         * ストロークテキストリスト
         */
        strokeTextList: function(text_list, x, y, offsetX, offsetY) {
            offsetX = offsetX || 0;
            offsetY = offsetY || 20;
            
            for (var i=0,len=text_list.length; i<len; ++i) {
                this.strokeText(x+offsetX*i, y+offsetY*i, text_list[i]);
            }
            
            return this;
        },
                
        /**
         * @property
         * 画像描画
         */
        drawImage: function(image, x, y) {
            this.context.drawImage.apply(this.context, arguments);
            return ;
            
            x = x || 0;
            y = y || 0;
            this.context.drawImage(image, x, y);
            return this;
            // ctx.drawImage(this.image.canvas,
                // 0, 0, this.width, this.height,
                // -this.width/2, -this.height/2, this.width, this.height);
        },
        
        /**
         * @property
         * テクスチャ描画
         */
        drawTexture: function(texture, x, y) {
            arguments[0] = texture.element;
            this.context.drawImage.apply(this.context, arguments);
            
            return ;
        },
        
        /**
         * @property
         * ビットマップ描画
         */
        drawBitmap: function(bitmap, x, y) {
            arguments[0] = bitmap.imageData;
            this.context.putImageData.apply(this.context, arguments);
            
            return ;
        },
        
        /**
         * @property
         * 行列をセット
         */
        setTransform: function(m11, m12, m21, m22, dx, dy) {
            this.context.setTransform(m11, m12, m21, m22, dx, dy);
            return this;
        },
        
        
        /**
         * @property
         * 行列をリセット
         */
        resetTransform: function() {
            this.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
            return this;
        },
        
        
        /**
         * @property
         * 中心に移動
         */
        setTransformCenter: function() {
            this.context.setTransform(1, 0, 0, 1, this.width/2, this.height/2);
            return this;
        },
        
        /**
         * @property
         * 行列を掛ける
         */
        transform: function(m11, m12, m21, m22, dx, dy) {
            this.context.transform(m11, m12, m21, m22, dx, dy);
            return this;
        },
        
        /**
         * @property
         * 保存
         */
        save: function() {
            this.context.save();
            return this;
        },
        
        /**
         * @property
         * 復元
         */
        restore: function() {
            this.context.restore();
            return this;
        },
        
        /**
         * @property
         * 移動
         */
        translate: function(x, y) {
            this.context.translate(x, y);
            return this;
        },
        
        /**
         * @property
         * 回転
         */
        rotate: function(rotation) {
            this.context.rotate(rotation);
            return this;
        },
        
        /**
         * @property
         * スケール
         */
        scale: function(scaleX, scaleY) {
            this.context.scale(scaleX, scaleY);
            return this;
        },
        
        /**
         * @property
         * 画像として保存
         */
        saveAsImage: function(mime_type) {
            mime_type = mime_type || tm.graphics.Canvas.MIME_TYPE_PNG;
            var data_url = this.canvas.toDataURL(mime_type);
            // data_url = data_url.replace(mime_type, "image/octet-stream");
            window.open(data_url, "save");
            
            // toDataURL を使えば下記のようなツールが作れるかも!!
            // TODO: プログラムで絵をかいて保存できるツール
        },

        /**
         * @property
         * @TODO ?
         */
        setCompositing: function(alpha, compositeOperation) {
            // TODO
        },

        /**
         * @property
         * @TODO ?
         */
        setFillStyle: function(style) {
            this.context.fillStyle = style;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setStrokeStyle: function(style) {
            this.context.strokeStyle = style;
            return this;
        },
        
        /**
         * @property
         * <a href="http://www.w3.org/TR/2010/WD-2dcontext-20100624/#colors-and-styles">http://www.w3.org/TR/2010/WD-2dcontext-20100624/#colors-and-styles</a>
         */
        setColorStyle: function(stroke, fill) {
            fill = fill || stroke;
            
            this.context.strokeStyle    = stroke;
            this.context.fillStyle      = fill;
            return this;
        },
        
        /**
         * @property
         * テキストをセット
         */
        setText: function(font, align, baseline) {
            var c = this.context;
            c.font          = font;
            c.textAlign     = align;
            c.textBaseline  = baseline;
        },
        
        /**
         * @property
         * ラインスタイルを一括セット
         * <a href="http://www.w3.org/TR/2010/WD-2dcontext-20100624/#line-styles">http://www.w3.org/TR/2010/WD-2dcontext-20100624/#line-styles</a>
         */
        setLineStyle: function(width, cap, join, miter) {
            with(this.context) {
                lineWidth   = width || 1;
                lineCap     = cap   || "round";
                lineJoin    = join  || "round";
                miterLimit  = miter || 10.0;
            }
            return this;
        },
        
        /**
         * @property
         * 影をセット
         * - <http://www.html5.jp/canvas/ref/property/shadowColor.html>
         * - <http://www.w3.org/TR/2010/WD-2dcontext-20100624/#shadows>
         */
        setShadow: function(color, offsetX, offsetY, blur) {
            var ctx = this.context;
            
            ctx.shadowColor     = color     || "black";
            ctx.shadowOffsetX   = offsetX   || 0;
            ctx.shadowOffsetY   = offsetY   || 0;
            ctx.shadowBlur      = blur      || 0;
            
            return this;
        },
        
        getElement: function() {
            return this.element;
        },
        
    });
    
    tm.graphics.Canvas.MIME_TYPE_PNG = "image/png";
    tm.graphics.Canvas.MIME_TYPE_JPG = "image/jpeg";
    tm.graphics.Canvas.MIME_TYPE_SVG = "image/svg+xml";
    
    /**
     * @property    width
     * 幅
     */
    tm.graphics.Canvas.prototype.accessor("width", {
        "get": function()   { return this.canvas.width; },
        "set": function(v)  { this.canvas.width = v; }
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.graphics.Canvas.prototype.accessor("height", {
        "get": function()   { return this.canvas.height; },
        "set": function(v)  { this.canvas.height = v;   }
    });
    
    /**
     * @property    fillStyle
     * 塗りつぶしスタイル
     */
    tm.graphics.Canvas.prototype.accessor("fillStyle", {
        "get": function()   { return this.context.fillStyle; },
        "set": function(v)  { this.context.fillStyle = v;   }
    });
    
    
    /**
     * @property    strokeStyle
     * ストロークスタイル
     */
    tm.graphics.Canvas.prototype.accessor("strokeStyle", {
        "get": function()   { return this.context.strokeStyle; },
        "set": function(v)  { this.context.strokeStyle = v;   }
    });
    
    
    /**
     * @property    globalAlpha
     * アルファ指定
     */
    tm.graphics.Canvas.prototype.accessor("globalAlpha", {
        "get": function()   { return this.context.globalAlpha; },
        "set": function(v)  { this.context.globalAlpha = v;   }
    });
    
    
    /**
     * @property    globalCompositeOperation
     * ブレンド指定
     */
    tm.graphics.Canvas.prototype.accessor("globalCompositeOperation", {
        "get": function()   { return this.context.globalCompositeOperation; },
        "set": function(v)  { this.context.globalCompositeOperation = v;   }
    });

    /**
     * @property    shadowBlur
     * シャドウブラー
     */
    tm.graphics.Canvas.prototype.accessor("shadowBlur", {
        "get": function()   { return this.context.shadowBlur; },
        "set": function(v)  { this.context.shadowBlur = v;   }
    });
    

    /**
     * @property    shadowColor
     * シャドウブラーカラー
     */
    tm.graphics.Canvas.prototype.accessor("shadowColor", {
        "get": function()   { return this.context.shadowColor; },
        "set": function(v)  { this.context.shadowColor = v;   }
    });
    

    /**
     * @property    shadowOffsetX
     * シャドウオフセット X 
     */
    tm.graphics.Canvas.prototype.accessor("shadowOffsetX", {
        "get": function()   { return this.context.shadowOffsetX; },
        "set": function(v)  { this.context.shadowOffsetX = v;   }
    });
    

    /**
     * @property    shadowOffsetY
     * シャドウオフセット Y
     */
    tm.graphics.Canvas.prototype.accessor("shadowOffsetY", {
        "get": function()   { return this.context.shadowOffsetY; },
        "set": function(v)  { this.context.shadowOffsetY = v;   }
    });
    
    /**
     * @property    lineCap
     * ライン終端の描画方法
     */
    tm.graphics.Canvas.prototype.accessor("lineCap", {
        "get": function()   { return this.context.lineCap; },
        "set": function(v)  { this.context.lineCap = v;   }
    });
    
    /**
     * @property    lineJoin
     * ラインつなぎ目の描画方法
     */
    tm.graphics.Canvas.prototype.accessor("lineJoin", {
        "get": function()   { return this.context.lineJoin; },
        "set": function(v)  { this.context.lineJoin = v;   }
    });
    
    /**
     * @property    miterLimit
     * マイターリミット
     */
    tm.graphics.Canvas.prototype.accessor("miterLimit", {
        "get": function()   { return this.context.miterLimit; },
        "set": function(v)  { this.context.miterLimit = v;   }
    });
    
    /**
     * @property    lineWidth
     * ライン幅設定
     */
    tm.graphics.Canvas.prototype.accessor("lineWidth", {
        "get": function()   { return this.context.lineWidth; },
        "set": function(v)  { this.context.lineWidth = v;   }
    });
    
    /**
     * @property    font
     * フォント
     */
    tm.graphics.Canvas.prototype.accessor("font", {
        "get": function()   { return this.context.font; },
        "set": function(v)  { this.context.font = v;   }
    });
    
    /**
     * @property    textAlign
     * テキストのアラインメント
     */
    tm.graphics.Canvas.prototype.accessor("textAlign", {
        "get": function()   { return this.context.textAlign; },
        "set": function(v)  { this.context.textAlign = v;   }
    });
    
    /**
     * @property    textBaseline
     * テキストのベースライン
     */
    tm.graphics.Canvas.prototype.accessor("textBaseline", {
        "get": function()   { return this.context.textBaseline; },
        "set": function(v)  { this.context.textBaseline = v;   }
    });
    
    /**
     * @property    centerX
     * センターX
     */
    tm.graphics.Canvas.prototype.getter("centerX", function() {
        return this.canvas.width/2;
    });
    
    /**
     * @property    centerY
     * センターY
     */
    tm.graphics.Canvas.prototype.getter("centerY", function(){
        return this.canvas.height/2;
    });

    /**
     * @property    imageSmoothingEnabled
     * 画像スムージング設定
     */
    tm.graphics.Canvas.prototype.accessor("imageSmoothingEnabled", {
        "get": function() {
            return this.context.imageSmoothingEnabled;
        },
        "set": function(v) {
            this.context.imageSmoothingEnabled = v;
            this.context.webkitImageSmoothingEnabled = v;
            this.context.mozImageSmoothingEnabled = v;
        }
    });
    
})();


















/*
 * bitmap.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class tm.graphics.Bitmap
     * ビットマップクラス
     */
    tm.graphics.Bitmap = tm.createClass({
        
        imageData: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(imageData) {
            if (!dummyCanvas) {
                dummyCanvas = document.createElement("canvas");
                dummyContext= dummyCanvas.getContext("2d");
            }
            this._init.apply(this, arguments);
            this.init = this._init;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _init: function(imageData) {
            if (arguments.length == 1) {
                this.imageData = imageData;
                this.data = imageData.data;
            }
            else if (arguments.length == 2) {
                var w = arguments[0];
                var h = arguments[1];
                this.imageData = dummyContext.createImageData(w, h);
                this.data = this.imageData.data;
            }
        },
        
        /**
         * @property
         * index 指定でピクセル値を取得
         * 最も高速
         */
        getPixelIndex: function(index) {
            var i = index*4;
            return [
                this.data[i+0],
                this.data[i+1],
                this.data[i+2],
                this.data[i+3]
            ];
        },
        
        /**
         * @property
         * x, y 指定でピクセル値を取得
         */
        getPixelXY: function(x, y) {
            return this.getPixelIndex( this.posToIndex(x, y) );
        },
        
        /**
         * @property
         * ピクセル値を取得
         * ### Memo
         * - index 指定か x, y 指定にするか検討中
         * - 配列で返すか数値で返すか検討中. 速度の早いやつを採用する
         */
        getPixel: function(x, y) {
            return this.getPixelIndex( this.posToIndex(x, y) );
        },

        /**
         * @property
         * @TODO ?
         */
        getPixelAsNumber: function(index) {
            var i = index*4;
            return (this.data[i+3] << 24) | (this.data[i+0] << 16) | (this.data[i+1] << 8) | this.data[i+2];
        },

        /**
         * @property
         * @TODO ?
         */
        getPixelAsObject: function(index) {
            var i = index*4;
            return {
                r: this.data[i+0],
                g: this.data[i+1],
                b: this.data[i+2],
                a: this.data[i+3]
            };
        },

        /**
         * @property
         * @TODO ?
         */
        getPixelAsArray: function(index) {
            var i = index*4;
            return [
                this.data[i+0],
                this.data[i+1],
                this.data[i+2],
                this.data[i+3]
            ];
        },
        
        /**
         * @property
         * 指定した範囲内のピクセル平均値を取得
         */
        getPixelAverage: function(x, y, width, height) {
            var rgba = [0, 0, 0, 0];
            
            // 範囲
            var l = x;
            var r = x+width;
            var t = y;
            var b = y+height;
            
            // ハミ出し調整
            if (l < 0) { l = 0; }
            if (r > this.width) { r = this.width; }
            if (t < 0) { t = 0; }
            if (b > this.height) { b = this.height; }
            
            // 範囲内のピクセル全てを取得
            var temp = [];
            var bitmapWidth = this.width;
            for (var i=t; i<b; ++i) {
                for (var j=l; j<r; ++j) {
                    var index = bitmapWidth*i + j;
                    temp.push( this.getPixelIndex(index) );
                    // temp.push( this.getPixelXY(j, i) );
                }
            }
            
            // 平均を求める
            var len = len=temp.length;
            for (var i=0; i<len; ++i) {
                rgba[0] += temp[i][0];
                rgba[1] += temp[i][1];
                rgba[2] += temp[i][2];
                rgba[3] += temp[i][3];
            }
            
            rgba[0]/=len;
            rgba[1]/=len;
            rgba[2]/=len;
            rgba[3]/=len;
            
            return rgba;
        },
        
        
        /**
         * @property
         * index 指定でピクセル値をセット
         * 最も高速
         */
        setPixelIndex: function(index, r, g, b) {
            var i = index*4;
            this.data[i+0] = r;
            this.data[i+1] = g;
            this.data[i+2] = b;
            return this;
        },
        
        /**
         * @property
         * x, y指定でピクセル値をセット
         */
        setPixelXY: function(x, y, r, g, b) {
            return this.setPixelIndex(y*this.imageData.width+x, r, g, b);
        },
        
        /**
         * @property
         * ピクセル値をセット
         */
        setPixel: function(index, r, g, b) {
            return this.setPixelIndex(y*this.imageData.width+x, r, g, b);
        },

        /**
         * @property
         * @TODO ?
         */
        setPixel32Index: function(index, r, g, b, a) {
            var i = index*4;
            this.data[i+0] = r;
            this.data[i+1] = g;
            this.data[i+2] = b;
            this.data[i+3] = a;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setPixel32: function(x, y, r, g, b, a) {
            return this.setPixel32Index(y*this.width+x, r, g, b, a);
        },

        /**
         * @property
         * @TODO ?
         */
        setPixel32XY: function(x, y, r, g, b, a) {
            return this.setPixel32Index(y*this.width+x, r, g, b, a);
        },

        /**
         * @property
         * @TODO ?
         */
        setPixelFromArray: function(index, pixel) {
            return this.setPixel(index, pixel[0], pixel[1], pixel[2]);
        },

        /**
         * @property
         * @TODO ?
         */
        setPixel32FromArray: function(index, pixel) {
            return this.setPixel32(index, pixel[0], pixel[1], pixel[2], pixel[3]);
        },

        /**
         * @property
         * argb
         */
        setPixelFromNumber: function(index, pixel) {
            return this.setPixel(index, (pixel & 0x00ff0000)>>>16, (pixel & 0x0000ff00)>>>8, (pixel & 0x000000ff)>>>0);
        },

        /**
         * @property
         * argb
         */
        setPixel32FromNumber: function(index, pixel) {
            return this.setPixel32(index, (pixel & 0x00ff0000)>>>16, (pixel & 0x0000ff00)>>>8, (pixel & 0x000000ff)>>>0, (pixel & 0xff000000)>>>24);
        },
        
        /**
         * @property
         * object
         */
        setPixelFromObject: function(index, pixel) {
            return this.setPixel(pixel.r, pixel.g, pixel.b);
        },
        /**
         * @property
         * @TODO ?
         */
        setPixel32FromObject: function(index, pixel) {
            return this.setPixel32(pixel.r, pixel.g, pixel.b, pixel.a);
        },
        
        /**
         * @property
         * string
         * rgb, hsl, #... #...... などに対応予定
         */
        setPixelFromString: function(index, pixel) {
            // TODO
        },
        
        /**
         * @property
         * 位置をインデックスに変換
         */
        posToIndex: function(x, y) {
            return y*this.imageData.width + x;
        },
        
        // filter: function(rect, filter)
        /**
         * @property
         * @TODO ?
         */
        filter: function(filter) {
            for (var i=0; i<this.height; ++i) {
                for (var j=0; j<this.width; ++j) {
                    var index = this.posToIndex(j, i);
                    var p = this.getPixel(j, i);
                    
                    filter.calc(p, index, j, i, this);
                }
            }
            
            return this;
        },
        
        /**
         * @property
         * ノイズ
         */
        noise: function(low, high) {
            low = low  || 0;
            high= high || 255;
            range= high-low;
            
            for (var i=0,len=this.length; i<len; ++i) {
                var p = this.getPixelIndex(i);
                p[0] = Math.random()*range + low;
                p[1] = Math.random()*range + low;
                p[2] = Math.random()*range + low;
                p[3] = 255;
                this.setPixel32Index(i, p[0], p[1], p[2], p[3]);
            }
        },

        /**
         * @property
         * @TODO ?
         */
        applyFilter: function(filter) {
            
        },
        
    });
    
    
    tm.graphics.Bitmap.prototype.accessor("width", {
        "get": function()   { return this.imageData.width; },
        "set": function(v)  { this.iamgeData.width = v;    }
    });
    
    tm.graphics.Bitmap.prototype.accessor("height", {
        "get": function()   { return this.imageData.height; },
        "set": function(v)  { this.iamgeData.height = v;    }
    });
    
    tm.graphics.Bitmap.prototype.getter("length", function() {
        return this.imageData.width*this.imageData.height;
    });
    
    
    /**
     * @member      tm.graphics.Canvas
     * @property    getBitmap
     * ビットマップ取得
     */
    tm.graphics.Canvas.prototype.getBitmap = function(x, y, width, height) {
        return tm.graphics.Bitmap(this.context.getImageData(x||0, y||0, width||this.width, height||this.height));
    };
    
    /**
     * @member      tm.graphics.Canvas
     * @property    createBitmap
     * ビットマップ生成
     */
    tm.graphics.Canvas.prototype.createBitmap = function(width, height) {
        return tm.graphics.Bitmap(this.context.createImageData(width||this.width, height||this.height));
    };

    var dummyCanvas = null;
    var dummyContext = null;
    
    
})();


/*
 * filter.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class tm.graphics.MonochromeFilter
     * モノクロフィルタ
     */
    tm.graphics.MonochromeFilter = tm.createClass({
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            
        },
        
        /**
         * @property
         * apply
         */
        apply: function(src, dst) {
            var len = src.length;
            for (var i=0; i<len; ++i) {
                var p = src.getPixelIndex(i);
                var grayscale = p[0]*0.3 + p[1]*0.59 + p[2]*0.11;
                dst.setPixel32Index(i, grayscale, grayscale, grayscale, p[3]);
            }
            
            return dst;
        },
    });
    
    
})();




(function() {
    
    /**
     * @class tm.graphics.ReverseFilter
     * リバースフィルタ
     */
    tm.graphics.ReverseFilter = tm.createClass({
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            
        },
        
        /**
         * @property
         * apply
         */
        apply: function(src, dst) {
            for (var i=0,len=src.width*src.height; i<len; ++i) {
                var p = src.getPixelIndex(i);
                p[0] = 255-p[0];
                p[1] = 255-p[1];
                p[2] = 255-p[2];
                dst.setPixel32Index(i, p[0], p[1], p[2], 255);
            }
            
            return dst;
        },
    });
    
    
})();


(function() {
    
    /**
     * @class tm.graphics.BlurFilter
     * ブラーフィルタ
     * 
     * ### Reference
     * - <http://www40.atwiki.jp/spellbound/pages/153.html>
     * - <http://www.flother.com/blog/2010/image-blur-html5-canvas/>
     */
    tm.graphics.BlurFilter = tm.createClass({
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(blurX, blurY, quality) {
            this.blurX      = blurX || 4;
            this.blurY      = blurY || 4;
            this.quality    = quality || 1;
        },
        
        /**
         * @property
         * apply
         */
        apply: function(src, dst) {
            var halfX       = Math.floor(this.blurX/2);
            var halfY       = Math.floor(this.blurY/2);
            var rangeX      = this.blurX;
            var rangeY      = this.blurY;
            var srcWidth    = src.width;
            var srcHeight   = src.height;
            var len         = src.length;
            
            // ブラー処理
            var _apply = function(src, dst) {
                for (var i=0; i<len; ++i) {
                    var x = i%srcWidth;
                    var y = Math.floor(i/srcWidth);
                    var p = src.getPixelAverage(x-halfX, y-halfY, rangeX, rangeY);
                    dst.setPixel32Index(i, p[0], p[1], p[2], 255);
                }
            };
            
            // quality の回数だけブラーをかける
            var tempDst     = src;
            for (var i=0; i<this.quality; ++i) {
                src = tempDst;
                tempDst = tm.graphics.Bitmap(srcWidth, srcHeight);
                _apply(src, tempDst);
            }
            
            // 結果に代入
            //? メモリリークとか大丈夫なのかな
            dst.imageData = tempDst.imageData;
            
            return dst;
        },
    });
    
    
})();


(function() {
    
    // トゥーンテーブル
    var defaultToonTable = [];
    for(var i=0; i<255; ++i) {
        var n=0;
        
        if      (i<100) { n =  60; }
        else if (i<150) { n = 150; }
        else if (i<180) { n = 180; }
        else            { n = 220; }
        
        defaultToonTable[i] = n;
    }
    
    /**
     * @class tm.graphics.ToonFilter
     * トゥーンフィルタ
     */
    tm.graphics.ToonFilter = tm.createClass({
        
        toonTable: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(toonTable) {
            this.toonTable = toonTable || defaultToonTable;
        },
        
        /**
         * @property
         * apply
         */
        apply: function(src, dst) {
            for (var i=0,len=src.width*src.height; i<len; ++i) {
                var pixel = src.getPixelIndex(i);
                var r = this.toonTable[ pixel[0] ];
                var g = this.toonTable[ pixel[1] ];
                var b = this.toonTable[ pixel[2] ];
                dst.setPixel32Index(i, r, g, b, 255);
            }
            
            return dst;
        },
    });
    
    
})();



(function() {
    
    /**
     * @class tm.graphics.ColorMatrixFilter
     * カラーマトリックスフィルタ
     * 
     * ### Reference
     * - <http://blog.boreal-kiss.com/2008/04/08113113.html/>
     * - <http://voglia.jp/2010/01/26/260>
     * - <http://hakuhin.jp/as/color.html#COLOR_02>
     * - <http://d.hatena.ne.jp/umezo/20090122/1232627694>
     * - <http://www40.atwiki.jp/spellbound/pages/188.html>
     */
    tm.graphics.ColorMatrixFilter = tm.createClass({
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(colorMatrix) {
            this.colorMatrix = colorMatrix;
        },
        
        /**
         * @property
         * apply
         */
        apply: function(src, dst) {
            var cm = this.colorMatrix;
            for (var i=0,len=src.length; i<len; ++i) {
                var pixel = src.getPixelIndex(i);
                var r = (pixel[0] * cm[0]) + (pixel[1] * cm[1]) + (pixel[2] * cm[2]) + (pixel[3] * cm[3]) + cm[4];
                var g = (pixel[0] * cm[5]) + (pixel[1] * cm[6]) + (pixel[2] * cm[7]) + (pixel[3] * cm[8]) + cm[9];
                var b = (pixel[0] * cm[10]) + (pixel[1] * cm[11]) + (pixel[2] * cm[12]) + (pixel[3] * cm[13]) + cm[14];
                var a = (pixel[0] * cm[15]) + (pixel[1] * cm[16]) + (pixel[2] * cm[17]) + (pixel[3] * cm[18]) + cm[19];
                dst.setPixel32Index(i, r, g, b, a);
            }
            
            return dst;
        }
        
    });
    
})();












/*
 * gradient.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    tm.graphics.Canvas.prototype.setGradient = function(gradient) {
        this.context.fillStyle = gradient.gradient;
    };
    
})();

(function() {
    
    /**
     * @class tm.graphics.LinearGradient
     * 線形グラデーション
     */
    tm.graphics.LinearGradient = tm.createClass({

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(x, y, width, height) {
            if (!dummyCanvas) {
                dummyCanvas = document.createElement("canvas");
                dummyContext= dummyCanvas.getContext("2d");
            }
            this._init(x, y, width, height);
            this.init = this._init;
        },

        /**
         * @property
         * 初期化
         * @private
         */
        _init: function(x, y, width, height) {
            this.gradient = dummyContext.createLinearGradient(x, y, width, height);
        },

        /**
         * @property
         * @TODO ?
         */
        addColorStop: function(offset, color) {
            this.gradient.addColorStop(offset, color);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        addColorStopList: function(prop) {
            for (var i=0,len=prop.length; i<len; ++i) {
                var offset  = prop[i].offset;
                var color   = prop[i].color;
                this.addColorStop(offset, color);
            }
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        toStyle: function() {
            return this.gradient;
        },
        
    });

    
    /**
     * @class tm.graphics.RadialGradient
     * 円形グラデーション
     */
    tm.graphics.RadialGradient = tm.createClass({

        /**
         * @constructor
         * コンストラクタ
         */        
        init: function(x0, y0, r0, x1, y1, r1) {
            if (!dummyCanvas) {
                dummyCanvas = document.createElement("canvas");
                dummyContext= dummyCanvas.getContext("2d");
            }
            this._init(x0, y0, r0, x1, y1, r1);
            this.init = this._init;
        },

        /**
         * @property
         * 初期化
         * @private
         */
        _init: function(x0, y0, r0, x1, y1, r1) {
            this.gradient = dummyContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
        },
        
        /**
         * @property
         * @TODO ?
         */
        addColorStop: function(offset, color) {
            this.gradient.addColorStop(offset, color);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        addColorStopList: function(prop) {
            for (var i=0,len=prop.length; i<len; ++i) {
                var offset  = prop[i].offset;
                var color   = prop[i].color;
                this.addColorStop(offset, color);
            }
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        toStyle: function() {
            return this.gradient;
        },
        
    });


    
    var dummyCanvas = null;
    var dummyContext = null;
    
})();
















/*
 * tween.js
 */

tm.anim = tm.anim || {};

(function() {
    
    
    /**
     * @class tm.anim.Tween
     * Tween クラス
     * @extends tm.event.EventDispatcher
     */
    tm.anim.Tween = tm.createClass({
        
        superClass: tm.event.EventDispatcher,
        
        /**
         * @property
         * アニメーションさせる対象
         */
        target      : null,
        /**
         * @property
         * アニメーションの時間
         */
        time        : null,
        /**
         * @property
         * プロパティ 未使用？
         */
        prop        : null,
        /**
         * @property
         * ?
         */
        now         : null,
        /**
         * @property
         * ?
         */
        begin       : null,
        /**
         * @property
         * ?
         */
        finish      : null,
        /**
         * @property
         * アニメーションにかける時間
         */
        duration    : null,
        /**
         * @property
         * ループするかどうか
         */
        isLooping   : null,
        /**
         * @property
         * アニメーション中かどうか
         */
        isPlaying   : null,
        /**
         * @property
         * アニメーション実行関数
         */
        func        : Math.linear,
        
        /**
         * @property
         * フレームレート
         */
        fps     : 30,
        
        /**
         * @property init
         * コンストラクタ
         * @param {Object} target
         * @param {Object} finishProps
         * @param {Object} duration
         * @param {Function} func
         */
        init: function(target, finishProps, duration, func) {
            this.superInit();
            
            this.time = 0;
            this.nowProps = {};
            this.isPlaying = false;

            if (arguments.length > 0) {
                this.to.apply(this, arguments);
            }
        },

        /**
         * @property to
         * 指定した値までアニメーション
         * @param {Object} target
         * @param {Object} finishProps
         * @param {Object} duration
         * @param {Function} func
         */
        to: function(target, finishProps, duration, func) {
            var beginProps = {};

            for (var key in finishProps) {
                beginProps[key] = target[key];
            }

            this.fromTo(target, beginProps, finishProps, duration, func);

            return this;
        },

        /**
         * @property by
         * 指定した値を足した値までアニメーション
         * @param {Object} target
         * @param {Object} props
         * @param {Object} duration
         * @param {Function} func
         */
        by: function(target, props, duration, func) {
            var beginProps = {};
            var finishProps = {};

            for (var key in props) {
                beginProps[key] = target[key];
                finishProps[key] = target[key] + props[key];
            }

            this.fromTo(target, beginProps, finishProps, duration, func);

            return this;
        },

        /**
         * @property fromTo
         * 開始の値から終了の値までアニメーション
         * @param {Object} target
         * @param {Object} beginProps
         * @param {Object} finishProps
         * @param {Object} duration
         * @param {Function} func
         */
        fromTo: function(target, beginProps, finishProps, duration, func) {
            this.target = target;
            this.beginProps  = beginProps;
            this.finishProps = finishProps;
            this.duration = duration;
            
            // setup
            this.changeProps = {};
            for (var key in beginProps) {
                this.changeProps[key] = finishProps[key] - beginProps[key];
            }
            this.setTransition(func);

            return this;
        },

        /**
         * @property from
         * @TODO ?
         * @param {Object} target
         * @param {Object} beginProps
         * @param {Object} duration
         * @param {Function} func
         */
        from: function(target, beginProps, duration, func) {
            var finishProps = {};

            for (var key in beginProps) {
                finishProps[key] = target[key];
            }

            this.fromTo(target, beginProps, finishProps, duration, func);

            return this;
        },
        
        /**
         * @property setTransition
         * easingの指定か、コールバックの指定か調べる
         * @param {Function} func
         */
        setTransition: function(func) {
            if (typeof func == 'function') {
                this.func = func;
            }
            else if (typeof func == 'string'){
                this.func = tm.anim.easing[func];
            }
            else {
                this.func = tm.anim.easing["default"];
            }
            return this;
        },
        
        /**
         * @property resume
         * アニメーションの再開
         */
        resume: function() {
            this.isPlaying = true;
            this._resumeTime();
            this._updateTime();
            this.dispatchEvent(tm.event.TweenEvent("resume", this.time, this.nowProps));
        },
        
        /**
         * @property start
         * アニメーションの開始
         */
        start: function() {
            this.isPlaying = true;
            this._startTime();
            this._updateTime();
            this.dispatchEvent(tm.event.TweenEvent("start", this.time, this.nowProps));
        },
        
        /**
         * @property stop
         * アニメーションのストップ
         */
        stop: function() {
            this.isPlaying = false;
            this.dispatchEvent(tm.event.TweenEvent("stop", this.time, this.nowProps));
        },
        
        /**
         * @property rewind
         * 開始位置まで戻る
         */
        rewind: function() {
            this.time = 0;
            this.update();
        },
        
        /**
         * @property fforward
         * 最後位置まで早送り
         */
        fforward: function() {
            this.time = this.duration;
            this.update();
        },

        /**        
         * @property yoyo
         * ヨーヨーのアニメーション
         */
        yoyo: function() {
            var temp = this.finishProps;
            this.finishProps = this.beginProps;
            this.beginProps  = temp;
            for (var key in this.beginProps) {
                this.changeProps[key] = this.finishProps[key] - this.beginProps[key];
            }
            this.start();
        },
        
        /**
         * @property update
         * 更新
         */
        update: function() {
            for (var key in this.changeProps) {
                this.nowProps[key] = this.func(this.time, this.beginProps[key], this.changeProps[key], this.duration);
                this.target[key] = this.nowProps[key];
            }
            this.dispatchEvent(tm.event.TweenEvent("change", this.time, this.nowProps));
        },
        
        /**
         * @property _resumeTime
         * 時間を巻き戻す
         * @private
         */
        _resumeTime: function() {
            this.startTime = (new Date()).getTime() - this.time;
        },
        
        /**
         * @property _startTime
         * スタート時間を設定
         * @private
         */
        _startTime: function() {
            this.startTime = (new Date()).getTime();
        },
        
        /**
         * @property _updateTime
         * 時間を進める
         * @private
         */
        _updateTime: function() {
            if (this.isPlaying) {
                this._setTime((new Date()).getTime() - this.startTime);
                setTimeout(arguments.callee.bind(this), 1000/this.fps);
            }
        },
        
        /**
         * @property _setTime
         * 時間を設定する
         * @param {Object} t
         * @private
         */
        _setTime: function(t) {
            var time = t;
            // モーション終了
            if (time > this.duration) {
                // ループ
                if (this.isLooping) {
                    this.rewind();
                    // 座標を更新
                    this.update();
                    // イベント開始
                    this.dispatchEvent(tm.event.TweenEvent("loop", this.time, this.nowProps));
                }
                // 終了
                else {
                    this.time = this.duration;
                    // 座標を更新
                    this.update();
                    // 停止
                    this.stop();
                    // イベント
                    this.dispatchEvent(tm.event.TweenEvent("finish", this.time, this.nowProps));
                }
            }
            // 更新
            else {
                this.time = time;
                // 座標を更新
                this.update();
            }
        }
    });
})();


/*
 * easing
 */
(function() {
    
    /**
     * @class tm.anim.easing
     * イージング
     * ### Reference
     * - <http://coderepos.org/share/wiki/JSTweener>
     * - <http://coderepos.org/share/browser/lang/javascript/jstweener/trunk/src/JSTweener.js>
     * - <http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js>
     * - <http://hosted.zeh.com.br/tweener/docs/en-us/misc/transitions.html>
     */
    tm.anim.easing = {
        /**
         * @property
         * default
         */
        "default": function(t, b, c, d) {
            return c*t/d + b;
        },
        
        /**
         * @property
         * linear
         */
        linear: function(t, b, c, d) {
            return c*t/d + b;
        },
        
        /**
         * @property
         * swing
         */
        swing: function(t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        
        /**
         * @property
         * easeInQuad
         */
        easeInQuad: function(t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        
        /**
         * @property
         * easeOutQuad
         */
        easeOutQuad: function(t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        
        /**
         * @property
         * easeInOutQuad
         */
        easeInOutQuad: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 *((--t)*(t-2) - 1) + b;
        },

        /**
         * @property
         * defeInCubic
         */   
        easeInCubic: function(t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },

        /**
         * @property
         * easeOutCubic
         */
        easeOutCubic: function(t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },

        /**
         * @property
         * easeInOutCubic
         */
        easeInOutCubic: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },

        /**
         * @property
         * easeOutInCubic
         */
        easeOutInCubic: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutCubic(t*2, b, c/2, d);
            return tm.anim.easing.easeInCubic((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInQuart
         */
        easeInQuart: function(t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },

        /**
         * @property
         * easeOutQuart
         */
        easeOutQuart: function(t, b, c, d) {
            return -c *((t=t/d-1)*t*t*t - 1) + b;
        },

        /**
         * @property
         * easeInOutQuart
         */
        easeInOutQuart: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 *((t-=2)*t*t*t - 2) + b;
        },

        /**
         * @property
         * easeOutInQuart
         */
        easeOutInQuart: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutQuart(t*2, b, c/2, d);
            return tm.anim.easing.easeInQuart((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInQuint
         */
        easeInQuint: function(t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },

        /**
         * @property
         * easeOutQuint
         */
        easeOutQuint: function(t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },

        /**
         * @property
         * easeInOutQuint
         */
        easeInOutQuint: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },

        /**
         * @property
         * easeOutInQuint
         */
        easeOutInQuint: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutQuint(t*2, b, c/2, d);
            return tm.anim.easing.easeInQuint((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInSine
         */
        easeInSine: function(t, b, c, d) {
            return -c * Math.cos(t/d *(Math.PI/2)) + c + b;
        },

        /**
         * @property
         * easeOutSine
         */
        easeOutSine: function(t, b, c, d) {
            return c * Math.sin(t/d *(Math.PI/2)) + b;
        },

        /**
         * @property
         * easeInOutSine
         */
        easeInOutSine: function(t, b, c, d) {
            return -c/2 *(Math.cos(Math.PI*t/d) - 1) + b;
        },

        /**
         * @property
         * easeOutInSine
         */
        easeOutInSine: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutSine(t*2, b, c/2, d);
            return tm.anim.easing.easeInSine((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInExpo
         */
        easeInExpo: function(t, b, c, d) {
            return(t==0) ? b : c * Math.pow(2, 10 *(t/d - 1)) + b - c * 0.001;
        },

        /**
         * @property
         * easeOutExpo
         */
        easeOutExpo: function(t, b, c, d) {
            return(t==d) ? b+c : c * 1.001 *(-Math.pow(2, -10 * t/d) + 1) + b;
        },

        /**
         * @property
         * easeInOutExpo
         */
        easeInOutExpo: function(t, b, c, d) {
            if(t==0) return b;
            if(t==d) return b+c;
            if((t/=d/2) < 1) return c/2 * Math.pow(2, 10 *(t - 1)) + b - c * 0.0005;
            return c/2 * 1.0005 *(-Math.pow(2, -10 * --t) + 2) + b;
        },

        /**
         * @property
         * easeOutInExpo
         */
        easeOutInExpo: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutExpo(t*2, b, c/2, d);
            return tm.anim.easing.easeInExpo((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInCirc
         */
        easeInCirc: function(t, b, c, d) {
            return -c *(Math.sqrt(1 -(t/=d)*t) - 1) + b;
        },

        /**
         * @property
         * easeOutCirc
         */
        easeOutCirc: function(t, b, c, d) {
            return c * Math.sqrt(1 -(t=t/d-1)*t) + b;
        },

        /**
         * @property
         * easeInOutCirc
         */
        easeInOutCirc: function(t, b, c, d) {
            if((t/=d/2) < 1) return -c/2 *(Math.sqrt(1 - t*t) - 1) + b;
            return c/2 *(Math.sqrt(1 -(t-=2)*t) + 1) + b;
        },

        /**
         * @property
         * easeOutInCirc
         */
        easeOutInCirc: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutCirc(t*2, b, c/2, d);
            return tm.anim.easing.easeInCirc((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInElastic
         */
        easeInElastic: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
            if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
        },

        /**
         * @property
         * easeOutElastic
         */
        easeOutElastic: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
            if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
            return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b);
        },

        /**
         * @property
         * easeInOutElastic
         */
        easeInOutElastic: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
            if(!a || a < Math.abs(c)) { a=c; s=p/4; }       else s = p/(2*Math.PI) * Math.asin(c/a);
            if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },

        /**
         * @property
         * easeOutInElastic
         */
        easeOutInElastic: function(t, b, c, d, a, p) {
            if(t < d/2) return tm.anim.easing.easeOutElastic(t*2, b, c/2, d, a, p);
            return tm.anim.easing.easeInElastic((t*2)-d, b+c/2, c/2, d, a, p);
        },

        /**
         * @property
         * easeInBack
         */
        easeInBack: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },

        /**
         * @property
         * easeOutBack
         */
        easeOutBack: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },

        /**
         * @property
         * easeInOutBack
         */
        easeInOutBack: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },

        /**
         * @property
         * easeOutInBack
         */
        easeOutInBack: function(t, b, c, d, s) {
            if(t < d/2) return tm.anim.easing.easeOutBack(t*2, b, c/2, d, s);
            return tm.anim.easing.easeInBack((t*2)-d, b+c/2, c/2, d, s);
        },

        /**
         * @property
         * easeInBounce
         */
        easeInBounce: function(t, b, c, d) {
            return c - tm.anim.easing.easeOutBounce(d-t, 0, c, d) + b;
        },

        /**
         * @property
         * easeOutBounce
         */
        easeOutBounce: function(t, b, c, d) {
            if((t/=d) <(1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if(t <(2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if(t <(2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },

        /**
         * @property
         * easeInOutBounce
         */
        easeInOutBounce: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeInBounce(t*2, 0, c, d) * .5 + b;
            else return tm.anim.easing.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
        },

        /**
         * @property
         * easeOutInBounce
         */
        easeOutInBounce: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutBounce(t*2, b, c/2, d);
            return tm.anim.easing.easeInBounce((t*2)-d, b+c/2, c/2, d);
        }
    };
    
})();








/*
 * baseapp.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class tm.app.BaseApp
     * ベースアプリケーション
     */
    tm.app.BaseApp = tm.createClass({
        
        /**
         * @property
         * エレメント
         */
        element     : null,

        /**
         * @property
         * マウスクラス
         */
        mouse       : null,

        /**
         * @property
         * タッチクラス
         */
        touch       : null,

        /**
         * @property
         * マウスクラス + タッチクラス
         */
        pointing    : null,

        /**
         * @property
         * キーボードクラス
         */
        keyboard    : null,

        /**
         * @property
         * statsライブラリ
         */
        stats       : null,

        /**
         * @property
         * フレーム
         */
        frame       : 0,

        /**
         * @property
         * フレームレート
         */
        fps         : 30,

        /**
         * @property
         * 現在更新中か
         */
        isPlaying   : null,
        
        /**
         * @property
         * シーン情報の管理
         * @private
         */
        _scenes      : null,

        /**
         * @property
         * シーンのインデックス
         * @private
         */
        _sceneIndex  : 0,

        /**
         * @property init
         * コンストラクタ
         * @param {Object} elm
         */
        init: function(elm) {
            this.element = elm;

            // マウスを生成
            this.mouse      = tm.input.Mouse(this.element);
            // タッチを生成
            this.touches    = tm.input.Touches(this.element, 3);
            this.touch      = this.touches[0];
            // キーボードを生成
            this.keyboard   = tm.input.Keyboard();
            
            // ポインティングをセット(PC では Mouse, Mobile では Touch)
            this.pointing   = (tm.isMobile) ? this.touch : this.mouse;
            
            // 加速度センサーを生成
            this.accelerometer = tm.input.Accelerometer();
            
            // 再生フラグ
            this.isPlaying = true;
            
            // シーン周り
            this._scenes = [ tm.app.Scene() ];
            this._sceneIndex = 0;
            
            // 決定時の処理をオフにする(iPhone 時のちらつき対策)
            this.element.addEventListener("touchstart", function(e) { e.stop(); });
            
            // ウィンドウフォーカス時イベントリスナを登録
            window.addEventListener("focus", function() {
                this.currentScene.dispatchEvent(tm.event.Event("focus"));
            }.bind(this));
            // ウィンドウブラー時イベントリスナを登録
            window.addEventListener("blur", function() {
                this.currentScene.dispatchEvent(tm.event.Event("blur"));
            }.bind(this));
            // クリック
            this.element.addEventListener((tm.isMobile) ? "touchstart" : "mousedown", this._onclick.bind(this));
        },
        
        /**
         * @property
         * 実行
         */
        run: function() {
            var self = this;
            
            // // requestAnimationFrame version
            // var fn = function() {
                // self._loop();
                // requestAnimationFrame(fn);
            // }
            // fn();
            
            tm.setLoop(function(){ self._loop(); }, 1000/this.fps);
            
            return ;
            
            if (true) {
                setTimeout(arguments.callee.bind(this), 1000/this.fps);
                this._loop();
            }
            
            return ;
            
            var self = this;
            // setInterval(function(){ self._loop(); }, 1000/self.fps);
            tm.setLoop(function(){ self._loop(); }, 1000/self.fps);
        },
        
        /*
         * @property
         * ループ処理
         * @private
         */
        _loop: function() {
            // update
            if (this.update) this.update();
            this._update();
            
            // draw
            if (this.draw) this.draw();
            this._draw();
            
            // stats update
            if (this.stats) this.stats.update();
        },
        
        /**
         * @property
         * シーンを切り替える
         * @param {Object} scene
         * ## Reference
         * - <http://ameblo.jp/hash-r-1234/entry-10967942550.html>
         */
        replaceScene: function(scene) {
            var e = null;
            if (this.currentScene) {
                e = tm.event.Event("exit");
                e.app = this;
                this.currentScene.dispatchEvent(e);
                this.currentScene.app = null;
            }
            e = tm.event.Event("enter");
            e.app = this;
            this.currentScene = scene;
            this.currentScene.app = this;
            this.currentScene.dispatchEvent(e);
        },
        
        /**
         * @property
         * シーンをプッシュする(ポーズやオブション画面などで使用)
         * @param {Object} scene
         */
        pushScene: function(scene) {
            e = tm.event.Event("exit");
            e.app = this;
            this.currentScene.dispatchEvent(e);
            
            this._scenes.push(scene);
            ++this._sceneIndex;
            
            e = tm.event.Event("enter");
            e.app = this;
            scene.app = this;
            scene.dispatchEvent(e);
        },
        
        /**
         * @property
         * シーンをポップする(ポーズやオブション画面などで使用)
         */
        popScene: function() {
            var scene = this._scenes.pop();
            --this._sceneIndex;
            
            e = tm.event.Event("exit");
            e.app = this;
            scene.dispatchEvent(e);
            scene.app = null;
            
            // 
            e = tm.event.Event("enter");
            e.app = this;
            this.currentScene.dispatchEvent(e);
            
            return scene;
        },
        
        /**
         * @property
         * 外部のFPS表示ライブラリ Stats を生成、配置する
         * ## Reference
         * - <https://github.com/mrdoob/stats.js>
         */
        enableStats: function() {
            if (window["Stats"]) {
                // Stats
                this.stats = new Stats();
                // 右上に設定
                this.stats.domElement.style.position = "fixed";
                this.stats.domElement.style.left     = "5px";
                this.stats.domElement.style.top      = "20px";
                document.body.appendChild(this.stats.domElement);
            }
            else {
                console.warn("not defined stats.");
            }
        },
        
        /**
         * @property
         * @TODO ?
         */
        enableDatGUI: function() {
            if (window.dat) {
                var gui = new dat.GUI();
                
                return gui;
            }
        },
        
        /**
         * @property
         * シーンのupdateを実行するようにする
         */
        start: function() {
            this.isPlaying = true;
        },
        
        /**
         * @property
         * シーンのupdateを実行しないようにする
         */
        stop: function() {
            this.isPlaying = false;
        },
        
        /**
         * @property
         * デバイスやシーンのアップデート呼び出し処理
         * @private
         */
        _update: function() {
            // デバイス系 Update
            this.mouse.update();
            this.keyboard._update();
            this.touches.update();
            
            if (this.isPlaying) {
                this.currentScene._update(this);
                ++this.frame;
            }
        },
        
        /**
         * @property
         * @TODO ? オーバーライド予定？
         * @private
         */
        _draw: function() {},
        
        /**
         * @property
         * elementの取得
         */
        getElement: function() {
            return this.element;
        },

        /**
         * @property
         * クリックイベント登録
         * @private
         * @param {Object} e
         */
        _onclick: function(e) {
            var px = e.pointX;
            var py = e.pointY;

            if (this.element.style.width) {
                px *= this.element.width / parseInt(this.element.style.width);
            }
            if (this.element.style.height) {
                py *= this.element.height / parseInt(this.element.style.height);
            }

            var _fn = function(elm) {
                if (elm.children.length > 0) {
                    elm.children.each(function(elm) {
                        if (elm.hasEventListener("click")) {
                            if (elm.isHitPoint && elm.isHitPoint(px, py)) {
                                elm.dispatchEvent(tm.event.Event("click"));
                            }
                        }
                    });
                }
            };
            _fn(this.currentScene);
        },
    });
    
    /**
     * @member      tm.app.BaseApp
     * @property    currentScene
     * カレントシーン
     */
    tm.app.BaseApp.prototype.accessor("currentScene", {
        "get": function() { return this._scenes[this._sceneIndex]; },
        "set": function(v){ this._scenes[this._sceneIndex] = v; }
    });
    
})();

/*
 * element.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class tm.app.Element
     * アプリケーション用オブジェクトの基底となるクラス
     * 親子関係の情報を管理する
     * @extends tm.event.EventDispatcher
     */
    tm.app.Element = tm.createClass({
        superClass: tm.event.EventDispatcher,
        
        /**
         * @property
         * 親
         */
        parent: null,

        /**
         * @property
         * 子
         */
        children: null,
        
        /**
         * @property init
         * コンストラクタ
         */
        init: function() {
            
            this.superInit();
            
            this.children = [];
            this._listeners = {};
        },
        
        /**
         * @property
         * 親から離す
         */
        remove: function() {
            console.assert(this.parent);
            this.parent.removeChild(this);

            this.parent = null;
            
            return this;
        },
        
        /**
         * @property
         * 子供を追加
         * @param {Object} child
         */
        addChild: function(child) {
            if (child.parent) child.remove();
            child.parent = this;
            this.children.push(child);

            var e = tm.event.Event("added");
            child.dispatchEvent(e);
            
            return child;
        },
        
        /**
         * @property
         * parent に自分を子供として追加
         * @param {Object} parent
         */
        addChildTo: function(parent) {
            parent.addChild(this);
            
            // if (this.parent) this.remove();
            // this.parent = parent;
            // parent.children.push(child);
            
            return this;
        },
        
        /**
         * @property
         * まとめて追加
         * scene 遷移時に子供をごっそり移譲するときなどに使用
         * まだ動作確認していない
         * @param {Object} children
         */
        addChildren: function(children) {
            var tempChildren = children.slice();
            for (var i=beginIndex,len=tempChildren.length; i<len; ++i) {
                this.addChild(tempChildren[i]);
            }
        },
        
        /**
         * @property
         * index 指定で要素を取得
         */
        addChildAt: function(child, index) {
            if (child.parent) child.remove();
            child.parent = this;
            this.children.splice(index, 0, child);

            var e = tm.event.Event("added");
            child.dispatchEvent(e);

            return child;
        },
        
        /**
         * index 指定で要素を取得
         */
        getChildAt: function(child) {
            return this.children.indexOf(child);
        },
        
        /**
         * @property
         * child に一致するエレメントを離す
         * @param {Object} child
         */
        removeChild: function(child) {
            var index = this.children.indexOf(child);
            if (index != -1) {
                this.children.splice(index, 1);
                var e = tm.event.Event("removed");
                child.dispatchEvent(e);
            }
        },
        
        /**
         * @property
         * すべての child を離す
         * @param {Object} beginIndex
         */
        removeChildren: function(beginIndex) {
            beginIndex = beginIndex || 0;
            var tempChildren = this.children.slice();
            for (var i=beginIndex,len=tempChildren.length; i<len; ++i) {
                tempChildren[i].remove();
            }
            this.children = [];
        },
        
        /**
         * @property
         * 名前の一致する child を取得
         * @param {String} name
         */
        getChildByName: function(name) {
            for (var i=0,len=this.children.length; i<len; ++i)
                if (this.children[i].name == name) return this.children[i];
            
            return null;
        },
        
        /**
         * @property
         * 関数実行
         * @param {Function} func
         * @param {Object} args
         */
        execChildren: function(func, args) {
            args = (args && args.length) ? args : [args];
            // 関数内で remove される可能性があるので配列をコピーする
            var tempChildren = this.children.slice();
            for (var i=0,len=tempChildren.length; i<len; ++i) {
                func.apply(tempChildren[i], args);
            }
        },
        
        /**
         * @property
         * 親を取得
         */
        getParent: function() { return this.parent; },
        
        /**
         * @property
         * ルートを取得
         */
        getRoot: function() {
            if (!this.parent) return null;
            // TODO: 親をたどって NULL だったらそのエレメントを返す
            var elm = null;
            for (elm=this.parent; elm.parent != null; elm = elm.parent) {}
            return elm;
        },
        
        fromJSON: function(data) {
            for (var key in data) {
                var value = data[key];
                if (key == "children") {
                    for (var i=0,len=value.length; i<len; ++i) {
                        var data = value[i];
                        var init = data["init"] || [];
                        var type = (DIRTY_CLASS_MAP[data.type]) ? DIRTY_CLASS_MAP[data.type] : data.type;
                        var _class = tm.using(type);
                        
                        console.assert(Object.keys(_class).length !== 0, _class + " is not defined.");
                        
                        var elm = _class.apply(null, init).addChildTo(this);
                        elm.fromJSON(data);
                        this[data.name] = elm;
                    }
                }
                else {
                    this[key] = value;
                }
            }

            return this;
        },
        
    });

    var DIRTY_CLASS_MAP = {
        "Sprite"            : "tm.display.Sprite",
        "Label"             : "tm.display.Label",
        "Shape"             : "tm.display.Shape",
        "CircleShape"       : "tm.display.CircleShape",
        "TriangleShape"     : "tm.display.TriangleShape",
        "RectangleShape"    : "tm.display.RectangleShape",
        "StarShape"         : "tm.display.StarShape",
        "PolygonShape"      : "tm.display.PolygonShape",
        "HeartShape"        : "tm.display.HeartShape",
        "AnimationSprite"   : "tm.display.AnimationSprite",
        
        "LabelButton"       : "tm.ui.LabelButton",
        "IconButton"        : "tm.ui.IconButton",
        "GlossyButton"      : "tm.ui.GlossyButton",
        "FlatButton"        : "tm.ui.FlatButton",
    };
    
})();

/*
 * object2d.js
 */

(function() {
    
    /**
     * @class tm.app.Object2D
     * Object2D
     * @extends tm.app.Element
     */
    tm.define("tm.app.Object2D", {
        superClass: "tm.app.Element",
        
        /**
         * @property
         * 位置
         */
        position: null,

        /**
         * @property
         * 回転
         */
        rotation: 0,

        /**
         * @property
         * スケール
         */
        scale: null,
        
        /**
         * @property
         * 幅
         * @private
         */
        _width:  64,

        /**
         * @property
         * 高さ
         * @private
         */
        _height: 64,
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} elm
         */
        init: function() {
            this.superInit();
            this.position = tm.geom.Vector2(0, 0);
            this.scale    = tm.geom.Vector2(1, 1);
            this.pointing = tm.geom.Vector2(0, 0);
            this.origin   = tm.geom.Vector2(0.5, 0.5);
            this._matrix  = tm.geom.Matrix33();
            this._matrix.identity();
            
            this.boundingType = "circle";
            this.interactive = false;
            this.hitFlags = [];
            this.downFlags= [];

            this._worldMatrix = tm.geom.Matrix33();
            this._worldMatrix.identity();
            this._worldAlpha = 1.0;
        },
        
        /**
         * @property
         * @TODO ?
         */
        getFinalMatrix: function() {
            var matrix = tm.geom.Matrix33();
 
            if (this.parent) {
                matrix.multiply(this.parent.getFinalMatrix());
            }
            matrix.translate(this.centerX, this.centerY);
            matrix.rotateZ(this.rotation*Math.DEG_TO_RAD);
            matrix.scale(this.scaleX, this.scaleY);
 
            return matrix;
        },
        
        /**
         * @property
         * 点と衝突しているかを判定
         * @param {Number} x
         * @param {Number} y
         */
        isHitPoint: function(x, y) {
            // 円判定
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            if (((p.x)*(p.x)+(p.y)*(p.y)) < (this.radius*this.radius)) {
                return true;
            }
            return false;
        },
 
        /**
         * @property
         * @TODO ?
         * @param {Number} x
         * @param {Number} y
         */
        isHitPointCircle: function(x, y) {
            var lenX = this.x - x;
            var lenY = this.y - y;
            if (((lenX)*(lenX)+(lenY)*(lenY)) < (this.radius*this.radius)) {
                return true;
            }
            return false;
        },
 
        /**
         * @property
         * @TODO ?
         * @param {Number} x
         * @param {Number} y
         */
        isHitPointRect: function(x, y) {
            // ここから下のバージョンは四角形
            var globalPos = (this.parent) ? this.parent.localToGlobal(this) : this;
            // var globalPos = this;
            
            var left   = globalPos.x - this.width*this.originX;
            var right  = globalPos.x + this.width*(1-this.originX);
            var top    = globalPos.y - this.height*this.originY;
            var bottom = globalPos.y + this.height*(1-this.originY);
            
            if ( left < x && x < right && top  < y && y < bottom ) { return true; }
            
            return false;
        },
        
        /**
         * @property
         * 階層を考慮した円衝突判定
         * @param {Number} x
         * @param {Number} y
         */
        isHitPointCircleHierarchy: function(x, y) {
            // 円判定
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            if (((p.x)*(p.x)+(p.y)*(p.y)) < (this.radius*this.radius)) {
                return true;
            }
            return false;
        },
        
        /**
         * @property
         * 階層を考慮した矩形衝突判定
         * @param {Number} x
         * @param {Number} y
         */
        isHitPointRectHierarchy: function(x, y) {
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            var left   = -this.width*this.originX;
            var right  = +this.width*(1-this.originX);
            var top    = -this.height*this.originY;
            var bottom = +this.height*(1-this.originY);
            
            if ( left < p.x && p.x < right && top  < p.y && p.y < bottom ) { return true; }
            
            return false;
        },
        
        /**
         * @property
         * 要素と衝突しているかを判定
         * @param {Object} elm
         */
        isHitElement: function(elm) {
            var selfGlobalPos  = this.parent.localToGlobal(this);
            if (((this.x-elm.x)*(this.x-elm.x)+(this.y-elm.y)*(this.y-elm.y)) < (this.radius+elm.radius)*(this.radius+elm.radius)) {
                return true;
            }
            return false;
        },
 
        /**
         * @property
         * 円同士の衝突判定
         * @param {Object} elm
         */
        isHitElementCircle: function(elm) {
            return tm.collision.testCircleCircle(this.getBoundingCircle(), elm.getBoundingCircle());
        },
 
        /**
         * @property
         * 円同士の衝突判定
         * @param {Object} elm
         */
        isHitElementRect: function(elm) {
            return tm.collision.testRectRect(this.getBoundingRect(), elm.getBoundingRect());    
        },
 
        /**
         * @property
         * バウンディングサークル
         * @param {Object} elm
         */
        getBoundingCircle: function() {
            return tm.geom.Circle(this.centerX, this.centerY, this.radius);
        },
 
        /**
         * @property
         * バウンディングレクト
         * @param {Object} elm
         */
        getBoundingRect: function() {
            return tm.geom.Rect(this.left, this.top, this.width, this.height);
        },
 
        /**
         * @property
         * ローカル座標をグローバル座標に変換
         * @param {Object} elm
         */
        localToGlobal: function(p) {
            return this.getFinalMatrix().multiplyVector2(p);
        },
        
        /**
         * @property
         * グローバル座標をローカル座標に変換
         * @param {Object} elm
         */
        globalToLocal: function(p) {
            // var matrix = this.getFinalMatrix();
            var matrix = this._worldMatrix.clone();
            matrix.invert();
            matrix.transpose();
            
            return matrix.multiplyVector2(p);
        },
        
        /**
         * @property
         * X 座標値をセット
         * @param {Number} x
         */
        setX: function(x) {
            this.position.x = x;
            return this;
        },
        
        /**
         * @property
         * Y 座標値をセット
         * @param {Number} y
         */
        setY: function(y) {
            this.position.y = y;
            return this;
        },
        
        /**
         * @property
         * XY 座標をセット
         * @param {Number} x
         * @param {Number} y
         */
        setPosition: function(x, y) {
            this.position.x = x;
            this.position.y = y;
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @param {Number} rotation
         */
        setRotation: function(rotation) {
            this.rotation = rotation;
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @param {Number} x
         * @param {Number} y
         */
        setScale: function(x, y) {
            this.scale.x = x;
            if (arguments.length <= 1) {
                this.scale.y = x;
            } else {
                this.scale.y = y;
            }
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         * @param {Number} x
         * @param {Number} y
         */
        setOrigin: function(x, y) {
            this.origin.x = x;
            this.origin.y = y;
            return this;
        },
        
        /**
         * @property
         * 幅をセット
         * @param {Number} width
         */
        setWidth: function(width) {
            this.width = width;
            return this;
        },
        
        /**
         * @property
         * 高さをセット
         * @param {Number} height
         */
        setHeight: function(height) {
            this.height = height;
            return this;
        },
        
        /**
         * @property
         * サイズ(幅, 高さ)をセット
         * @param {Number} width
         * @param {Number} height
         */
        setSize: function(width, height) {
            this.width  = width;
            this.height = height;
            return this;
        },
        
        /**
         * @property
         * 起動
         */
        wakeUp: function() {
            this.isUpdate = true;
            return this;
        },
        
        /**
         * @property
         * 停止
         */
        sleep: function() {
            this.isUpdate = false;
            return this;
        },
        
        /**
         * @property
         * タッチ判定の有効/無効をセット
         * @param {Boolean} flag
         */
        setInteractive: function(flag) {
            this.interactive = flag;
            return this;
        },
        
        /**
         * @property
         * バウンディングタイプをセット("circle" or "rect")
         * @param {Object} type
         */
        setBoundingType: function(type) {
            this.boundingType = type;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} app
         */
        _update: function(app) {
            // 更新有効チェック
            if (this.isUpdate == false) return ;
            
            if (this.update) this.update(app);
            
            if (this.hasEventListener("enterframe")) {
                var e = tm.event.Event("enterframe");
                e.app = app;
                this.dispatchEvent(e);
            }
            
            if (this.interactive) {
                this._checkPointing(app);
            }
            
            // 子供達も実行
            if (this.children.length > 0) {
                var tempChildren = this.children.slice();
                for (var i=0,len=tempChildren.length; i<len; ++i) {
                    tempChildren[i]._update(app);
                }
            }
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} app
         */
        _checkPointing: function(app) {
            console.assert(false);
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} app
         */
        _checkMouse: function(app) {
            this.__checkPointing(app, app.pointing, 0);
        },

        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} app
         */
        _checkTouch: function(app) {
            var self = this;
            app.touches.each(function(touch, i) {
                self.__checkPointing(app, touch, i);
            });
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} app
         * @param {Object} p
         * @param {Number} index
         */
        __checkPointing: function(app, p, index) {
            var elm = this.element;
            
            var prevHitFlag = this.hitFlags[index];
            
            this.hitFlags[index]    = this.isHitPoint(p.x, p.y);
            
            if (!prevHitFlag && this.hitFlags[index]) {
                this._dispatchPointingEvent("mouseover", "touchover", "pointingover", app, p);
            }
            
            if (prevHitFlag && !this.hitFlags[index]) {
                this._dispatchPointingEvent("mouseout", "touchout", "pointingout", app, p);
            }
            
            if (this.hitFlags[index]) {
                if (p.getPointingStart()) {
                    this._dispatchPointingEvent("mousedown", "touchstart", "pointingstart", app, p);
                    this.downFlags[index] = true;
                }
            }
            
            if (this.downFlags[index]) {
                this._dispatchPointingEvent("mousemove", "touchmove", "pointingmove", app, p);
            }
            
            if (this.downFlags[index]==true && p.getPointingEnd()) {
                this._dispatchPointingEvent("mouseup", "touchend", "pointingend", app, p);
                this.downFlags[index] = false;
            }
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} mouse
         * @param {Object} touch
         * @param {Object} pointing
         * @param {Object} app
         * @param {Object} p
         */
        _dispatchPointingEvent: function(mouse, touch, pointing, app, p) {
            this.dispatchEvent( tm.event.MouseEvent(mouse, app, p) );
            this.dispatchEvent( tm.event.TouchEvent(touch, app, p) );
            this.dispatchEvent( tm.event.PointingEvent(pointing, app, p) );
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _calcWorldMatrix: function() {
            if (!this.parent) {
                return ;
            }

            // 行列
            if(this.rotation != this.rotationCache) {
                this.rotationCache = this.rotation;
                var r = this.rotation*Math.DEG_TO_RAD;
                this._sr =  Math.sin(r);
                this._cr =  Math.cos(r);
            }

            var localTransform = this._matrix.m;
            var parentTransform = this.parent._worldMatrix.m;
            var worldTransform = this._worldMatrix.m;
            //console.log(localTransform)
            localTransform[0] = this._cr * this.scale.x;
            localTransform[1] =-this._sr * this.scale.y
            localTransform[3] = this._sr * this.scale.x;
            localTransform[4] = this._cr * this.scale.y;

            ///AAARR GETTER SETTTER!
            localTransform[2] = this.position.x;
            localTransform[5] = this.position.y;

            // Cache the matrix values (makes for huge speed increases!)
            var a00 = localTransform[0], a01 = localTransform[1], a02 = localTransform[2],
                a10 = localTransform[3], a11 = localTransform[4], a12 = localTransform[5],

                b00 = parentTransform[0], b01 = parentTransform[1], b02 = parentTransform[2],
                b10 = parentTransform[3], b11 = parentTransform[4], b12 = parentTransform[5];

            worldTransform[0] = b00 * a00 + b01 * a10;
            worldTransform[1] = b00 * a01 + b01 * a11;
            worldTransform[2] = b00 * a02 + b01 * a12 + b02;

            worldTransform[3] = b10 * a00 + b11 * a10;
            worldTransform[4] = b10 * a01 + b11 * a11;
            worldTransform[5] = b10 * a02 + b11 * a12 + b12;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _dirtyCalc: function() {
            this._calcWorldMatrix();
        },
    });
 
    /**
     * @property    x
     * x座標値
     */
    tm.app.Object2D.prototype.accessor("x", {
        "get": function()   { return this.position.x; },
        "set": function(v)  { this.position.x = v; }
    });
    
    /**
     * @property    y
     * y座標値
     */
    tm.app.Object2D.prototype.accessor("y", {
        "get": function()   { return this.position.y; },
        "set": function(v)  { this.position.y = v; }
    });
 
    /**
     * @property    originX
     * x座標値
     */
    tm.app.Object2D.prototype.accessor("originX", {
        "get": function()   { return this.origin.x; },
        "set": function(v)  { this.origin.x = v; }
    });
    
    /**
     * @property    originY
     * y座標値
     */
    tm.app.Object2D.prototype.accessor("originY", {
        "get": function()   { return this.origin.y; },
        "set": function(v)  { this.origin.y = v; }
    });
    
    /**
     * @property    scaleX
     * スケールX値
     */
    tm.app.Object2D.prototype.accessor("scaleX", {
        "get": function()   { return this.scale.x; },
        "set": function(v)  { this.scale.x = v; }
    });
    
    /**
     * @property    scaleY
     * スケールY値
     */
    tm.app.Object2D.prototype.accessor("scaleY", {
        "get": function()   { return this.scale.y; },
        "set": function(v)  { this.scale.y = v; }
    });
    
    
    
    /**
     * @property    width
     * width
     */
    tm.app.Object2D.prototype.accessor("width", {
        "get": function()   { return this._width; },
        "set": function(v)  { this._width = v; }
    });
    
    
    /**
     * @property    height
     * height
     */
    tm.app.Object2D.prototype.accessor("height", {
        "get": function()   { return this._height; },
        "set": function(v)  { this._height = v; }
    });
    
    /**
     * @property    radius
     * 半径
     */
    tm.app.Object2D.prototype.accessor("radius", {
        "get": function()   { return this._radius || (this.width+this.height)/4; },
        "set": function(v)  { this._radius = v; }
    });
    
    /**
     * @property    top
     * 左
     */
    tm.app.Object2D.prototype.getter("top", function() {
        return this.y - this.height*this.originY;
    });
 
    /**
     * @property    right
     * 左
     */
    tm.app.Object2D.prototype.getter("right", function() {
        return this.x + this.width*(1-this.originX);
    });
 
    /**
     * @property    bottom
     * 左
     */
    tm.app.Object2D.prototype.getter("bottom", function() {
        return this.y + this.height*(1-this.originY);
    });
 
    /**
     * @property    left
     * 左
     */
    tm.app.Object2D.prototype.getter("left", function() {
        return this.x - this.width*this.originX;
    });
 
    /**
     * @property    centerX
     * centerX
     */
    tm.app.Object2D.prototype.accessor("centerX", {
        "get": function()   { return this.x + this.width/2 - this.width*this.originX; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
 
    /**
     * @property    centerY
     * centerY
     */
    tm.app.Object2D.prototype.accessor("centerY", {
        "get": function()   { return this.y + this.height/2 - this.height*this.originY; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
 
    /**
     * @property    boundingType
     * boundingType
     */
    tm.app.Object2D.prototype.accessor("boundingType", {
        "get": function() {
            return this._boundingType;
        },
        "set": function(v) {
            this._boundingType = v;
            this._setIsHitFunc();
        },
    });
 
    /**
     * @property    checkHierarchy
     * checkHierarchy
     */
    tm.app.Object2D.prototype.accessor("checkHierarchy", {
        "get": function()   { return this._checkHierarchy; },
        "set": function(v)  {
            this._checkHierarchy = v;
            this._setIsHitFunc();
        }
    });
 
 
    var _isHitFuncMap = {
        "rect": tm.app.Object2D.prototype.isHitPointRect,
        "circle": tm.app.Object2D.prototype.isHitPointCircle,
        "true": function() { return true; },
        "false": function() { return false; },
    };
 
    var _isHitFuncMapHierarchy = {
        "rect": tm.app.Object2D.prototype.isHitPointRectHierarchy,
        "circle": tm.app.Object2D.prototype.isHitPointCircleHierarchy,
        "true": function() { return true; },
        "false": function() { return false; },
    };
 
    var _isHitElementMap = {
        "rect": tm.app.Object2D.prototype.isHitElementRect,
        "circle": tm.app.Object2D.prototype.isHitElementCircle,
        "true": function() { return true; },
        "false": function() { return false; },
    };
 
    /**
     * @member      tm.app.Object2D.prototype
     * @property    _setIsHitFunc
     * @private
     */
    tm.app.Object2D.prototype._setIsHitFunc = function() {
        var isHitFuncMap = (this.checkHierarchy) ? _isHitFuncMapHierarchy : _isHitFuncMap;
        var boundingType = this.boundingType;
        var isHitFunc = (isHitFuncMap[boundingType]) ? (isHitFuncMap[boundingType]) : (isHitFuncMap["true"]);
 
        this.isHitPoint   = (isHitFuncMap[boundingType]) ? (isHitFuncMap[boundingType]) : (isHitFuncMap["true"]);
        this.isHitElement = (_isHitElementMap[boundingType]) ? (_isHitElementMap[boundingType]) : (_isHitElementMap["true"]);
    };
    
    /**
     * @member      tm.app.Object2D.prototype
     * @property    _checkPointing
     * @TODO ?
     * @param {Object} isMobile
     * @private
     */
    tm.app.Object2D.prototype._checkPointing = (tm.isMobile) ?
        tm.app.Object2D.prototype._checkTouch : tm.app.Object2D.prototype._checkMouse;

    
})();

/*
 * scene.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class tm.app.Scene
     * シーンとして使用するゲームエレメントクラス
     * @extends tm.app.Object2D
     */
    tm.app.Scene = tm.createClass({
        superClass: tm.app.Object2D,
    
        /**
         * @property
         * @TODO ?
         * @private
         */
        _sceneResultCallback: null,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.superInit();
            
            this.boundingType = "none";
            
            // タッチに反応させる
            this.setInteractive(true);
        },

    });
    
})();

(function() {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
    };
    
    /**
     * @class tm.app.LoadingScene
     * ローディングシーン
     * @extends tm.app.Scene
     */
    tm.app.LoadingScene = tm.createClass({
        superClass: tm.app.Scene,
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} param
         */
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            var label = tm.display.Label("Loading");
            label.x = param.width/2;
            label.y = param.height/2;
            label.width = param.width;
            label.align     = "center";
            label.baseline  = "middle";
            label.fontSize = 32;
            label.counter = 0;
            label.update = function(app) {
                if (app.frame % 30 == 0) {
                    this.text += ".";
                    this.counter += 1;
                    if (this.counter > 3) {
                        this.counter = 0;
                        this.text = "Loading";
                    }
                }
            };
            this.addChild(label);

            // ひよこさん
            var piyo = tm.display.Shape(84, 84);
            piyo.setPosition(param.width, param.height - 80);
            piyo.canvas.setColorStyle("white", "yellow").fillCircle(42, 42, 32);
            piyo.canvas.setColorStyle("white", "black").fillCircle(27, 27, 2);
            piyo.canvas.setColorStyle("white", "brown").fillRect(40, 70, 4, 15).fillTriangle(0, 40, 11, 35, 11, 45);
            piyo.update = function(app) {
                piyo.x -= 4;
                if (piyo.x < -80) piyo.x = param.width;
                piyo.rotation -= 7;
            };

            this.addChild(piyo);

            this.alpha = 0.0;
            this.tweener.clear().fadeIn(100).call(function() {
                if (param.assets) {
                    tm.asset.AssetManager.onload = function() {
                        this.tweener.clear().fadeOut(200).call(function() {
                            this.app.replaceScene(param.nextScene());
                        }.bind(this));
                    }.bind(this);
                    tm.asset.AssetManager.load(param.assets);
                }
            }.bind(this));
        },
    });
    
    
})();
    
(function() {
    
    var DEFAULT_PARAM = {
        title: "Time is money",
        titleSize: 32,
        width: 465,
        height: 465,
    };
    
    /**
     * @class tm.app.TitleScene
     * ローディングシーン
     * @extends tm.app.Scene
     */
    tm.app.TitleScene = tm.createClass({
        superClass: tm.app.Scene,
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} param
         */
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);

            if (param.backgroundImage) {
                var texture = tm.asset.AssetManager.get(param.backgroundImage);
                this._backgroundImage = tm.display.Sprite(texture, param.width, param.height);
                this._backgroundImage.originX = this._backgroundImage.originY = 0;
                this.addChild(this._backgroundImage);
            }
            
            var label = tm.display.Label(param.title);
            label.x = param.width/2;
            label.y = param.height/2;
            label.width = param.width;
            label.align     = "center";
            label.baseline  = "middle";
            label.fontSize = param.titleSize;
            this.addChild(label);
        },

        /**
         * @property
         * pointingstartイベント登録
         */
        onpointingstart: function() {
            var e = tm.event.Event("nextscene");
            this.dispatchEvent(e);
        },
    });
    
    
})();

(function() {
    
    
    var DEFAULT_PARAM = {
        score: 256,
        msg: "tmlib.js のサンプルです!",
        hashtags: "tmlibjs",
        url: "https://github.com/phi1618/tmlib.js/",
        width: 465,
        height: 465,
        related: "tmlib.js tmlife javascript",
    };
    
    /**
     * @class tm.app.ResultScene
     * ローディングシーン
     * @extends tm.app.Scene
     */
    tm.app.ResultScene = tm.createClass({
        superClass: tm.app.Scene,
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} param
         */
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            var text = "SCORE: {score}, {msg}".format(param);
            var twitterURL = this.tweetURL = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : text,
                hashtags: param.hashtags,
                url     : param.url, // or window.document.location.href
            });

            if (param.backgroundImage) {
                var texture = tm.asset.AssetManager.get(param.backgroundImage);
                this._backgroundImage = tm.display.Sprite(texture, param.width, param.height);
                this._backgroundImage.originX = this._backgroundImage.originY = 0;
                this.addChild(this._backgroundImage);
            }
            
            var scoreLabel = tm.display.Label("SCORE: {score}".format(param));
            scoreLabel.x = param.width/2;
            scoreLabel.y = param.height/2-70;
            scoreLabel.width = param.width;
            scoreLabel.align     = "center";
            scoreLabel.baseline  = "middle";
            scoreLabel.fontSize = 32;
            this.addChild(scoreLabel);
            
            var msgLabel = tm.display.Label(param.msg);
            msgLabel.x = param.width/2;
            msgLabel.y = param.height/2-20;
            msgLabel.width = param.width;
            msgLabel.align     = "center";
            msgLabel.baseline  = "middle";
            msgLabel.fontSize = 16;
            this.addChild(msgLabel);
            
            // ツイートボタン
            var tweetButton = this.tweetButton = tm.ui.GlossyButton(120, 50, "blue", "Tweet").addChildTo(this);
            tweetButton.setPosition(param.width/2 - 65, param.height/2 + 50);
            tweetButton.onclick = function() {
                window.open(twitterURL);
            };
            
            // 戻るボタン
            var backButton = tm.ui.GlossyButton(120, 50, "black", "Back").addChildTo(this);
            backButton.setPosition(param.width/2 + 65, param.height/2 + 50);
            backButton.onpointingstart = function() {
                var e = tm.event.Event("nextscene");
                this.dispatchEvent(e);
            }.bind(this);


        },
    });
    
})();

/*
 * collision.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class tm.app.Collision
     * 衝突管理クラス
     */
    tm.app.Collision = tm.createClass({
        
        /**
         * @property
         * @TODO ?
         */
        collideList: null,
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} elm
         */
        init: function(elm) {
            this.element = elm;
            this.collideList = [];
        },
        
        /**
         * @property
         * 更新
         * @param {Object} app
         */
        update: function(app) {
            var cl  = this.collideList.clone();
            var elm = this.element;
            
            for (var i=0,len=cl.length; i<len; ++i) {
                var c = cl[i];
                if (elm.isHitElement(c.element)) {
                    // 最初の衝突だった場合は collisionenter を呼ぶ
                    if (c.collide === false) {
                        var e = tm.event.Event("collisionenter");
                        e.other = c.element;
                        elm.dispatchEvent(e);
                    }
                    // 通常の衝突イベント
                    var e = tm.event.Event("collisionstay");
                    e.other = c.element;
                    elm.dispatchEvent(e);
                    
                    c.collide = true;
                }
                else {
                    if (c.collide == true) {
                        var e = tm.event.Event("collisionexit");
                        e.other = c.element;
                        elm.dispatchEvent(e);
                    }
                    c.collide = false;
                }
            }
        },
        
        /**
         * @property
         * 追加
         * @param {Object} elm
         */
        add: function(elm) {
            this.collideList.push({
                element: elm,
                collide: false,
            });
        },
        
        /**
         * @property
         * 削除
         * @param {Object} elm
         */
        remove: function(elm) {
            this.collideList.eraseIf(function(v) {
                return v.element == elm;
            });
        },
        
    });
    
    
    /**
     * @member      tm.app.Element
     * @property    collision
     * コリジョン
     */
    tm.app.Element.prototype.getter("collision", function() {
        if (!this._collision) {
            this._collision = tm.app.Collision(this);
            this.addEventListener("enterframe", function(e){
                this._collision.update(e.app);
            });
        }
        
        return this._collision;
    });
    
    
})();
/*
 * tweener.js
 */

(function() {

    /**
     * @class tm.app.Tweener
     * トゥイーナークラス
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.app.Tweener", {
        superClass: "tm.event.EventDispatcher",

        /**
         * @property
         * コンストラクタ
         * @param {Object} elm
         */
        init: function(elm) {
            this.superInit();

            this.setTarget(elm);
            this.loop = false;

            this._init();
        },

        /**
         * @property
         * 初期化
         */
        _init: function() {
            this._index = 0;
            this._tasks = [];
            this._func = this._updateTask;
            this.isPlaying = true;
        },

        /**
         * @property
         * ターゲットのセット
         * @param {Object} target
         */
        setTarget: function(target) {
            if (this._fn) {
                this.element.removeEventListener("enterframe", this._fn);
            }

            this.element = target;
            this._fn = function(e) { this.update(e.app); }.bind(this);
            this.element.addEventListener("enterframe", this._fn);
        },

        /**
         * @property
         * 更新
         * @param {Object} app
         */
        update: function(app) {
            this._func(app);
            return ;
            var tweens = this.tweens.clone();
            for (var i=0,len=tweens.length; i<len; ++i) {
                var tween = tweens[i];
                
                // 待ちチェック
                if (tween.delay > 0) {
                    tween.delay -= 1000/app.fps;
                    continue;
                }
                
                var time = tween.time + 1000/app.fps;
                tween._setTime(time);
                
                if (tween.time >= tween.duration) {
                    // 削除
                    this.tweens.erase(tween);
                    
                    // 全てのアニメーション終了チェック
                    if (this.tweens.length <= 0) {
                        this.isAnimation = false;
                        var e = tm.event.Event("animationend");
                        this.element.dispatchEvent(e);
                        this.dispatchEvent(e);
                    }
                }
                else {
                    tween.update();
                }
            }
        },

        /**
         * @property
         * タスクの更新
         * @private
         * @param {Object} app
         */
        _updateTask: function(app) {
            if (!this.isPlaying) return ;

            var task = this._tasks[this._index];
            if (!task) {

                if (this.loop === true) {
                    this._index = 0;
                }
                else {
                    this.isPlaying = false;
                }

                return ;
            }
            this._index++;

            if (task.type == "tween") {
                var data = task.data;
                var fnStr= task.data.type;
                var args = task.data.args;
                this._tween = tm.anim.Tween();

                this._tween[fnStr].apply(this._tween, args);

                this._func = this._updateTween;
                this._func(app);
            }
            else if (task.type == "wait") {
                this._wait = task.data;
                this._wait.time = 0;

                this._func = this._updateWait;
                this._func(app);
            }
            else if (task.type == "call") {
                task.data.func.apply(null, task.data.args);
            }
            else if (task.type == "set") {
                this.element.$extend(task.data.values);
            }
        },

        /**
         * @property
         * Tween の更新
         * @private
         * @param {Object} elm
         */
        _updateTween: function(app) {
            var tween = this._tween;
            var time = tween.time + 1000/app.fps;
            tween._setTime(time);
            
            if (tween.time >= tween.duration) {
                // 削除
                delete this._tween;
                this._tween = null;
                this._func = this._updateTask;
            }
            else {
                tween.update();
            }

        },

        /**
         * @property
         * 時間の更新
         * @private
         * @param {Object} elm
         */
        _updateWait: function(app) {
            var wait = this._wait;
            wait.time += 1000/app.fps;

            if (wait.time >= wait.limit) {
                delete this._wait;
                this._wait = null;
                this._func = this._updateTask;
            }
        },

        /**
         * @property
         * @TODO ?
         * @param {Object} param
         */
        add: function(param) {
            if (!param.target) param.target = this.element;

            this._tasks.push({
                type: "tween",
                data: param
            });

            if (this.isAnimation == false) {
                this.isAnimation = true;
                var e = tm.event.Event("animationstart");
                this.element.dispatchEvent(e);
            }
            
            return this;
        },

        /**
         * @property
         * 指定した値を足した値までアニメーション
         * @param {Object} props
         * @param {Object} duration
         * @param {Function} fn
         */
        by: function(props, duration, fn) {
            this._addTweenTask({
                props: props,
                duration: duration,
                fn: fn,
                type: "by"
            });
            return this;
        },

        /**
         * @property
         * 指定した値までアニメーション
         * @param {Object} props
         * @param {Object} duration
         * @param {Function} fn
         */
        to: function(props, duration, fn) {
            this._addTweenTask({
                props: props,
                duration: duration,
                fn: fn,
                type: "to"
            });
            return this;
        },

        /**
         * @property
         * 移動アニメーション
         * @param {Number} x
         * @param {Number} y
         * @param {Object} duration
         * @param {Function} fn
         */
        move: function(x, y, duration, fn) {
            return this.to({x:x, y:y}, duration, fn);
        },

        /**
         * @property
         * 指定した値を足した座標までアニメーション
         * @param {Number} x
         * @param {Number} y
         * @param {Object} duration
         * @param {Function} fn
         */
        moveBy: function(x, y, duration, fn) {
            return this.by({x:x, y:y}, duration, fn);
        },

        /**
         * @property
         * 回転アニメーション
         * @param {Number} rotation
         * @param {Object} duration
         * @param {Function} fn
         */
        rotate: function(rotation, duration, fn) {
            return this.to({rotation:rotation}, duration, fn);
        },

        /**
         * @property
         * 拡縮アニメーション
         * @param {Number} scale
         * @param {Object} duration
         * @param {Function} fn
         */
        scale: function(scale, duration, fn) {
            return this.to({scaleX:scale, scaleY:scale}, duration, fn);
        },

        /**
         * @property
         * フェードアニメーション
         * @param {Object} value
         * @param {Object} duration
         */
        fade: function(value, duration) {
            this.to({"alpha":value}, duration);
            return this;
        },

        /**
         * @property
         * フェードイン
         * @param {Object} duration
         */
        fadeIn: function(duration) {
            this.fade(1.0, duration);
            return this;
        },

        /**
         * @property
         * フェードアウト
         * @param {Object} duration
         */
        fadeOut: function(duration) {
            this.fade(0.0, duration);
            return this;
        },

        /**
         * @property
         * Tween のタスクを追加
         * @private
         * @param {Object} param
         */
        _addTweenTask: function(param) {
            param.target   = (param.target !== undefined) ? param.target : this.element;
            param.duration = (param.duration !== undefined) ? param.duration : 1000;

            this._tasks.push({
                type: "tween",
                data: {
                    args: [param.target, param.props, param.duration, param.fn],
                    type: param.type
                }
            });

            if (this.isAnimation == false) {
                this.isAnimation = true;
                var e = tm.event.Event("animationstart");
                this.element.dispatchEvent(e);
            }
            
            return this;
        },

        /**
         * @property
         * 待ち時間
         * @param {Object} time
         */
        wait: function(time) {
            this._tasks.push({
                type: "wait",
                data: {
                    limit: time
                }
            });
            return this;
        },

        /**
         * @property
         * コールバックを登録
         * @param {Function} fn
         * @param {Object} args
         */
        call: function(fn, args) {
            this._tasks.push({
                type: "call",
                data: {
                    func: fn,
                    args: args,
                },
            });

            return this;
        },

        /**
         * @property
         * プロパティをセット
         * @param {Object} key
         * @param {Object} value
         */
        set: function(key, value) {
            var values = null;
            if (arguments.length == 2) {
                values = {};
                values[key] = value;
            }
            else {
                values = key;
            }
            this._tasks.push({
                type: "set",
                data: {
                    values: values
                }
            });

            return this;
        },

        /**
         * @property
         * アニメーション開始
         */
        play: function() {
            this.isPlaying = true;
            return this;
        },

        /**
         * @property
         * アニメーションを一時停止
         */
        pause: function() {
            this.isPlaying = false;
            return this;
        },

        /**
         * @property
         * アニメーションを巻き戻す
         */
        rewind: function() {
            this._func = this._updateTask;
            this._index = 0;
            this.play();
            return this;
        },

        /**
         * @property
         * アニメーションループ設定
         * @param {Boolean} flag
         */
        setLoop: function(flag) {
            this.loop = flag;
            return this;
        },

        /**
         * @property
         * アニメーションをクリア
         */
        clear: function() {
            this._init();
            return this;
        }

    });

    /**
     * @member      tm.app.Element.prototype
     * @property    tweener
     * @TODO ?
     */
    tm.app.Element.prototype.getter("tweener", function() {
        if (!this._tweener) {
            this._tweener = tm.app.Tweener(this);
        }
        
        return this._tweener;
    });
})();

/*
 * timeline.js
 */

tm.namespace("tm.app", function() {
    /**
     * @class tm.app.Timeline
     * タイムラインクラス
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.app.Timeline", {
        superClass: "tm.event.EventDispatcher",
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} elm
         */
        init: function(elm) {
            this.superInit();
            
            this.setTarget(elm);

            this.fps = 30;
            
            this.currentFrame = 0;
            this.duration = 0;
            this.isPlay = true;
            this._tweens  = [];
            this._actions = [];
        },
        
        /**
         * @property
         * 更新
         * @param {Object} app
         */
        update: function(app) {
            if (!this.isPlay) return ;
            
            if (this.currentFrame > this.duration) {
//                this.gotoAndPlay(0);
            }
            else {
                this._updateTween();
                this._updateAction();
            }
            
            this.currentFrame++;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateTween: function() {
            var tweens = this._tweens;
            for (var i=0,len=tweens.length; i<len; ++i) {
                var tween = tweens[i];
                
                if (tween.delay > this.currentFrame) {
                    continue ;
                }
                
                var time = this.currentFrame - tween.delay;
                tween._setTime(time);
                if (tween.time >= tween.duration) {
                }
                else {
                    tween.update();
                }
            }
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateAction: function() {
            var actions = this._actions;
            
            for (var i=0,len=actions.length; i<len; ++i) {
                var action = actions[i];
                
                if (action.delay == this.currentFrame) {
                    if (action.type == "call") {
                        action.func();
                    }
                    else if (action.type == "set") {
                        var props = action.props;
                        for (var key in props) {
                            this.element[key] = props[key];
                        }
                    }
                }
            }
        },
        
        /**
         * @property
         * 指定した値までアニメーション
         * @param {Object} props
         * @param {Object} duration
         * @param {Object} delay
         * @param {Function} func
         */
        to: function(props, duration, delay, fn) {
            this._addTween({
                props: props,
                duration: duration,
                fn: fn,
                delay: delay
            });
            
            return this;
        },

        /**
         * @property
         * 指定した値を足した値までアニメーション
         * @param {Object} props
         * @param {Object} duration
         * @param {Object} delay
         * @param {Function} func
         */
        by: function(props, duration, delay, fn) {
            for (var key in props) {
                props[key] += this.element[key] || 0;
            }
            this._addTween({
                props: props,
                duration: duration,
                fn: fn,
                delay: delay
            });
            
            return this;
        },
        
        /**
         * @property
         * 関数を実行
         * @param {Function} func
         * @param {Object} delay
         */
        call: function(func, delay) {
            this._addAction({
                "type": "call",
                func: func,
                delay: delay,
            });
            return this;
        },
        
        /**
         * @property
         * プロパティをセット
         * @param {Object} props
         * @param {Object} delay
         */
        set: function(props, delay) {
            this._addAction({
                "type": "set",
                props: props,
                delay: delay,
            });
            return this;
        },
        
        /**
         * @property
         * ターゲットをセット
         * @param {Object} target
         */
        setTarget: function(target) {
            if (this._fn) {
                this.element.removeEventListener("enterframe", this._fn);
            }
            
            this.element = target;
            this._fn = function(e) { this.update(e.app); }.bind(this);
            this.element.addEventListener("enterframe", this._fn);
        },
        
        /**
         * @property
         * ターゲットをゲット
         */
        getTarget: function() {
            return this.element;
        },
        
        /**
         * @property
         * アニメーション開始
         * アニメーションが終了したら再度アニメーションを行う
         * @param {Number} frame
         */
        gotoAndPlay: function(frame) {
            this.isPlay = true;
            this.currentFrame = frame;
            this._updateTween();
        },
        
        /**
         * @property
         * アニメーション開始
         * アニメーションが終了したらストップする
         * @param {Number} frame
         */
        gotoAndStop: function(frame) {
            this.currentFrame = frame;
            this.isPlay = false;
            this._updateTween();
        },

        /**
         * @property
         * tween を追加
         * @private
         * @param {Object} tween
         */
        _addTween: function(tween) {
            tween.duration = tween.duration || 1000;
            tween.duration = this._dirty(tween.duration);
            tween.delay = tween.delay || 0;
            tween.delay = this._dirty(tween.delay);

            var tweenObj = tm.anim.Tween();
            tweenObj.to(this.element, tween.props, tween.duration, tween.fn);
            tweenObj.delay = tween.delay;

            this._tweens.push(tweenObj);
            this._updateDuration(tweenObj);
        },

        /**
         * @property
         * アニメーションを追加
         * @private
         * @param {Object} action
         */
        _addAction: function(action) {
            action.delay = action.delay || 0;
            action.delay = this._dirty(action.delay);

            this._actions.push(action);
            this._updateDuration(action);
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} task
         */
        _updateDuration: function(task) {
            var duration = task.delay + (task.duration ? task.duration : 0);
            if (this.duration < duration) this.duration = duration;
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} t
         */
        _dirty: function(t) {
            return (t/this.fps).toInt();
        },
        
        /**
         * @property
         * @TODO ?
         * @param {Object} data
         */
        load: function(data) {
            
            for (var key in data.timeline) {
                var value = data.timeline[key];
            }
            
            return this;
        },
        
        /**
         * @property
         * アニメーションをクリア
         */
        clear: function() {
            this.currentFrame = 0;
            this.duration = 0;
            this.isPlay = true;
            this._tweens  = [];
            this._actions = [];
        }
        
    });
    
    
    
    /**
     * @property    animation
     * アニメーション
     */
    tm.app.Element.prototype.getter("timeline", function() {
        if (!this._timeline) {
            this._timeline = tm.app.Timeline(this);
        }
        
        return this._timeline;
    });
    
});
/*
 * canvasapp.js
 */

tm.display = tm.display || {};

(function() {

    /**
     * @class tm.display.CanvasApp
     * キャンバスアプリケーション
     * @extends tm.app.BaseApp
     */
    tm.display.CanvasApp = tm.createClass({
        superClass: tm.app.BaseApp,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(canvas) {
            if (canvas instanceof HTMLCanvasElement) {
                this.element = canvas;
            }
            else if (typeof canvas == "string") {
                this.element = document.querySelector(canvas);
            }
            else {
                this.element = document.createElement("canvas");
            }

            // 親の初期化
            this.superInit(this.element);

            // グラフィックスを生成
            this.canvas = tm.graphics.Canvas(this.element);
            this.renderer = tm.display.CanvasRenderer(this.canvas);
            
            // カラー
            this.background = "black";
            
            // シーン周り
            this._scenes = [ tm.app.Scene() ];
        },
        
        /**
         * @property
         * @TODO ?
         */
        resize: function(width, height) {
            this.width = width;
            this.height= height;
            
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        resizeWindow: function() {
            this.width = innerWidth;
            this.height= innerHeight;
            
            return this;
        },
        
        /**
         * 画面にフィットさせる
         */
        fitWindow: function(everFlag) {
            // 画面にフィット
            this.canvas.fitWindow(everFlag);
            
            // マウスとタッチの座標更新関数をパワーアップ
            this.mouse._mousemove = this.mouse._mousemoveScale;
            this.touches.each(function(touch) {
                touch._touchmove = touch._touchmoveScale;
            });
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _draw: function() {
            this.canvas.clearColor(this.background, 0, 0);
            
            this.canvas.fillStyle   = "white";
            this.canvas.strokeStyle = "white";
            
            // 描画は全てのシーン行う
            this.canvas.save();
            for (var i=0, len=this._scenes.length; i<len; ++i) {
                this.renderer.render(this._scenes[i]);
//                this._scenes[i]._draw(this.canvas);
            }
            this.canvas.restore();
            
            //this.currentScene._draw(this.canvas);
        },
        
    });
    
    
    /**
     * @property    width
     * 幅
     */
    tm.display.CanvasApp.prototype.accessor("width", {
        "get": function()   { return this.canvas.width; },
        "set": function(v)  { this.canvas.width = v; }
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.display.CanvasApp.prototype.accessor("height", {
        "get": function()   { return this.canvas.height; },
        "set": function(v)  { this.canvas.height = v; }
    });

})();



/*
 * canvaselement.js
 */

tm.display = tm.display || {};


(function() {

    /**
     * @class tm.display.CanvasElement
     * キャンバスエレメント
     * @extends tm.app.Object2D
     */
    tm.display.CanvasElement = tm.createClass({
        superClass: tm.app.Object2D,

        /**
         * @property
         * 更新フラグ
         */
        isUpdate: true,

        /**
         * @property
         * 表示フラグ
         */
        visible: true,

        /**
         * @property
         * fillStyle
         */
        fillStyle: "white",

        /**
         * @property
         * strokeStyle
         */
        strokeStyle: "white",

        /**
         * @property
         * アルファ
         */
        alpha: 1.0,

        /**
         * @property
         * ブレンドモード
         */
        blendMode: "source-over",

        /**
         * @property
         * シャドウカラー
         */
        shadowColor: "black",

        /**
         * @property
         * @TODO ?
         */
        shadowOffsetX: 0,

        /**
         * @property
         * @TODO ?
         */
        shadowOffsetY: 0,

        /**
         * @property
         * @TODO ?
         */
        shadowBlur: 0,

        /**
         * @property
         * コンストラクタ: ゲーム用エレメントクラス
         */
        init: function() {
            this.superInit();
        },

        /**
         * @property
         * @TODO ?
         */
        setAlpha: function(alpha) {
            this.alpha = alpha;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setShadowColor: function(color) {
            this.shadowColor = color;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setShadowBlur: function(blur) {
            this.shadowBlur = blur;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setShadowOffset: function(x, y) {
            this.shadowOffsetX = x;
            this.shadowOffsetY = y;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        drawBoundingCircle: function(canvas) {
            canvas.save();
            canvas.lineWidth = 2;
            canvas.strokeCircle(0, 0, this.radius);
            canvas.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        drawBoundingRect: function(canvas) {
            canvas.save();
            canvas.lineWidth = 2;
            canvas.strokeRect(-this.width*this.originX, -this.height*this.originY, this.width, this.height);
            canvas.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        drawFillRect: function(ctx) {
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            return this;
        },
        /**
         * @property
         * @TODO ?
         */
        drawStrokeRect: function(ctx) {
            ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        drawFillArc: function(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
            ctx.fill();
            ctx.closePath();
            return this;
        },
        /**
         * @property
         * @TODO ?
         */
        drawStrokeArc: function(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
            ctx.stroke();
            ctx.closePath();
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        show: function() {
            this.visible = true;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        hide: function() {
            this.visible = false;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setFillStyle: function(style) {
            this.fillStyle = style;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setStrokeStyle: function(style) {
            this.strokeStyle = style;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setBlendMode: function(blendMode) {
            this.blendMode = blendMode;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        load: function(data) {
            var self = this;

            data.layers.forEach(function(layer) {
                if (layer.type != "objectgroup") return ;

                var group = tm.display.CanvasElement().addChildTo(self);
                group.width = layer.width;
                group.height = layer.height;

                layer.objects.forEach(function(obj) {
                    var _class = tm.using(obj.type);
                    if (Object.keys(_class).length === 0) {
                        _class=tm.display[obj.type];
                    }
                    var initParam = null;
                    if (obj.properties.init) {
                        initParam = JSON.parse(obj.properties.init);
                    }
                    var element = _class.apply(null, initParam).addChildTo(group);
                    var props   = obj.properties;
                    for (var key in props) {
                        if (key == "init") continue ;
                        var value = props[key];
                        element[key] = value;
                    }

                    element.x = obj.x;
                    element.y = obj.y;
                    element.width = obj.width;
                    element.height = obj.height;
                });

                self[layer.name] = group;
            });
        },

        /**
         * @property
         * @TODO ?
         */
        fromJSON: function(data) {
            for (var key in data) {
                var value = data[key];
                if (key == "children") {
                    for (var i=0,len=value.length; i<len; ++i) {
                        var data = value[i];
                        var init = data["init"] || [];
                        var _class = tm.using(data.type);
                        if (Object.keys(_class).length === 0) {
                            _class = tm.display[data.type];
                        }
                        var elm = _class.apply(null, init).addChildTo(this);
                        elm.fromJSON(data);
                        this[data.name] = elm;
                    }
                }
                else {
                    this[key] = value;
                }
            }

            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        toJSON: function() {
            // TODO:
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _calcAlpha: function() {
            if (!this.parent) {
                this._worldAlpha = this.alpha;
                return ;
            }
            else {
                // alpha
                this._worldAlpha = this.parent._worldAlpha * this.alpha;
            }
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _dirtyCalc: function() {
            this._calcAlpha();
            this._calcWorldMatrix();
        },
    });


})();


















/*
 * sprite.js
 */


tm.display = tm.display || {};


(function() {
    
    /**
     * @class tm.display.Sprite
     * 画像の描画を行うクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.Sprite = tm.createClass({
        superClass: tm.display.CanvasElement,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(texture, width, height) {
            this.superInit();
            
            console.assert(arguments.length == 0 || texture instanceof tm.asset.Texture || typeof texture == "string", "Sprite の第一引数はテクスチャもしくはテクスチャ名に変わりました");
            
            this.srcRect = tm.geom.Rect(0, 0, 64, 64);
            
            // 画像のみ渡された場合
            if (arguments.length == 1) {
                var texture = arguments[0];
                if (typeof texture == "string") texture = tm.asset.AssetManager.get(texture);
                
                this.width = texture.width;
                this.height= texture.height;
                
                this.image = texture;
            }
            // その他
            else {
                width = width   || 64;
                height= height  || 64;
                
                this.width  = width;
                this.height = height;
                if (texture) {
                    this.image  = texture;
                }
            }
        },
        
        /**
         * @property
         * @TODO ?
         */
        setFrameIndex: function(index, width, height) {
            var w   = width || this.width;
            var h   = width || this.height;
            var row = ~~(this.image.width / w)
            var x   = index%row;
            var y   = ~~(index/row);
            this.srcRect.x = x*w;
            this.srcRect.y = y*h;
            this.srcRect.width  = w;
            this.srcRect.height = h;

            return this;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _refreshSize: function() {},

        _update: tm.display.CanvasElement.prototype._update,
    });
    
    /**
     * @property    image
     * 高さ
     */
    tm.display.Sprite.prototype.accessor("image", {
        "get": function()   {
            return this._image;
        },
        "set": function(image)  {
            if (typeof image == "string") image = tm.asset.AssetManager.get(image);
            
            this._image = image;
            this.srcRect.x = 0;
            this.srcRect.y = 0;
            this.srcRect.width  = image.element.width;
            this.srcRect.height = image.element.height;
        }
    });
    
})();

/*
 * shape.js
 */


tm.display = tm.display || {};


(function() {
    
    /**
     * @class tm.display.Shape
     * 図形を描画するクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.Shape = tm.createClass({
        superClass: tm.display.CanvasElement,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height) {
            this.superInit();
            
            width = width   || 64;
            height= height  || 64;
            
            this.canvas = tm.graphics.Canvas();
            
            this.width  = width;
            this.height = height;
            this.canvas.resize(width, height);
        },

        /**
         * @property
         * @TODO ?
         */
        renderCircle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_CIRCLE, param);
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            
            // 描画
            c.fillCircle(this.width/2, this.height/2, this.radius);
            c.strokeCircle(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2);
            
            c.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        renderTriangle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_TRIANGLE, param);
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            
            // 描画
            c.fillPolygon(this.width/2, this.height/2, this.radius, 3);
            c.strokePolygon(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, 3);
            
            c.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        renderRectangle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_RECTANGLE, param);

            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            
            // 描画
            var lw      = Number(c.lineWidth);
            var lw_half = lw/2;
            c.fillRect(0, 0, this.width, this.height);
            c.strokeRect(lw_half, lw_half, this.width-lw, this.height-lw);
            
            c.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        renderStar: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_STAR, param);
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;

            // 描画
            var lw          = Number(c.lineWidth);
            var lw_half     = lw/2;
            var sides       = param.sides;
            var sideIndent  = param.sideIndent;
            var offsetAngle = param.offsetAngle;
            c.fillStar(this.width/2, this.height/2, this.radius, sides, sideIndent, offsetAngle);
            c.strokeStar(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, sides, sideIndent, offsetAngle);
            
            c.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        renderPolygon: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_POLYGON, param);
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            c.textAlign = "center";
            c.textBaseline = "middle";
            
            // 描画
            var lw          = Number(c.lineWidth);
            var lw_half     = lw/2;
            var sides       = param.sides;
            var sideIndent  = param.sideIndent;
            var offsetAngle = param.offsetAngle;
            c.fillPolygon(this.width/2, this.height/2, this.radius, sides, offsetAngle);
            c.strokePolygon(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, sides, offsetAngle);
            
            c.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        renderHeart: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_HEART, param);

            c.save();
            
            // パラメータセット
            c.fillStyle     = param.fillStyle;
            c.strokeStyle   = param.strokeStyle;
            c.lineWidth     = param.lineWidth;
            
            // 描画
            c.fillHeart(this.width/2, this.height/2, this.radius, param.angle);
            c.strokeHeart(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, param.angle);
            
            c.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        renderText: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_TEXT, param);

            c.save();
            
            // パラメータセット
            c.fillStyle     = param.fillStyle;
            c.strokeStyle   = param.strokeStyle;
            c.lineWidth     = param.lineWidth;
            c.font          = param.font;
            c.textAlign     = param.textAlign;
            c.textBaseline  = param.textBaseline;

            // 描画
            c.strokeText(param.text, this.width/2, this.height/2);
            c.fillText(param.text, this.width/2, this.height/2);
            
            c.restore();
        },
        
    });

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_CIRCLE = {
        fillStyle: "red",
        strokeStyle: "white",
        lineWidth: "2",
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_TRIANGLE = {
        fillStyle: "green",
        strokeStyle: "white",
        lineWidth: "2",
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_RECTANGLE = {
        fillStyle: "blue",
        strokeStyle: "white",
        lineWidth: "2",
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_STAR = {
        fillStyle: "yellow",
        strokeStyle: "white",
        lineWidth: "2",
        
        sides: 5,
        sideIndent: undefined,
        offsetAngle: undefined,
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_POLYGON = {
        fillStyle: "cyan",
        strokeStyle: "white",
        lineWidth: "2",
        
        sides: 5,
        offsetAngle: undefined,
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_HEART = {
        fillStyle: "pink",
        strokeStyle: "white",
        lineWidth: "2",
        
        angle: 45,
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_TEXT = {
        text: "hello, world",
        fillStyle: "pink",
        strokeStyle: "white",
        lineWidth: "1",
        textAlign: "center",
        textBaseline: "middle",
        font: "24px 'Consolas', 'Monaco', 'ＭＳ ゴシック'",
    };
    
})();


(function() {
    
    /**
     * @class tm.display.CircleShape
     * 簡単に円を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.CircleShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderCircle(param);
        },
    });
    
})();




(function() {
    
    /**
     * @class tm.display.TriangleShape
     * 簡単に三角形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.TriangleShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderTriangle(param);
        },
        
    });
    
})();




(function() {
    
    /**
     * @class tm.display.RectangleShape
     * 簡単に矩形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.RectangleShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderRectangle(param);
        },
        
    });
    
})();


(function() {
    
    /**
     * @class tm.display.StarShape
     * 簡単に星形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.StarShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderStar(param);
        },
        
    });
    
})();



(function() {
    
    /**
     * @class tm.display.PolygonShape
     * @TODO なにを描画するクラス？
     * @extends tm.display.Shape
     */
    tm.display.PolygonShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderPolygon(param);
        },
        
    });
    
})();




(function() {
    
    /**
     * @class tm.display.HeartShape
     * 簡単にハートを描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.HeartShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderHeart(param);
        },
        
    });
    
})();




(function() {
    
    /**
     * @class tm.display.TextShape
     * @TODO なにするクラス？
     * @extends tm.display.Shape
     */
    tm.define("tm.display.TextShape", {

        superClass: "tm.display.Shape",
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderText(param);
        },
    });
    
})();



















/*
 * label.js
 */

tm.display = tm.display || {};


(function() {
    
    var dummyCanvas  = null;
    var dummyContext = null;
    
    /**
     * @class tm.display.Label
     * システムフォントを描画するクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.Label = tm.createClass({
        
        superClass: tm.display.CanvasElement,
        
        /**
         * @property
         * 塗りつぶしフラグ
         */
        fill: true,

        /**
         * @property
         * ストロークフラグ
         */
        stroke: false,

        /**
         * @property
         * @TODO ?
         */
        debugBox: false,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(text, size) {
            this.superInit();
            
            this.text       = text || "";
            
            this._fontSize   = size || 24;
            this._fontFamily = "'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            this._fontWeight = "";
            this._lineHeight = 1.2;
            this._updateFont();
            
            this.align      = "start";
            this.baseline   = "alphabetic";

            this.maxWidth   = null;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setAlign: function(align) {
            this.align = align;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setBaseline: function(baseline) {
            this.baseline = baseline;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setFontSize: function(size) {
            this.fontSize = size;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setFontFamily: function(family) {
            this.fontFamily= family;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setFontWeight: function(weight) {
            this.fontWeight= weight;
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateFont: function() {
            this.fontStyle = "{fontWeight} {fontSize}px {fontFamily}".format(this);
            if (!dummyCanvas) {
                dummyCanvas = document.createElement("canvas");
                dummyContext = dummyCanvas.getContext('2d');
            }
            dummyContext.font = this.fontStyle;
            this.textSize = dummyContext.measureText('あ').width * this.lineHeight;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateLines: function() {
            this._lines = (this._text+'').split('\n');
        }
        
    });
    
    /**
     * @property    text
     * サイズ
     */
    tm.display.Label.prototype.accessor("text", {
        "get": function() { return this._text; },
        "set": function(v){
            if (v == null || v == undefined) {
                this._text = "";
            }
            else {
                this._text = v;
            }
            this._updateLines();
        }
    });
    
    /**
     * @property    size
     * サイズ
     */
    tm.display.Label.prototype.accessor("fontSize", {
        "get": function() { return this._fontSize; },
        "set": function(v){ this._fontSize = v; this._updateFont(); }
    });
    
    /**
     * @property    fontFamily
     * フォント
     */
    tm.display.Label.prototype.accessor("fontFamily", {
        "get": function() { return this._fontFamily; },
        "set": function(v){ this._fontFamily = v; this._updateFont(); }
    });
    
    /**
     * @property fontWeight
     * フォント
     */
    tm.display.Label.prototype.accessor("fontWeight", {
        "get": function() { return this._fontWeight; },
        "set": function(v) {
            this._fontWeight = v; this._updateFont();
        },
    });
    
    /**
     * @property lineHeight
     * フォント
     */
    tm.display.Label.prototype.accessor("lineHeight", {
        "get": function() { return this._lineHeight; },
        "set": function(v) {
            this._lineHeight = v; this._updateFont();
        },
    });

    
})();


/*
 * animationsprite.js
 */


tm.display = tm.display || {};


(function() {

    /**
     * @class tm.display.AnimationSprite
     * スプライトアニメーションクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.AnimationSprite = tm.createClass({
        superClass: tm.display.CanvasElement,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(ss, width, height) {
            this.superInit();

            if (typeof ss == "string") {
                var ss = tm.asset.AssetManager.get(ss);
                console.assert(ss, "not found " + ss);
            }

            console.assert(typeof ss == "object", "AnimationSprite の第一引数はスプライトシートもしくはスプライトシート名に変わりました");

            this.ss = ss;

            this.width  = width || ss.frame.width;
            this.height = height|| ss.frame.height;

            this.currentFrame = 0;
            this.currentFrameIndex = 0;
            this.paused = true;

            this.currentAnimation = null;

            this.addEventListener("enterframe", function(e) {
                if (!this.paused && e.app.frame%this.currentAnimation.frequency === 0) {
                    this._updateFrame();
                }
            });
        },

        /**
         * @property
         * 描画
         */
        draw: function(canvas) {
            var srcRect = this.ss.getFrame(this.currentFrame);
            var element = this.ss.image.element;

            canvas.drawImage(element,
                srcRect.x, srcRect.y, srcRect.width, srcRect.height,
                -this.width*this.originX, -this.height*this.originY, this.width, this.height);
        },

        /**
         * @property
         * @TODO ?
         */
        gotoAndPlay: function(name) {
            name = (name !== undefined) ? name : "default";

            this.paused = false;
            this.currentAnimation = this.ss.animations[name];
            this.currentFrame = 0;
            this.currentFrameIndex = 0;
            this._normalizeFrame();

            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        gotoAndStop: function(name) {
            name = (name !== undefined) ? name : "default";

            this.paused = true;
            this.currentAnimation = this.ss.animations[name];
            this.currentFrame = 0;
            this.currentFrameIndex = 0;
            this._normalizeFrame();

            return this;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateFrame: function() {
            this.currentFrameIndex += 1;
            this._normalizeFrame();
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _normalizeFrame: function() {
            var anim = this.currentAnimation;
            if (anim) {
                if (this.currentFrameIndex < anim.frames.length) {
                    this.currentFrame = anim.frames[this.currentFrameIndex];
                }
                else {
                    if (anim.next) {
                        this.gotoAndPlay(anim.next);
                    }
                    else {
                        this.currentFrameIndex = anim.frames.length - 1;
                        this.currentFrame = anim.frames[this.currentFrameIndex];
                        this.paused = true;
                    }
                    // dispatch animationend
                    var e = tm.event.Event("animationend");
                    this.dispatchEvent(e);
                }
            }
        },

    });

})();


/*
 * mapsprite.js
 */


(function() {

    /**
     * @class tm.display.MapSprite
     * マップ描画クラス
     * @extends tm.display.CanvasElement
     */
    tm.define("tm.display.MapSprite", {
        superClass: "tm.display.CanvasElement",

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(mapSheet, chipWidth, chipHeight) {
            this.superInit();

            if (typeof mapSheet == "string") {
                this.mapSheet = tm.asset.AssetManager.get(mapSheet);
            }
            else {
                this.mapSheet = mapSheet;
            }

            this.chipWidth  = chipWidth  || 32;
            this.chipHeight = chipHeight || 32;

            this.originX = this.originY = 0;

            this.width = chipWidth*this.mapSheet.width;
            this.height= chipWidth*this.mapSheet.height;

            this._build();
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _build: function() {
            var self = this;

            this.mapSheet.layers.each(function(layer, hoge) {
                if (layer.type == "objectgroup") {
                    self._buildObject(layer);
                }
                else {
                    self._buildLayer(layer);
                }
            });
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _buildLayer: function(layer) {
            var self        = this;
            var mapSheet    = this.mapSheet;
            var texture     = tm.asset.AssetManager.get(mapSheet.tilesets[0].image);
            var xIndexMax   = (texture.width/mapSheet.tilewidth)|0;
            var shape       = tm.display.Shape(this.width, this.height).addChildTo(this);
            shape.origin.set(0, 0);

            layer.data.each(function(d, index) {
                var type = d;
                if (type == -1) {
                    return ;
                }
                type = Math.abs(type);

                var xIndex = index%mapSheet.width;
                var yIndex = (index/mapSheet.width)|0;

                var mx = (type%xIndexMax);
                var my = (type/xIndexMax)|0;

                var dx = xIndex*self.chipWidth;
                var dy = yIndex*self.chipHeight;

                shape.canvas.drawTexture(texture,
                    mx*mapSheet.tilewidth, my*mapSheet.tileheight, mapSheet.tilewidth, mapSheet.tileheight,
                    dx, dy, self.chipWidth, self.chipHeight
                    );
            }.bind(this));

        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _buildObject: function(layer) {
            var self = this;
            
            var group = tm.display.CanvasElement().addChildTo(self);
            group.width = layer.width;
            group.height = layer.height;
            
            layer.objects.forEach(function(obj) {
                var _class = tm.using(obj.type);
                if (Object.keys(_class).length === 0) {
                    _class=tm.display[obj.type];
                }

                var initParam = null;
                if (obj.properties.init) {
                    initParam = JSON.parse(obj.properties.init);
                }
                var element = _class.apply(null, initParam).addChildTo(group);
                var props   = obj.properties;
                for (var key in props) {
                    if (key == "init") continue ;
                    var value = props[key];
                    element[key] = value;
                }
                
                element.x = obj.x;
                element.y = obj.y;
                element.width = obj.width;
                element.height = obj.height;
                
                group[obj.name] = element;
            });

            self[layer.name] = group;

        },

    });

})();




/*
 * renderer.js
 */

 
(function() {
    
    /**
     * @class tm.display.CanvasRenderer
     * @TODO キャンバス描画クラス？
     */
    tm.define("tm.display.CanvasRenderer", {
        canvas: null,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(canvas) {
            this.canvas = canvas;
            this._context = this.canvas.context;
        },

        /**
         * @property
         * @TODO ?
         */
        render: function(root) {
            this.canvas.save();
            this.renderObject(root);
            this.canvas.restore();
        },

        /**
         * @property
         * @TODO ?
         */
        renderObject: function(obj) {
            obj._dirtyCalc();

            if (obj.visible === false) return ;
            var context = this._context;

            if (!obj.draw) this._setRenderFunction(obj);

            // 情報をセット
            context.fillStyle      = obj.fillStyle;
            context.strokeStyle    = obj.strokeStyle;
            context.globalAlpha    = obj._worldAlpha;
            context.globalCompositeOperation = obj.blendMode;
            
            if (obj.shadowBlur) {
                context.shadowColor   = obj.shadowColor;
                context.shadowOffsetX = obj.shadowOffsetX;
                context.shadowOffsetY = obj.shadowOffsetY;
                context.shadowBlur    = obj.shadowBlur;
            }
            else {
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.shadowColor   = "rgba(0, 0, 0, 0)";
            }
            
            // 行列をセット
            var m = obj._worldMatrix.m;
            context.setTransform( m[0], m[3], m[1], m[4], m[2], m[5] );
            
            obj.draw(this.canvas);
            
            // 子供達も実行
            if (obj.children.length > 0) {
                var tempChildren = obj.children.slice();
                for (var i=0,len=tempChildren.length; i<len; ++i) {
                    this.renderObject(tempChildren[i]);
                }
            }
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _setRenderFunction: function(obj) {
            if (obj instanceof tm.display.Sprite) {
                obj.draw = renderFuncList["sprite"];
            }
            else if (obj instanceof tm.display.MapSprite) {
                obj.draw = function() {};
            }
            else if (obj instanceof tm.display.Label) {
                obj.draw = renderFuncList["label"];
            }
            else if (obj instanceof tm.display.Shape) {
                obj.draw = renderFuncList["shape"];
            }
            else {
                obj.draw = function() {};
            }
        }

    });
    
    var renderFuncList = {
        "sprite": function(canvas) {
            var srcRect = this.srcRect;
            var element = this._image.element;
            
            canvas.context.drawImage(element,
                srcRect.x, srcRect.y, srcRect.width, srcRect.height,
                -this.width*this.origin.x, -this.height*this.origin.y, this.width, this.height);
        },
        "shape": function(canvas) {
            var srcRect = this.srcRect;
            canvas.drawImage(
                this.canvas.canvas,
                0, 0, this.canvas.width, this.canvas.height,
                -this.width*this.origin.x, -this.height*this.origin.y, this.width, this.height);
        },
        "label": function(canvas) {
            canvas.setText(this.fontStyle, this.align, this.baseline);
            if (this.fill) {
                if (this.maxWidth) {
                    this._lines.each(function(elm, i) {
                        canvas.fillText(elm, 0, this.textSize*i, this.maxWidth);
                    }.bind(this));
                }
                else {
                    this._lines.each(function(elm, i) {
                        canvas.fillText(elm, 0, this.textSize*i);
                    }.bind(this));
                }
            }
            if (this.stroke) {
                if (this.maxWidth) {
                    this._lines.each(function(elm, i) {
                        canvas.strokeText(elm, 0, this.textSize*i, this.maxWidth);
                    }.bind(this));
                }
                else {
                    this._lines.each(function(elm, i) {
                        canvas.strokeText(elm, 0, this.textSize*i);
                    }.bind(this));
                }
            }
            
            if (this.debugBox) {
                canvas.strokeRect(0, 0, this.width, -this.size);
            }
        }
    };

})();
 


 
(function() {
    
    /**
     * @class tm.display.BoundingRectRenderer
     * @TODO なにをするクラス？
     * @extends tm.display.CanvasRenderer
     */
    tm.define("tm.display.BoundingRectRenderer", {
        superClass: "tm.display.CanvasRenderer",

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(canvas) {
            this.superInit(canvas);
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _setRenderFunction: function(obj) {
            obj.draw = render;
        }
    });

    /**
     * @TODO ?
     * コンストラクタ
     */
    var render = function(canvas) {
        canvas.save();
        canvas.lineWidth = 2;
        canvas.strokeRect(-this.width*this.originX, -this.height*this.originY, this.width, this.height);
        canvas.restore();
    };

})();
 












/*
 * userinterface.js
 */

tm.ui = tm.ui || {};


(function() {

	/**
	 * @class tm.ui.Gauge
	 * ゲーム用ゲージクラス
     * @extends tm.display.RectangleShape
	 */
	tm.ui.Gauge = tm.createClass({
        superClass: tm.display.RectangleShape,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, color, direction) {
            this.superInit(width, height, {
                fillStyle: color || "red",
                strokeStyle: "rgba(255, 255, 255, 0)"
            });

            this._reset(direction);
        },

        /**
         * @property
         * @TODO ?
         */
        isFull: function() {
            return this.targetProp === this._maxValue;
        },

        /**
         * @property
         * @TODO ?
         */
        isEmpty: function() {
            return this.targetProp == 0;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _reset: function(direction) {
            this.direction = direction || "left";
            switch (this.direction) {
                case "left":
                    this.originX = 0;
                    this._targetPropName = "width";
                    this._value     = this.width;
                    this._value = this._maxValue = this.width;
                    break;
                case "right":
                    this.originX = 1;
                    this._targetPropName = "width";
                    this._value = this._maxValue = this.width;
                    break;
                case "up":
                    this.originY = 1;
                    this._targetPropName = "height";
                    this._value     = this.height;
                    this._value = this._maxValue = this.height;
                    break;
                case "down":
                    this.originY = 0;
                    this._targetPropName = "height";
                    this._value     = this.height;
                    this._value = this._maxValue = this.height;
                    break;
            }
        },

        /**
         * @property
         * @TODO ?
         */
        setValue: function(value, anim) {
        	value= Math.clamp(value, 0, this._maxValue);
            anim = (anim !== undefined) ? anim : true;

            this._value = value;
            this._targetValue = (value/this._maxValue)*this._maxValue;

            if (this._targetValue == this.targetProp) return ;

            this.tweener.clear();
            if (anim) {
                var props = {};
                props[this._targetPropName] = this._targetValue;
                this.tweener.to(props, Math.abs(this._targetValue-this.targetProp)*10);
                /*
                this.animation.addTween({
                    prop: this._targetPropName,
                    begin: this.targetProp,
                    finish: this._targetValue,
                    duration: Math.abs(this._targetValue-this.targetProp)*10,
                });
*/
            }
            else {
                this.targetProp = this._targetValue;
            }

            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        getValue: function() {
            return this.value;
        },

        /**
         * @property
         * @TODO ?
         */
        setPercent: function(percent, anim) {
            this.setValue(this._maxValue*percent*0.01, anim);
        },

        /**
         * @property
         * @TODO ?
         */
        getPercent: function() {
            return (this._value/this._maxValue)*100;
        },

        /**
         * @property
         * @TODO ?
         */
        setRatio: function(ratio) {
            this.setValue(this._maxValue*percent, anim);
        },

        /**
         * @property
         * @TODO ?
         */
        getRatio: function() {
            return this._value/this._maxValue;
        },
    });
    
    /**
     * @property    value
     * 値
     */
    tm.ui.Gauge.prototype.accessor("value", {
        get: function() {
            return this._value;
        },
        set: function(v) {
            this.setValue(v);
        },
    });

    /**
     * @property    percent
     * パーセント
     */
    tm.ui.Gauge.prototype.accessor("percent", {
        get: function() {
            return this.getPercent();
        },
        set: function(v) {
            this.setPercent(v);
        },
    });
    
    
    /**
     * @property    ratio
     * 比率
     */
    tm.ui.Gauge.prototype.accessor("ratio", {
        get: function() {
            return this.getRatio();
        },
        set: function(v) {
            this.setRatio(v);
        },
    });
    
    /**
     * @property    targetProp
     * ターゲット
     */
    tm.ui.Gauge.prototype.accessor("targetProp", {
        get: function() {
            return this[this._targetPropName];
        },
        set: function(v) {
            this[this._targetPropName] = v;
        },
    });
    
})();



(function() {
    
    /**
     * @class tm.ui.Pad
     * padクラス
     * @extends tm.display.Shape
     */
    tm.ui.Pad = tm.createClass({
        superClass: tm.display.Shape,
        
        isTouching: false,
        circle: null,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.superInit(120, 120);
            
            var c = this.canvas;
            c.fillStyle = "#fff";
            c.fillCircle(60, 60, 60);
            c.fillStyle = "#eee";
            
            this._createCircle();
            
            this.setInteractive(true);
            
            this.alpha = 0.75;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _createCircle: function() {
            var circle = this.circle = tm.display.Shape(80, 80);
            this.addChild(circle);
            
            var c = circle.canvas;
            c.fillStyle = "#222";
            c.setShadow("black", 2, 2, 2);
            c.fillCircle(40, 40, 35);
        },

        /**
         * @property
         * @TODO ?
         */
        onpointingstart: function() {
            this.isTouching = true;
        },

        /**
         * @property
         * @TODO ?
         */
        onpointingend: function() {
            this.isTouching = false;
            this.circle.position.set(0, 0);
        },

        /**
         * @property
         * @TODO ?
         */
        onpointingmove: function(e) {
            if (this.isTouching==false) return ;
            var p = e.pointing;
            var v = tm.geom.Vector2(p.x - this.x, p.y - this.y);
            var len = v.length();
            v.div(len);
            if (len > 40) len = 40;
            
            this.angle = Math.radToDeg(v.toAngle());
            this.circle.position.set(v.x*len, v.y*len);
            
            // 大きさ
            this.distance  = len/40.0;
            // 向きベクトル
            this.direction = v.mul(this.distance);
        }
        
        
    });
    
})();




/*
 * button.js
 */

tm.ui = tm.ui || {};


(function() {
    
    /**
     * @class tm.ui.LabelButton
     * LabelButton
     * @extends tm.display.Label
     */
    tm.ui.LabelButton = tm.createClass({
        superClass: tm.display.Label,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(text) {
            this.superInit(text);
            
            this.alpha = tm.ui.LabelButton.DEFAULT_ALPHA;
            this.setAlign("center").setBaseline("middle");
            
            this.setInteractive(true);
            this.boundingType = "rect";
            
            this.addEventListener("pointingover", function() {
                this.tweener.clear();
                this.tweener.fadeIn(250);
            }.bind(this));
            this.addEventListener("pointingout", function() {
                this.tweener.clear();
                this.tweener.fade(tm.ui.LabelButton.DEFAULT_ALPHA, 250);
            }.bind(this));
            
            /*
            var d = this.draw;
            this.draw = function(canvas) {
                d.call(this, canvas);
                this.drawBoundingRect(canvas);
            }
            /*
            */
        }
    });
    
    tm.ui.LabelButton.DEFAULT_ALPHA = 0.5;
    
})();


(function() {
    
    /**
     * @class tm.ui.IconButton
     * IconButton
     * @extends tm.display.Sprite
     */
    tm.ui.IconButton = tm.createClass({
        superClass: tm.display.Sprite,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(texture) {
            if (texture) {
                this.superInit(texture, texture.width, texture.height);
            }
            else {
                this.superInit();
            }
            
            this.alpha = tm.ui.IconButton.DEFAULT_ALPHA;
            
            this.setInteractive(true);
            this.boundingType = "rect";
            this.addEventListener("pointingover", function() {
                this.tweener.clear();
                this.tweener.fade(1, 250);
            });
            this.addEventListener("pointingout", function() {
                this.tweener.clear();
                this.tweener.fade(tm.ui.LabelButton.DEFAULT_ALPHA, 250);
            });
        },
    });
    
    tm.ui.IconButton.DEFAULT_ALPHA = 0.5;
    
})();


(function() {
    
    /**
     * @class tm.ui.GlossyButton
     * glossy button
     * @extends tm.display.Shape
     */
    tm.ui.GlossyButton = tm.createClass({
        superClass: tm.display.Shape,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, backgroundColor, text) {
            this.superInit(width, height);
            
            text  = text  || "Button";
            this.backgroundColor = backgroundColor || "black";
            this.alpha = tm.ui.GlossyButton.DEFAULT_ALPHA;
            
            this.setInteractive(true);
            this.boundingType = "rect";
            this.addEventListener("pointingover", function() {
                this.tweener.clear();
                this.tweener.fade(1.0, 250);
            });
            this.addEventListener("pointingout", function() {
                this.tweener.clear();
                this.tweener.fade(tm.ui.GlossyButton.DEFAULT_ALPHA, 250);
            });
            
            // ラベル
            this.label = tm.display.Label(text || "").addChildTo(this);
            this.label.setAlign("center").setBaseline("middle");
            
            this._refresh();
        },

        /**
         * @property
         * @TODO ?
         */
        setBackgroundColor: function(backgroundColor) {
            this.backgroundColor = backgroundColor;
            
            this._refresh();
            
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _refresh: function() {
            // ボタン描画
            var c = this.canvas;
            c.resize(this.width, this.height);
            c.fillStyle = this.backgroundColor;
            c.fillRoundRect(2, 2, this.width-4, this.height-4, 10);
            c.strokeStyle   = "rgba(100,100,100,0.75)";
            c.lineWidth     = 2;
            c.strokeRoundRect(2, 2, this.width-4, this.height-4, 10);
            
            // テカリ
            c.roundRect(2, 2, this.width-4, this.height-4, 10);
            c.clip();
            
            var grad = tm.graphics.LinearGradient(0, 0, 0, this.height);
            
            // grad.addColorStop(0.0, "hsl(  0, 75%, 50%)");
            // grad.addColorStop(0.5, "hsl(120, 75%, 50%)");
            // grad.addColorStop(1.0, "hsl(240, 75%, 50%)");
            grad.addColorStop(0.0, "rgba(255,255,255,0.9)");
            grad.addColorStop(0.5, "rgba(255,255,255,0.5)");
            grad.addColorStop(0.51, "rgba(255,255,255,0.2)");
            grad.addColorStop(1.0, "rgba(255,255,255,0.0)");
            c.setGradient(grad);
            c.fillRect(2, 2, this.width-4, this.height-4, 10);
            
            // ラベルのサイズをリセット
            this.label.setSize(this.width, this.height);
        },
    });
    
    
    tm.ui.GlossyButton.DEFAULT_ALPHA = 0.5;
    
    
})();


(function() {

    /**
     * @class tm.ui.FlatButton
     * フラットデザインのボタン
     * @extends tm.display.Shape
     */
    tm.define("tm.ui.FlatButton", {
        superClass: tm.display.Shape,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(param) {
            param.$safe({
                width: 300,
                height: 100,
                bgColor: "rgb(180, 180, 180)",
                text: "ABC",
                fontSize: 50,
                fontFamily: "'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif",
            });

            this.superInit(param.width, param.height);

            this.canvas.clearColor(param.bgColor);

            this.setInteractive(true);
            this.setBoundingType("rect");

            this.label = tm.display.Label(param.text).addChildTo(this);
            this.label.setFontSize(param.fontSize).setFontFamily(param.fontFamily).setAlign("center").setBaseline("middle");
        },
    });



})();




/*
 * menudialog.js
 */

(function() {
    
    /**
     * @class tm.ui.MenuDialog
     * メニューダイアログ
     * @extends tm.app.Scene
     */
    tm.define("tm.ui.MenuDialog", {
        superClass: tm.app.Scene,

        /** @type {string} タイトル */
        titleText: null,
        /** @type {Array.<string>} メニュー名リスト */
        menu: null,
        /** @type {Array.<string>} メニュー詳細リスト */
        descriptions: null,
        /** @type {boolean} exit の表示/非表示 */
        showExit: false,

        /** @type {tm.display.Label} dummy */
        title: null,
        /** @type {Array.<tm.ui.LabelButton>} dummy */
        selections: [],
        /** @type {tm.display.Label} dummy */
        description: null,
        /** @type {tm.display.RectangleShape} dummy */
        box: null,
        /** @type {tm.display.RectangleShape} dummy */
        cursor: null,

        _selected: 0,
        _opened: false,
        _finished: false,

        _screenWidth: 0,
        _screenHeight: 0,

        /**
         * @constructor
         * コンストラクタ
         * @param {Object} params
         */
        init: function(params) {
            this.superInit();

            this._screenWidth = params.screenWidth;
            this._screenHeight = params.screenHeight;

            this.titleText = params.title;
            this.menu = [].concat(params.menu);
            this._selected = ~~params.defaultSelected;
            this.showExit = !!params.showExit;
            if (params.menuDesctiptions) {
                this.descriptions = params.menuDesctiptions;
            } else {
                this.descriptions = [].concat(params.menu);
            }

            if (this.showExit) {
                this.menu.push("exit");
                this.descriptions.push("前の画面へ戻ります");
            }

            var height = Math.max((1+this.menu.length)*50, 50) + 40;
            this.box = tm.display.RectangleShape(this._screenWidth * 0.8, height, {
                strokeStyle: "rgba(0,0,0,0)",
                fillStyle: "rgba(43,156,255, 0.8)",
            }).setPosition(this._screenWidth*0.5, this._screenHeight*0.5);
            this.box.width = 1;
            this.box.height = 1;
            this.box.setBoundingType("rect");
            this.box.tweener
                .to({ width: this._screenWidth*0.8, height: height }, 200, "easeOutExpo")
                .call(this._onOpen.bind(this));
            this.box.addChildTo(this);

            this.description = tm.display.Label("", 14)
                .setAlign("center")
                .setBaseline("middle")
                .setPosition(this._screenWidth*0.5, this._screenHeight-10)
                .addChildTo(this);
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _onOpen: function() {
            var self = this;
            var y = this._screenHeight*0.5 - this.menu.length * 25;

            this.title = tm.display.Label(this.titleText, 30)
                .setAlign("center")
                .setBaseline("middle")
                .setPosition(this._screenWidth*0.5, y)
                .addChildTo(this);

            this.cursor = this._createCursor();

            this.selections = this.menu.map(function(text, i) {
                var self = this;
                y += 50;
                var selection = tm.ui.LabelButton(text)
                    .setPosition(this._screenWidth*0.5, y)
                    .addChildTo(this);
                selection.interactive = true;
                selection.addEventListener("click", function() {
                    if (self._selected === i) {
                        self.closeDialog(self._selected);
                    } else {
                        self._selected = i;
                        var e = tm.event.Event("menuselect");
                        e.selectValue = self.menu[self._selected];
                        e.selectIndex = i;
                        self.dispatchEvent(e);
                    }
                });
                selection.width = this._screenWidth * 0.7;
                return selection;
            }.bind(this));

            this.cursor.y = this.selections[this._selected].y;

            this._opened = true;

            // close window when touch bg outside
            this.addEventListener("pointingend", function(e) {
                var p = e.app.pointing;
                if (!self.box.isHitPoint(p.x, p.y)) {
                    self.closeDialog(self._selected);
                }
            });

            // dispatch opened event
            var e = tm.event.Event("menuopened");
            this.dispatchEvent(e);
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _createCursor: function() {
            var cursor = tm.display.RectangleShape(this._screenWidth*0.7, 30, {
                strokeStyle: "rgba(0,0,0,0)",
                fillStyle: "rgba(12,79,138,1)"
            }).addChildTo(this);
            cursor.x = this._screenWidth*0.5;
            cursor.target = this._selected;
            
            cursor.update = function() {
                if (this.target !== this.parent._selected) {
                    this.target = this.parent._selected;
                    this.tweener.clear();
                    this.tweener.to({
                        y: this.parent.selections[this.parent._selected].y
                    }, 200, "easeOutExpo");
                }
            };

            return cursor;
        },

        /**
         * @property
         * @TODO ?
         */
        update: function(app) {
            this.description.text = this.descriptions[this._selected];
        },

        /**
         * @property
         * @TODO ?
         */
        closeDialog: function(result) {
            this._finished = true;

            var e = tm.event.Event("menuselected");
            e.selectIndex = result;
            this.dispatchEvent(e);

            this.tweener
                .clear()
                .wait(200)
                .call(function() {
                    this.cursor.remove();
                    this.title.remove();
                    this.selections.each(function(sel) {
                        sel.remove();
                    });
                    this.box.tweener.clear();
                    this.box.tweener
                        .to({ width: 1, height: 1 }, 200, "easeInExpo")
                        .call(function() {
                            this.app.popScene();
                            var e = tm.event.Event("menuclosed");
                            e.selectIndex = result;
                            this.dispatchEvent(e);
                        }.bind(this));
                }.bind(this));
            this.cursor.tweener
                .clear()
                .call(function() {
                    this.visible = !this.visible;
                }.bind(this.cursor))
                .setLoop(true);
        },

        /**
         * @property
         * @TODO ?
         */
        draw: function(canvas) {
            canvas.fillStyle = "rgba(0,0,0,0.8)";
            canvas.fillRect(0,0,this._screenWidth,this._screenHeight);
        },

    });

})();

/*
 * three.js
 */

tm.three = tm.three || {};


(function() {

    if (!tm.global.THREE) return ;

    /**
     * @class THREE.Texture
     * Three.js ライブラリ内クラス
     */
    /**
     * @class THREE.Scene
     * Three.js ライブラリ内クラス
     */
    /**
     * @class THREE.Mesh
     * Three.js ライブラリ内クラス
     */
    /**
     * @class THREE.Object3D
     * Three.js ライブラリ内クラス
     */
    
    /**
     * @class tm.three.ThreeApp
     * 3Dライブラリ - Three.jsをtmlib.jsで対応
     * @extends tm.app.BaseApp
     */
    tm.three.ThreeApp = tm.createClass({

        superClass: tm.app.BaseApp,
        
        canvas      : null,
        background  : null,
        
        _scenes      : null,
        _sceneIndex  : 0,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(canvas) {
            if (canvas instanceof HTMLCanvasElement) {
                this.element = canvas;
            }
            else if (typeof canvas == "string") {
                this.element = document.querySelector(canvas);
            }
            else {
                this.element = document.createElement("canvas");
                document.body.appendChild(this.element);
            }

            // 親の初期化
            this.superInit(this.element);

            // レンダラーを生成
//            this.renderer = new THREE.CanvasRenderer({ canvas: this.element });
            this.renderer = new THREE.WebGLRenderer({ canvas: this.element, clearColor: 0x222222, clearAlpha: 1.0 });

            this.renderer.setSize(this.element.width, this.element.height);
            
            // シーン周り
            this._scenes = [ tm.three.Scene() ];
        },
        
        /**
         * @property
         * @TODO ?
         */
        resize: function(width, height) {
            this.width = width;
            this.height= height;
            this.renderer.setSize(this.width, this.height);
            
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        resizeWindow: function() {
            this.width = innerWidth;
            this.height= innerHeight;
            this.renderer.setSize(this.width, this.height);
            
            return this;
        },
        
        /**
         * @property
         * 画面にフィットさせる
         */
        fitWindow: function(everFlag) {
            // 画面にフィット
            var _fitFunc = function() {
                everFlag = everFlag === undefined ? true : everFlag;
                var e = this.element;
                var s = e.style;
                
                s.position = "absolute";
                s.left = "0px";
                s.top  = "0px";
                
                var rateWidth = e.width/window.innerWidth;
                var rateHeight= e.height/window.innerHeight;
                var rate = e.height/e.width;
                
                if (rateWidth > rateHeight) {
                    s.width  = innerWidth+"px";
                    s.height = innerWidth*rate+"px";
                }
                else {
                    s.width  = innerHeight/rate+"px";
                    s.height = innerHeight+"px";
                }
            }.bind(this);
            
            // 一度実行しておく
            _fitFunc();
            // リサイズ時のリスナとして登録しておく
            if (everFlag) {
                window.addEventListener("resize", _fitFunc, false);
            }
            
            // マウスとタッチの座標更新関数をパワーアップ
            this.mouse._mousemove = this.mouse._mousemoveScale;
            this.touch._touchmove = this.touch._touchmoveScale;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _draw: function() {
            // 描画は全てのシーン行う
            for (var i=0, len=this._scenes.length; i<len; ++i) {
                this.renderer.render(this.currentScene, this.currentScene.camera);
            }
        },
        
    });
    
    
    /**
     * @property    width
     * 幅
     */
    tm.three.ThreeApp.prototype.accessor("width", {
        "get": function()   { return this.element.width; },
        "set": function(v)  { this.element.width = v; }
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.three.ThreeApp.prototype.accessor("height", {
        "get": function()   { return this.element.height; },
        "set": function(v)  { this.element.height = v; }
    });
    
})();


(function() {
    
    if (!tm.global.THREE) return ;

    /**
     * @class tm.three.Element
     * @TODO ?
     * @extends THREE.Object3D
     */
    tm.three.Element = tm.createClass({

        superClass: THREE.Object3D,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            // THREE.Object3D の初期化 
            THREE.Object3D.call(this);

            tm.event.EventDispatcher.prototype.init.call(this);
        },
        
        /**
         * @property
         * 更新処理
         */
        update: function() {},

        /**
         * @property
         * @TODO ?
         * @private
         */
        _update: function(app) {
            // 更新有効チェック
            if (this.isUpdate == false) return ;
            
            this.update(app);
            
            var e = tm.event.Event("enterframe");
            e.app = app;
            this.dispatchEvent(e);
            // 子供達も実行
            if (this.children.length > 0) {
                var tempChildren = this.children.slice();
                for (var i=0,len=tempChildren.length; i<len; ++i) {
                    var child = tempChildren[i];
                    child._update && child._update(app);
                }
                //this.execChildren(arguments.callee, app);
            }
        },
    });
    
    // tm.event.EventDispatcher を継承
    tm.three.Element.prototype.$safe(tm.event.EventDispatcher.prototype);
    
})();

(function() {
    
    if (!tm.global.THREE) return ;

    /**
     * @class tm.three.MeshElement
     * @TODO ?
     * @extends THREE.Mesh
     */
    tm.three.MeshElement = tm.createClass({
        
        superClass: THREE.Mesh,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(geometry, material) {
            material = material || new THREE.MeshNormalMaterial();
            // THREE.Mesh の初期化
            THREE.Mesh.call(this, geometry, material);

            tm.three.Element.prototype.init.call(this);
        },
    });
    
    // tm.three.Element を継承
    tm.three.MeshElement.prototype.$safe(tm.three.Element.prototype);

    
    /**
     * @class tm.three.CubeElement
     * @TODO ?
     * @extends tm.three.MeshElement
     */
    tm.three.CubeElement = tm.createClass({
        superClass: tm.three.MeshElement,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, depth) {
            width  = width || 100;
            height = height || 100;
            depth  = depth || 100;

            var geometry = new THREE.CubeGeometry(width, height, depth);
            var material = new THREE.MeshNormalMaterial();

            this.superInit(geometry, material);
        }
    });


    /**
     * @class tm.three.SphereElement
     * @TODO ?
     * @extends tm.three.MeshElement
     */
    tm.three.SphereElement = tm.createClass({
        superClass: tm.three.MeshElement,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(radius, widthSegments, heightSegments) {
            radius          = radius || 45;
            widthSegments   = widthSegments || 16;
            heightSegments  = heightSegments || 12;

            var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
            var material = new THREE.MeshNormalMaterial();

            this.superInit(geometry, material);
        }
    });

    /**
     * @class tm.three.PlaneElement
     * @TODO ?
     * @extends tm.three.MeshElement
     */
    tm.three.PlaneElement = tm.createClass({
        superClass: tm.three.MeshElement,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height) {
            var geometry = new THREE.PlaneGeometry(width, height);
            var material = new THREE.MeshNormalMaterial();

            this.superInit(geometry, material);
        }
    });


    /**
     * @class tm.three.FloorElement
     * @TODO ?
     * @extends tm.three.MeshElement
     */
    tm.three.FloorElement = tm.createClass({
        superClass: tm.three.MeshElement,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height) {
            width  = width || 1000;
            height = height || 1000;
            var geometry = new THREE.PlaneGeometry(width, height);
            var material = new THREE.MeshBasicMaterial();

            this.superInit(geometry, material);

            this.rotation.x = -Math.PI/2;
            this._render();
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _render: function() {
            var c = tm.graphics.Canvas();
            c.resize(128, 128);
            c.clearColor("#444");
            c.setFillStyle("white");
            c.fillRect(0, 0, 64, 64);
            c.fillRect(64, 64, 64, 64);

            var texture = new THREE.Texture(c.element);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
            texture.needsUpdate = true;
            this.material.map = texture;
        }
    });

    /**
     * @class tm.three.TextElement
     * @TODO ?
     * @extends tm.three.MeshElement
     */
    tm.three.TextElement = tm.createClass({
        superClass: tm.three.MeshElement,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(text, param) {
            var geometry = new THREE.TextGeometry(text, param);
            var material = new THREE.MeshNormalMaterial();

            this.superInit(geometry, material);
        }
    });

    /**
     * @class tm.three.CanvasTexture
     * @TODO ?
     * @extends THREE.Texture
     */
    tm.three.CanvasTexture = tm.createClass({
        superClass: THREE.Texture,

        canvas: null,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.canvas = tm.graphics.Canvas();

            THREE.Texture.call(this, this.canvas.element);
            this.needsUpdate = true;
        }

    });


})();

(function() {
    
    if (!tm.global.THREE) return ;

    /**
     * @class tm.three.Scene
     * シーン
     * @extends THREE.Scene
     */
    tm.three.Scene = tm.createClass({
        
        superClass: THREE.Scene,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(fov, aspect) {
            fov = fov || 60;
            aspect = aspect || 640/480;
            // THREE.Scene の初期化
            THREE.Scene.call(this);

            // tm.three.Element を継承
            tm.three.Element.prototype.init.call(this);

            this.camera = new THREE.PerspectiveCamera(fov, aspect, 1, 10000);
            this.camera.position.y = 100;
            this.camera.position.z = 500;

            this.projector = new THREE.Projector();
        },

        /**
         * @property
         * @TODO ?
         */
        intersect: function(objects) {
            objects = objects || this.children;
            var mouseX = this.app.pointing.x;
            var mouseY = this.app.pointing.y;

            mouseX = (mouseX/this.app.width) *2-1;
            mouseY =-(mouseY/this.app.height)*2+1;

            var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
            this.projector.unprojectVector(vector, this.camera);

            var raycaster = new THREE.Raycaster(
                this.camera.position, vector.sub(this.camera.position).normalize()
            );

            return raycaster.intersectObjects(objects);
        }
    });
    
    // tm.three.Element を継承
    tm.three.Scene.prototype.$safe(tm.three.Element.prototype);
})();





/*
 * sound.js
 */

tm.sound = tm.sound || {};


(function() {
    
    tm.sound.globalVolume = 1.0;
    
})();


(function() {
    
    /**
     * @class tm.sound.Sound
     * サウンドクラス
     */
    tm.sound.Sound = tm.createClass({
        
        element     : null,
        loaded      : false,
        isPlay      : false,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(src) {
            this.element = new Audio();
            this.element.src = src;
            this.element.load();
            this.element.setAttribute("preload", "auto");
            
            var self = this;
            this.element.addEventListener("canplaythrough", function(){
                self.loaded = true;
            });
            this.element.addEventListener("ended", function(){
                self.isPlay = false;
            });
            this.element.addEventListener("error", function(){
                console.warn(this.src + "の読み込みに失敗しました");
            });
            
            this.element.volume = 1.0;
            
            //? モバイル系は音が不安定なので一時対応
            if (tm.isMobile) {
                this.loaded = true;
            }
        },
        
        /**
         * @property
         * 再生
         */
        play: function() {
            this.element.play();
            this.isPlay = true;
            return this;
        },
        
        /**
         * @property
         * 停止
         */
        stop: function() {
            this.element.pause();
            //? スマホだと止まるので応急対応
            if (!tm.isMobile) {
                this.element.currentTime = 0;
            }
            this.isPlay = false;
            return this;
        },
        
        /**
         * @property
         * 一時停止
         */
        pause: function() {
            this.element.pause();
            return this;
        },
        
        /**
         * @property
         * クローン
         */
        clone: function() {
            return tm.sound.Sound( this.element.src );
        },
        
    });
    
    
    
    /**
     * @property    volume
     * ボリューム
     */
    tm.sound.Sound.prototype.accessor("volume", {
        "get": function() { return this.element.volume; },
        "set": function(v){ this.element.volume = v; }
    });
    
    
    if ((new Audio()).loop !== undefined) {
    
        /**
         * @property    loop
         * ループフラグ
         */
        tm.sound.Sound.prototype.accessor("loop", {
            "get": function() { return this.element.loop; },
            "set": function(v){ this.element.loop = v; }
        });
    }
    // firefox 対応
    else {
        var onLoopFunc = function() {
            this.play();
        }
        tm.sound.Sound.prototype.accessor("loop", {
            "get": function() { return this.element.loop; },
            "set": function(v){
                // ループが false の状態で ture が来た場合ループ用関数を登録する
                if (this.element.loop != true && v == true) {
                    this.element.addEventListener("ended", onLoopFunc, false);
                }
                // 関数が登録されていて false が設定された場合ループ用関数を解除する
                else if (this.element.loop == true && v == false) {
                    this.element.removeEventListener("ended", onLoopFunc, false);
                }
                this.element.loop = v;
            }
        });
    }
    
    
    /**
     * @static
     * @property    SUPPORT_EXT
     * サポートしている拡張子
     */
    tm.sound.Sound.SUPPORT_EXT = (function(){
        var ext     = "";
        var audio   = new Audio();
        
        if      (audio.canPlayType("audio/wav") == 'maybe') { ext="wav"; }
        else if (audio.canPlayType("audio/mp3") == 'maybe') { ext="mp3"; }
        else if (audio.canPlayType("audio/ogg") == 'maybe') { ext="ogg"; }
        
        return ext;
    })();
    
})();


(function(){
    
    //? モバイル系ブラウザ対応
    var DEFAULT_CACHE_NUM = (tm.isMobile) ? 1 : 4;
    
    /**
     * @class tm.sound.SoundManager
     * サウンドを管理するクラス
     */
    tm.sound.SoundManager = {
        sounds: {}
    };
    
    /**
     * @static
     * @method
     * サウンドを追加
     */
    tm.sound.SoundManager.add = function(name, src, cache) {
        cache = cache || DEFAULT_CACHE_NUM;
        
        // 拡張子チェック
        if (src.split('/').at(-1).indexOf('.') == -1) {
            src += "." + tm.sound.Sound.SUPPORT_EXT;
        }
        
        var cacheList = this.sounds[name] = [];
        for (var i=0; i<cache; ++i) {
            var sound = tm.sound.Sound(src);
            cacheList.push( sound );
        }
        
        return this;
    };
    
    /**
     * @static
     * @method
     * サウンドを取得
     */
    tm.sound.SoundManager.get = function(name) {
        var cacheList = this.sounds[name];
        for (var i=0,len=cacheList.length; i<len; ++i) {
            if (cacheList[i].isPlay == false) {
                return cacheList[i];
            }
        }
        // 仕方なく0番目を返す
        return cacheList[0];
    };
    
    /**
     * @static
     * @method
     * サウンドを取得(index 指定版)
     */
    tm.sound.SoundManager.getByIndex = function(name, index) {
        return this.sounds[name][index];
    };
    
    /**
     * @static
     * @method
     * サウンドを削除
     */
    tm.sound.SoundManager.remove = function(name) {
        // TODO:
        
        return this;
    };
    
    /**
     * @static
     * @method
     * ボリュームをセット
     */
    tm.sound.SoundManager.setVolume = function(name, volume) {
        // TODO:
        
        return this;
    };
    
    /**
     * @static
     * @method
     * ロードチェック
     */
    tm.sound.SoundManager.isLoaded = function() {
        for (var key in this.sounds) {
            var soundList = this.sounds[key];
            
            for (var i=0,len=soundList.length; i<len; ++i) {
                if (soundList[i].loaded == false) {
                    return false;
                }
            }
        }
        return true;
    };
    
    tm.addLoadCheckList(tm.sound.SoundManager);
    
})();


/*
 * webaudio.js
 */

tm.sound = tm.sound || {};


(function() {

    var isAvailable = tm.global.webkitAudioContext ? true : false;
    var context = isAvailable ? new webkitAudioContext() : null;

    /**
     * @class tm.sound.WebAudio
     * WebAudioクラス
     * @extends tm.event.EventDispatcher
     */
    tm.sound.WebAudio = tm.createClass({
        superClass: tm.event.EventDispatcher,

        loaded: false,
        context: null,
        buffer: null,
        panner: null,

        /**
         * ボリューム
         */
        volume: 0.8,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(src_or_buffer) {
            this.superInit();

            this.context = context;
            var type = typeof(src_or_buffer);

            if (type==="string") {
                this.loaded = false;
                this._load(src_or_buffer);
            }
            else if (type==="object") {
                this._setup();
                this.buffer = src_or_buffer;
                this.loaded = true;
                this.dispatchEvent( tm.event.Event("load") );
            }
            else {
                this._setup();
                this.loaded = false;
            }
        },

        /**
         * @property
         * 再生
         * - noteGrainOn ... http://www.html5rocks.com/en/tutorials/casestudies/munkadoo_bouncymouse/
         */
        play: function(time) {
            if (time === undefined) time = 0;
            this.source.noteOn(this.context.currentTime + time);
            /*
            this.source.noteGrainOn(this.context.currentTime + time, 0, this.buffer.duration);
            console.dir(this.buffer.duration);
            console.dir(this.context.currentTime)
            */

            return this;
        },

        /**
         * @property
         * 停止
         */
        stop: function(time) {
            if (time === undefined) time = 0;
            this.source.noteOff(this.context.currentTime + time);
            
            var buffer = this.buffer;
            var volume = this.volume;
            var loop   = this.loop;
            
            this.source = this.context.createBufferSource();
            this.source.connect(this.panner);
            this.buffer = buffer;
            this.volume = volume;
            this.loop = loop;

            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        pause: function() {
            this.source.disconnect();

            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        resume: function() {
            this.source.connect(this.panner);

            return this;
        },

        /**
         * @property
         * 複製
         */
        clone: function() {
            var webAudio = tm.sound.WebAudio(this.buffer);
            webAudio.volume = this.volume;
            return webAudio;
        },
        /**
         * @property
         * dummy
         */
        setPosition: function(x, y, z) {
            this.panner.setPosition(x, y||0, z||0);

            return this;
        },
        /**
         * @property
         * dummy
         */
        setVelocity: function(x, y, z) {
            this.panner.setVelocity(x, y||0, z||0);

            return this;
        },
        /**
         * @property
         * dummy
         */
        setOrientation: function(x, y, z) {
            this.panner.setOrientation(x, y||0, z||0);

            return this;
        },

        /**
         * @property
         * dummy
         * チェーンメソッド用
         */
        setBuffer: function(v) {
            this.buffer = v;
            return this;
        },


        /**
         * @property
         * dummy
         * チェーンメソッド用
         */
        setLoop: function(v) {
            this.loop = v;
            return this;
        },


        /**
         * @property
         * dummy
         * チェーンメソッド用
         */
        setVolume: function(v) {
            this.volume = v;
            return this;
        },


        /**
         * @property
         * チェーンメソッド用
         */
        setPlaybackRate: function(v) {
            this.playbackRate = v;
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _load: function(src) {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        self.context.decodeAudioData(xhr.response, function(buffer) {
                            self._setup();
                            self.buffer = buffer;
                            self.loaded = true;
                            self.dispatchEvent( tm.event.Event("load") );
                        });
                    } else {
                        console.error(xhr);
                    }
                }
            };
            xhr.open("GET", src, true);
            xhr.responseType = "arraybuffer";
            xhr.send();
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _setup: function() {
            this.source     = this.context.createBufferSource();
//            this.gainNode   = this.context.createGainNode();
            this.panner     = this.context.createPanner();
            this.analyser   = this.context.createAnalyser();

            this.source.connect(this.panner);
            this.panner.connect(this.analyser);
            this.analyser.connect(this.context.destination);
        },

        /**
         * @property
         * @TODO ?
         */
        tone: function(hertz, seconds) {
            // handle parameter
            hertz   = hertz !== undefined ? hertz : 200;
            seconds = seconds !== undefined ? seconds : 1;
            // set default value    
            var nChannels   = 1;
            var sampleRate  = 44100;
            var amplitude   = 2;
            // create the buffer
            var buffer  = this.context.createBuffer(nChannels, seconds*sampleRate, sampleRate);
            var fArray  = buffer.getChannelData(0);
            // fill the buffer
            for(var i = 0; i < fArray.length; i++){
                var time    = i / buffer.sampleRate;
                var angle   = hertz * time * Math.PI;
                fArray[i]   = Math.sin(angle)*amplitude;
            }
            // set the buffer
            this.buffer = buffer;
            return this;    // for chained API
        },
    });

    /**
     * @property    buffer
     * @TODO ?
     */
    tm.sound.WebAudio.prototype.accessor("buffer", {
        get: function()  { return this.source.buffer; },
        set: function(v) { this.source.buffer = v; }
    });

    /**
     * @property    loop
     * @TODO ?
     */
    tm.sound.WebAudio.prototype.accessor("loop", {
        get: function()  { return this.source.loop; },
        set: function(v) { this.source.loop = v; }
    });

    /**
     * @property    valume
     * @TODO ?
     */
    tm.sound.WebAudio.prototype.accessor("volume", {
        get: function()  { return this.source.gain.value; },
        set: function(v) { this.source.gain.value = v; }
    });

    /**
     * @property    playbackRate
     * @TODO ?
     */
    tm.sound.WebAudio.prototype.accessor("playbackRate", {
        get: function()  { return this.source.playbackRate.value; },
        set: function(v) { this.source.playbackRate.value = v; }
    });

    tm.sound.WebAudio.isAvailable = tm.global.webkitAudioContext ? true : false;

})();




/*
 * twitter.js
 */

tm.social = tm.social || {};


(function() {
    
    /**
     * @class tm.social.Twitter
     * ツイッター関連ネームスペース
     */
    tm.social.Twitter = tm.social.Twitter || {};
    
    tm.social.Twitter.API_URL = "http://api.twitter.com/1";    // version 1 は廃止予定らしい
    var BASE_URL = "http://twitter.com/intent";


    /**
     * @member      tm.social.Twitter
     * Tweet する
     * @param {Object} prop
     * ### Reference
     * - <https://dev.twitter.com/docs/intents>
     * ### Example
     *      tm.social.Twitter.createURL({
     *          type        : "tweet",              // タイプ(tweet/retweet/favorite/user)
     *          tweet_id    : "210219483959263232", // 対象となる Tweet
     *          in_reply_to : "210219483959263232", // 返信する対象となる Tweet
     *          text        : "Test",               // テキスト
     *          screen_name : "phi_jp",             // スクリーンネーム
     *          hashtags    : "javascript,tmlibjs", // ハッシュタグ
     *          url         : "http://tmlife.net",  // url
     *          via         : "phi_jp",             // ～から
     *          related     : "tmlib.js tmlife",    // 関連ワード
     *      });
     */
    tm.social.Twitter.createURL = function(prop) {
        var param_string_list = [];
        for (var key in prop) {
            if (key == "type") continue;
            var value = encodeURIComponent(prop[key]);
            var param_string = key+"="+value;
            param_string_list.push(param_string);
        }
        
        var url = "{baseURL}/{type}?{param}".format({
            baseURL : BASE_URL,
            type    : prop.type,
            param   : param_string_list.join('&'),
        });
        
        return url;
    };
    
    
})();

(function() {
    
    var BASE_URL = "http://api.twitter.com/1/{type}/{kind}.json";

    /**
     * @member      tm.social.Twitter
     * @property    api
     */
    tm.social.Twitter.api = function(type, kind, param, callback) {
        var url = BASE_URL.format({ type:type, kind:kind });
        var qs  = tm.util.QueryString.stringify(param);
        
        tm.util.Ajax.loadJSONP(url + "?" + qs, callback);
    };
    
})();



(function() {
    
    var BASE_URL = "http://search.twitter.com/search.json";

    /**
     * @member      tm.social.Twitter
     * @property    search
     */
    tm.social.Twitter.search = function(param, callback) {
        var url = BASE_URL;
        var qs  = tm.util.QueryString.stringify(param);
        
        tm.util.Ajax.loadJSONP(url + "?" + qs, callback);
    };
    
})();


(function() {
    
    /*
     * format = xml or json
     */
    var BASE_URL = "http://api.twitter.com/1/statuses/followers.json";
    //http://api.twitter.com/1/statuses/followers.json?id=tmlife_jp
    
    /**
     * @member      tm.social.Twitter
     * @property    getFollowers
     * 
     * user_id      ユーザーID
     * screen_name  screen_name
     * cursor       -1 を指定すると先頭から 100
     * include_entities     true を指定すると entities を取得できる
     * 
     */
    tm.social.Twitter.getFollowers = function(param, callback) {
        tm.social.Twitter.api("statuses", "followers", param, callback);
        
        /*
        tm.social.Twitter.api("statuses", "public_timeline", param, callback);
        tm.social.Twitter.api("statuses", "home_timeline", param, callback);
        tm.social.Twitter.api("statuses", "friends_timeline", param, callback);
        tm.social.Twitter.api("statuses", "user_timeline", param, callback);
        tm.social.Twitter.api("statuses", "replies", param, callback);
        tm.social.Twitter.api("statuses", "mentions", param, callback);
        */
    };
    
})();





































/*
 * nineleap.js
 */

tm.social = tm.social || {};


(function() {
    
    /**
     * @class tm.social.NineLeap
     * 9leap ネームスペース
     */
    tm.social.Nineleap = tm.social.Nineleap || {};
    
    var BASE_URL = "http://9leap.net/games/{id}/result?score={score}&result={result}";

    /**
     * @member      tm.social.Nineleap
     * @property    createURL
     */
    tm.social.Nineleap.createURL = function(id, score, result) {
        return BASE_URL.format({
            id      : id,
            score   : score,
            result  : result
        });
    };

    /**
     * @member      tm.social.Nineleap
     * @property    postRanking
     */
    tm.social.Nineleap.postRanking = function(score, result) {
        if (location.hostname == 'r.jsgames.jp') {
            var id = location.pathname.match(/^\/games\/(\d+)/)[1]; 
            location.replace( this.createURL(id, score, result) );
        }
        else {
            console.warn("9leap に投稿されていません!");
        }
    };
    
})();


/*
 * chart.js
 */

tm.google = tm.google || {};


(function() {
    
    /**
     * @class tm.google.Chart
     * チャートネームスペース
     */
    tm.google.Chart = tm.google.Chart || {};
    
    var DYNAMIC_ICONS_BASE_URL  = "https://chart.googleapis.com/chart?chst={type}&chld={data}";
    var QR_CODE_BASE_URL        = "https://chart.googleapis.com/chart?chs={size}&cht={type}&chl={text}&chco={color}";
    
    /**
     * @property
     * ダイナミックアイコン
     * @param {string}  type    d_bubble_text_small OR d_fnote_title OR chst=d_fnote etc...
     * @param {string}  data    
     * ### Example
     *      tm.google.Chart.createDynamicIcons("d_bubble_icon_text_small", "ski|bb|Hello, world!|FFFFFF|000000");
     *      tm.google.Chart.createDynamicIcons("d_fnote", "balloon|1|000000|l|Hello, world!");
     *      tm.google.Chart.createDynamicIcons("d_fnote", "pinned_c|1|000000|l|Hello, world!");
     *      tm.google.Chart.createDynamicIcons("d_weather", "taped_y|sunny|Barcelona|max+25°C|min+15°C");
     *      tm.google.Chart.createDynamicIcons("d_simple_text_icon_left", "flag_jp|14|000|flag_jp|24|000|FFF");
     */
    tm.google.Chart.createDynamicIcons = function(type, data) {
        // data = encodeURIComponent(data);
        return DYNAMIC_ICONS_BASE_URL.format({
            type:type,
            data:data
        });
    };
    
    /**
     * @property
     * QRCode 生成
     * @param {Object} prop
     * ### Reference
     * - <https://developers.google.com/chart/?hl=ja#qrcodes>
     * - <https://developers.google.com/chart/infographics/?hl=ja>
     * - <https://google-developers.appspot.com/chart/infographics/docs/overview>
     * ### Example
     *      tm.google.Chart.createQRCode("160x160", "http://tmlife.net");
     *      tm.google.Chart.createQRCode("160x160", "Hello, world");
     */
    tm.google.Chart.createQRCode = function(size, text, color) {
        text = encodeURIComponent(text);
        
        return QR_CODE_BASE_URL.format({
            type:"qr",
            size:size,
            text:text,
        });
    };
    
    /**
     * @property
     * Tex 生成
     */
    tm.google.Chart.createTeX = function() {
        //&chco=ff0000ff
    };
    
})();


;(function() {
    
    /**
     * @member      tm.app.Element
     * @property    interaction
     * インタラクション
     */
    tm.app.Element.prototype.getter("interaction", function() {
        console.assert(false, "interaction は Object2d に統合されました. obj.setInteractive(true); とすればタッチ判定が有効になります.");
    });
    
    
    var dirtyClass = [
        "Sprite",
        "Shape",
        "CircleShape",
        "TriangleShape",
        "RectangleShape",
        "StarShape",
        "PolygonShape",
        "HeartShape",
        "TextShape",
        "CanvasRenderer",
        "BoundingRectRenderer",
        "Label",
        "MapSprite",
        "CanvasElement",
        "CanvasApp",
        "AnimationSprite",
        "SpriteSheet",
    ];
    
    dirtyClass.each(function(className) {
        tm.app[className] = tm.display[className];
    });


})();
