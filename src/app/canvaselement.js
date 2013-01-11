/*
 * 
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * キャンバスエレメント
     */
    tm.app.CanvasElement = tm.createClass({
        
        superClass: tm.app.Element,
        
        /**
         * 位置
         */
        position: null,
        /**
         * 回転
         */
        rotation: 0,
        /**
         * スケール
         */
        scale: null,
        
        /**
         * 幅
         */
        _width:  64,
        /**
         * 高さ
         */
        _height: 64,
        
        /**
         * originX
         */
        originX: 0.5,
        
        /**
         * originX
         */
        originY: 0.5,
        
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
        
        _matrix: null,
        
        /**
         * ゲーム用エレメントクラス
         */
        init: function() {
            this.superInit();
            this.position = tm.geom.Vector2(0, 0);
            this.scale    = tm.geom.Vector2(1, 1);
            this.pointing = tm.geom.Vector2(0, 0);
            this._matrix  = tm.geom.Matrix33();
            this._matrix.identity();
            this.eventFlags = {};
        },
        
        /**
         * 更新処理
         */
        update: function() {},
        /**
         * 描画処理
         */
        draw: function(canvas) {},
        
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
        
        getFinalMatrix: function() {
            var matrix = tm.geom.Matrix33();

            if (this.parent) {
                matrix.multiply(this.parent.getFinalMatrix());
            }
            matrix.translate(this.centerX, this.centerY);
            matrix.rotateZ(this.rotation*Math.DEG_TO_RAD);
            matrix.scale(this.scaleX, this.scaleY);

            return matrix;
        },
        
        /**
         * 点と衝突しているかを判定
         */
        isHitPoint: function(x, y) {
            // 円判定
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            if (((p.x)*(p.x)+(p.y)*(p.y)) < (this.radius*this.radius)) {
                return true;
            }
            return false;
        },
        
        isHitPointRect: function(x, y) {
            // ここから下のバージョンは四角形
            var globalPos = (this.parent) ? this.parent.localToGlobal(this) : this;
            // var globalPos = this;
            
            var left   = globalPos.x - this.width*this.originX;
            var right  = globalPos.x + this.width*this.originX;
            var top    = globalPos.y - this.height*this.originY;
            var bottom = globalPos.y + this.height*this.originY;
            
            if ( left < x && x < right && top  < y && y < bottom ) { return true; }
            
            return false;
        },
        
        /**
         * 階層を考慮した円衝突判定
         */
        isHitPointCircleHierarchy: function(x, y) {
            // 円判定
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            if (((p.x)*(p.x)+(p.y)*(p.y)) < (this.radius*this.radius)) {
                return true;
            }
            return false;
        },
        
        /**
         * 階層を考慮した矩形衝突判定
         */
        isHitPointRectHierarchy: function(x, y) {
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            var left   = -this.width*this.originX;
            var right  = +this.width*this.originX;
            var top    = -this.height*this.originY;
            var bottom = +this.height*this.originY;
            
            if ( left < p.x && p.x < right && top  < p.y && p.y < bottom ) { return true; }
            
            return false;
        },
        
        /**
         * 要素と衝突しているかを判定
         */
        isHitElement: function(elm) {
            var selfGlobalPos  = this.parent.localToGlobal(this);
            if (((this.x-elm.x)*(this.x-elm.x)+(this.y-elm.y)*(this.y-elm.y)) < (this.radius+elm.radius)*(this.radius+elm.radius)) {
                return true;
            }
            return false;
        },
        
        /**
         * ローカル座標をグローバル座標に変換
         */
        localToGlobal: function(p) {
            return this.getFinalMatrix().multiplyVector2(p);
        },
        
        /**
         * グローバル座標をローカル座標に変換
         */
        globalToLocal: function(p) {
            var matrix = this.getFinalMatrix();
            matrix.invert();
            
            return matrix.multiplyVector2(p);
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
        
        wakeUp: function() {
            this.isUpdate = true;
            return this;
        },
        
        sleep: function() {
            this.isUpdate = false;
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
        
        setX: function(x) {
            this.position.x = x;
            return this;
        },
        
        setY: function(y) {
            this.position.y = y;
            return this;
        },
        
        setPosition: function(x, y) {
            this.position.x = x;
            this.position.y = y;
            return this;
        },
        
        setWidth: function(width) {
            this.width = width;
            return this;
        },
        
        setHeight: function(height) {
            this.height = height;
            return this;
        },
        
        setSize: function(width, height) {
            this.width  = width;
            this.height = height;
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
        
        fromJSON: function(data) {
            for (var key in data) {
                var value = data[key];
                if (key == "children") {
                    for (var i=0,len=value.length; i<len; ++i) {
                        var data = value[i];
                        var _class = window[data.type] || tm.app[data.type];
                        var elm = _class().addChildTo(this);
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
        
        _update: function(app) {
            // 更新有効チェック
            if (this.isUpdate == false) return ;
            
            this.update(app);
            
            var e = tm.event.Event("enterframe");
            e.app = app;
            this.dispatchEvent(e);
            
            // 子供達も実行
            if (this.children.length > 0) {
                var tempChildren = this.children.slice();
                for (var i=0,len=tempChildren.length; i<len; ++i) {
                    tempChildren[i]._update(app);
                }
                //this.execChildren(arguments.callee, app);
            }
        },
        
        _draw: function(canvas) {
            // 表示有効チェック
            if (this.visible === false) return ;
            
            var context = canvas.context;
            
            context.save();
            
            context.fillStyle      = this.fillStyle;
            context.strokeStyle    = this.strokeStyle;
            context.globalAlpha    *= this.alpha;
            context.globalCompositeOperation = this.blendMode;
            
            if (this.shadowBlur > 0) {
                context.shadowColor     = this.shadowColor;
                context.shadowOffsetX   = this.shadowOffsetX;
                context.shadowOffsetY   = this.shadowOffsetY;
                context.shadowBlur      = this.shadowBlur;
            }
            
            // // 座標計算
            // var matrix = this.getFinalMatrix();
            // var m = matrix.m;
            // context.setTransform( m[0], m[1], m[3], m[4], m[6], m[7] );
            
            context.translate(this.position.x, this.position.y);
            context.rotate(this.rotation * Math.DEG_TO_RAD);
            context.scale(this.scale.x, this.scale.y);
            
            this.draw(canvas);
            
            // 子供達も実行
            if (this.children.length > 0) {
                var tempChildren = this.children.slice();
                for (var i=0,len=tempChildren.length; i<len; ++i) {
                    tempChildren[i]._draw(canvas);
                }
                // this.execChildren(arguments.callee, canvas);
            }
            
            context.restore();
            
            // // 衝突バウンディングボックス
            // canvas.strokeRect(this.left, this.top, this.width, this.height);
            // // 衝突バウンディングサークル
            // canvas.strokeCircle(this.x, this.y, this.radius);
        },
        
        
        _checkEvent: function(check_func, event_name) {
            
            if (check_func(this) === true) {
                this.eventFlags[event_name] = true;
                if (this[event_name]) this[event_name]();
            }
            else {
                this.eventFlags[event_name] = false;
            }
            
            for (var i=0; i<this.children.length; ++i) {
                this.children[i]._checkEvent(check_func, event_name);
            }
        },
        
        _refreshSize: function() {},
        
        
    });
    
    
    /**
     * @property    x
     * x座標値
     */
    tm.app.CanvasElement.prototype.accessor("x", {
        "get": function()   { return this.position.x; },
        "set": function(v)  { this.position.x = v; }
    });
    
    /**
     * @property    y
     * y座標値
     */
    tm.app.CanvasElement.prototype.accessor("y", {
        "get": function()   { return this.position.y; },
        "set": function(v)  { this.position.y = v; }
    });
    
    /**
     * @property    scaleX
     * スケールX値
     */
    tm.app.CanvasElement.prototype.accessor("scaleX", {
        "get": function()   { return this.scale.x; },
        "set": function(v)  { this.scale.x = v; }
    });
    
    /**
     * @property    scaleY
     * スケールY値
     */
    tm.app.CanvasElement.prototype.accessor("scaleY", {
        "get": function()   { return this.scale.y; },
        "set": function(v)  { this.scale.y = v; }
    });
    
    
    
    /**
     * @property    width
     * width
     */
    tm.app.CanvasElement.prototype.accessor("width", {
        "get": function()   { return this._width; },
        "set": function(v)  { this._width = v; this._refreshSize(); }
    });
    
    
    /**
     * @property    height
     * height
     */
    tm.app.CanvasElement.prototype.accessor("height", {
        "get": function()   { return this._height; },
        "set": function(v)  { this._height = v; this._refreshSize(); }
    });
    
    /**
     * @property    radius
     * 半径
     */
    tm.app.CanvasElement.prototype.accessor("radius", {
        "get": function()   { return this._radius || (this.width+this.height)/4; },
        "set": function(v)  { this._radius = v; }
    });
    
    /**
     * @property    top
     * 左
     */
    tm.app.CanvasElement.prototype.getter("top", function() {
        return this.y - this.height*this.originY;
    });

    /**
     * @property    right
     * 左
     */
    tm.app.CanvasElement.prototype.getter("right", function() {
        return this.x + this.width*(1-this.originX);
    });

    /**
     * @property    bottom
     * 左
     */
    tm.app.CanvasElement.prototype.getter("bottom", function() {
        return this.y + this.height*(1-this.originY);
    });

    /**
     * @property    left
     * 左
     */
    tm.app.CanvasElement.prototype.getter("left", function() {
        return this.x - this.width*this.originX;
    });

    /**
     * @property    centerX
     * centerX
     */
    tm.app.CanvasElement.prototype.accessor("centerX", {
        "get": function()   { return this.x + this.width/2 - this.width*this.originX; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });

    /**
     * @property    centerY
     * centerY
     */
    tm.app.CanvasElement.prototype.accessor("centerY", {
        "get": function()   { return this.y + this.height/2 - this.height*this.originY; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
    
})();
