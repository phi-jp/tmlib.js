/*
 * phi
 */


var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT= 480;

tm.graphics.Canvas.prototype.koch = function(x0, y0, x1, y1, n) {
    var x2 = (2 * x0 + x1) / 3;
    var y2 = (2 * y0 + y1) / 3;
    var x3 = (x0 + 2 * x1) / 3;
    var y3 = (y0 + 2 * y1) / 3;
    
    var x = x1 - x0;
    var y = -(y1 - y0);
    var d = Math.sqrt(x*x + y*y) / Math.sqrt(3);
    var tempX, tempY;
    var rad = 0;
    
    if (x >= 0) {
        tempX = x0;
        tempY = y0;
        rad = Math.PI / 6;
    }
    else {
        tempX = x1;
        tempY = y1;
        rad = -Math.PI / 6;
    }
    
    var angle = Math.atan(y / x) + rad;
    x4 = tempX + d * Math.cos(angle);
    y4 = tempY - d * Math.sin(angle);
    
    if (n == 0) {
        this.strokeLines(x0, y0, x2, y2);
        this.strokeLines(x2, y2, x4, y4);
        this.strokeLines(x4, y4, x3, y3);
        this.strokeLines(x3, y3, x1, y1);
    }
    else {
        --n;
        this.koch(x0, y0, x2, y2, n);
        this.koch(x2, y2, x4, y4, n);
        this.koch(x4, y4, x3, y3, n);
        this.koch(x3, y3, x1, y1, n);
    }
    
    return this;
};

tm.graphics.Canvas.prototype.strokeKoch = function(x0, y0, x1, y1, n) {
    this.beginPath();
    this.koch(x0, y0, x1, y1, n);
    this.fill();
    return this;
};

var Snow = tm.createClass({
    
    superClass: tm.app.Shape,
    
    init: function(x, y, scale) {
        this.superInit(32, 32);
        
        this.position.set(x, y);
        
        this.radius     = 16;
        this.scaleX     = scale;
        this.scaleY     = scale;
        this.blendMode  = "lighter";
        
        var canvas = this.canvas;
        var grad   = tm.graphics.RadialGradient(0, 0, 0, 0, 0, this.radius);
        grad.addColorStop(0.0, "rgba(255, 255, 255, 1.0)")
            .addColorStop(0.7, "rgba(255, 255, 255, 0.5)")
            .addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
        canvas.setTransformCenter();
        canvas.setGradient(grad);
        canvas.fillCircle(0, 0, this.radius);
        
        this.fall();
    },
    
    fall: function() {
        var self = this;

        this.timeline
            .to({x:this.x+tm.util.Random.randint(-50, 50)}, 5000, "easeInOutSine")
            .to({y:(SCREEN_HEIGHT-120) + 100*this.scaleY}, 7500 - 2500*this.scaleY, "swing")
            .call(function() {
                self.melt();
            }, 7500 - 2500*this.scaleY);
    },
    
    melt: function() {
        var self = this;

        this.timeline.clear();
        this.timeline
            .to({alpha:0.0}, 2000, 1000, "easeInOutSine")
            .call(function() {
                self.remove();
            }, 3000);
    },
});


tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    app.enableStats();
    app.background = "rgba(0, 0, 0, 0.25)";
    
    app.currentScene.update = function(app) {
        if (app.frame % 4 == 0) {
            var snow = Snow(
                tm.util.Random.randint(0, app.width),
                -50,
                tm.util.Random.randfloat(0.25, 1.0)
            );
            snow.addChildTo(this);
        }
    }
    
    var grad   = tm.graphics.LinearGradient(0, 0, 0, app.height);
    grad.addColorStop(0.0, "#1f2273");
    grad.addColorStop(1.0, "#000000");
    app.currentScene.fillStyle = grad.toStyle();
    app.currentScene.draw = function(canvas) {
        canvas.fillRect(0, 0, app.width, app.height);
    }
    
    app.run();
});


