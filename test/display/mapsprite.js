/*
 * test
 */

tm.define("tests.mapsprite.DemoScene00", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        var loader = tm.asset.Loader();
        loader.load("sample", "../resource/tmx/testmap.tmx");
        var mapSheet = loader.get("sample");
        mapSheet.onload = function() {
            this.map = tm.display.MapSprite("sample", 32, 32).addChildTo(this);
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
        
        var mapSheet = tm.asset.MapSheet({
            tilewidth: 32,
            tileheight: 32,
            width: 10,
            height: 10,

            tilesets: [
                {
                    image: "../resource/tmx/mapImage.png"
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
            this.map = tm.display.MapSprite(mapSheet, 32, 32).addChildTo(this);
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
        var canvasElement = tm.display.CanvasElement().addChildTo(this);
        
        var mapSheet = tm.asset.MapSheet("../resource/tmx/testmap.tmx");
        mapSheet.onload = function() {
            canvasElement.load(mapSheet);
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
        
        var loader = tm.asset.Loader();
        loader.load("sample", "../resource/tmx/testmap.tmx");
        var mapSheet = loader.get("sample");
        mapSheet.onload = function() {
            this.map = tm.display.MapSprite("sample", 32, 32).addChildTo(this);
            this.update = this._move;
        }.bind(this);


        var charaTexture = tm.asset.Texture("../resource/img/chara.png");

        var ss = tm.asset.SpriteSheet({
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
                var player = tm.display.AnimationSprite(ss, 32, 48).addChildTo(this.map.playerGroup);
                player.origin.set(0, 0);
                player.gotoAndPlay("forward");
                player.xIndex = 31;
                player.yIndex = 32;
                player.moveTilePos = function() {
                    var x = player.xIndex*32;
                    var y = player.yIndex*32;
                    this.tweener.clear().move(x, y, 200);
                };
                player.update = function() {
                    var targetX = player.xIndex*32;
                    var targetY = player.yIndex*32;
                    if (this.x < targetX) this.x+=4;
                    else if (this.x > targetX) this.x-=4;
                    if (this.y < targetY) this.y+=4;
                    else if (this.y > targetY) this.y-=4;

                    if (this.x == targetX && this.y == targetY) {
                        this.isMoving = false;
                    }
                    else {
                        this.isMoving = true;
                    }
                };
                player.moveTilePos();
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

            if (this.player.isMoving == false) {
                if (k.getKey("left")) {
                    this.player.xIndex -= 1;
                }
                else if (k.getKey("right")) {
                    this.player.xIndex += 1;
                }
                if (k.getKey("up")) {
                    this.player.yIndex -= 1;
                }
                else if (k.getKey("down")) {
                    this.player.yIndex += 1;
                }
            }
        }

        if (this.map && this.player) {
            this.map.x = - (this.player.x - 32*10);
            if (this.map.x > 0) this.map.x = 0;
            var right = -32*(34-20);
            if (this.map.x < right) this.map.x = right;
            // if (this.player.x > 32*10 && this.player.x < 32*24) {
            //     console.log(this.map.x);
            // }
            if (this.player.y > 32*7 && this.player.y < 32*27) {
                this.map.y = - (this.player.y - 32*7);
            }
        }

    },
});

tm.define("tests.mapsprite.DemoScene04", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        var mapSheet = tm.asset.MapSheet({
            tilewidth: 32,
            tileheight: 32,

            width: 5,
            height: 10,

            tilesets: [
                {
                    name: 'pink',
                    image: '../resource/img/tilesets/pink.png'
                },
                {
                    name: 'blue',
                    image: '../resource/img/tilesets/blue.png'
                }
            ],

            layers: [
                {
                    tilesets: ['blue','pink'],
                    data: [
                         0, 1, 0, 4, 5,
                         2, 3, 0, 6, 7,
                         0, 0,-1, 0, 0,
                         0, 0, 0, 0, 0,
                         0, 0, 0, 0, 0,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1
                    ]
                },
                {
                    tilesets: ['pink','blue'],
                    data: [
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                         0, 1, 0, 4, 5,
                         2, 3, 0, 6, 7,
                         0, 0,-1, 0, 0,
                         0, 0, 0, 0, 0,
                         0, 0, 0, 0, 0
                    ]
                },
                {
                    tilesets: 'blue',
                    data: [
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,

                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1,-1,-1,-1,
                        -1,-1, 0,-1,-1,
                    ]
                }
            ]
        });
        mapSheet.onload = function() {
            this.map = tm.display.MapSprite(mapSheet, 32, 32).addChildTo(this);
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
