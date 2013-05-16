/*
 * test
 */

tm.define("tests.mapsprite.DemoScene00", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        var mapSheet = tm.app.MapSheet("../../resource/tmx/testmap.tmx");
        mapSheet.onload = function() {
            this.map = tm.app.MapSprite(32, 32, mapSheet).addChildTo(this);
            this.update = this._move;
        }.bind(this);

        this.vx = 0;
        this.vy = 0;
    },

    _move: function(app) {
        var p = app.pointing;

        if (p.getPointing()) {
            this.vx = p.deltaPosition.x;
            this.vy = p.deltaPosition.y;
            this.map.x += this.vx;
            this.map.y += this.vy;
        }
        else {
            this.map.x += (this.vx*=0.8);
            this.map.y += (this.vy*=0.8);
        }
    },
});

tm.define("tests.mapsprite.DemoScene01", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        var mapSheet = tm.app.MapSheet({
            tilewidth: 32,
            tileheight: 32,
            width: 10,
            height: 10,

            tilesets: [
                {
                    image: "../../resource/tmx/mapImage.png"
                }
            ],

            layers: [
                {
                    data: [
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                        6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
                    ]
                },
                {
                    data: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 84, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 100, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 84, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 100, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 84, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 100, 0, 0,
                    ]
                },
            ]
        });
        mapSheet.onload = function() {
            this.map = tm.app.MapSprite(32, 32, mapSheet).addChildTo(this);
            this.update = this._move;
        }.bind(this);

        this.vx = 0;
        this.vy = 0;
    },

    _move: function(app) {
        var p = app.pointing;

        if (p.getPointing()) {
            this.vx = p.deltaPosition.x;
            this.vy = p.deltaPosition.y;
            this.map.x += this.vx;
            this.map.y += this.vy;
        }
        else {
            this.map.x += (this.vx*=0.8);
            this.map.y += (this.vy*=0.8);
        }
    },
});


tm.define("tests.mapsprite.DemoScene02", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        var mapSheet = tm.app.MapSheet("../../resource/tmx/testmap.tmx");
        mapSheet.onload = function() {
            this.load(mapSheet);
        }.bind(this);
    },

    update: function(app) {
        return ;
        var p = app.pointing;

        if (p.getPointing()) {
            this.vx = p.deltaPosition.x;
            this.vy = p.deltaPosition.y;
            this.map.x += this.vx;
            this.map.y += this.vy;
        }
        else {
            this.map.x += (this.vx*=0.8);
            this.map.y += (this.vy*=0.8);
        }
    },
});



tm.define("tests.mapsprite.DemoScene03", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        var mapSheet = tm.app.MapSheet("../../resource/tmx/testmap.tmx");
        mapSheet.onload = function() {
            this.map = tm.app.MapSprite(32, 32, mapSheet).addChildTo(this);
            this.update = this._move;
        }.bind(this);

        var charaTexture = tm.graphics.Texture("../../resource/img/chara.png");

        var ss = tm.app.SpriteSheet({
            image: charaTexture,
            frame: {
                width: 32,
                height: 48,
                count: 120
            },
            animations: {
                "forward": [0, 3, "forward2", 4],
                "forward2": [2, -1, "forward", 4],
                "backward": [0, 3, "backward"],
                "left": [0, 3, "left"],
                "right": [0, 3, "right"],
            }
        });

        ss.onload = function() {
            setTimeout(function() {
                var player = tm.app.AnimationSprite(32, 48, ss).addChildTo(this);
                player.origin.set(0, 0);
                player.setPosition(32, 32);
                player.gotoAndPlay("forward");
                this.player = player;
            }.bind(this), 100);
        }.bind(this);

        this.vx = 0;
        this.vy = 0;
    },

    _move: function(app) {
        var p = app.pointing;

        if (this.player) {
            var k = app.keyboard;

            if (k.getKeyDown("left")) {
                this.player.tweener.clear().moveBy(-32, 0, 200);
            }
            else if (k.getKeyDown("right")) {
                this.player.tweener.clear().moveBy(32, 0, 200);
            }
            if (k.getKeyDown("up")) {
                this.player.tweener.clear().moveBy(0, -32, 200);
            }
            else if (k.getKeyDown("down")) {
                this.player.tweener.clear().moveBy(0, 32, 200);
            }


        }
    },
});