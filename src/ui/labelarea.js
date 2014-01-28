
;(function() {
    
    tm.define("tm.ui.LabelArea", {
        superClass: "tm.display.Shape",
        
        init: function(param) {
            param = param || {};
            this.superInit(param.width || 150, param.height || 60);
            
            this.canvas.clearColor("red");
            
            this.mode = param.mode || "horizon";
            
            this._fillStyle = param.fillStyle || "#aaa";
            this._bgColor = param.bgColor || "transparent";
            
            this._fontSize   = param.fontSize || 24;
            this._fontFamily = "'Consolas', 'Monaco', 'ＭＳ ゴシック'";
            this._fontWeight = "";
            this._updateFont();
            
            this.setText(param.text || "こんにちは,世界!");
        },
        
        setText: function(text) {
            if (this._text === text) { return ; }
            
            this._text =  text;
            
            this._renderText();
        },
        
        _renderText: function() {
            this.canvas.width  =this.width;
            this.canvas.height =this.height;
            
            this.canvas.clearColor(this.bgColor);
            
            this.canvas.font = this.fontStyle;
            this.canvas.fillStyle = this.fillStyle;
            this.canvas.fillLabelArea({
                text: this._text,
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                mode: this.mode,
            });
        },

        /**
         * @TODO ?
         * @private
         */
        _updateFont: function() {
            this.fontStyle = "{fontWeight} {fontSize}px {fontFamily}".format(this);
            if (this.text) {
                this._renderText();
            }
        },
    });
    
    
    /**
     * @property    text
     * 文字
     */
    tm.ui.LabelArea.prototype.accessor("text", {
        "get": function() { return this._text; },
        "set": function(v){
            this.setText(v);
        }
    });
    
    /**
     * @property    fontSize
     * フォントサイズ
     */
    tm.ui.LabelArea.prototype.accessor("fontSize", {
        "get": function() { return this._fontSize; },
        "set": function(v){ this._fontSize = v; this._updateFont(); }
    });
    
    /**
     * @property    fontFamily
     * フォント
     */
    tm.ui.LabelArea.prototype.accessor("fontFamily", {
        "get": function() { return this._fontFamily; },
        "set": function(v){ this._fontFamily = v; this._updateFont(); }
    });
    
    /**
     * @property    fontWeight
     */
    tm.ui.LabelArea.prototype.accessor("fontWeight", {
        "get": function() { return this._fontWeight; },
        "set": function(v) {
            this._fontWeight = v; this._updateFont();
        },
    });
    
    /**
     * @property    fillStyle
     */
    tm.ui.LabelArea.prototype.accessor("fillStyle", {
        "get": function() { return this._fillStyle; },
        "set": function(v) {
            this._fillStyle = v; this._updateFont();
        },
    });
    
    /**
     * @property    bgColor
     */
    tm.ui.LabelArea.prototype.accessor("bgColor", {
        "get": function() { return this._bgColor; },
        "set": function(v) {
            this._bgColor = v; this._updateFont();
        },
    });

    /**
     * @property    width
     * dummy
     */
    tm.ui.LabelArea.prototype.accessor("width", {
        "get": function() { return this._width; },
        "set": function(v){
            this._width = v;
            if (this.text) {
                this._renderText();
            }
        }
    });
    
    /**
     * @property    height
     * dummy
     */
    tm.ui.LabelArea.prototype.accessor("height", {
        "get": function() { return this._height; },
        "set": function(v){
            this._height = v;
            if (this.text) {
                this._renderText();
            }
        }
    });

    
})();
