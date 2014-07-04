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
        /** element */
        element: null,
        
        /** @property  position */
        /** @property  deltaPosition */
        /** @property  prevPosition */
        /** @private @property  _x */
        /** @private @property  _y */

        /**
         * @constructor
         */
        init: function(element) {
            this.element = element || window.document;
            
            this.position       = tm.geom.Vector2(0, 0);
            this.deltaPosition  = tm.geom.Vector2(0, 0);
            this.prevPosition   = tm.geom.Vector2(0, 0);
            this._x = 0;
            this._y = 0;
            this.touches = [];
            
            var self = this;
            this.element.addEventListener("mousedown", function(e){
                self._mousemove(e);
                self.prevPosition.set(self._x, self._y);    // prevPostion をリセット
                self.button |= 1<<e.button;
            });
            this.element.addEventListener("mouseup", function(e){
                self.button &= ~(1<<e.button);
            });
            this.element.addEventListener("mousemove", function(e){
                // 座標更新
                self._mousemove(e);
            });
        },
        
        /**
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
         * 情報更新処理
         * マイフレーム呼んで下さい.
         */
        update: function() {
            this.last = this.press;
            
            this.press = this.button;
            
            this.down = (this.press ^ this.last) & this.press;
            this.up   = (this.press ^ this.last) & this.last;
            
            // 変化値を更新
            this.deltaPosition.x = this._x - this.position.x;
            this.deltaPosition.y = this._y - this.position.y;
            
            // 前回の座標を更新
            this.prevPosition.setObject(this.position);
            
            // 現在の位置を更新
            this.position.set(this._x, this._y);
        },
        
        /**
         * ボタン取得
         */
        getButton: function(button) {
            if (typeof(button) == "string") {
                button = BUTTON_MAP[button];
            }
            
            return (this.press & button) != 0;
        },
        
        /**
         * ボタンダウン取得
         */
        getButtonDown: function(button) {
            if (typeof(button) == "string") {
                button = BUTTON_MAP[button];
            }
            
            return (this.down & button) != 0;
        },
        
        /**
         * ボタンアップ取得
         */
        getButtonUp: function(button) {
            if (typeof(button) == "string") {
                button = BUTTON_MAP[button];
            }
            
            return (this.up & button) != 0;
        },

        /**
         * @private
         */
        _mousemove: function(e) {
            var rect = e.target.getBoundingClientRect();
            this._x = e.clientX - rect.left;
            this._y = e.clientY - rect.top;
        },

        /**
         * @private
         */
        _mousemoveNormal: function(e) {
            var rect = e.target.getBoundingClientRect();
            this._x = e.clientX - rect.left;
            this._y = e.clientY - rect.top;
        },

        /**
         * @private
         */
        _mousemoveScale: function(e) {
            var rect = e.target.getBoundingClientRect();
            this._x = e.clientX - rect.left;
            this._y = e.clientY - rect.top;
            
            //if (e.target instanceof HTMLCanvasElement) {
                // スケールを考慮した拡縮
                if (e.target.style.width) {
                    this._x *= e.target.width / parseInt(e.target.style.width);
                }
                if (e.target.style.height) {
                    this._y *= e.target.height / parseInt(e.target.style.height);
                }
            //}
        },
        
    });
    
    /** @static @property */
    tm.input.Mouse.BUTTON_LEFT      = 0x1;
    /** @static @property */
    tm.input.Mouse.BUTTON_MIDDLE    = 0x2;
    /** @static @property */
    tm.input.Mouse.BUTTON_RIGHT     = 0x4;
    
    /*
     * 
     */
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
     * @static
     * @method getPointing
     * ポインティング状態取得(touch との差異対策)
     */
    tm.input.Mouse.prototype.getPointing        = function() { return this.getButton("left"); };
    /**
     * @static
     * @method getPointingStart
     * ポインティングを開始したかを取得(touch との差異対策)
     */
    tm.input.Mouse.prototype.getPointingStart   = function() { return this.getButtonDown("left"); };
    /**
     * @static
     * @method getPointingEnd
     * ポインティングを終了したかを取得(touch との差異対策)
     */
    tm.input.Mouse.prototype.getPointingEnd     = function() { return this.getButtonUp("left"); };
    
    
})();

