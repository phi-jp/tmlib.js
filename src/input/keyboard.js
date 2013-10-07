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

