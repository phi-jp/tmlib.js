/*
 * phi
 */


/*
 * 定数
 */
var SCREEN_WIDTH    = 600;
var SCREEN_HEIGHT   = 600;

var GOLDEN_RATIO = 1.618;
var BASE_SIZE    = 115;
var DOUBLE_SIZE  = BASE_SIZE*2;
var TREBLE_SIZE  = BASE_SIZE*3;
// var BODY_SIZE    = BASE_SIZE/5*1.618*9;
var BODY_SIZE    = 325;


tm.preload(function() {
    tm.graphics.TextureManager.add("twitter", "twitter-logo.png");
});

var Part = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function(x, y) {
        this.superInit(SCREEN_WIDTH*2, SCREEN_HEIGHT*2);
        
        this.rotation = tm.util.Random.randint(0, 359);
        this.scaleX = this.scaleY = 0.5;
        this.time = 0;
        this.alpha = 0;
        this.x = tm.util.Random.randint(0, 600);
        this.y = tm.util.Random.randint(0, 600);

        // アニメーション
        this.timeline
            .to({alpha:1, x:x, y:y}, 500, "easeInOutQuad")
            .to({scaleX: 1, scaleY: 1}, 1000, 500, "easeInOutQuad")
            .to({rotation: 0}, 1000, 1500, "easeInOutQuad");
    },
});

var Head = tm.createClass({
    superClass: Part,
    
    init: function() {
        this.superInit(408, 198);
        
        var canvas = this.canvas;
        canvas.setTransformCenter();
        canvas.fillStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.fillCircle(0, 0, BASE_SIZE);
    },
});

var Bill0 = tm.createClass({
    superClass: Part,
    
    init: function() {
        this.superInit(456, 56);
        
        var canvas = this.canvas;
        canvas.setTransformCenter();
        canvas.strokeStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.strokeCircle(0, 0, BASE_SIZE);
        canvas.fillStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.fillCircle(0, 0, BASE_SIZE);
        canvas.fillStyle = "white";
        canvas.globalCompositeOperation = "destination-out";
        canvas.fillCircle(-51, -270, TREBLE_SIZE);
    },
});


var Bill1 = tm.createClass({
    superClass: Part,
    
    init: function() {
        this.superInit(389, 10);
        
        var canvas = this.canvas;
        canvas.setTransformCenter();
        canvas.fillStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.fillCircle(0, 0, DOUBLE_SIZE);
        canvas.fillStyle = "white";
        canvas.globalCompositeOperation = "destination-out";
        canvas.fillCircle(64, -194, TREBLE_SIZE);
        canvas.fillCircle(-155, 86, DOUBLE_SIZE);
    },
    
    update: function() {
        this.time += 1;
    }
});


var Wing0 = tm.createClass({
    superClass: Part,
    
    init: function() {
        this.superInit(159, 162);
        
        var canvas = this.canvas;
        canvas.setTransformCenter();
        canvas.fillStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.fillCircle(0, 0, BASE_SIZE);
        canvas.fillStyle = "white";
        canvas.globalCompositeOperation = "destination-out";
        canvas.fillCircle(162, -282 , TREBLE_SIZE);
    },
    
    update: function() {
        this.rotation -= Math.cos(this.time*10*Math.DEG_TO_RAD)*2;
        this.time += 1;
    }
});


var Wing1 = tm.createClass({
    superClass: Part,
    
    init: function() {
        this.superInit(159, 244);
        
        var canvas = this.canvas;
        canvas.setTransformCenter();
        canvas.fillStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.fillCircle(0, 0, BASE_SIZE);
        canvas.fillStyle = "white";
        canvas.globalCompositeOperation = "destination-out";
        canvas.fillCircle(-24, -212, DOUBLE_SIZE);
        canvas.fillCircle(162, -364, TREBLE_SIZE);
    },
    
    update: function() {
        this.rotation -= Math.cos(this.time*10*Math.DEG_TO_RAD)*2;
        this.time += 1;
    }
});


var Wing2 = tm.createClass({
    superClass: Part,
    
    init: function() {
        this.superInit(194, 324);
        
        var canvas = this.canvas;
        canvas.setTransformCenter();
        canvas.fillStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.fillCircle(0, 0, BASE_SIZE);
        canvas.fillStyle = "white";
        canvas.globalCompositeOperation = "destination-out";
        canvas.fillCircle(-87, -194, DOUBLE_SIZE);
    },
    
    update: function() {
        this.rotation -= Math.cos(this.time*10*Math.DEG_TO_RAD)*2;
        this.time += 1;
    }
});

var Body = tm.createClass({
    superClass: Part,
    
    init: function() {
        this.superInit(199, 212);
        
        var canvas = this.canvas;
        
        
        canvas.setTransformCenter();
        
        canvas.rect(-190, -190, 590, 590);
        canvas.clip();
        
        canvas.fillStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.fillCircle(0, 0, BODY_SIZE);
        canvas.fillStyle = "white";
        canvas.globalCompositeOperation = "destination-out";
        canvas.fillCircle(-152, 45, DOUBLE_SIZE);
        canvas.fillCircle(122, -332, TREBLE_SIZE);
    },
});


var Remainder = tm.createClass({
    superClass: Part,
    
    init: function() {
        this.superInit(262, 242);
        
        var canvas = this.canvas;
        
        canvas.setTransformCenter();
        canvas.fillStyle = "hsla(0, 50%, 50%, 1.0)";
        canvas.fillCircle(0, 0, BASE_SIZE);
        canvas.fillStyle = "white";
        canvas.globalCompositeOperation = "destination-out";
        canvas.fillCircle(59, -362, TREBLE_SIZE);
    },
});

var TwitterLogo = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function() {
        this.superInit();
        
        this.addChild( Head() );
        this.addChild( Bill0() );
        this.addChild( Bill1() );
        this.addChild( Wing0() );
        this.addChild( Wing1() );
        this.addChild( Wing2() );
        this.addChild( Body() );
        this.addChild( Remainder() );
    },
});


tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    //app.enableStats();
    app.background = "rgba(0, 0, 0, 0.1)";
    
    var twitterLogo = TwitterLogo();
    app.currentScene.addChild( twitterLogo );
    
    var originVisible = false;
    app.update = function() {
        if (app.pointing.getPointingStart()) {
            originVisible = true;
            twitterLogo.visible = false;
        }
        if (app.pointing.getPointingEnd()) {
            originVisible = false;
            twitterLogo.visible = true;
        }
    };
    
    app.draw = function() {
        if (originVisible) {
            app.canvas.drawTexture(tm.graphics.TextureManager.get("twitter"), 0, 0);
        }
    };
    
    // mdlclick でキャプチャ
    tm.dom.Element(app.getElement()).event.mdlclick(function() {
        app.canvas.saveAsImage();
    });
    
    app.run();
});
