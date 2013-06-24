/*
 * color.js
 */

/*
 * 
 */
tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class   カラークラス
     */
    tm.graphics.Color = tm.createClass({
        
        /**
         * R値
         */
        r: 255,
        
        /**
         * G値
         */
        g: 255,
        
        /**
         * B値
         */
        b: 255,
        
        /**
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
         * 配列によるセッター
         */
        setFromArray: function(arr) {
            return this.set.apply(this, arr);
        },
        
        /**
         * オブジェクトによるセッター
         */
        setFromObject: function(obj) {
            return this.set(obj.r, obj.g, obj.b, obj.a);
        },
        
        /**
         * 文字列によるセッター
         */
        setFromString: function(str) {
            var color = tm.graphics.Color.stringToNumber(str);
            return this.set(color[0], color[1], color[2], color[3]);
        },
        
        /**
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
    
    var MATCH_SET_LIST = {
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
        "hsl": {
            reg: /^hsl\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%\)$/,
            exec: function(m) {
                return tm.graphics.Color.HSLtoRGB(m[1], m[2], m[3]);
            }
        },

        "hsla": {
            reg: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1}(\.{1}\d+)?)\)$/,
            exec: function(m) {
                return Color.HSLAtoRGBA(m[1], m[2], m[3], m[4]);
            }
        },
    };


    tm.graphics.Color.COLOR_LIST = {
        "black"     : [0x00, 0x00, 0x00],
        "silver"    : [0xc0, 0xc0, 0xc0],
        "gray"      : [0x80, 0x80, 0x80],
        "white"     : [0xff, 0xff, 0xff],
        "maroon"    : [0x80, 0x00, 0x00],
        "red"       : [0xff, 0x00, 0x00],
        "purple"    : [0x80, 0x00, 0x80],
        "fuchsia"   : [0xff, 0x00, 0xff],
        "green"     : [0x00, 0x80, 0x00],
        "lime"      : [0x00, 0xff, 0x00],
        "olive"     : [0x80, 0x80, 0x00],
        "yellow"    : [0xff, 0xff, 0x00],
        "navy"      : [0x00, 0x00, 0x80],
        "blue"      : [0x00, 0x00, 0xff],
        "teal"      : [0x00, 0x80, 0x80],
        "aqua"      : [0x00, 0xff, 0xff],
    };

    tm.graphics.Color.strToNum = tm.graphics.Color.stringToNumber = function(str){
        var vlaue = null;
        var type = null;
        
        if (str[0] === '#') {
            type = (str.length == 4) ?  "hex111" : "hex222";
        }
        else if (str[0] === 'r' && str[1] === 'g' && str[2] === 'b')
        {
            type = (str[3] == 'a') ? "rgba" : "rgb";
        }
        else if (str[0] === 'h' && str[1] === 's' && str[2] === 'l')
        {
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


    tm.graphics.Color.HSLtoRGB = function(h, s, l)
    {
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
    
    tm.graphics.Color.HSLAtoRGBA = function(h, s, l, a)
    {
        var temp = Color.HSLtoRGB(h, s, l); temp[3] = a;
        return rgb;
    };

    /**
     * rgb 値を作成
     */
    tm.graphics.Color.createStyleRGB = function(r, g, b) {
        return "rgba(" + r + "," + g + "," + b + ")";
    };
    
    /**
     * rgba 値を作成
     */
    tm.graphics.Color.createStyleRGBA = function(r, g, b, a) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };

    /**
     * hsl 値を作成
     */
    tm.graphics.Color.createStyleHSL = function(h, s, l) {
        return "hsl(" + h + "," + s + "%," + l + "%)";
    };
    
    /**
     * hsla 値を作成
     */
    tm.graphics.Color.createStyleHSLA = function(h, s, l, a) {
        return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
    };
})();
