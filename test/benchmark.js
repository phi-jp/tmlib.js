
testhelper.describe("benchmark", function() {

    testhelper.it("bench1", function() {

        var CHILD_NUM = 10;
        var CHILD_RADIUS = 50;
        var CREATE_NUM = 100;

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();

                var loader = tm.asset.Loader();
                loader.load({
                    "piyo": "http://junk.tmlife.net/test/bench-canvas/tmlib.js/piyo.png",
                });
                loader.onload = this._init.bind(this);
            },

            _init: function() {
                (CREATE_NUM).times(function() {
                    this._create();
                }, this);
            },

            _create: function(x, y) {
                var container = tm.display.CanvasElement().addChildTo(this);
                container.x = Math.random() * SCREEN_WIDTH;
                container.vy = 5 * Math.random();
                container.vr = 5 * Math.random();
                container.update = function() {
                    this.y += this.vy;
                    this.rotation -= this.vr;

                    if (this.y > SCREEN_HEIGHT) this.y = 0;
                };

                (CHILD_NUM).times(function(i) {
                    var child = new tm.display.Sprite("piyo", 32, 32);
                    child.originX = 0.5;
                    child.originY = 0.5;
                    var rad = i / CHILD_NUM * 360;
                    child.x = CHILD_RADIUS * Math.cos(rad * Math.PI / 180);
                    child.y = CHILD_RADIUS * Math.sin(rad * Math.PI / 180);
                    child.rotation = rad;
                    child.scaleX = child.scaleY = i / CHILD_NUM + 0.5;
                    child.alpha = i / CHILD_NUM + 0.1;
                    container.addChild(child);

                    child.checkHierarchy = true;
                    child.setInteractive(true);
                    child.onpointingstart = function() {
                        this.scale.set(2, 2);
                    };
                });

            },

            onenter: function(e) {
                this.app.fps = 120;
                this.app.enableStats();
            },
        });
    });

});

