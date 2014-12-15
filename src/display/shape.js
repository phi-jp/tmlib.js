/*
 * shape.js
 */


tm.display = tm.display || {};


(function() {
    
    /**
     * @class tm.display.Shape
     * @extends tm.display.CanvasElement
     * 図形を描画するクラス
     */
    tm.display.Shape = tm.createClass({
        superClass: tm.display.CanvasElement,
        
        /** @property canvsa */
        /** @property width */
        /** @property height */
        /** @property autoRender */

        /**
         * @constructor
         */
        init: function(param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            var param = {}.$safe(param, {
                width: 64,
                height: 64,
                // bgColor: "#888",
                bgColor: "transparent",

                fillStyle: "red",
                strokeStyle: "white",
                lineWidth: "2",
                shadowBlur: 0,
                shadowColor: "red",
            });
            
            this.superInit();

            // 
            this.canvas = tm.graphics.Canvas();
            // 
            this.$extend(param);
            // 
            this.render();
            // 
            this.autoRender = true;
        },

        _prerender: function() {
            var c = this.canvas;
            c.resize(this.width, this.height);
            c.clearColor(this.bgColor);

            c.save();

            // パラメータセット
            c.fillStyle   = this.fillStyle;
            c.strokeStyle = this.strokeStyle;
            c.lineWidth   = this.lineWidth;
            c.shadowBlur  = this.shadowBlur;
            c.shadowColor  = this.shadowColor;

            return this;
        },

        _postrender: function() {
            var c = this.canvas;
            c.restore();

            return this;
        },

        render: function() {
            this._prerender();

            this._render();

            this._postrender();
        },

        _render: function() {

        },

        /**
         * テキスト描画
         */
        renderText: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_TEXT, param);

            c.save();
            
            // パラメータセット
            c.fillStyle     = param.fillStyle;
            c.strokeStyle   = param.strokeStyle;
            c.lineWidth     = param.lineWidth;
            c.font          = param.font;
            c.textAlign     = param.textAlign;
            c.textBaseline  = param.textBaseline;

            // 描画
            c.strokeText(param.text, this.width/2, this.height/2);
            c.fillText(param.text, this.width/2, this.height/2);
            
            c.restore();
        },


        // TODO: old support(plan delete)
        _dirtyCheckParam: function(param) {
            var param = param;
            if (arguments.length >= 2) {
                var width = arguments[0];
                var height= arguments[1];
                var param = arguments[2] || {};
                param.width = width;
                param.height = height;

                console.warn("tmlib.js warn: arguments of shape init is only param from version 0.4");
            }

            return param;
        },
        
    });

    ["width", "height", "bgColor", "strokeStyle", "fillStyle", "lineWidth", "shadowBlur", "shadowColor"].each(function(prop) {
        var propName = '_' + prop;

        tm.display.Shape.prototype.accessor(prop, {
            "get": function()   {
                return this[propName];
            },
            "set": function(v)  {
                this[propName] = v;
                if (this.autoRender === true) {
                    this.render();
                }
            }
        });
    });

})();


(function() {
    
    /**
     * @class tm.display.CircleShape
     * @extends tm.display.Shape
     * 簡単に円を描画できるクラス
     * 
     *      @example display
     *      var shape = tm.display.CircleShape().addChildTo(this);
     *      shape.setPosition(50, 50);
     */
    tm.define("tm.display.CircleShape", {
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         */
        init: function(param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            this.superInit(param);

            this.render();
        },

        _render: function() {
            var c = this.canvas;
            // 描画
            var radius = Math.min(this.width, this.height)/2;
            c.fillCircle(this.width/2, this.height/2, radius);
            c.strokeCircle(this.width/2, this.height/2, radius-Number(c.lineWidth)/2);
        },
    });
    
})();




(function() {
    
    /**
     * @class tm.display.TriangleShape
     * 簡単に三角形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.define("tm.display.TriangleShape", {
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         */
        init: function(param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            param = {}.$safe(param, {
                fillStyle: "green",
            });
            this.superInit(param);

            this.render();
        },

        _render: function() {
            var c = this.canvas;

            // 描画
            var x = this.width/2;
            var y = this.height/2;
            var radius = Math.min(this.width, this.height)/2;
            var offsetLine = Number(c.lineWidth)*1;
            c.fillPolygon(x, y, radius, 3);
            c.strokePolygon(x, y, radius-offsetLine, 3);
        },
    });
    
})();




(function() {
    
    /**
     * @class tm.display.RectangleShape
     * 簡単に矩形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.define("tm.display.RectangleShape", {
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         */
        init: function(param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            param = {}.$safe(param, {
                fillStyle: "blue",
            });
            this.superInit(param);

            this.render();
        },

        _render: function() {
            var c = this.canvas;
            // 描画
            var lw = this.lineWidth;
            var lw_half = lw/2;
            c.fillRect(0, 0, this.width, this.height);
            c.strokeRect(lw_half, lw_half, this.width-lw, this.height-lw);
        },
    });
    
})();




(function() {
    
    /**
     * @class tm.display.RoundRectangleShape
     * 簡単に矩形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.define("tm.display.RoundRectangleShape", {
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         */
        init: function(param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            param = {}.$safe(param, {
                fillStyle: "blue",
                cornerRadius: 8,
            });
            this.superInit(param);

            this.render();
        },

        _render: function() {
            var c = this.canvas;
            // 描画
            var lw = this.lineWidth;
            var lw_half = lw/2;

            c.fillRoundRect(lw_half, lw_half, this.width-lw, this.height-lw, this.cornerRadius);
            c.strokeRoundRect(lw_half, lw_half, this.width-lw, this.height-lw, this.cornerRadius);
        },
    });

    ["cornerRadius"].each(function(prop) {
        var propName = '_' + prop;

        tm.display.RoundRectangleShape.prototype.accessor(prop, {
            "get": function()   {
                return this[propName];
            },
            "set": function(v)  {
                this[propName] = v;
                if (this.autoRender === true) { this.render(); }
            }
        });
    });

})();


(function() {
    
    /**
     * @class tm.display.StarShape
     * 簡単に星形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.define("tm.display.StarShape", {
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         */
        init: function(param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            param = {}.$safe(param, {
                fillStyle: "yellow",
                sides: 5,
                sideIndent: 0.38,
                offsetAngle: -90,
            });
            this.superInit(param);

            this.render();
        },

        _render: function() {
            var c = this.canvas;

            var sides       = this.sides;
            var sideIndent  = this.sideIndent;
            var offsetAngle = this.offsetAngle;
            
            // 描画
            var x = this.width/2;
            var y = this.height/2;
            var radius = Math.min(this.width, this.height)/2;
            var offsetLine = Number(c.lineWidth)*1.5;
            c.fillStar(x, y, radius, sides, sideIndent, offsetAngle);
            c.strokeStar(x, y, radius-offsetLine, sides, sideIndent, offsetAngle);
        },
    });

    ["sides", "sideIndent", "offsetAngle"].each(function(prop) {
        var propName = '_' + prop;

        tm.display.StarShape.prototype.accessor(prop, {
            "get": function()   {
                return this[propName];
            },
            "set": function(v)  {
                this[propName] = v;
                if (this.autoRender === true) {
                    this.render();
                }
            }
        });
    });
    
})();



(function() {
    
    /**
     * @class tm.display.PolygonShape
     * @extends tm.display.Shape
     * ポリゴン描画クラス
     */
    tm.define("tm.display.PolygonShape", {
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         */
        init: function(param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            param = {}.$safe(param, {
                fillStyle: "cyan",
                sides: 5,
                sideIndent: 0.38,
                offsetAngle: -90,
            });
            this.superInit(param);

            this.render();
        },

        _render: function() {
            var c = this.canvas;

            var sides       = this.sides;
            var offsetAngle = this.offsetAngle;
            
            // 描画
            var x = this.width/2;
            var y = this.height/2;
            var radius = Math.min(this.width, this.height)/2;
            var offsetLine = Number(c.lineWidth)*0.6;
            c.fillPolygon(x, y, radius, sides, offsetAngle);
            c.strokePolygon(x, y, radius-offsetLine, sides, offsetAngle);
        },
    });

    ["sides", "offsetAngle"].each(function(prop) {
        var propName = '_' + prop;

        tm.display.PolygonShape.prototype.accessor(prop, {
            "get": function()   {
                return this[propName];
            },
            "set": function(v)  {
                this[propName] = v;
                if (this.autoRender === true) {
                    this.render();
                }
            }
        });
    });
    
})();




(function() {
    
    /**
     * @class tm.display.HeartShape
     * 簡単にハートを描画できるクラス
     * @extends tm.display.Shape
     */
    tm.define("tm.display.HeartShape", {
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         */
        init: function(param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            param = {}.$safe(param, {
                fillStyle: "pink",
                cornerAngle: 45,
            });
            this.superInit(param);

            this.render();
        },

        _render: function() {
            var c = this.canvas;
            // 描画
            var x = this.width/2;
            var y = this.height/2;
            var radius = Math.min(this.width, this.height)/2;
            c.fillHeart(x, y, radius, this.cornerAngle);
            c.strokeHeart(x, y, radius-Number(c.lineWidth)/2, this.cornerAngle);
        },
    });

    ["cornerAngle"].each(function(prop) {
        var propName = '_' + prop;

        tm.display.HeartShape.prototype.accessor(prop, {
            "get": function()   {
                return this[propName];
            },
            "set": function(v)  {
                this[propName] = v;
                if (this.autoRender === true) { this.render(); }
            }
        });
    });

})();




(function() {

    var dummyCanvas = null;
    
    /**
     * @class tm.display.TextShape
     * @extends tm.display.Shape
     * テキスト描画クラス
     */
    tm.define("tm.display.TextShape", {

        superClass: "tm.display.Shape",
        
        /**
         * @constructor
         */
        init: function(width, height, param) {
            param = this._dirtyCheckParam.apply(this, arguments);
            param = {}.$safe(param, {
                fillStyle: "black",
                lineWidth: 4,
                text: "hello, world!",
                fontSize: 64,
                fontWeight: "",
                fontFamily: "'HiraKakuProN-W3'",
            });
            this.superInit(param);

            this.fit();

            this.render();
        },

        fit: function() {
            if (!dummyCanvas) {
                dummyCanvas = tm.graphics.Canvas();
            }
            dummyCanvas.font = "{fontWeight} {fontSize}px {fontFamily}".format(this);
            var textWidth = dummyCanvas.context.measureText(this.text).width + (10);
            var textHeight = dummyCanvas.context.measureText('あ').width*1.5;
            this.width = textWidth;
            this.height = textHeight;
        },

        _render: function() {
            var c = this.canvas;

            c.fillStyle = this.fillStyle;
            c.strokeStyle = this.strokeStyle;
            c.font = "{fontWeight} {fontSize}px {fontFamily}".format(this);
            c.textAlign = "center";
            c.textBaseline = "middle";

            var textWidth = c.context.measureText(this.text).width;

            var hw = this.width/2;
            var hh = this.height/2
            c.strokeText(this.text, hw, hh);
            c.fillText(this.text, hw, hh);
        },

    });

    ['text', "fontWeight", "fontSize", "fontFamily"].each(function(prop) {
        var propName = '_' + prop;

        tm.display.TextShape.prototype.accessor(prop, {
            "get": function()   {
                return this[propName];
            },
            "set": function(v)  {
                this[propName] = v;
                if (this.autoRender === true) { this.render(); }
            }
        });
    });

    
})();


















