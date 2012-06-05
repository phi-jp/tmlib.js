/*
 * phi
 */

var MagicSquareSprite = tm.createClass({
    
    superClass: tm.app.Sprite,
    
    init: function() {
        this.superInit(150, 150);
        
        this.radius    = 50;
        this.blendMode = "lighter";
        
        this.setupAnim();
        this.rendererCanvas();
    },
    
    setupAnim: function() {
        this.animation.addTween({
            prop: "alpha",
            begin: 0,
            finish: 1.0,
            duration: 1000,
        });
        this.animation.addTween({
            prop: "rotation",
            begin: 0,
            finish: 360,
            duration: 1000,
            func: "easeInOutQuad",
        });
        
        this.animation.addTween({
            prop: "scaleX",
            begin: 1.0,
            finish: 2.0,
            duration: 1000,
            delay: 1500,
            func: "easeInOutBack",
        });
        this.animation.addTween({
            prop: "scaleY",
            begin: 1.0,
            finish: 2.0,
            duration: 1000,
            delay: 1500,
            func: "easeInOutBack",
        });
        this.animation.addTween({
            prop: "alpha",
            begin: 1.0,
            finish: 0.0,
            duration: 1000,
            delay: 1500,
        });
        
        this.onanimationend = function() {
            this.remove();
        };
    },
    
    
    rendererCanvas: function() {
        var canvas = this.canvas;
        
        canvas.setTransformCenter();
        canvas.fillStyle  = "hsl(60, 75%, 50%)";
        canvas.strokeStyle= "hsl(60, 75%, 50%)";
        // 星
        canvas.lineWidth = 2;
        canvas.strokeStar(0, 0, this.radius, 5);
        canvas.lineWidth = 1;
        // ５角形
        canvas.strokePolygon(0, 0, this.radius, 5);
        // 円
        canvas.strokeCircle(0, 0, this.radius);
        // 内側の円
        canvas.strokeCircle(0, 0, this.radius*0.8);
        canvas.lineWidth = 4;
        // 外側の円
        canvas.strokeCircle(0, 0, this.radius*1.35);
        
        var text = "Time is money. Time is money. Time";
        canvas.lineWidth = 1;
        for (var i=0,len=text.length; i<len; ++i) {
            canvas.save();
            canvas.rotate(Math.degToRad(i*10));
            canvas.translate(0, -this.radius*1.1);
            canvas.fillText(text[i], 0, 0);
            canvas.restore();
        }
    },

});


tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(640, 640);
    app.fitWindow();
    //app.enableStats();
    app.background = "rgba(0, 0, 0, 0.25)";
    
    app.currentScene.name = "hoge";
    app.currentScene.onmousedown = function(e) {
        var p  = e.app.pointing;
        var ms = MagicSquareSprite();
        ms.x = p.x;
        ms.y = p.y;
        ms.addChildTo(this);
    };
    
    app.update = function() {
        var scene = this.currentScene;
        var key = this.keyboard;
        if (key.getKeyDown("space") == true) {
            (scene.isUpdate == true) ? scene.sleep() : scene.wakeUp();
        }
    }
    
    // mdlclick でキャプチャ
    tm.dom.Element(app.getElement()).event.mdlclick(function() {
        app.canvas.saveAsImage();
    });
    
    app.run();
});
