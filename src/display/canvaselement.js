/*
 * canvaselement.js
 */

tm.display = tm.display || {};


(function() {

    /**
     * @class tm.display.CanvasElement
     * キャンバスエレメント
     * @extends tm.app.Object2D
     */
    tm.display.CanvasElement = tm.createClass({
        superClass: tm.app.Object2D,

        /** 表示フラグ */
        visible: true,
        /** クリッピングフラグ */
        clipping: false,
        /** fillStyle */
        fillStyle: "white",
        /** strokeStyle */
        strokeStyle: "white",
        /** アルファ */
        alpha: 1.0,
        /** ブレンドモード */
        blendMode: "source-over",
        /** シャドウカラー */
        shadowColor: "black",
        /** シャドウオフセットX */
        shadowOffsetX: 0,
        /** シャドウオフセットY */
        shadowOffsetY: 0,
        /** シャドウオフブラー */
        shadowBlur: 0,

        /**
         * @constructor
         */
        init: function() {
            this.superInit();
        },

        /**
         * アルファをセット
         */
        setAlpha: function(alpha) {
            this.alpha = alpha;
            return this;
        },

        /**
         * シャドウカラーをセット
         */
        setShadowColor: function(color) {
            this.shadowColor = color;
            return this;
        },
        
        /**
         * シャドウブラーをセット
         */
        setShadowBlur: function(blur) {
            this.shadowBlur = blur;
            return this;
        },
        
        /**
         * シャドウオフセットをセット
         */
        setShadowOffset: function(x, y) {
            this.shadowOffsetX = x;
            this.shadowOffsetY = y;
            return this;
        },

        /**
         * バウンディングサークルを描画
         */
        drawBoundingCircle: function(canvas) {
            canvas.save();
            canvas.lineWidth = 2;
            canvas.strokeCircle(0, 0, this.radius);
            canvas.restore();
        },

        /**
         * バウンディングレクトを描画
         */
        drawBoundingRect: function(canvas) {
            canvas.save();
            canvas.lineWidth = 2;
            canvas.strokeRect(-this.width*this.originX, -this.height*this.originY, this.width, this.height);
            canvas.restore();
        },

        /**
         * ????
         */
        drawFillRect: function(ctx) {
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            return this;
        },
        /**
         * ????
         */
        drawStrokeRect: function(ctx) {
            ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
            return this;
        },

        /**
         * ????
         */
        drawFillArc: function(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
            ctx.fill();
            ctx.closePath();
            return this;
        },
        /**
         * ????
         */
        drawStrokeArc: function(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2, false);
            ctx.stroke();
            ctx.closePath();
            return this;
        },

        /**
         * 表示/非表示をセット
         */
        setVisible: function(flag) {
            this.visible = flag;
            return this;
        },

        /**
         * 表示
         */
        show: function() {
            this.visible = true;
            return this;
        },

        /**
         * 非表示
         */
        hide: function() {
            this.visible = false;
            return this;
        },

        /**
         * 塗りつぶしスタイルをセット
         */
        setFillStyle: function(style) {
            this.fillStyle = style;
            return this;
        },

        /**
         * ストロークスタイルをセット
         */
        setStrokeStyle: function(style) {
            this.strokeStyle = style;
            return this;
        },

        /**
         * ブレンドモードをセット
         */
        setBlendMode: function(blendMode) {
            this.blendMode = blendMode;
            return this;
        },

        /**
         * ロード
         */
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

        /**
         * @private
         */
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

        /**
         * @private
         */
        _dirtyCalc: function() {
            this._calcAlpha();
            this._calcWorldMatrix();
        },
    });


})();

