


// エレメントとして動作
tm.define("tests.tweener.test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit({});

        var star = tm.display.StarShape().addChildTo(this);
        star.setPosition(100, 100);

        star.tweener
            .to({
                scaleX: 2,
                scaleY: 2
            })
            .to({
                scaleX: 1,
                scaleY: 1
            })
            ;

        tm.app.Tweener(star).to({
            x: 200,
            y: 200,
            rotation: 360
        }).call(function() {
            this.remove();
        }).addChildTo(this);
    },
});


tm.define("tests.tweener.to", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var star = tm.display.StarShape().addChildTo(this);
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


tm.define("tests.tweener.by", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var star = tm.display.StarShape().addChildTo(this);
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

tm.define("tests.tweener.call", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        var star = tm.display.StarShape().addChildTo(this);
        star.blendMode = "lighter";

        star.setPosition(100, 200);
        star.alpha = 0.0;

        star.tweener
            .by({x:100, y:100, alpha:1.0}, 500)
            // .by({x:-150, y:-300, scaleX:-2, scaleY:-2}, 1000)
            // .by({x:200, y:100, scaleX:2, scaleY:2, rotation:Math.rand(0, 360)}, 1500)
            .call(function(a) {
                console.log(this);
            }, this)
            ;
    },
});

tm.define("tests.tweener.fade", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var star = tm.display.StarShape().addChildTo(this);
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




tm.define("tests.tweener.from", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        var star = tm.display.StarShape().addChildTo(this);
        star.x = 200;
        star.y = 200;

        star.tweener.from({
            x: -100,
            rotation: 45,
        });
    },
});



tm.define("tests.tweener.demo", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        for (var i=0; i<18; ++i) {
            var star = tm.display.Shape().addChildTo(this);
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

tm.define("tests.tweener.demo2", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        for (var i=0; i<32; ++i) {
            var star = tm.display.Shape().addChildTo(this);
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




tm.define("tests.tweener.demo3", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var shape = tm.display.StarShape().addChildTo(this);
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



tm.define("tests.tweener.demo4", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var circleCount = 25;

        for (var i=0; i<circleCount; ++i) {
            var circle = tm.display.CircleShape((i+1)*4, (i+1)*4).addChildTo(this);
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



tm.define("tests.tweener.demo5", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        var group = tm.display.CanvasElement().addChildTo(this);
        group.setPosition(SCREEN_WIDTH/2, SCREEN_HEIGHT/2)

        for (var i=0; i<64; ++i) {
            var star = tm.display.Shape().addChildTo(group);
            var color = "hsl({0}, 75%, 50%)".format(Math.rand(0, 360));
            star.x = Math.rand(-SCREEN_WIDTH/2, SCREEN_WIDTH/2);
            star.y = Math.rand(-SCREEN_HEIGHT/2, SCREEN_HEIGHT/2);
            star.blendMode = "lighter";

            star.renderStar({
                fillStyle: color,
            });

            star.tweener
                .set({x:star.x, y:star.y, alpha:0, rotation:0})
                .wait(i*50)
                .fadeIn(1000)
                .moveBy(Math.rand(-400, 400), Math.rand(-400, 400), 500)
                .rotate(360, 500)
                .moveBy(Math.rand(-400, 400), Math.rand(-400, 400), 500)
                .fadeOut(1000)
                .setLoop(true);
        }

        group.tweener
            .set({scaleX:0, scaleY:0})
            .to({scaleX:1, scaleY:1, rotation:360}, 2000, "easeInOutCubic")
            .wait(1000)
            .scale(0, 1000, "easeInOutBounce")
            .wait(100)
            .scale(1, 1000, "easeInOutBounce");
    },
});




tm.define("tests.tweener.demo6", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        // フェードアウト
        if (p.getPointingStart()) {
            var fadeout = tm.display.Shape(app.width, app.height).addChildTo(this);
            fadeout.originX = fadeout.originY = 0;
            fadeout.canvas.clearColor("white");
            fadeout.alpha = 0.0;

            /*
            var anim = tm.app.Animation(fadeout);
            anim.fadeIn(1500);
            anim.onanimationend = function() { this.getTarget().remove(); };
            */

            fadeout.tweener.fadeIn(1500).call(function() {
                fadeout.remove()
            });
        }
    }
});


tm.define("tests.tweener.DemoScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var circle = tm.display.CircleShape();
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
























