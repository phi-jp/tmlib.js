
tm.define("tests.canvaselement.JSONLoadTestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        tm.asset.AssetManager.onload = function() {
            this.setup();
        }.bind(this);
        tm.asset.AssetManager.load("dummy", "http://dummyimage.com/128x128/0000ff/fff.png&text=dummy.png");
    },

    setup: function() {

        this.fromJSON({
            children: [
                {
                    type: "Label",
                    name: "titleLabel",
                    x   : SCREEN_CENTER_X,
                    y   : 100,
                    width: SCREEN_WIDTH,
                    height: 50,
                    text: "Title",
                    align: "center",
                    fontSize: 40,
                },
                {
                    type: "Label",
                    name: "titleLabel",
                    x   : SCREEN_CENTER_X,
                    y   : 100,
                    width: SCREEN_WIDTH,
                    height: 50,
                    text: "Title",
                    align: "center",
                    fontSize: 40,
                },
                {
                    type: "LabelButton",
                    name: "button00",
                    x   : SCREEN_CENTER_X,
                    y   : 200,
                    width: 150,
                    height: 50,
                    fillStyle: "red",
                    shadowBlur: 10,
                    shadowColor: "white",
                    text: "Item00",
                    align: "center",
                    fontSize: 20,
                },
                {
                    type: "LabelButton",
                    name: "button01",
                    x   : SCREEN_CENTER_X,
                    y   : 260,
                    width: 150,
                    height: 50,
                    fillStyle: "green",
                    shadowBlur: 10,
                    shadowColor: "white",
                    text: "Item01",
                    align: "center",
                    fontSize: 20,
                },
                {
                    type: "LabelButton",
                    name: "button02",
                    x   : SCREEN_CENTER_X,
                    y   : 320,
                    width: 150,
                    height: 50,
                    fillStyle: "blue",
                    shadowBlur: 10,
                    shadowColor: "white",
                    text: "Item02",
                    align: "center",
                    fontSize: 20,
                },
                {
                    type: "Label",
                    name: "textLabel",
                    x   : SCREEN_CENTER_X,
                    y   : 400,
                    width: SCREEN_WIDTH,
                    height: 50,
                    fillStyle: "white",
                    text: "Text Text Text Text Text Text Text Text",
                    align: "center",
                    fontSize: 15,
                },
                {
                    type: "Sprite",
                    name: "icon",
                    x   : 560,
                    y   : 400,
                    image: "dummy",
                    width: 100,
                    height: 100,
                },
            ],
        });
    },
});


tm.define("tests.canvaselement.ShapeTest", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        // json load
        this.fromJSON({
            children: [
                { type: "CircleShape", name: "circle", x: 100, y: 100 },
                { type: "TriangleShape", name: "triangle", x: 200, y: 100 },
                { type: "RectangleShape", name: "rectangle", x: 300, y: 100 },
                { type: "StarShape", name: "star", x: 400, y: 100 },
                { type: "PolygonShape", name: "polygon", x: 500, y: 100 },
                { type: "HeartShape", init: [50, 50], name: "heart", x: 300, y: 200 },
            ],
        });
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointing() == true) {
            this.circle.tweener.clear().to({x:p.x, y:p.y}, 1000, "easeInOutBounce");
            this.triangle.tweener.clear().to({x:p.x, y:p.y}, 800, "easeInOutBounce");
            this.rectangle.tweener.clear().to({x:p.x, y:p.y}, 600, "easeInOutBounce");
            this.star.tweener.clear().to({x:p.x, y:p.y}, 400, "easeInOutBounce");
            this.polygon.tweener.clear().to({x:p.x, y:p.y}, 200, "easeInOutBounce");
        };
    }

});


tm.define("tests.canvaselement.SceneTest", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var self = this;


        tm.define("TitleScene", {
            superClass: "tm.app.TitleScene",

            init: function() {
                this.superInit({
                    width: 640,
                    height: 480,
                    backgroundImage: "title-bg"
                });
            },

            onnextscene: function() {
                app.replaceScene(ResultScene());
            },
        });

        tm.define("ResultScene", {
            superClass: "tm.app.ResultScene",

            init: function() {
                this.superInit({
                    width: 640,
                    height: 480,
                    backgroundImage: "result-bg"
                });
            },

            onnextscene: function() {
                app.replaceScene(TitleScene());
            },
        });
    },

    onpointingstart: function() {
        var ASSETS = {
            "title-bg": "https://twimg0-a.akamaihd.net/profile_images/484079620/kenkyo.jpg",
            "result-bg": "https://twimg0-a.akamaihd.net/profile_images/484079620/kenkyo.jpg"
        };
        var loadingScene = tm.app.LoadingScene({
            assets: ASSETS,
            nextScene: TitleScene,
        });
        app.replaceScene(loadingScene);
    }

});




tm.define("tests.canvaselement.GaugeTestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var gauge      = tm.app.Gauge(300, 25, "white", "left").addChildTo(this).setPosition(85, 100);
	    var upButton   = tm.app.GlossyButton(100, 50, "red", "up").addChildTo(this).setPosition(SCREEN_CENTER_X-50, 350);
	    var downButton = tm.app.GlossyButton(100, 50, "blue", "down").addChildTo(this).setPosition(SCREEN_CENTER_X+50, 350);
        
        upButton.onpointingstart = function() {
            gauge.value += 10;
        };
        downButton.onpointingstart = function() {
            gauge.value -= 10;
        };
    },

});


tm.define("tests.canvaselement.GaugeTest01Scene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var gauge0 = this.gauge0 = tm.app.Gauge(200, 20).setPosition(100, 50).addChildTo(this);
        var gauge1 = tm.app.Gauge(200, 20, "green", "right").setPosition(300, 80).addChildTo(this);
        var gauge2 = tm.app.Gauge(20, 200, "blue", "up").setPosition(20, 220).addChildTo(this);
        var gauge3 = tm.app.Gauge(20, 200, "white", "down").setPosition(50, 20).addChildTo(this);

        var updateGauge = function() {
            this.percent += this.v;
            if (this.isEmpty()) {
                this.v = 1;
            }
            if (this.isFull()) {
                this.v = -1;
            }
        }

        gauge0.v = -1; gauge0.update = updateGauge;
        gauge1.v = -1; gauge1.update = updateGauge;
        gauge2.v = -1; gauge2.update = updateGauge;
        gauge3.v = -1; gauge3.update = updateGauge;
    },

});

tm.define("tests.canvaselement.GaugeTest02Scene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var gauge = tm.app.Gauge(200, 20, "red", "left").setPosition(100, 50).addChildTo(this);
        gauge.v = 1;

//                    gauge.setValue(10);
//                    gauge.setRatio(0.5);
        gauge.update = function() {
            this.percent += this.v;
            if (this.isEmpty()) {
                this.v = 1;
            }
            if (this.isFull()) {
                this.v = -1;
            }
        }
    },

});

tm.define("tests.Scene.ResultTest", {
    superClass: "tm.app.ResultScene",
 
    init: function() {
        this.superInit({

        });
    },

    onnextscene: function() {
        this.app.replaceScene(tm.app.Scene());
    }

});


tm.define("tests.sprite.DemoScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var texture = tm.asset.Texture("http://dummyimage.com/128x128/0000ff/fff.png&text=dummy");
        tm.asset.AssetManager.set("dummy", texture);
        
        texture.onload = function() {
            var sprite = tm.app.Sprite("dummy", 150, 50).addChildTo(this);
            sprite.x = 200; sprite.y = 100;
            
            var sprite = tm.app.Sprite("dummy").addChildTo(this);
            sprite.x = 200; sprite.y = 300;
        }.bind(this);
    },

});



tm.define("tests.label.DemoScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var label = tm.app.Label("hoge").addChildTo(this);
        label.x = 100; label.y = 100;

        var label = tm.app.Label("hoge\nBBBB").addChildTo(this);
        label.x = 350; label.y = 100;

        var label = tm.app.Label("hogehogehogehoge").addChildTo(this);
        label.x = 100; label.y = 140;

        var label = tm.app.Label("hogehogehogehoge\nbbbbb").addChildTo(this);
        label.x = 100; label.y = 180;
        label.maxWidth = 100;

        var label = tm.app.Label("ABCDEFG").addChildTo(this);
        label.x = 100; label.y = 260;
        label.fontFamily = "'Helvetica Neue'";

        var label = tm.app.Label("ABCDEFG").addChildTo(this);
        label.x = 300; label.y = 260;
        label.fontFamily = "'Helvetica Neue'";
        label.fontWeight = "bold"
    },

});


