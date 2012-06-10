/*
 * phi
 */


// 定数
var SCREEN_WIDTH    = 960;
var SCREEN_HEIGHT   = 640;
var SUN_RADIUS      = 200;
var MOON_RADIUS     = 200;  // total eclipse
// var MOON_RADIUS     = 150;  // annular eclipse

var Sun = tm.createClass({
    superClass: tm.app.Sprite,
    
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

var MoonAxis = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function() {
        this.superInit();
    },
});

var Moon = tm.createClass({
    superClass: tm.app.Sprite,
    
    init: function() {
        this.superInit(MOON_RADIUS*3, MOON_RADIUS*3);
        this.radius = MOON_RADIUS;
        
        var c = this.canvas;
        c.setTransformCenter();
        
        c.fillStyle = "black";
        c.fillCircle(0, 0, this.radius);
    },
    
    eclipse: function() {
        this.animation.addTween({
            prop: "x",
            begin: 0,
            finish: this.x,
            duration: 3000,
        });
    },
    
    update: function() {
        
    },
});


window.onload = function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    
    var sun = Sun();
    sun.x = SCREEN_WIDTH/2;
    sun.y = SCREEN_HEIGHT/2;
    app.currentScene.addChild(sun);
    
    var moon = Moon();
    moon.x = SCREEN_WIDTH/2;
    moon.y = SCREEN_HEIGHT/2;
    moon.eclipse();
    app.currentScene.addChild(moon);
    
    app.run();
};

