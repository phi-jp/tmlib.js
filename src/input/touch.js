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
        /** element */
        element: null,
        /** touched */
        touched: false,

        /** @property position */
        /** @property deltaPosition */
        /** @property prevPosition */
        /** @private @property _x */
        /** @private @property _y */
        
        /**
         * @constructor
         * <a href="http://tmlib-js.googlecode.com/svn/trunk/test/input/touch-test.html">Test Program</a>.
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
            this.element.addEventListener("touchstart", function(e){
                self.touched = true;
                
                self._touchmove(e);
                // 最初だけセット
                self.position.set(self._x, self._y);
                self.prevPosition.set(self._x, self._y);    // prevPostion をリセット

                self._setTouches(e);
            });
            this.element.addEventListener("touchend", function(e){
                self.touched = false;

                self._setTouches(e);
            });
            this.element.addEventListener("touchmove", function(e){
                self._touchmove(e);
                // 画面移動を止める
                e.stop();

                self._setTouches(e);
            });
            
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
         * 情報更新処理
         * マイフレーム呼んで下さい.
         */
        update: function() {
            this.last   = this.now;
            this.now    = Number(this.touched);
            
            this.start  = (this.now ^ this.last) & this.now;
            this.end    = (this.now ^ this.last) & this.last;
            
            // 変化値を更新
            this.deltaPosition.x = this._x - this.position.x;
            this.deltaPosition.y = this._y - this.position.y;
            
            // 前回の座標を更新
            this.prevPosition.setObject(this.position);
            
            // 現在の位置を更新
            this.position.set(this._x, this._y);
        },
        
        /**
         * タッチしているかを判定
         */
        getTouch: function() {
            return this.touched != 0;
        },
        
        /**
         * タッチ開始時に true
         */
        getTouchStart: function() {
            return this.start != 0;
        },
        
        /**
         * タッチ終了時に true
         */
        getTouchEnd: function() {
            return this.end != 0;
        },

        /**
         * @private
         */
        _touchmove: function(e) {
            var t = e.touches[0];
            var r = e.target.getBoundingClientRect();
            this._x = t.clientX - r.left;
            this._y = t.clientY - r.top;
        },

        /**
         * @private
         */
        _touchmoveScale: function(e) {
            var t = e.touches[0];
            var r = e.target.getBoundingClientRect();
            this._x = t.clientX - r.left;
            this._y = t.clientY - r.top;
            
            if (e.target.style.width) {
                this._x *= e.target.width / parseInt(e.target.style.width);
            }
            if (e.target.style.height) {
                this._y *= e.target.height / parseInt(e.target.style.height);
            }
        },

        _getAdjustPoint: function(p) {
            var elm = this.element;
            var style = elm.style;
            var r = elm.getBoundingClientRect();
            var p = {
                x: p.clientX - r.left,
                y: p.clientY - r.top,
            };
            
            if (style.width) {
                p.x *= elm.width / parseInt(style.width);
            }
            if (style.height) {
                p.y *= elm.height / parseInt(style.height);
            }

            return p;
         },

        _setTouches: function(e) {
            var touches = e.touches;

            this.touches.clear();
            for (var i=0,len=touches.length; i<len; ++i) {
                var p = this._getAdjustPoint(touches[i]);
                this.touches.push(p);
            }

            return this;
        }
        
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
    return ;

    /**
     * @class tm.input.Touches
     * マルチタッチ対応クラス
     * @extends global.Array
     */
    tm.define("tm.input.Touches", {
        superClass: Array,

        /**
         * @constructor
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
         * 更新
         */
        update: function() {
            this.each(function(touch) {
                touch.update();
            });
        }
    });

})();





