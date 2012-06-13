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
        this.interaction;
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
        this.interaction;
        
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
        this.addChild( tm.prim.RectSprite(SCREEN_WIDTH, SCREEN_HEIGHT, "rgba(0, 0, 0, 0.75)") );
        
        this.score = tm.app.Label("Start");
        this.score.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
        this.score.fontSize = 60;
        this.score.width = 320;
        this.score.color = "white";
        this.score.align = "center";
        this.score.baseline = "middle";
        this.score.addChildTo(this);
        
        
        //this.addChild( tm.fade.FadeIn(SCREEN_WIDTH, SCREEN_HEIGHT, "#000", 1000) );
        
        var fadein = tm.fade.FadeIn(SCREEN_WIDTH, SCREEN_HEIGHT, "#fff", 2000);
        fadein.blendMode = "lighter";
        this.addChild( fadein );
    },
    
    onpointingstart: function() {
        tm.sound.SoundManager.get("decide").play();
        
        this.addChild( tm.fade.FadeOut(
            SCREEN_WIDTH, SCREEN_HEIGHT, "#000", 1000, function() {
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
        
        var tweetButton = tm.twitter.TweetButton("test");
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
        
        var fadeout = tm.fade.FadeOut(SCREEN_WIDTH, SCREEN_HEIGHT, "#fff", 2000, function() {
            app.replaceScene(StartScene());
        });
        fadeout.blendMode = "lighter";
        this.addChild( fadeout );

        // this.addChild( tm.fade.FadeOut(
            // SCREEN_WIDTH, SCREEN_HEIGHT, "#000", 1000, function() {
                // app.replaceScene(StartScene());
            // })
        // );
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
    // tm.graphics.TextureManager.add("twitter", "https://twitter.com/images/three_circles/twitter-bird-light-bgs.png");
    tm.graphics.TextureManager.add("twitter", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGNzdGMTE3NDA3MjA2ODExOEY2MkVGMkNDRkUzNjI5OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozQTI3OTdGMEEzNzUxMUUxQTI2Q0M1MDcxNTQ1QTc1MCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozQTI3OTdFRkEzNzUxMUUxQTI2Q0M1MDcxNTQ1QTc1MCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1LjEgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Rjc3RjExNzQwNzIwNjgxMThGNjJFRjJDQ0ZFMzYyOTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Rjc3RjExNzQwNzIwNjgxMThGNjJFRjJDQ0ZFMzYyOTgiLz4gPC9yZGY6RGVzY3Jp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");
    
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





