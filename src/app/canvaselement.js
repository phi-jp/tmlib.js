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
                        var init = data["init"] || [];
                        var _class = window[data.type] || tm.app[data.type];
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
        
        _update: function(app) {
            // 更新有効チェック
            if (this.isUpdate == false) return ;
            
            if (this.update) this.update(app);
            
            if (this.hasEventListener("enterframe")) {
                var e = tm.event.Event("enterframe");
                e.app = app;
                this.dispatchEvent(e);
            }
            
            // 子供達も実行
            if (this.children.length > 0) {
                var tempChildren = this.children.slice();
                for (var i=0,len=tempChildren.length; i<len; ++i) {
                    tempChildren[i]._update(app);
                }
            }
        },
        
        _refreshSize: function() {},
        
    });
    

})();
 
















