/*
 * canvas.js
 */

/*
 * 
 */
tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * キャンバス
     */
    tm.graphics.Canvas = tm.createClass({
        
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
            this.canvas             = canvas || document.createElement("canvas");
            this.context            = this.canvas.getContext("2d");
            this.context.lineCap    = "round";
            this.context.lineJoin   = "round";
        }
        
    });
    
})();
