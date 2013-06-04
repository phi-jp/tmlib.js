/*
 * phi
 */


var app = null;

// 定数
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 720;
var MOGURA_SIZE     = 50;
var TIME            = 30;


var Mogura = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function() {
        this.superInit();
        this.radius     = MOGURA_SIZE;
        
        this.moguraPos = 50;
        
        this.update = this.wait;
        
        this.setInteractive(true);
        this.setBoundingType("circle");
    },
    
    appear: function() {
        if (this.moguraPos > 0) {
            this.moguraPos -= 1;
        }
        else {
            this.update = this.hide;
        }
    },
    
    hide: function() {
        if (this.moguraPos < 50) {
            this.moguraPos += 1;
        }
        else {
            this.update = this.wait;
        }
    },
    
    damage: function() {
        if (this.moguraPos < 50) {
            this.moguraPos += 1;
        }
        else {
            this.update = this.wait;
        }
    },
    
    wait: function() {
        if (tm.util.Random.randint(0, 100) === 0) {
            this.update = this.appear;
            this.setInteractive(true);
        }
    },
    
    update: function() {
    },

    
    draw: function(c) {
        c.save();
        c.scale(1, 0.2);
        c.fillStyle = "white";
        c.fillCircle(0, 0, this.radius);
        c.restore();
        

        c.save();
        c.beginPath();
        c.rect(-this.radius, -this.radius, this.radius*2, this.radius + this.radius*0.2);
        c.clip();
        
        c.fillStyle = "brown";
        c.fillCircle(0, this.moguraPos, this.radius*0.6);
        c.fillRect(-this.radius*0.6, this.moguraPos, this.radius*2*0.6, this.radius);
        c.restore();
    },
    
    onpointingstart: function() {
        var se = tm.sound.SoundManager.get("touch");
        se.volume = 0.5;
        se.play();
        this.update = this.damage;
        this.setInteractive(true);
    },
    
    isAppear: function() {
        return this.update === this.appear || this.update === this.hide;
    },    
    
    // isHitPoint: function(x, y) {
        // var o = {x:x, y:y};
        // var d = tm.geom.Vector2.distanceSquared(this, o);
        // return d <= Math.pow(this.radius, 2);
    // }
});

var CrashEffect = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function() {
        this.superInit(100, 100);
        this.scaleY = 0.5;
        
        this.canvas.fillStyle = "yellow";
        this.canvas.fillStar(this.width/2, this.height/2, this.radius, 10);
    },
    
    update: function() {
        this.alpha -= 0.025;
        if (this.alpha < 0) {
            this.remove();
        }
    },
});


var MainScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        this.color      = color;
        this.blendMode  = "lighter";
        
        for (var i=0; i<3; ++i) {
            for (var j=0; j<3; ++j) {
                var mogura = Mogura();
                var x = j*140 + 100;
                var y = i*140 + 200;
                mogura.position.set(x, y);
                mogura.addEventListener("pointingstart", function(e) {
                    // if (e.target.isAppear() === false) return ;
                    
                    this.dispatchEvent(tm.event.Event("circleclick"));
                    
                    var crash = CrashEffect();
                    crash.x = e.target.x;
                    crash.y = e.target.y;
                    this.addChild(crash);
                }.bind(this));
                this.addChild(mogura);
            }
        }
        
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
    },
    
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});

var StartScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        this.score = tm.app.Label("Start");
        this.score.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
        this.score.fontSize = 60;
        this.score.width = 320;
        this.score.color = "white";
        this.score.align = "center";
        this.score.baseline = "middle";
        this.score.addChildTo(this);
        
        
        //this.addChild( tm.fade.FadeIn(SCREEN_WIDTH, SCREEN_HEIGHT, "#000", 1000) );
        
        var shape = tm.app.RectangleShape(SCREEN_WIDTH, SCREEN_HEIGHT, {
            fillStyle: "white"
        }).addChildTo(this);
        shape.blendMode = "lighter";
        shape.originX = shape.originY = 0;
        shape.tweener
            .fadeOut(2000)
            .call(function() {
                this.remove();
            }.bind(shape));
    },
    
    onpointingstart: function() {
        tm.sound.SoundManager.get("decide").play();
        
        this.onpointingstart = null;
        
        var shape = tm.app.RectangleShape(SCREEN_WIDTH, SCREEN_HEIGHT, {
            fillStyle: "white"
        }).addChildTo(this);
        shape.blendMode = "lighter";
        shape.originX = shape.originY = 0;
        shape.alpha = 0;
        shape.tweener
            .fadeIn(1000)
            .call(function() {
                app.replaceScene(MainScene());
            }.bind(shape));

    },
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});


var EndScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
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
        tweetButton.setBoundingType("rect");
        tweetButton.addChildTo(this);
        */
        
        var shape = tm.app.RectangleShape(SCREEN_WIDTH, SCREEN_HEIGHT, {
            fillStyle: "white"
        }).addChildTo(this);
        shape.blendMode = "lighter";
        shape.originX = shape.originY = 0;
        shape.tweener
            .fadeOut(2000)
            .call(function() {
                shape.remove();
                this.onpointingstart = this._onpointingstart;
            }.bind(this));
    },
    
    _onpointingstart: function() {
        tm.sound.SoundManager.get("decide").play();

        var shape = tm.app.RectangleShape(SCREEN_WIDTH, SCREEN_HEIGHT, {
            fillStyle: "white"
        }).addChildTo(this);
        shape.blendMode = "lighter";
        shape.originX = shape.originY = 0;
        shape.alpha = 0;
        shape.tweener
            .fadeIn(1000)
            .call(function() {
                app.replaceScene(StartScene());
            }.bind(this));


        
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
    tm.sound.SoundManager.add("main_bgm", "http://storage.tmlife.net/resource/bgm/maoudamashii/game_maoudamashii_4_field04", 1);
    tm.sound.SoundManager.add("touch", "touch");
    tm.sound.SoundManager.add("decide", "decide");
});

tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fitWindow();
    // app.enableStats();
    
    var bgm = tm.sound.SoundManager.get("main_bgm");
    bgm.loop = true;
    bgm.play();
    
    var startScene = StartScene();
    app.replaceScene(startScene);
    
    app.run();
});





