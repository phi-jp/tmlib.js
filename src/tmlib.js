/*
 * tmlib.js v0.1.3
 * http://github.com/phi1618/tmlib.js
 * MIT licensed
 * 
 * Copyright (C) 2010 phi, http://tmlife.net
 */


(function() { "use strict"; })();

/*
 * tm namespace
 */
var tm = tm || {};
tm.global = window || global || this;

(function() {
    
    /**
     * バージョン
     */
    tm.VERSION = "0.1.4";
    
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
            tm_class.prototype = Object.create(prop.superClass.prototype);
            tm_class.prototype.superInit = function() {
                // 一時的に superClass として扱われるようにする
                var temp_proto = this.__proto__;
                this.__proto__ = prop.superClass.prototype;
                // 親の初期化を呼び出す
                prop.superClass.prototype.init.apply(this, arguments);
                // 元に戻す
                this.__proto__ = temp_proto;
            };
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
        
        return tm_class;
    };
    
    
    /**
     * 使用する
     */
    tm.using = function() {
        for (var key in tm) {
            window[key] = tm[key];
        }
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
    
    /**
     * キーコード
     */
    tm.keyCode = {
        "backspace" : 8,
        "tab"       : 9,
        "enter"     : 13, "return"    : 13,
        "shift"     : 16,
        "ctrl"      : 17,
        "alt"       : 18,
        "pause"     : 19,
        "capslock"  : 20,
        "escape"    : 27,
        "pageup"    : 33,
        "pagedown"  : 34,
        "end"       : 35,
        "home"      : 36,
        "left"      : 37,
        "up"        : 38,
        "right"     : 39,
        "down"      : 40,
        "insert"    : 45,
        "delete"    : 46,
        
        "0" : 48,
        "1" : 49,
        "2" : 50,
        "3" : 51,
        "4" : 52,
        "5" : 53,
        "6" : 54,
        "7" : 55,
        "8" : 56,
        "9" : 57,
        
        "a" : 65, "A" : 65,
        "b" : 66, "B" : 66,
        "c" : 67, "C" : 67,
        "d" : 68, "D" : 68,
        "e" : 69, "E" : 69,
        "f" : 70, "F" : 70,
        "g" : 71, "G" : 71,
        "h" : 72, "H" : 72,
        "i" : 73, "I" : 73,
        "j" : 74, "J" : 74,
        "k" : 75, "K" : 75,
        "l" : 76, "L" : 76,
        "m" : 77, "M" : 77,
        "n" : 78, "N" : 78,
        "o" : 79, "O" : 79,
        "p" : 80, "P" : 80,
        "q" : 81, "Q" : 81,
        "r" : 82, "R" : 82,
        "s" : 83, "S" : 83,
        "t" : 84, "T" : 84,
        "u" : 85, "U" : 85,
        "v" : 86, "V" : 86,
        "w" : 87, "W" : 87,
        "x" : 88, "X" : 88,
        "y" : 89, "Y" : 89,
        "z" : 90, "Z" : 90,
        
        "numpad0" : 96,
        "numpad1" : 97,
        "numpad2" : 98,
        "numpad3" : 99,
        "numpad4" : 100,
        "numpad5" : 101,
        "numpad6" : 102,
        "numpad7" : 103,
        "numpad8" : 104,
        "numpad9" : 105,
        "multiply"      : 106,
        "add"           : 107,
        "subtract"      : 109,
        "decimalpoint"  : 110,
        "divide"        : 111,
        
        "f1"    : 112,
        "f2"    : 113,
        "f3"    : 114,
        "f4"    : 115,
        "f5"    : 116,
        "f6"    : 117,
        "f7"    : 118,
        "f8"    : 119,
        "f9"    : 120,
        "f10"   : 121,
        "f11"   : 122,
        "f12"   : 123,
        
        "numlock"   : 144,
        "scrolllock": 145,
        "semicolon" : 186,
        "equalsign" : 187,
        "comma"     : 188,
        "dash"      : 189,
        "period"    : 190,
        "forward slash" : 191,  "/": 191,
        "grave accent"  : 192,
        "open bracket"  : 219,
        "back slash"    : 220,
        "close braket"  : 221,
        "single quote"  : 222,
        
        
        
        "space"         : 32
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




