/*
 * label.js
 */

tm.app = tm.app || {};


(function() {
    
    var dummyCanvas  = null;
    var dummyContext = null;
    
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
            
            this.text       = text || "";
            
            this._fontSize   = size || 24;
            this._fontFamily = "'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            this._fontWeight = "";
            this._lineHeight = 1.2;
            this._updateFont();
            
            this.align      = "start";
            this.baseline   = "alphabetic";

            this.maxWidth   = null;
        },
        
        setAlign: function(align) {
            this.align = align;
            return this;
        },
        
        setBaseline: function(baseline) {
            this.baseline = baseline;
            return this;
        },
        
        setFontSize: function(size) {
            this.fontSize = size;
            return this;
        },
        
        setFontFamily: function(family) {
            this.fontFamily= family;
            return this;
        },
        
        setFontWeight: function(weight) {
            this.fontWeight= weight;
            return this;
        },
        
        _updateFont: function() {
            this.fontStyle = "{fontWeight} {fontSize}px {fontFamily}".format(this);
            if (!dummyCanvas) {
                dummyCanvas = document.createElement("canvas");
                dummyContext = dummyCanvas.getContext('2d');
            }
            dummyContext.font = this.fontStyle;
            this.textSize = dummyContext.measureText('あ').width * this.lineHeight;
        },
        
        _updateLines: function() {
            this._lines = (this._text+'').split('\n');
        }
        
    });
    
    /**
     * @property    text
     * サイズ
     */
    tm.app.Label.prototype.accessor("text", {
        "get": function() { return this._text; },
        "set": function(v){
            this._text = v || "";
            this._updateLines();
        }
    });
    
    /**
     * @property    size
     * サイズ
     */
    tm.app.Label.prototype.accessor("fontSize", {
        "get": function() { return this._fontSize; },
        "set": function(v){ this._fontSize = v; this._updateFont(); }
    });
    
    /**
     * @property    fontFamily
     * フォント
     */
    tm.app.Label.prototype.accessor("fontFamily", {
        "get": function() { return this._fontFamily; },
        "set": function(v){ this._fontFamily = v; this._updateFont(); }
    });
    
    /**
     * @property fontWeight
     * フォント
     */
    tm.app.Label.prototype.accessor("fontWeight", {
        "get": function() { return this._fontWeight; },
        "set": function(v) {
            this._fontWeight = v; this._updateFont();
        },
    });
    
    /**
     * @property lineHeight
     * フォント
     */
    tm.app.Label.prototype.accessor("lineHeight", {
        "get": function() { return this._lineHeight; },
        "set": function(v) {
            this._lineHeight = v; this._updateFont();
        },
    });

    
})();

