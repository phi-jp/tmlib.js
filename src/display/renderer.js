/*
 * renderer.js
 */

 
(function() {
    
    /**
     * @class tm.display.CanvasRenderer
     * キャンバス描画クラス
     */
    tm.define("tm.display.CanvasRenderer", {
        /** キャンバス */
        canvas: null,

        /** @property @private _context     コンテキスト */

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(canvas) {
            this.canvas = canvas;
            this._context = this.canvas.context;
        },

        /**
         * 描画
         */
        render: function(root) {
            this.canvas.save();
            this.renderObject(root);
            this.canvas.restore();
        },

        /**
         * オブジェクトを描画
         */
        renderObject: function(obj) {
            if (obj.visible === false) return ;
            var context = this._context;

            // TODO: 別の場所で呼ぶよう調整する
            obj._dirtyCalc && obj._dirtyCalc();

            // 描画可能かをチェック
            if (!this._checkRenderable(obj)) {
                // 子供達のみ描画実行
                if (obj.children.length > 0) {
                    var tempChildren = obj.children.slice();
                    for (var i=0,len=tempChildren.length; i<len; ++i) {
                        this.renderObject(tempChildren[i]);
                    }
                }

                return ;
            }

            // 
            if (!obj.draw) {
                this._setRenderFunction(obj);
            }

            // 情報をセット
            if (obj.fillStyle)   context.fillStyle   = obj.fillStyle;
            if (obj.strokeStyle) context.strokeStyle = obj.strokeStyle;
            context.globalAlpha    = obj._worldAlpha;
            context.globalCompositeOperation = obj.blendMode;
            
            if (obj.shadowBlur) {
                context.shadowColor   = obj.shadowColor;
                context.shadowOffsetX = obj.shadowOffsetX;
                context.shadowOffsetY = obj.shadowOffsetY;
                context.shadowBlur    = obj.shadowBlur;
            }
            else {
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.shadowColor   = "rgba(0, 0, 0, 0)";
            }
            
            // 行列をセット
            var m = obj._worldMatrix.m;
            context.setTransform( m[0], m[3], m[1], m[4], m[2], m[5] );
            

            if (obj.clipping) {
                context.save();

                // クリップ処理を実行
                if (obj.clip) {
                    obj.clip();
                }
                else {
                    onclip.call(obj, this.canvas);
                }
                context.clip();

                obj.draw(this.canvas);
                
                // 子供達も実行
                if (obj.children.length > 0) {
                    var tempChildren = obj.children.slice();
                    for (var i=0,len=tempChildren.length; i<len; ++i) {
                        this.renderObject(tempChildren[i]);
                    }
                }

                context.restore();
            }
            else {
                obj.draw(this.canvas);
                
                // 子供達も実行
                if (obj.children.length > 0) {
                    var tempChildren = obj.children.slice();
                    for (var i=0,len=tempChildren.length; i<len; ++i) {
                        this.renderObject(tempChildren[i]);
                    }
                }
            }
        },

        /**
         * @private
         */
        _checkRenderable: function(obj) {
            if (obj._renderable === undefined) {
                obj._renderable = (obj instanceof tm.display.CanvasElement);
            }
            return obj._renderable;
        },

        /**
         * @private
         */
        _setRenderFunction: function(obj) {
            if (obj instanceof tm.display.Sprite) {
                obj.draw = renderFuncList["sprite"];
            }
            else if (obj instanceof tm.display.MapSprite) {
                obj.draw = function() {};
            }
            else if (obj instanceof tm.display.Label) {
                obj.draw = renderFuncList["label"];
            }
            else if (obj instanceof tm.display.Shape) {
                obj.draw = renderFuncList["shape"];
            }
            else {
                obj.draw = function() {};
            }
        }

    });
    
    var renderFuncList = {
        "sprite": function(canvas) {
            var srcRect = this.srcRect;
            var element = this._image.element;
            
            canvas.context.drawImage(element,
                srcRect.x, srcRect.y, srcRect.width, srcRect.height,
                -this.width*this.origin.x, -this.height*this.origin.y, this.width, this.height);
        },
        "shape": function(canvas) {
            var srcRect = this.srcRect;
            canvas.drawImage(
                this.canvas.canvas,
                0, 0, this.canvas.width, this.canvas.height,
                -this.width*this.origin.x, -this.height*this.origin.y, this.width, this.height);
        },
        "label": function(canvas) {
            canvas.setText(this.fontStyle, this.align, this.baseline);
            if (this.lineWidth) canvas.lineWidth = this.lineWidth;
            
            if (this.stroke) {
                if (this.maxWidth) {
                    this._lines.each(function(elm, i) {
                        canvas.strokeText(elm, 0, this.textSize*i, this.maxWidth);
                    }.bind(this));
                }
                else {
                    this._lines.each(function(elm, i) {
                        canvas.strokeText(elm, 0, this.textSize*i);
                    }.bind(this));
                }
            }
            if (this.fill) {
                if (this.maxWidth) {
                    this._lines.each(function(elm, i) {
                        canvas.fillText(elm, 0, this.textSize*i, this.maxWidth);
                    }.bind(this));
                }
                else {
                    this._lines.each(function(elm, i) {
                        canvas.fillText(elm, 0, this.textSize*i);
                    }.bind(this));
                }
            }
            
            if (this.debugBox) {
                canvas.strokeRect(0, 0, this.width, -this.size);
            }
        }
    };

    var onclip = function(c) {
        c.beginPath();
        c.rect(
            -this.width*this.origin.x,
            -this.height*this.origin.y,
            this.width,
            this.height
            );
    };

})();
 


 
(function() {
    
    /**
     * @class tm.display.BoundingRectRenderer
     * バウンディング表示レンダー
     * @extends tm.display.CanvasRenderer
     */
    tm.define("tm.display.BoundingRectRenderer", {
        superClass: "tm.display.CanvasRenderer",

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(canvas) {
            this.superInit(canvas);
        },

        /**
         * @private
         */
        _setRenderFunction: function(obj) {
            obj.draw = render;
        }
    });

    var render = function(canvas) {
        canvas.save();
        canvas.lineWidth = 2;
        canvas.strokeRect(-this.width*this.originX, -this.height*this.originY, this.width, this.height);
        canvas.restore();
    };

})();
 











