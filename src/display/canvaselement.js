/*
 *
 */

tm.display = tm.display || {};


(function() {

    /**
     * @class
     * キャンバスエレメント
     */
    tm.display.CanvasElement = tm.createClass({

        superClass: tm.app.Object2D,

        /**
         * 更新フラグ
         */
        isUpdate: true,

        /**
         * 表示フラグ
         */
        visible: true,

        /**
         * fillStyle
         */
        fillStyle: "white",

        /**
         * strokeStyle
         */
        strokeStyle: "white",

        /**
         * アルファ
         */
        alpha: 1.0,

        /**
         * ブレンドモード
         */
        blendMode: "source-over",

        /**
         * シャドウカラー
         */
        shadowColor: "black",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0,

        /**
         * ゲーム用エレメントクラス
         */
        init: function() {
            this.superInit();
        },
        
        setAlpha: function(alpha) {
            this.alpha = alpha;
            return this;
        },
        
        setShadowColor: function(color) {
            this.shadowColor = color;
            return this;
        },
        
        setShadowBlur: function(blur) {
            this.shadowBlur = blur;
            return this;
        },
        
        setShadowOffset: function(x, y) {
            this.shadowOffsetX = x;
            this.shadowOffsetY = y;
            return this;
        },

        drawBoundingCircle: function(canvas) {
            canvas.save();
            canvas.lineWidth = 2;
            canvas.strokeCircle(0, 0, this.radius);
            canvas.restore();
        },

        drawBoundingRect: function(canvas) {
            canvas.save();
            canvas.lineWidth = 2;
            canvas.strokeRect(-this.width*this.originX, -this.height*this.originY, this.width, this.height);
            canvas.restore();
        },

        drawFillRect: function(ctx) {
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            return this;
        },
        drawStrokeRect: function(ctx) {
            ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
            return this;
        },

        drawFillArc: function(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
            ctx.fill();
            ctx.closePath();
            return this;
        },
        drawStrokeArc: function(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
            ctx.stroke();
            ctx.closePath();
            return this;
        },

        show: function() {
            this.visible = true;
            return this;
        },

        hide: function() {
            this.visible = false;
            return this;
        },

        setFillStyle: function(style) {
            this.fillStyle = style;
            return this;
        },

        setStrokeStyle: function(style) {
            this.strokeStyle = style;
            return this;
        },

        setBlendMode: function(blendMode) {
            this.blendMode = blendMode;
            return this;
        },

        load: function(data) {
            var self = this;

            data.layers.forEach(function(layer) {
                if (layer.type != "objectgroup") return ;

                var group = tm.display.CanvasElement().addChildTo(self);
                group.width = layer.width;
                group.height = layer.height;

                layer.objects.forEach(function(obj) {
                    var _class = tm.using(obj.type);
                    if (Object.keys(_class).length === 0) {
                        _class=tm.display[obj.type];
                    }
                    var initParam = null;
                    if (obj.properties.init) {
                        initParam = JSON.parse(obj.properties.init);
                    }
                    var element = _class.apply(null, initParam).addChildTo(group);
                    var props   = obj.properties;
                    for (var key in props) {
                        if (key == "init") continue ;
                        var value = props[key];
                        element[key] = value;
                    }

                    element.x = obj.x;
                    element.y = obj.y;
                    element.width = obj.width;
                    element.height = obj.height;
                });

                self[layer.name] = group;
            });
        },

        fromJSON: function(data) {
            for (var key in data) {
                var value = data[key];
                if (key == "children") {
                    for (var i=0,len=value.length; i<len; ++i) {
                        var data = value[i];
                        var init = data["init"] || [];
                        var _class = tm.using(data.type);
                        if (Object.keys(_class).length === 0) {
                            _class = tm.display[data.type];
                        }
                        var elm = _class.apply(null, init).addChildTo(this);
                        elm.fromJSON(data);
                        this[data.name] = elm;
                    }
                }
                else {
                    this[key] = value;
                }
            }

            return this;
        },

        toJSON: function() {
            // TODO:
        },


        _calcAlpha: function() {
            if (!this.parent) {
                this._worldAlpha = this.alpha;
                return ;
            }
            else {
                // alpha
                this._worldAlpha = this.parent._worldAlpha * this.alpha;
            }
        },

        _dirtyCalc: function() {
            this._calcAlpha();
            this._calcWorldMatrix();
        },

    });


})();

















