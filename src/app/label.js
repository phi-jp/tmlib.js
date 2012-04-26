/*
 * label.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class
     * Label
     */
    tm.app.Label = tm.createClass({
        
        superClass: tm.app.CanvasElement,
        
        /**
         * 塗りつぶしフラグ
         */
        fill: true,
        /**
         * ストロークフラグ
         */
        stroke: false,
        debugBox: false,
        
        /**
         * 初期化
         */
        init: function(text, size) {
            this.superInit();
            
            this.text       = text || "HOGE";
            this.size       = size || 24;
            this.font       = "'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            this.align      = "start";
            this.baseline   = "alphabetic";
        },
        
        /**
         * 描画
         */
        draw: function(canvas) {
            canvas.setText(this.fontStyle, this.align, this.baseline);
            if (this.fill) {
                canvas.fillText(this.text, 0, 0, this.width);
            }
            if (this.stroke) {
                canvas.strokeText(this.text, 0, 0, this.width);
            }
            
            if (this.debugBox) {
                canvas.strokeRect(0, 0, this.width, -this.size);
            }
        },
        
        _updateFont: function() {
            this.fontStyle = "{size}px {font}".format(this);
        }
        
    });
    
    
        
    /**
     * サイズ
     * @name        size
     * @fieldof     TM.App.Text.prototype
     */
    tm.app.Label.prototype.accessor("size", {
        "get": function() { return this._size; },
        "set": function(v){ this._size = v; this._updateFont(); }
    });
    
        
    /**
     * フォント
     * @name        font
     * @fieldof     TM.App.Text.prototype
     */
    tm.app.Label.prototype.accessor("font", {
        "get": function() { return this._font; },
        "set": function(v){ this._font = v; this._updateFont(); }
    });
    
})();

