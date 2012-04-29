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
        width:  64,
        /**
         * 高さ
         */
        height: 64,
        /**
         * 表示フラグ
         */
        visible: true,
        
        /**
         * アルファ
         */
        alpha: 1.0,
        
        /**
         * ブレンドモード
         */
        blendMode: "source-over",
        
        /**
         * ゲーム用エレメントクラス
         */
        init: function() {
            this.superInit();
            this.position = tm.geom.Vector2(0, 0);
            this.scale    = tm.geom.Vector2(1, 1);
            this.eventFlags = {};
        },
        
        /**
         * 更新処理
         */
        update: function() {},
        /**
         * 描画処理
         */
        draw: function(ctx) {},
        
        /**
         * 点と衝突しているかを判定
         */
        isHitPoint: function(x, y) {
            var globalPos = (this.parent) ? this.parent.localToGlobal(this) : this;
            // var globalPos = this;
            if (
                globalPos.x < x && x < (globalPos.x+this.width) &&
                globalPos.y < y && y < (globalPos.y+this.height))
            {
                return true;
            }
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
         * ローカル座標をグローバル座標にする
         */
        localToGlobal: function(p) {
            // TODO: まだ未実装
            return { x: this.x + p.x, y: this.y + p.y };
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
        
        _update: function(app) {
            this.update(app);
            
            var e = tm.app.Event("enterframe");
            e.app = app;
            this.dispatchEvent(e);
            
            // 子供達も実行
            this.execChildren(arguments.callee, app);
        },
        
        _draw: function(graphics) {
            
            if (this.visible === false) return ;
            
            graphics.save();
            
            graphics.globalAlpha = this.alpha;
            graphics.globalCompositeOperation = this.blendMode;
            
            graphics.translate(this.x, this.y);
            graphics.rotate(this.rotation*Math.PI/180);
            graphics.scale(this.scaleX, this.scaleY);
            
            this.draw(graphics);
            
            // 子供達も実行
            this.execChildren(arguments.callee, graphics);
            
            graphics.restore();
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
        }
        
        
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
     * @property    rotate
     * 回転値(削除予定)
     */
    tm.app.CanvasElement.prototype.accessor("rotate", {
        "get": function()   { return this.rotation; },
        "set": function(v)  { this.rotation = v; }
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
     * @property    radius
     * 半径
     */
    tm.app.CanvasElement.prototype.accessor("radius", {
        "get": function()   { return this._radius || (this.width+this.height)/2; },
        "set": function(v)  { this._radius = v; }
    });
    
    
    
    
})();
