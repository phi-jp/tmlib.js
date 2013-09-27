/*
 * shape.js
 */


tm.display = tm.display || {};


(function() {
    
    /**
     * @class tm.display.Shape
     * 図形を描画するクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.Shape = tm.createClass({
        
        superClass: tm.display.CanvasElement,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height) {
            this.superInit();
            
            width = width   || 64;
            height= height  || 64;
            
            this.canvas = tm.graphics.Canvas();
            
            this.width  = width;
            this.height = height;
            this.canvas.resize(width, height);
        },

        /**
         * @property
         * @TODO ?
         */
        renderCircle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_CIRCLE, param);
            
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

        /**
         * @property
         * @TODO ?
         */
        renderTriangle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_TRIANGLE, param);
            
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

        /**
         * @property
         * @TODO ?
         */
        renderRectangle: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_RECTANGLE, param);

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

        /**
         * @property
         * @TODO ?
         */
        renderStar: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_STAR, param);
            
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

        /**
         * @property
         * @TODO ?
         */
        renderPolygon: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_POLYGON, param);
            
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

        /**
         * @property
         * @TODO ?
         */
        renderHeart: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_HEART, param);

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

        /**
         * @property
         * @TODO ?
         */
        renderText: function(param) {
            var c = this.canvas;
            param = {}.$extend(tm.display.Shape.DEFAULT_SHAPE_PARAM_TEXT, param);

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

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_CIRCLE = {
        fillStyle: "red",
        strokeStyle: "white",
        lineWidth: "2",
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_TRIANGLE = {
        fillStyle: "green",
        strokeStyle: "white",
        lineWidth: "2",
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_RECTANGLE = {
        fillStyle: "blue",
        strokeStyle: "white",
        lineWidth: "2",
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_STAR = {
        fillStyle: "yellow",
        strokeStyle: "white",
        lineWidth: "2",
        
        sides: 5,
        sideIndent: undefined,
        offsetAngle: undefined,
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_POLYGON = {
        fillStyle: "cyan",
        strokeStyle: "white",
        lineWidth: "2",
        
        sides: 5,
        offsetAngle: undefined,
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_HEART = {
        fillStyle: "pink",
        strokeStyle: "white",
        lineWidth: "2",
        
        angle: 45,
    };

    /**
     * @enum
     */
    tm.display.Shape.DEFAULT_SHAPE_PARAM_TEXT = {
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
     * @class tm.display.CircleShape
     * 簡単に円を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.CircleShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
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
     * @class tm.display.TriangleShape
     * 簡単に三角形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.TriangleShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
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
     * @class tm.display.RectangleShape
     * 簡単に矩形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.RectangleShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
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
     * @class tm.display.StarShape
     * 簡単に星形を描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.StarShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
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
     * @class tm.display.PolygonShape
     * @TODO なにを描画するクラス？
     * @extends tm.display.Shape
     */
    tm.display.PolygonShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
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
     * @class tm.display.HeartShape
     * 簡単にハートを描画できるクラス
     * @extends tm.display.Shape
     */
    tm.display.HeartShape = tm.createClass({
        
        superClass: tm.display.Shape,
        
        /**
         * @constructor
         * コンストラクタ
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
     * @class tm.display.TextShape
     * @TODO なにするクラス？
     * @extends tm.display.Shape
     */
    tm.define("tm.display.TextShape", {

        superClass: "tm.display.Shape",
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            // 描画
            this.renderText(param);
        },
    });
    
})();


















