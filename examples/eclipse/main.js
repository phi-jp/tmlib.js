/*
 * phi
 */


// 定数
var SCREEN_WIDTH    = 960;
var SCREEN_HEIGHT   = 640;
var SUN_RADIUS      = 200;
// var MOON_RADIUS     = 200;  // total eclipse
var MOON_RADIUS     = 150;  // annular eclipse
var ECLIPSE_TIME    = 5000;
var WAIT_TIME       = 2000;

var SunAxis = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function() {
        this.superInit();
        this.x = SCREEN_WIDTH/2 - 900;
        this.y = SCREEN_HEIGHT/2 + 1000;
        
        var sun = Sun();
        sun.x = 900;
        sun.y = -1000;
        sun.addChildTo(this);
        
        this.rotation = 330;
        this.tweener
            .rotate(360, ECLIPSE_TIME)
            .wait(WAIT_TIME)
            .rotate(390, ECLIPSE_TIME);
    },
});

var Sun = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function() {
        this.superInit(SUN_RADIUS*3, SUN_RADIUS*3);
        this.radius = SUN_RADIUS;
        
        var c = this.canvas;
        c.setTransformCenter();
        
        var grad = tm.graphics.RadialGradient(0, 0, 0, 0, 0, this.radius*1.1);
        grad.addColorStopList([
            { offset: 0.00, color: "hsla(60, 75%, 100%, 1.0)" },
            { offset: 0.75, color: "hsla(60, 75%, 75%, 1.0)" },
            { offset: 0.9, color: "hsla(60, 75%, 50%, 0.2)" },
            { offset: 1.0, color: "hsla(60, 75%, 50%, 0.0)" },
        ]);
        c.setGradient(grad);
        c.setShadow("red", 0, 0, 1);
        c.fillCircle(0, 0, this.radius*1.1);
    },
    
    update: function() {
        
    },
});

var Moon = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function() {
        this.superInit(MOON_RADIUS*3, MOON_RADIUS*3);
        this.radius = MOON_RADIUS;
        
        var c = this.canvas;
        c.setTransformCenter();
        
        c.fillStyle = "black";
        c.fillCircle(0, 0, this.radius);
    },
});

var MoonAxis = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function() {
        this.superInit();
        this.x = SCREEN_WIDTH/2 + 400;
        this.y = SCREEN_HEIGHT/2 + 400;
        
        var moon = Moon();
        moon.x = -400;
        moon.y = -400;
        moon.addChildTo(this);
        
        this.rotation = 350;
        this.tweener
            .rotate(360, ECLIPSE_TIME)
            .wait(WAIT_TIME)
            .rotate(370, ECLIPSE_TIME);
    },
});



window.onload = function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    
    var sunAxis = SunAxis();
    app.currentScene.addChild(sunAxis);
    
    var moonAxis = MoonAxis();
    app.currentScene.addChild(moonAxis);
    
    // ダブルクリックで保存
    //tm.dom.Element(app.element).event.mdlclick( function() { app.canvas.saveAsImage(); } );
    
    app.run();
};

