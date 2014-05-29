/*
 * phi
 */


var app = null;
var bgm = null;

// 定数
var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 960;
var CIRCLE_RADIUS   = 30;
var TIME            = 10;


tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fitWindow();
    // app.enableStats();
    
    bgm = tm.sound.Sound("http://storage.tmlife.net/resource/bgm/maoudamashii/bgm_maoudamashii_healing02.wav");
    bgm.onload = function() {
        bgm.play();
    };
    
    var scene = MainScene();
    app.replaceScene(scene);
    
    app.run();

    app.onblur = function() {
        this.pushScene(PauseScene());
    };
});



tm.define("MainScene", {
    superClass: "tm.scene.ManagerScene",
 
    init: function() {
        this.superInit({
            scenes: [
                {
                    className: "tm.app.LoadingScene",
                    arguments: {
                        assets: {
                            touch: "touch.wav",
                            decide: "decide.wav",
                        }
                    },
                    label: "loading",
                },
                {
                    className: "tm.scene.TitleScene",
                    arguments: {
                        title: "Circle Touch",
                        titleColor: "#ccc",
                        bgColor: "black",
                    },
                    label: "title",
                },
                {
                    className: "GameScene",
                    arguments: {
                    },
                    label: "game",
                },
                {
                    className: "tm.scene.ResultScene",
                    arguments: {
                        name: "Result",
                    },
                    label: "result",
                    nextLabel: "title",
                },
            ],
        });
    },

    onprepare: function() {
        if (this.getCurrentLabel() == "game") {
            this.setSceneArgument("result", "score", app.score);
        }
    },

    ongoto: function() {
        if (this.getCurrentLabel() == "loading") {
            this.currentScene.onload = function() {
                this.app.popScene();
            }.bind(this);
        }
    },

    // onstart: function() {
    //     this.gotoScene("result");
    // },
});


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
        tm.asset.Manager.get("touch").clone().play();
    },

    disappear: function() {
        this.setInteractive(false);
        tm.app.Tweener(this).addChildTo(this)
            .to({
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
            }, 200)
            .call(function() {
                this.element.remove();
                this.remove();
            });
    },
    
    onmouseover: function() {
        this.alpha = 1.0;
    },
    
    onmouseout: function() {
        this.alpha = 0.75;
    },
});


tm.define("GameScene", {
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();

        this.radius     = CIRCLE_RADIUS;
        this.color      = color;
        this.blendMode  = "lighter";
        
        
        this.timer = tm.app.Label("abc");
        this.timer.position.set(320, 70);
        this.timer.width = 200;
        this.timer.color = "white";
        this.timer.addChildTo(this);
        
        app.frame = 0;
        app.score = 0;

        this.createCircle();
    },

    createCircle: function() {
        var circle = circle = Circle( "hsla({0}, 75%, 50%, 0.75)".format(Math.rand(0, 360)) );
        circle.setPosition(tm.util.Random.randint(40, SCREEN_WIDTH-40), tm.util.Random.randint(40, SCREEN_HEIGHT-40));
        circle.addChildTo(this);
        circle.on("pointingstart", function() {
            this.fire(tm.event.Event("circleclick"));
            circle.disappear();
        }.bind(this));
    },

    update: function() {
        var time = TIME - (app.frame / app.fps);
        if (time <= 0) {
            time = 0;
            app.popScene();
        }
        
        this.timer.text = "Time : " + time.round(1);
    },
    
    oncircleclick: function() {
        app.score += 100;
        this.createCircle();
    },

});



// tm.define("ResultScene", {
//     superClass: tm.scene.ResultScene,
    
//     init: function() {
//         this.superInit({
//             score: app.score,
//         });
//     },
// });


tm.define("PauseScene", {
    superClass: tm.app.Scene,
    
    init: function() {
        this.superInit();
        
        var filter = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT);
        filter.setPosition(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
        filter.canvas.clearColor("rgba(0, 0, 0, 0.75)");
        this.addChild(filter);
        
        app.stop();
        bgm.pause();
    },

    onfocus: function() {
        app.start();
    },
    
    onpointingstart: function() {
        bgm.play();
        app.popScene();
    },
    
});


