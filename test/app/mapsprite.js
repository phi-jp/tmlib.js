/*
 * test
 */

tm.define("tests.mapsprite.DemoScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        var mapSheet = tm.app.MapSheet("../../resource/tmx/testmap.tmx");
        mapSheet.onload = function() {
            tm.app.MapSprite(32, 32, mapSheet).addChildTo(this);
        }.bind(this);

        this.vx = 0;
        this.vy = 0;
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


tm.define("tests.mapsprite.DemoScene2", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        var mapSheet = tm.app.MapSheet("hoge.tmx");
        
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