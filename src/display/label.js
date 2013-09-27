/*
 * label.js
 */

tm.display = tm.display || {};


(function() {
    
    var dummyCanvas  = null;
    var dummyContext = null;
    
    /**
     * @class tm.display.Label
     * システムフォントを描画するクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.Label = tm.createClass({
        
        superClass: tm.display.CanvasElement,
        
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
         * @constructor
         * コンストラクタ
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
        
        /**
         * @property
         * @TODO ?
         */
        setAlign: function(align) {
            this.align = align;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setBaseline: function(baseline) {
            this.baseline = baseline;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setFontSize: function(size) {
            this.fontSize = size;
            return this;
        },
        
        /**
         * @property
         * @TODO ?
         */
        setFontFamily: function(family) {
            this.fontFamily= family;
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        setFontWeight: function(weight) {
            this.fontWeight= weight;
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateFont: function() {
            this.fontStyle = "{fontWeight} {fontSize}px {fontFamily}".format(this);
            if (!dummyCanvas) {
                dummyCanvas = document.createElement("canvas");
                dummyContext = dummyCanvas.getContext('2d');
            }
            dummyContext.font = this.fontStyle;
            this.textSize = dummyContext.measureText('あ').width * this.lineHeight;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateLines: function() {
            this._lines = (this._text+'').split('\n');
        }
        
    });
    
    /**
     * @property    text
     * サイズ
     */
    tm.display.Label.prototype.accessor("text", {
        "get": function() { return this._text; },
        "set": function(v){
            if (v == null || v == undefined) {
                this._text = "";
            }
            else {
                this._text = v;
            }
            this._updateLines();
        }
    });
    
    /**
     * @property    size
     * サイズ
     */
    tm.display.Label.prototype.accessor("fontSize", {
        "get": function() { return this._fontSize; },
        "set": function(v){ this._fontSize = v; this._updateFont(); }
    });
    
    /**
     * @property    fontFamily
     * フォント
     */
    tm.display.Label.prototype.accessor("fontFamily", {
        "get": function() { return this._fontFamily; },
        "set": function(v){ this._fontFamily = v; this._updateFont(); }
    });
    
    /**
     * @property fontWeight
     * フォント
     */
    tm.display.Label.prototype.accessor("fontWeight", {
        "get": function() { return this._fontWeight; },
        "set": function(v) {
            this._fontWeight = v; this._updateFont();
        },
    });
    
    /**
     * @property lineHeight
     * フォント
     */
    tm.display.Label.prototype.accessor("lineHeight", {
        "get": function() { return this._lineHeight; },
        "set": function(v) {
            this._lineHeight = v; this._updateFont();
        },
    });

    
})();

