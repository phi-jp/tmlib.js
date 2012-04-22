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
            
            this.canvas             = canvas || document.createElement("canvas");
            this.context            = this.canvas.getContext("2d");
            this.context.lineCap    = "round";
            this.context.lineJoin   = "round";
        },
        
        /**
         * CSS 用 RGBA 文字列に変換
         */
        toCSSValue: function() {
            return "rgba({r},{g},{b},{a})".format(this);
        },
        
    });
    
})();
