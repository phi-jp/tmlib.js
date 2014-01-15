
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

        var loader = tm.asset.Loader();
        loader.load("crash", "../../resource/tmss/crash.tmss");
    },

    onpointingstart: function(e) {
    	var p = e.app.pointing;
        var crash = tm.display.AnimationSprite("crash", 128, 128);
        crash.position.set(p.x, p.y);
        crash.gotoAndPlay("crash");
        // crash.gotoAndPlay("hoge");
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
        var crash = tm.display.AnimationSprite(this.ss, 128, 128);
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
        
        var loader = tm.asset.Loader();
        loader.load({
            "hiyocos": "../../resource/img/hiyocos.png",
            "hiyocosSS": "../../resource/tmss/hiyocos.tmss"
        });
    },

    onpointingstart: function(e) {
        var p = e.app.pointing;
        var crash = tm.display.AnimationSprite("hiyocosSS", 64, 64);
        crash.position.set(p.x, p.y);
        crash.gotoAndPlay("appear");
        crash.blendMode = "lighter";
        this.addChild(crash);
    }
});





