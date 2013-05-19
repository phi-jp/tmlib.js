
tm.preload(function() {
    PLAYER_SPRITE_SHEET = tm.app.SpriteSheet({
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
    },

    onpointingstart: function(e) {
    	var p = e.app.pointing;
        var crash = tm.app.AnimationSprite(128, 128, PLAYER_SPRITE_SHEET);
        crash.position.set(p.x, p.y);
        crash.gotoAndPlay("crash");
        //crash.gotoAndStop("hoge");
        crash.blendMode = "lighter";
        this.addChild(crash);
    }
});