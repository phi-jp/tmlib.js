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

        renderCircle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_CIRCLE, param);
            
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

        renderTriangle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_TRIANGLE, param);
            
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

        renderRectangle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_RECTANGLE, param);

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

        renderStar: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_STAR, param);
            
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
        },

        renderPolygon: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_POLYGON, param);
            
            c.save();
            
            // パラメータセット
            c.fillStyle = param.fillStyle;
            c.strokeStyle = param.strokeStyle;
            c.lineWidth = param.lineWidth;
            c.textAlign = "center";
            c.textBaseline = "middle";
            
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

        renderHeart: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_HEART, param);

            c.save();
            
            // パラメータセット
            c.fillStyle     = param.fillStyle;
            c.strokeStyle   = param.strokeStyle;
            c.lineWidth     = param.lineWidth;
            
            // 描画
            c.fillHeart(this.width/2, this.height/2, this.radius, param.angle);
            c.strokeHeart(this.width/2, this.height/2, this.radius-Number(c.lineWidth)/2, param.angle);
            
            c.restore();
        },

        renderText: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.app.Shape.DEFAULT_SHAPE_PARAM_TEXT, param);

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
        
    });

    tm.app.Shape.DEFAULT_SHAPE_PARAM_CIRCLE = {
        fillStyle: "red",
        strokeStyle: "white",
        lineWidth: "2",
    };

    tm.app.Shape.DEFAULT_SHAPE_PARAM_TRIANGLE = {
        fillStyle: "green",
        strokeStyle: "white",
        lineWidth: "2",
    };
    
    tm.app.Shape.DEFAULT_SHAPE_PARAM_RECTANGLE = {
        fillStyle: "blue",
        strokeStyle: "white",
        lineWidth: "2",
    };

    tm.app.Shape.DEFAULT_SHAPE_PARAM_STAR = {
        fillStyle: "yellow",
        strokeStyle: "white",
        lineWidth: "2",
        
        sides: 5,
        sideIndent: undefined,
        offsetAngle: undefined,
    };

    tm.app.Shape.DEFAULT_SHAPE_PARAM_POLYGON = {
        fillStyle: "cyan",
        strokeStyle: "white",
        lineWidth: "2",
        
        sides: 5,
        offsetAngle: undefined,
    };

    tm.app.Shape.DEFAULT_SHAPE_PARAM_HEART = {
        fillStyle: "pink",
        strokeStyle: "white",
        lineWidth: "2",
        
        angle: 45,
    };

    tm.app.Shape.DEFAULT_SHAPE_PARAM_TEXT = {
        text: "hello, world",
        fillStyle: "pink",
        strokeStyle: "white",
        lineWidth: "1",
        textAlign: "center",
        textBaseline: "middle",
        font: "24px 'Consolas', 'Monaco', 'ＭＳ ゴシック'",
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
            this.renderCircle(param);
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
            this.renderTriangle(param);
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
            this.renderRectangle(param);
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
            this.renderStar(param);
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
            this.renderPolygon(param);
        },
        
    });
    
})();




(function() {
    
    /**
     * @class
     * HeartShape
     */
    tm.app.HeartShape = tm.createClass({
        
        superClass: tm.app.Shape,
        
        /**
         * 初期化
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderHeart(param);
        },
        
    });
    
})();




(function() {
    
    /**
     * @class
     * HeartShape
     */
    tm.define("tm.app.TextShape", {

        superClass: "tm.app.Shape",
        
        /**
         * 初期化
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderText(param);
        },
    });
    
})();


(function() {
    
    /**
     * @class
     * TmlibLogo
     */
    tm.define("tm.app.TmlibLogo", {

        superClass: "tm.app.Shape",
        
        /**
         * 初期化
         */
        init: function(width, height) {
            this.superInit(width, height);
        },

        update: function () {
            this._refresh();
        },

        /**
         * 描画
         */
        _refresh: function () {
            var c = this.canvas;
            c.resize(this.width, this.height);
            c.fillStyle = "rgba(0,0,255,1.0)";
            c.fillCircle(this.x - this.width/10, this.y - this.height/4 + this.height/8, this.width/5);
            
            c.fillStyle = "rgba(255,255,0,1.0)";
            c.fillCircle(this.x + this.width/10, this.y - this.height/8 + this.height/8, this.width/5);
            
            // テキストを描画
            c.setShadow("rgb(20,20,20)", 2, 2, 7);
            var fontsize = 80/600 * this.width;
            c.setText(fontsize + "px 'Consolas', 'Monaco', 'ＭＳ ゴシック'", "center", "center");
            c.fillStyle = "rgba(255,255,255,1.0)";
            c.fillText("tmlib.js", this.x, this.y + this.height/20 + this.height/8);
        },
    });
    
})();















