/*
 * phi
 */


var app = null;

// 定数
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 720;
var CIRCLE_RADIUS   = 30;
var TIME            = 10;


var Circle = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(color) {
        this.superInit();
        
        this.radius     = CIRCLE_RADIUS;
        this.fillStyle  = color;
        this.alpha      = 0.75;
        this.setInteractive(true);
    },
    
    draw: function(c) {
        //c.fillRect(0, 0, this.width, this.height);
        c.fillCircle(0, 0, this.radius);
        
        c.strokeStyle = "white";
        c.lineWidth = 4;
        c.strokeCircle(0, 0, this.radius+1);
    },
    
    onpointingstart: function() {
        var se = tm.sound.SoundManager.get("touch");
        se.volume = 0.5;
        se.play();
    },
    
    onmouseover: function() {
        this.alpha = 1.0;
    },
    
    onmouseout: function() {
        this.alpha = 0.75;
    },
    
    isHitPoint: function(x, y) {
        var o = {x:x, y:y};
        var d = tm.geom.Vector2.distanceSquared(this, o);
        return d <= Math.pow(this.radius, 2);
    }
});

var MainScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        this.radius     = CIRCLE_RADIUS;
        this.color      = color;
        this.blendMode  = "lighter";
        
        this.circle = Circle( "hsla({0}, 75%, 50%, 0.75)".format(Math.rand(0, 360)) );
        this.circle.setPosition(tm.util.Random.randint(40, SCREEN_WIDTH-40), tm.util.Random.randint(40, SCREEN_HEIGHT-40));
        this.circle.addChildTo(this);
        this.circle.addEventListener("pointingstart", function() {
            this.dispatchEvent(tm.event.Event("circleclick"));
        }.bind(this));
        
        this.timer = tm.app.Label("abc");
        this.timer.position.set(320, 70);
        this.timer.width = 200;
        this.timer.color = "white";
        this.timer.addChildTo(this);
        
        app.frame = 0;
        app.score = 0;
    },
    
    update: function() {
        var time = TIME - (app.frame / app.fps);
        if (time <= 0) {
            time = 0;
            app.replaceScene(EndScene());
        }
        
        this.timer.text = "Time : " + time.round(1);
    },
    
    oncircleclick: function() {
        app.score += 100;
        this.circle.fillStyle = "hsla({0}, 75%, 50%, 0.75)".format(Math.rand(0, 360));
        this.circle.setPosition(tm.util.Random.randint(40, SCREEN_WIDTH-40), tm.util.Random.randint(40, SCREEN_HEIGHT-40));
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
        
        this.score = tm.app.Label("Start");
        this.score.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
        this.score.fontSize = 60;
        this.score.width = 320;
        this.score.color = "white";
        this.score.align = "center";
        this.score.baseline = "middle";
        this.score.addChildTo(this);
        
        
        //this.addChild( tm.fade.FadeIn(SCREEN_WIDTH, SCREEN_HEIGHT, "#000", 1000) );
        
        this.alpha = 0.0;
        this.tweener.fadeIn(2000);
    },
    
    onpointingstart: function() {
        tm.sound.SoundManager.get("decide").play();
        
        this.tweener.clear();
        this.tweener.fadeOut(1000).call(function() {
            app.replaceScene(MainScene());
        });
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
        
        var label = null;
        label = tm.app.Label("Score");
        label.position.set(SCREEN_WIDTH/2, 300);
        label.fontSize = 60;
        label.width = 320;
        label.color = "white";
        label.align = "center";
        label.addChildTo(this);
        
        label = tm.app.Label(app.score+"");
        label.position.set(SCREEN_WIDTH/2, 390);
        label.fontSize = 60;
        label.width = 320;
        label.color = "white";
        label.align = "center";
        label.addChildTo(this);
        
        /*
        var tweetButton = tm.twitter.TweetButton("test");
        tweetButton.setPosition(SCREEN_WIDTH/2, 470);
        tweetButton.addChildTo(this);
        */
        
        this.alpha = 0.0;
        this.tweener.fadeIn(500).call(function() {
            this.onpointingstart = this._onpointingstart;
        }.bind(this));

    },
    
    _onpointingstart: function() {
        tm.sound.SoundManager.get("decide").play();
        
        this.tweener.clear();
        this.tweener.fadeOut(1000).call(function() {
            app.replaceScene(StartScene());
        });
    },
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});

var PauseScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        var filter = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT);
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
    tm.sound.SoundManager.add("main_bgm", "http://storage.tmlife.net/resource/bgm/maoudamashii/bgm_maoudamashii_healing02.wav", 1);
    tm.sound.SoundManager.add("touch", "touch");
    tm.sound.SoundManager.add("decide", "decide");
});

tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fitWindow();
    // app.enableStats();
    
    tm.sound.SoundManager.get("main_bgm").play();
    
    var startScene = StartScene();
    app.replaceScene(startScene);
    
    app.run();
});





