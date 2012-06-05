/*
 * phi
 */


// 定数
var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 640;
var CIRCLE_RADIUS   = 30;
var CIRCLE_MAX_NUM  = 15;
var CIRCLE_PURSUIT_RATE = 0.25;  // 収束率

var app = null;

var Circle = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(color) {
        this.superInit();
        this.color = color;
        this.blendMode = "lighter";
    },
    
    update: function(app) {
        if (this.target) {
            this.x += (this.target.x-this.x)*CIRCLE_PURSUIT_RATE;
            this.y += (this.target.y-this.y)*CIRCLE_PURSUIT_RATE;
        }
        else {
            this.x = app.pointing.x;
            this.y = app.pointing.y;
        }
    },
    
    draw: function(c) {
        c.fillStyle = this.color;
        c.fillCircle(0, 0, CIRCLE_RADIUS);
    },
});

window.onload = function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    
    var circleList = [];
    for (var i=0; i<CIRCLE_MAX_NUM; ++i) {
        var c = "hsla({0}, 75%, 50%, 0.75)".format(360/CIRCLE_MAX_NUM*i);
        var circle = Circle(c);
        circle.x = tm.util.Random.randint(0, SCREEN_WIDTH);
        circle.y = tm.util.Random.randint(0, SCREEN_HEIGHT);
        app.currentScene.addChild(circle);
        circleList.push(circle);
    }
    
    for (var i=1; i<CIRCLE_MAX_NUM; ++i) {
        circleList[i].target = circleList[i-1];
    }
    
    app.run();
};