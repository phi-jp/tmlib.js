/*
 * phi
 */


/*
 * 定数
 */
var GOLDEN_RATIO  = 1.618;

var SCREEN_WIDTH  = 500;
var SCREEN_HEIGHT = 500;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;
var BACKGROUND_COLOR= "rgb(240, 240, 240)";
var BACKGROUND_COLOR= "rgb(255, 255, 255)";

var CIRCLE_RADIUS   = SCREEN_WIDTH/2/GOLDEN_RATIO;
var BASE_OFFSET     = SCREEN_WIDTH/10;
var LOGO_LABEL_SIZE = SCREEN_WIDTH/5;

tm.preload(function() {
});

var Daylight = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function(x, y) {
        this.superInit(SCREEN_WIDTH, SCREEN_HEIGHT);
        
        this.canvas.setTransformCenter();
        this.canvas.fillStyle= "rgba(255, 255, 0, 1.0)";
        this.canvas.fillCircle(0, 0, CIRCLE_RADIUS);
    }
});

var Night = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function(x, y) {
        this.superInit(SCREEN_WIDTH, SCREEN_HEIGHT);
        
        this.canvas.setTransformCenter();
        this.canvas.fillStyle= "rgba(0, 0, 255, 1.0)";
        this.canvas.fillCircle(0, 0, CIRCLE_RADIUS);
    }
});

var LogoLabel = tm.createClass({
    superClass: tm.app.Label,
    
    init: function(x, y) {
        this.superInit("tmlib.js");
        
        // this.stroke = true;
        this.width = SCREEN_WIDTH;
        this.align = "center";
        this.fillStyle = "white";
        this.strokeStyle = "black";
        this.fontSize = LOGO_LABEL_SIZE;
        this.fontFamily = '"Meiryo", "メイリオ", "ヒラギノ角ゴ Pro W3", sans-serif';
        //this.fontFamily = "'Consolas', 'Monaco', 'ＭＳ ゴシック'";
        console.dir(this);
        
        this.shadowColor    = "#000";
        this.shadowOffsetX  = 2;
        this.shadowOffsetY  = 2;
        this.shadowBlur     = 8;
    },
});

var Logo = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(x, y) {
        this.superInit();
        
        var offsetX = BASE_OFFSET*GOLDEN_RATIO;
        var offsetY = BASE_OFFSET;
        
        var night   = Night().setPosition(SCREEN_CENTER_X-offsetX, SCREEN_CENTER_Y-offsetY).addChildTo(this);
        var daylight= Daylight().setPosition(SCREEN_CENTER_X+offsetX, SCREEN_CENTER_Y+offsetY).addChildTo(this);
        
        var logoLabel = LogoLabel().setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y+offsetY*2*1.618).addChildTo(this);
    }
});

tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    app.background = BACKGROUND_COLOR;
    
    var logo = Logo();
    app.currentScene.addChild( logo );
    
    app.update = function() {
    };
    
    app.draw = function() {
    };
    
    // mdlclick でキャプチャ
    tm.dom.Element(app.getElement()).event.mdlclick(function() {
        app.canvas.saveAsImage();
    });
    
    app.run();
});
