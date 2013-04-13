/*
 * phi
 */

// 定数
var CIRCLE_RADIUS   = 30;
var SCREEN_WIDTH    = 465;
var SCREEN_HEIGHT   = 465;
var FRICTION        = 0.96;
var TO_DIST         = SCREEN_WIDTH*0.86;
var STIR_DIST       = SCREEN_WIDTH*0.125;
var BLOW_DIST       = SCREEN_WIDTH*0.4;

var Particle = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function(color) {
        this.superInit(10, 10);
        
        this.v = tm.geom.Vector2(0, 0);
        this.fillStyle = color;
        if (tm.BROWSER != "Firefox") {
            this.blendMode = "lighter";
        }
        this.canvas.setTransformCenter();
        this.canvas.fillStyle = color;
        this.canvas.fillStar(0, 0, 5, 5);
        // this.canvas.strokeStyle = color;
        // this.canvas.strokeStar(0, 0, 5, 5);
    },
    
    update: function(app) {
        var p  = app.pointing;
        var dv = tm.geom.Vector2.sub(this, p);
        var d  = dv.length() || 0.001;
        dv.div(d);  // normalize
        
        // タッチによる反発
        if (p.getPointing()) {
            if (d < BLOW_DIST) {
                var blowAcc = (1 - (d/BLOW_DIST)) * 14;
                this.v.x += dv.x * blowAcc + 0.5 - Math.random();
                this.v.y += dv.y * blowAcc + 0.5 - Math.random();
            }
        }
        
        // 距離が一定以内だと速度を調整する
        if (d<TO_DIST) {
            var toAcc = ( 1 - ( d / TO_DIST ) ) * app.width * 0.0014;
            this.v.x -= dv.x * toAcc;
            this.v.y -= dv.y * toAcc;
        }
          
        if (d<STIR_DIST) {
            var mAcc = ( 1 - (d / STIR_DIST) * app.width * 0.00026 );
            this.v.x += p.dx * mAcc * 0.1;
            this.v.y += p.dy * mAcc * 0.1;
        }
        
        // 摩擦
        this.v.mul(FRICTION);
        // 移動
        this.position.add(this.v);
        
        // ハミ出しチェック
        if (this.x > app.width) {
            this.x = app.width; this.v.x *= -1;
        }
        else if (this.x < 0) {
            this.x = 0; this.v.x *= -1;
        }
        if (this.y > app.height) {
            this.y = app.height; this.v.y *= -1;
        }
        else if (this.y < 0) {
            this.y = 0; this.v.y *= -1;
        }
        // // ハミ出しチェック
        // if (this.x > app.width) {
            // this.x = 0;
            // // this.v.x *= -1;
        // }
        // else if (this.x < 0) {
            // this.x = app.width;
            // // this.v.x *= -1;
        // }
        // if (this.y > app.height) {
            // this.y = 0;
            // // this.v.y *= -1;
        // }
        // else if (this.y < 0) {
            // this.y = app.height;
            // // this.v.y *= -1;
        // }
        
        
        // スケール
        var scale = this.v.lengthSquared() * 0.04;
        scale = Math.clamp(scale, 0.75, 2);
        this.scaleX = this.scaleY = scale;
        
        // 回転
        this.rotation += scale*10;
    },
    
});

window.onload = function() {
    var app = tm.app.CanvasApp("#world");
    app.fps = 60;
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    app.enableStats();
    app.background = "rgba(0, 0, 0, 0.5)";
    
    for (var i=0; i<500; ++i) {
        var c = Particle(
            "hsla({0}, 75%, 50%, 1)".format(Math.rand(0, 360))
        );
        c.position.setRandom(0, 360, Math.random()*app.width*0.5).add(tm.geom.Vector2(app.width*0.5, app.height*0.5));
        // c.x = Math.rand(0, app.width);
        // c.y = Math.rand(0, app.height);
        app.currentScene.addChild(c);
    }
    
    app.currentScene.update = function(app) {
        if (app.keyboard.getKeyDown("space")) {
            app.currentScene._update = function() {};
        }
    };
    
    app.run();
};
