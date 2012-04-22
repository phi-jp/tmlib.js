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
        
        x   : 0,
        y   : 0,
        pX  : 0,
        pY  : 0,
        dX  : 0,
        dY  : 0,
        
        /**
         * @constructs
         * @see         <a href="http://tmlib-js.googlecode.com/svn/trunk/test/input/touch-test.html">Test Program</a>.
         */
        init: function(element) {
            this.element = element || window.document;
            
            var self = this;
            this.element.addEventListener("touchstart", function(e){
                self.touched = true;
            });
            this.element.addEventListener("touchend", function(e){
                self.touched = false;
            });
            this.element.addEventListener("touchmove", function(e){
                var t = e.touches[0];
                self.x = t.pageX;
                self.y = t.pageY;
                // 画面移動を止める
                e.stop();
            });
        },
        
        /**
         * run.
         * 自動でマウス情報を更新したい際に使用する
         */
        run: function(fps) {
            var self = this;
            fps = fps || 30;
            TM.setLoop(function(){
                self.update();
            },　1000/fps);
        },
        
        /**
         * 情報更新処理
         * マイフレーム呼んで下さい.
         */
        update: function() {
            this.last   = this.now;
            this.now    = this.touched;
            this.start  = (this.now ^ this.last) & this.now;
            this.end    = (this.now ^ this.last) & this.last;
            
            this.dX = this.x - this.pX;
            this.dY = this.y - this.pY;
            
            this.pX = this.x;
            this.pY = this.y;
        },
        
        /**
         * タッチしているかを判定
         */
        getTouch: function() {
            return this.touched;
        },
        
        /**
         * タッチ開始時に true
         */
        getTouchStart: function() {
            return this.start;
        },
        
        /**
         * タッチ終了時に true
         */
        getTouchEnd: function() {
            return this.end;
        }
        
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

