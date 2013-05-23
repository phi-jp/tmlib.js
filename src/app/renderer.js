/*
 * phi
 */

 
(function() {
    
    tm.define("tm.app.CanvasRenderer", {
        canvas: null,

        init: function(canvas) {
            this.canvas = canvas;
            this._context = this.canvas.context;
        },

        render: function(root) {
            this.canvas.save();
            this.renderObject(root);
            this.canvas.restore();
        },

        renderObject: function(obj) {
            obj._dirtyCalc();

            if (obj.visible === false) return ;
            var context = this._context;

            if (!obj.draw) this._setRenderFunction(obj);

            // 情報をセット
            context.fillStyle      = obj.fillStyle;
            context.strokeStyle    = obj.strokeStyle;
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
            
            obj.draw(this.canvas);
            
            // 子供達も実行
            if (obj.children.length > 0) {
                var tempChildren = obj.children.slice();
                for (var i=0,len=tempChildren.length; i<len; ++i) {
                    this.renderObject(tempChildren[i]);
                }
            }
        },

        _setRenderFunction: function(obj) {
            if (obj instanceof tm.app.Sprite) {
                obj.draw = renderFuncList["sprite"];
            }
            else if (obj instanceof tm.app.MapSprite) {
                obj.draw = function() {};
            }
            else if (obj instanceof tm.app.Label) {
                obj.draw = renderFuncList["label"];
            }
            else if (obj instanceof tm.app.Shape) {
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
            if (this.fill) {
                if (this.maxWidth) {
                    canvas.fillText(this.text, 0, 0, this.maxWidth);
                }
                else {
                    canvas.fillText(this.text, 0, 0);
                }
            }
            if (this.stroke) {
                if (this.maxWidth) {
                    canvas.strokeText(this.text, 0, 0, this.maxWidth);
                }
                else {
                    canvas.strokeText(this.text, 0, 0);
                }
            }
            
            if (this.debugBox) {
                canvas.strokeRect(0, 0, this.width, -this.size);
            }
        }
    };

})();
 


 
(function() {
    
    tm.define("tm.app.BoundingRectRenderer", {
        superClass: "tm.app.CanvasRenderer",

        init: function(canvas) {
            this.superInit(canvas);
        },

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
 











