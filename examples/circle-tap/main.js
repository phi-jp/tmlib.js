/*
 * phi
 */









var IconButton = tm.createClass({
    superClass: tm.app.Sprite,
    
    init: function(img) {
        this.superInit(img.width, img.height, img);
        this.alpha = 0.5;
        
        this.interaction.setBoundingType("rect");
        this.addEventListener("pointingover", function() { this.animation.fade(1.0, 250); });
        this.addEventListener("pointingout", function() { this.animation.fade(0.5, 250); });
    }
});










var app = null;

// 定数
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 720;
var CIRCLE_RADIUS   = 5;
var CIRCLE_NUM      = 100;
var TAP_RANGE       = 150;

var Circle = tm.createClass({
    superClass: tm.app.Sprite,
    
    init: function(color) {
        this.superInit(CIRCLE_RADIUS+15, CIRCLE_RADIUS+15);
        
        this.v          = tm.geom.Vector2.random(0, 360, tm.util.Random.randfloat(4, 8));
        this.radius     = CIRCLE_RADIUS;
        this.fillStyle  = color;
        this.alpha      = 0.75;
        
        this.canvas.fillStyle = color;
        this.canvas.setTransformCenter();
        this.canvas.fillCircle(0, 0, this.radius);
        this.canvas.strokeStyle = "white";
        this.canvas.lineWidth = 2;
        this.canvas.strokeCircle(0, 0, this.radius+1);
    },
    
    update: function() {
        this.position.add(this.v);
        
        var left   = this.radius;
        var right  = SCREEN_WIDTH-this.radius;
        var top    = this.radius;
        var bottom = SCREEN_HEIGHT-this.radius;
        
        if      (left   > this.x) { this.x = left;   this.v.x*=-1; }
        else if (right  < this.x) { this.x = right;  this.v.x*=-1; }
        if      (top    > this.y) { this.y = top;    this.v.y*=-1; }
        else if (bottom < this.y) { this.y = bottom; this.v.y*=-1; }
    },
    
    disappear: function() {
        this.update = function() {};
        var duration = tm.util.Random.randint(500, 1500);
        this.animation.move(0, -150, duration).scale(4, duration).fadeOut(duration);
    },
    
    onanimationend: function() {
        this.remove();
    },
    
});

var MainScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        this.interaction.eanbled = true;
        this.circleList = [];
        
        for (var i=0; i<CIRCLE_NUM; ++i) {
            var circle = Circle( "hsla({0}, 75%, 50%, 0.75)".format(Math.rand(0, 360)) );
            circle.setPosition(tm.util.Random.randint(CIRCLE_RADIUS, SCREEN_WIDTH-CIRCLE_RADIUS), tm.util.Random.randint(CIRCLE_RADIUS, SCREEN_HEIGHT-CIRCLE_RADIUS));
            circle.addChildTo(this);
            this.circleList.push(circle);
        }
        
        app.frame = 0;
        app.score = 0;
    },
    
    update: function(app) {
        var p = app.pointing;
        
        if (p.getPointingStart()) {
            tm.sound.SoundManager.get("touch").play();
            for (var i=0,len=this.circleList.length; i<len; ++i) {
                var circle = this.circleList[i];
                var d = tm.geom.Vector2.distanceSquared(p.position, circle.position);
                if (d < TAP_RANGE*TAP_RANGE) {
                    app.score += 100;
                    circle.disappear();
                }
                circle.update = function() {};
            }
            this.update = this.wait;
            app.frame = 0;
        };
    },
    
    wait: function() {
        if (app.frame > 120) { app.replaceScene(EndScene()); }
        
        app.frame+=1;
    },
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});

var StartScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        
        for (var i=0; i<20; ++i) {
            this.circle = Circle( "hsla({0}, 75%, 50%, 0.5)".format(Math.rand(0, 360)) );
            this.circle.setPosition(tm.util.Random.randint(40, SCREEN_WIDTH-40), tm.util.Random.randint(40, SCREEN_HEIGHT-40));
            this.circle.addChildTo(this);
        }
        this.addChild( tm.prim.RectSprite(SCREEN_WIDTH, SCREEN_HEIGHT, "rgba(0, 0, 0, 0.75)") );
        
        var label = null;
        
        label = tm.app.Label("Circle Tap");
        label.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2-150);
        label.fontSize  = 70;
        label.width = SCREEN_WIDTH;
        label.color = "white";
        label.align = "center";
        label.baseline = "middle";
        label.addChildTo(this);
        
        label = tm.app.Label("Start");
        label.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2+150);
        label.fontSize  = 40;
        label.width = SCREEN_WIDTH;
        label.align = "center";
        label.baseline = "middle";
        label.shadowColor = "#aaf";
        label.shadowBlur   = 16;
        label.addChildTo(this);
        
        
        var tmlibIconButton = IconButton( tm.graphics.TextureManager.get("tmlibIcon") );
        tmlibIconButton.setPosition(SCREEN_WIDTH-80, SCREEN_HEIGHT-80).setSize(100, 100);
        tmlibIconButton.onpointingend = function() { window.open("https://github.com/phi1618/tmlib.js", "_self"); };
        tmlibIconButton.addChildTo(this);
        
        var blogIconButton = IconButton( tm.graphics.TextureManager.get("blogIcon") );
        blogIconButton.setPosition(SCREEN_WIDTH-80-120, SCREEN_HEIGHT-80).setSize(100, 100);
        // blogIconButton.onpointingend = function() { window.open("http://tmlife.net", "_self"); };
        blogIconButton.onpointingend = function() { window.open("http://tmlife.net", "_self"); };
        blogIconButton.addChildTo(this);
        
        var fadein = tm.fade.FadeIn(SCREEN_WIDTH, SCREEN_HEIGHT, "#fff", 2000);
        fadein.blendMode = "lighter";
        this.addChild( fadein );
    },
    
    onpointingstart: function() {
        tm.sound.SoundManager.get("decide").play();
        
        this.addChild( tm.fade.FadeOut(
            SCREEN_WIDTH, SCREEN_HEIGHT, "#000", 500, function() {
                app.replaceScene(MainScene());
            })
        );
    },
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});


var EndScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        
        for (var i=0; i<20; ++i) {
            this.circle = Circle( "hsla({0}, 75%, 50%, 0.5)".format(Math.rand(0, 360)) );
            this.circle.setPosition(tm.util.Random.randint(40, SCREEN_WIDTH-40), tm.util.Random.randint(40, SCREEN_HEIGHT-40));
            this.circle.addChildTo(this);
        }
        this.addChild( tm.prim.RectSprite(SCREEN_WIDTH, SCREEN_HEIGHT, "rgba(0, 0, 0, 0.75)") );
        
        
        var label = null;
        label = tm.app.Label("Score");
        label.position.set(SCREEN_WIDTH/2, 300);
        label.fontSize = 60;
        label.width = SCREEN_WIDTH;
        label.color = "white";
        label.align = "center";
        label.addChildTo(this);
        
        label = tm.app.Label(app.score+"");
        label.position.set(SCREEN_WIDTH/2, 390);
        label.fontSize = 60;
        label.width = SCREEN_WIDTH;
        label.color = "white";
        label.align = "center";
        label.addChildTo(this);
        
        var msg = "『{title}』\nScore : {score}\n{msg}\n{url}\n#{hash0} #{hash1}".format({
            title: document.title,
            score: app.score,
            msg: "遊んでくれてありがとう♪",
            url: "https://github.com/phi1618/tmlib.js",
            hash0: "circletap",
            hash1: "tmlibjs",
        });
        var tweetButton = tm.twitter.TweetButton(msg);
        tweetButton.setPosition(SCREEN_WIDTH/2, 470);
        tweetButton.addChildTo(this);
        
        this.addChild( tm.fade.FadeIn(
            SCREEN_WIDTH, SCREEN_HEIGHT, "#000", 1000, function() {
                this.onpointingstart = this._onpointingstart;
            }.bind(this))
        );

    },
    
    _onpointingstart: function() {
        tm.sound.SoundManager.get("decide").play();
        
        var fadeout = tm.fade.FadeOut(SCREEN_WIDTH, SCREEN_HEIGHT, "#fff", 500, function() {
            app.replaceScene(StartScene());
        });
        fadeout.blendMode = "lighter";
        this.addChild( fadeout );
    },
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});

var PauseScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        this.interaction;
        
        var filter = tm.app.Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
        filter.setPosition(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
        filter.canvas.clearColor("rgba(0, 0, 0, 0.75)");
        this.addChild(filter);
        
        app.stop();
        tm.sound.SoundManager.get("main_bgm").pause();
    },
    
    onfocus: function() {
        app.start();
    },
    
    onblur: function() {
        app.stop();
    },
    
    onpointingstart: function() {
        tm.sound.SoundManager.get("main_bgm").play();
        app.popScene();
    },
});

tm.preload(function() {
    tm.graphics.TextureManager.add("blogIcon", "../logo/blog-icon.png");
    tm.graphics.TextureManager.add("tmlibIcon", "../logo/icon.png");
    
    tm.sound.SoundManager.add("main_bgm", "http://storage.tmlife.net/resource/bgm/maoudamashii/bgm_maoudamashii_healing02.wav", 1);
    tm.sound.SoundManager.add("touch", "touch");
    tm.sound.SoundManager.add("decide", "decide");
});

tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fps = 30;
    app.fitWindow();
    app.enableStats();
    
    tm.sound.SoundManager.get("main_bgm").loop = true;
    tm.sound.SoundManager.get("main_bgm").play();
    
    var startScene = StartScene();
    app.replaceScene(startScene);
    
    app.run();
});





