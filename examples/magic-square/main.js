/*
 * phi
 */


/*
 * 定数
 */
var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 640;


/**
 * 魔方陣クラス
 */
var MagicSquareSprite = tm.createClass({
    
    superClass: tm.app.Shape,
    
    init: function() {
        this.superInit(150, 150);
        
        this.radius    = 50;
        this.blendMode = "lighter";
        
        this.setupAnim();
        this.rendererCanvas();
    },
    
    setupAnim: function() {
        this.alpha = 0;

        this.tweener
            .to({alpha:1, rotation: 360}, 1000, "easeInOutQuad")
            .wait(500)
            .to({scaleX:2.0, scaleY:2.0}, 1000, "easeInOutBack")
            .to({alpha:0}, 1000)
            .call(function() {
                this.remove();
            }.bind(this));
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
    app.currentScene.onpointingstart = function(e) {
        var p  = e.app.pointing;
        var ms = MagicSquareSprite();
        ms.x = p.x;
        ms.y = p.y;
        ms.addChildTo(this);
    };
    
    // あらかじめいくつか生成しておく
    for (var i=0; i<16; ++i) {
        var ms = MagicSquareSprite();
        ms.x = tm.util.Random.randint(0, SCREEN_WIDTH);
        ms.y = tm.util.Random.randint(0, SCREEN_HEIGHT);;
        ms.addChildTo(app.currentScene);
    }
    
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
