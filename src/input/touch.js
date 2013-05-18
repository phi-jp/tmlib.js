/*
 * phi
 */


tm.input = tm.input || {};


(function() {
    
    /**
     * @class
     * タッチクラス
     */
    tm.input.Touch = tm.createClass({
        
        element: null,
        touched: false,
        
        /**
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
            
            // 変化値を保存
            this.deltaPosition.setObject(this.position).sub(this.prevPosition);
            
            // 前回の座標を保存
            this.prevPosition.setObject(this.position);
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
        
        _touchmove: function(e) {
            var t = this._touch;
            var r = e.target.getBoundingClientRect();
            this.x = t.clientX - r.left;
            this.y = t.clientY - r.top;
        },
        
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

    tm.define("tm.input.Touches", {
        superClass: Array,

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

        update: function() {
            this.each(function(touch) {
                touch.update();
            });
        }
    });

})();





