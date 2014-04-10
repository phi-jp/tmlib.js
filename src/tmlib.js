
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
    tm.VERSION = '<%= pkg.version %>';

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
    
    tm.isLocal = (function() {
        var flag = (location.protocol == "file:");
        return function() { return flag; };
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

        prop._path      = path;
        prop._className = className;

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