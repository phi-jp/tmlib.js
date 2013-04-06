

tm.define("tests.tweener.DemoScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var circle = tm.app.CircleShape();
            circle.blendMode = "lighter";
            circle.startX = p.x;
            circle.startY = p.y;
            circle.setPosition(p.x, p.y);
            this.addChild(circle);

            circle.startAnim = function() {

                this.x = this.startX;
                this.y = this.startY;
                this.alpha = 1.0;
                this.scaleX = this.scaleY = 1.0;

                this.tweener
                    .set("alpha", 0.0)
                    .fadeIn(500)
                    .by({"x": 100}, 500)
                    .moveBy(-100, -100, 500)
                    .fadeOut(500)
                    .wait(500)
                    .fadeIn(500)
                    .move(300, 300, 100)
                    .fadeOut(500)
                    .call(function() {
                        this.tweener._index = 0;
                    }.bind(this));
            };
            circle.startAnim();

            circle.onanimationend = function() {
                this.startAnim();
            };

        }
    }
});



tm.define("tests.tweener.ToTestScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var star = tm.app.StarShape().addChildTo(this);
            star.blendMode = "lighter";

            star.startAnim = function() {
                this.setPosition(p.x, p.y);
                this.alpha = 0.0;

                this.tweener
                    .to({x:100, y:100, alpha:1.0}, 500)
                    .to({x:150, y:300, scaleX:2, scaleY:2}, 1000)
                    .to({x:500, y:400, scaleX:1, scaleY:1, rotation:360}, 300);
            };
            star.startAnim();
        }

    }
});


tm.define("tests.tweener.ByTestScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var star = tm.app.StarShape().addChildTo(this);
            star.blendMode = "lighter";

            star.startAnim = function() {
                this.setPosition(p.x, p.y);
                this.alpha = 0.0;

                this.tweener
                    .by({x:100, y:100, alpha:1.0}, 500)
                    .by({x:-150, y:-300, scaleX:-2, scaleY:-2}, 1000)
                    .by({x:200, y:100, scaleX:2, scaleY:2, rotation:Math.rand(0, 360)}, 1500);
            };
            star.startAnim();
        }

    }
});

tm.define("tests.tweener.FadeTestScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var star = tm.app.StarShape().addChildTo(this);
            star.blendMode = "lighter";

            star.startAnim = function() {
                this.setPosition(p.x, p.y);
                this.alpha = 0.0;

                this.tweener
                    .fade(1.0, 500)
                    .fadeOut(100)
                    .fadeIn(1500);
            };
            star.startAnim();
        }
    }
});

tm.define("tests.tweener.Demo00Scene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        for (var i=0; i<18; ++i) {
            var star = tm.app.Shape().addChildTo(this);
            var color = "hsl({0}, 75%, 50%)".format(Math.rand(0, 360));
            star.x = i*40;
            star.y = 200;

            star.renderStar({
                fillStyle: color
            });

            star.tweener
                .set({x:i*40, y:200, alpha:0})
                .wait(i*100)
                .fadeIn(1000)
                .by({y:-200})
                .by({y:400})
                .fadeOut(500)
        }

        this.children.last.tweener.call(function() {
            this.children.each(function(elm) {
                elm.tweener.rewind();
            });
        }.bind(this));
    },
});

tm.define("tests.tweener.RandomMoveScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        for (var i=0; i<32; ++i) {
            var star = tm.app.Shape().addChildTo(this);
            var color = "hsl({0}, 75%, 50%)".format(Math.rand(0, 360));
            star.x = i*40;
            star.y = 200;

            star.renderStar({
                fillStyle: color,
            });

            star.tweener
                .set({x:Math.rand(0, SCREEN_WIDTH), y:Math.rand(0, SCREEN_HEIGHT), alpha:0, rotation:0})
                .wait(i*100)
                .fadeIn(1000)
                .moveBy(Math.rand(-400, 400), Math.rand(-400, 400))
                .rotate(360, 500)
                .moveBy(Math.rand(-400, 400), Math.rand(-400, 400))
                .fadeOut(1000)
                .setLoop(true);
        }
    },
});




tm.define("tests.tweener.SimpleTweenScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var shape = tm.app.StarShape().addChildTo(this);
        shape.setPosition(200, -50);

        var canvas = {
            width: 640,
            height: 480
        };

        shape.tweener.loop = true;
        shape.tweener
            .set({x:200,y:-50})
            .to({x:shape.x, y:480 - 55, rotation:-360}, 1500, "easeOutBounce")
            .wait(1000)
            .to({x:640-55, rotation:360}, 2500, "easeOutBounce")
            .wait(1000).call(function() {console.log("hoge")})
            .to({scaleX:2, scaleY:2, x:canvas.width - 110, y:canvas.height-110}, 2500, "easeOutBounce")
            .wait(1000)
            .to({scaleX:.5, scaleY:.5, x:30, rotation:-360, y:canvas.height-30}, 2500, "easeOutBounce");
    },
 
});



tm.define("tests.tweener.TweenCirclesScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var circleCount = 25;

        for (var i=0; i<circleCount; ++i) {
            var circle = tm.app.CircleShape((i+1)*4, (i+1)*4).addChildTo(this);
            circle.x = Math.random()*550;
            circle.y = Math.random()*550;
            circle.alpha = 1-i*0.02;
            circle.blendMode = "lighter";

            circle.tweener.to({x:275,y:200}, (0.5+i*0.04)*1500, "easeOutBounce");
        }
    },

    onpointingstart: function(e) {
        var p = e.app.pointing;
        var children = this.children;
        children.each(function(elm, i) {
            elm.tweener.clear();
            elm.tweener.to({x:p.x, y:p.y}, (0.5+i*0.04)*1500, "easeOutBounce");
        });
    }
 
});



























