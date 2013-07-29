
tm.preload(function() {
    PLAYER_SPRITE_SHEET = tm.asset.SpriteSheet({
        image: "../../resource/img/crash/01.png",
        frame: {
            width: 64,
            height: 64,
            count: 64
        },
        animations: {
            "crash": [0, 32, "crash"],
            "hoge": [32, 0, "crash", 5],
        }
    });
});

tm.define("tests.animationsprite.DemoScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        var as = tm.asset.AssetManager;
        as.load("crash", "../../resource/tmss/crash.tmss");
    },

    onpointingstart: function(e) {
    	var p = e.app.pointing;
        var crash = tm.app.AnimationSprite("crash", 128, 128);
        crash.position.set(p.x, p.y);
        // crash.gotoAndPlay("crash");
        crash.gotoAndPlay("hoge");
        crash.blendMode = "lighter";
        this.addChild(crash);
    }
});



tm.define("tests.animationsprite.DemoScene2", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        this.ss = tm.asset.SpriteSheet({
            "image": "../../resource/img/crash/01.png",
            "frame": {
                "width": 64,
                "height": 64,
                "count": 64
            },
            "animations": {
                "crash": {
                    frames: [1, 3, 5, 1, 3, 5],
                    next: "crash",
                    frequency: 1,
                },
            }
        });
    },

    onpointingstart: function(e) {
        var p = e.app.pointing;
        console.dir(this.ss);
        var crash = tm.app.AnimationSprite(this.ss, 128, 128);
        crash.position.set(p.x, p.y);
        crash.gotoAndPlay("crash");
        crash.blendMode = "lighter";
        this.addChild(crash);
    }
});



tm.define("tests.animationsprite.hiyocos", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        var as = tm.asset.AssetManager;
        as.load("hiyocos", "../../resource/img/hiyocos.png");
        as.load("hiyocosSS", "../../resource/tmss/hiyocos.tmss");
    },

    onpointingstart: function(e) {
        var p = e.app.pointing;
        var crash = tm.app.AnimationSprite("hiyocosSS", 64, 64);
        crash.position.set(p.x, p.y);
        crash.gotoAndPlay("appear");
        crash.blendMode = "lighter";
        this.addChild(crash);
    }
});






tm.define("tests.benchmark.CrashScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        app.fps = 60;
        app.enableStats();
        app.stats.domElement.style.zIndex = 1100;

        var as = tm.asset.AssetManager;
        as.load("sample", "../../resource/tmss/crash.tmss");

        as.onload = function() {
            for (var i=0; i<512; ++i) {
                var crash = tm.app.AnimationSprite(PLAYER_SPRITE_SHEET, 128, 128).addChildTo(this);
                var x = tm.util.Random.randint(0, SCREEN_WIDTH);
                var y = tm.util.Random.randint(0, SCREEN_HEIGHT);
                crash.position.set(x, y);
                crash.blendMode = "lighter";
                crash.timeline.call(function() {
                    this.gotoAndPlay("crash");
                }.bind(crash), i*50);
            }
        }.bind(this);

    },

    onpointingstart: function(e) {
        var p = e.app.pointing;

    }
});