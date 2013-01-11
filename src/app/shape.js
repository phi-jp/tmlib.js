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
            canvas.drawImage(
                this.canvas.canvas,
                0, 0, this.width, this.height,
                -this.width*this.originX, -this.height*this.originY, this.width, this.height);
            return this;
        },

        rendererCircle: function(param) {
            var param = {}.extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_CIRCLE, param);
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
        },

        rendererTriangle: function(param) {
            var param = {}.extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_TRIANGLE, param);
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
        },

        rendererRectangle: function(param) {
            var param = {}.extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_RECTANGLE, param);
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
        },

        rendererStar: function(param) {
            var param = {}.extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_STAR, param);
            var c = this.canvas;
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;

            console.dir(param);
            
            // 描画
            var lw          = Number(c.lineWidth);
            var lw_half     = lw/2;
            var sides       = param.sides;
            var sideIndent  = param.sideIndent;
            var offsetAngle = param.offsetAngle;
            c.fillStar(this.width/2, this.height/2, this.radius, sides, sideIndent, offsetAngle);
            c.strokeStar(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, sides, sideIndent, offsetAngle);
            
            c.restore();
        },

        rendererPolygon: function(param) {
            var param = {}.extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_POLYGON, param);
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
        },
        
    });

    tm.app.Shape.DEFAULT_SHAPE_PARAM_CIRCLE = {
        fillStyle: "red",
        strokeStyle: "white",
        lineWidth: "4",
    };

    tm.app.Shape.DEFAULT_SHAPE_PARAM_TRIANGLE = {
        fillStyle: "green",
        strokeStyle: "white",
        lineWidth: "4",
    };
    
    tm.app.Shape.DEFAULT_SHAPE_PARAM_RECTANGLE = {
        fillStyle: "blue",
        strokeStyle: "white",
        lineWidth: "4",
    };

    tm.app.Shape.DEFAULT_SHAPE_PARAM_STAR = {
        fillStyle: "yellow",
        strokeStyle: "white",
        lineWidth: "4",
        
        sides: 5,
        sideIndent: undefined,
        offsetAngle: undefined,
    };

    tm.app.Shape.DEFAULT_SHAPE_PARAM_POLYGON = {
        fillStyle: "cyan",
        strokeStyle: "white",
        lineWidth: "4",
        
        sides: 5,
        offsetAngle: undefined,
    };
    
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
            // 描画
            this.rendererCircle(param);
        },
    });
    
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
            // 描画
            this.rendererTriangle(param);
        },
        
    });
    
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
            // 描画
            this.rendererRectangle(param);
        },
        
    });
    
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
            // 描画
            this.rendererStar(param);
        },
        
    });
    
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
            // 描画
            this.rendererPolygon(param);
        },
        
    });
    
})();


















