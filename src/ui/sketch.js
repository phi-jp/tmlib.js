/*
 * sketch.js
 */

;(function() {
    
    var DEFAULT_PARAM = {
        bgColor: "rgba(255, 255, 255, 1.0)",
        penColor: "rgba(0, 0, 0, 1.0)",
        lineWidth: 16,
    };
    
    /**
     * @class tm.ui.Sketch
     * Sketch
     * @extends tm.display.Shape
     */
    tm.define("tm.ui.Sketch", {
        superClass: "tm.display.Shape",
        
        /**
         * @constructor
         */
        init: function(width, height, param) {
            this.superInit(width, height);
            
            param = param || {};
            param.$safe(DEFAULT_PARAM);
            this._setup(param);
        },
        
        _setup: function(param) {
            var self = this;
            
            // setup this
            this.boundingType = "rect";
            this.setInteractive(true);
            
            // setup canvas
            var c = this.canvas.context;
            c.lineCap  = "round";
            c.lineJoin = "round";
            c.miterLimit = 10.0;
            this.bgColor = param.bgColor;
            this.penColor = param.penColor;
            this.lineWidth = param.lineWidth;
            
            // setup event
            this.on("pointingstart", function(e) {
                var p = e.app.pointing;
                
                self._drawPoint(p.position);
            });
            this.on("pointingmove", function(e) {
                var p = e.app.pointing;
                self._drawLine(p.prevPosition, p.position);
                self.points.push({
                    x: p.x-this.left,
                    y: p.y-this.top,
                });
            });
            this.on("pointingend", function(e) {
                self.pointsList.push(self.points);
                self.points = [];
            });

            // ポイントスタック
            this.pointsList = [];
            this.points = [];
        },
        
        /**
         * 画面をbgColor色でクリアする
         */
        clear: function() {
            this.canvas.clear();
            this.canvas.clearColor(this.bgColor);

            this.pointsList = [];
            this.points = [];
            
            return this;
        },
        
        _drawPoint: function(p) {
            this.canvas.drawPoint(p.x-this.left, p.y-this.top);
        },
        
        _drawLine: function(p, prev) {
            this.canvas.drawLine(
                p.x-this.left, p.y-this.top,
                prev.x-this.left, prev.y-this.top
            );
        },
        
    });

    /**
     * @property    penColor
     * penColor
     */
    tm.ui.Sketch.prototype.accessor("penColor", {
        "get": function()   { return this._penColor; },
        "set": function(v)  {
            this._penColor = v;
            this.canvas.strokeStyle = v;
        }
    });
    
    /**
     * @property    bgColor
     * bgColor
     */
    tm.ui.Sketch.prototype.accessor("bgColor", {
        "get": function()   { return this._bgColor; },
        "set": function(v)  {
            this._bgColor = v;
            this.clear();
        }
    });
    
    /**
     * @property    lineWidth
     * lineWidth
     */
    tm.ui.Sketch.prototype.accessor("lineWidth", {
        "get": function()   { return this._lineWidth; },
        "set": function(v)  {
            this._lineWidth = v;
            this.canvas.lineWidth = v;
        }
    });

    
})();

