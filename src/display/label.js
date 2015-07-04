/*
 * label.js
 */

tm.display = tm.display || {};


(function() {
    
    var dummyCanvas = document.createElement("canvas");
    var dummyContext = dummyCanvas.getContext('2d');

    /**
     * @class tm.display.Label
     * システムフォントを描画するクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.Label = tm.createClass({
        
        superClass: tm.display.CanvasElement,
        
        /** 塗りつぶしフラグ */
        fill: true,
        /** ストロークフラグ */
        stroke: false,
        /** デバッグボックス */
        debugBox: false,

        /** @property _fontSize @private */
        /** @property _fontFamily @private */
        /** @property _fontWeight @private */
        /** @property _lineHeight @private */
        /** @property _rowWidth @private */
        /** @property align */
        /** @property baseline */
        /** @property maxWidth */

        /**
         * @constructor
         */
        init: function(text, size) {
            this.superInit();
            
            this.text       = text;
            
            this._fontSize   = size || 24;
            this._fontFamily = tm.display.Label.default.fontFamily;
            this._fontWeight = "";
            this._lineHeight = 1.2;
            this._updateFont();
            
            this.align = tm.display.Label.default.align;
            this.baseline = tm.display.Label.default.baseline;

            this.maxWidth   = null;
        },
        
        /**
         * アラインをセット
         */
        setAlign: function(align) {
            this.align = align;
            return this;
        },
        
        /**
         * ベースラインをセット
         */
        setBaseline: function(baseline) {
            this.baseline = baseline;
            return this;
        },
        
        /**
         * フォントサイズをセット
         */
        setFontSize: function(size) {
            this.fontSize = size;
            return this;
        },
        
        /**
         * フォントファミリーをセット
         */
        setFontFamily: function(family) {
            this.fontFamily= family;
            return this;
        },

        /**
         * フォントウェイトをセット
         */
        setFontWeight: function(weight) {
            this.fontWeight= weight;
            return this;
        },

        /**
         * @private
         */
        _updateFont: function() {
            this.fontStyle = "{fontWeight} {fontSize}px {fontFamily}".format(this);
            
            this.textSize = this.measure('あ') * this.lineHeight;
        },

        /**
         * @private
         */
        _updateLines: function() {
            var lines = this._lines = (this._text + '').split('\n');

            if (this._rowWidth) {
                var rowWidth = this._rowWidth;
                //どのへんで改行されるか目星つけとく
                var defaultIndex = rowWidth / this.measure('あ') | 0;

                for (var i = lines.length; i--;) {
                    var text = lines[i], index, len, j = 0;
                    while (true) {
                        if (rowWidth > dummyContext.measureText(text).width) break;

                        index = index || defaultIndex;
                        len = text.length;
                        if (len <= index) index = len - 1;

                        if (rowWidth < dummyContext.measureText(text.substring(0, index)).width) {
                            while (rowWidth < dummyContext.measureText(text.substring(0, --index)).width);
                        } else {
                            while (rowWidth >= dummyContext.measureText(text.substring(0, ++index)).width);
                            --index;
                        }

                        //index が 0 のときは無限ループになるので、1にしとく
                        if (index === 0) index = 1;
                        lines.splice(i + j++, 1, text.substring(0, index));
                        lines.splice(i + j, 0, text = text.substring(index, len));
                    }

                }
            }
        },

        /**
         * このLabelインスタンスの設定で文字を描画したときの幅
         * newLine true 指定で\nによる改行も考慮する
         */
        measure: function (text, newLine) {
            dummyContext.font = this.fontStyle;
            text = text == null ? '' : text + '';

            if (newLine) {
                text = text.split('\n');
                var max = 0;

                text.forEach(function (text) {
                    var width = dummyContext.measureText(text).width;
                    if (width > max) max = width;
                });

                return max;
            }

            return dummyContext.measureText(text).width;
        },

        /**
         * 列の幅をセット
         */
        setRowWidth: function (v) {
            this.rowWidth = v;
            return this;
        },
        
    });
    
    /**
     * @property    text
     * 文字
     */
    tm.display.Label.prototype.accessor("text", {
        "get": function() { return this._text; },
        "set": function(v){
            if (v == null) {
                this._text = "";
            }
            else {
                this._text = v;
            }
            this._updateLines();
        }
    });
    
    /**
     * @property    fontSize
     * フォントサイズ
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
     * @property    fontWeight
     */
    tm.display.Label.prototype.accessor("fontWeight", {
        "get": function() { return this._fontWeight; },
        "set": function(v) {
            this._fontWeight = v; this._updateFont();
        },
    });
    
    /**
     * @property lineHeight
     */
    tm.display.Label.prototype.accessor("lineHeight", {
        "get": function() { return this._lineHeight; },
        "set": function(v) {
            this._lineHeight = v; this._updateFont();
        },
    });


    /**
     * @property rowWidth
     */
    tm.display.Label.prototype.accessor("rowWidth", {
        "get": function () { return this._rowWidth; },
        "set": function (v) {
            this._rowWidth = v; this._updateLines();
        },
    });
    
    tm.display.Label.default = {
        align: "center",
        baseline: "middle",
        fontFamily: "'HiraKakuProN-W3'", // Hiragino or Helvetica
        // align: "start",
        // baseline: "alphabetic",
    };

    
})();

