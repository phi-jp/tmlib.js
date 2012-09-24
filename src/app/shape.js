/*
 * sprite.js
 */


tm.app = tm.app || {};


(function() {
    
    /**
     * @class
     * Shape
     */
    tm.app.Shape = tm.createClass({
        
        superClass: tm.app.CanvasElement,
        
        /**
         * 初期化
         */
        init: function(width, height)
        {
            this.superInit();
            
            width = width   || 64;
            height= height  || 64;
            
            this.canvas = tm.graphics.Canvas();
            
            this.width  = width;
            this.height = height;
            this.canvas.resize(width, height);
        },
        
        /**
         * 描画
         */
        draw: function(canvas) {
            var srcRect = this.srcRect;
            canvas.drawImage(this.canvas.canvas,
                0, 0, this.width, this.height,
                -this.width*this.originX, -this.height*this.originY, this.width, this.height);
            return this;
        },
        
        renderer: function(param) {
        },
        
    });
    
    /**
     * @property    lineWidth
     * ライン幅設定
     */
    tm.app.Shape.prototype.accessor("shapeParam", {
        "get": function()   { return this._shapeParam; },
        "set": function(param)  {
            // デフォルト値で拡張
            param.extendSafe(this.selfClass.DEFAULT_SHAPE_PARAM);
            // セット
            this._shapeParam = param;
            // 描画
            this.renderer(param);
        }
    });
    
})();


(function() {
    
    /**
     * @class
     * CircleShape
     */
    tm.app.CircleShape = tm.createClass({
        
        superClass: tm.app.Shape,
        
        /**
         * 初期化
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            
            // セット & 描画
            this.shapeParam = param || {};
        },
        
        /**
         * レンダラー
         */
        renderer: function(param) {
            var c = this.canvas;
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            
            // 描画
            c.fillCircle(this.width/2, this.height/2, this.radius);
            c.strokeCircle(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2);
            
            c.restore();
        }
        
    });
    
    
    tm.app.CircleShape.DEFAULT_SHAPE_PARAM = {
        fillStyle: "red",
        strokeStyle: "white",
        lineWidth: "4",
    };
    
})();




(function() {
    
    /**
     * @class
     * TriangleShape
     */
    tm.app.TriangleShape = tm.createClass({
        
        superClass: tm.app.Shape,
        
        /**
         * 初期化
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            
            // セット & 描画
            this.shapeParam = param || {};
        },
        
        /**
         * レンダラー
         */
        renderer: function(param) {
            var c = this.canvas;
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            
            // 描画
            c.fillPolygon(this.width/2, this.height/2, this.radius, 3);
            c.strokePolygon(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, 3);
            
            c.restore();
        }
        
    });
    
    
    tm.app.TriangleShape.DEFAULT_SHAPE_PARAM = {
        fillStyle: "green",
        strokeStyle: "white",
        lineWidth: "4",
    };
    
})();




(function() {
    
    /**
     * @class
     * RectangleShape
     */
    tm.app.RectangleShape = tm.createClass({
        
        superClass: tm.app.Shape,
        
        /**
         * 初期化
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            
            // セット & 描画
            this.shapeParam = param || {};
        },
        
        /**
         * レンダラー
         */
        renderer: function(param) {
            var c = this.canvas;
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            
            // 描画
            var lw      = Number(c.lineWidth);
            var lw_half = lw/2;
            c.fillRect(0, 0, this.width, this.height);
            c.strokeRect(lw_half, lw_half, this.width-lw, this.height-lw);
            
            c.restore();
        }
        
    });
    
    
    tm.app.RectangleShape.DEFAULT_SHAPE_PARAM = {
        fillStyle: "blue",
        strokeStyle: "white",
        lineWidth: "4",
    };
    
})();


(function() {
    
    /**
     * @class
     * StarShape
     */
    tm.app.StarShape = tm.createClass({
        
        superClass: tm.app.Shape,
        
        /**
         * 初期化
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            
            // セット & 描画
            this.shapeParam = param || {};
        },
        
        /**
         * レンダラー
         */
        renderer: function(param) {
            var c = this.canvas;
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            
            // 描画
            var lw          = Number(c.lineWidth);
            var lw_half     = lw/2;
            var sides       = param.sides;
            var sideIndent  = param.sideIndent;
            var offsetAngle = param.offsetAngle;
            c.fillStar(this.width/2, this.height/2, this.radius, sides, sideIndent, offsetAngle);
            c.strokeStar(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, sides, sideIndent, offsetAngle);
            
            c.restore();
        }
        
    });
    
    
    tm.app.StarShape.DEFAULT_SHAPE_PARAM = {
        fillStyle: "yellow",
        strokeStyle: "white",
        lineWidth: "4",
        
        sides: 5,
        sideIndent: undefined,
        offsetAngle: undefined,
    };
    
})();



(function() {
    
    /**
     * @class
     * PolygonShape
     */
    tm.app.PolygonShape = tm.createClass({
        
        superClass: tm.app.Shape,
        
        /**
         * 初期化
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            
            // セット & 描画
            this.shapeParam = param || {};
        },
        
        /**
         * レンダラー
         */
        renderer: function(param) {
            var c = this.canvas;
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            
            // 描画
            var lw          = Number(c.lineWidth);
            var lw_half     = lw/2;
            var sides       = param.sides;
            var sideIndent  = param.sideIndent;
            var offsetAngle = param.offsetAngle;
            c.fillPolygon(this.width/2, this.height/2, this.radius, sides, offsetAngle);
            c.strokePolygon(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, sides, offsetAngle);
            
            c.restore();
        }
        
    });
    
    
    tm.app.PolygonShape.DEFAULT_SHAPE_PARAM = {
        fillStyle: "cyan",
        strokeStyle: "white",
        lineWidth: "4",
        
        sides: 5,
        offsetAngle: undefined,
    };
    
})();


















