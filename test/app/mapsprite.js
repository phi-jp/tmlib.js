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