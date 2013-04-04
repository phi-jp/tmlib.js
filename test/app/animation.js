
tm.define("tests.animation.DemoScene", {
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

                this.animation
                    .by("x", 300, 1000)
                    .by("y", 300, 1000, 500)
                    .fadeOut(1000, 500)
                    .scale(2, 1000, 500);
            };
            circle.startAnim();

            circle.onanimationend = function() {
                this.startAnim();
            };

        }
    }
});


tm.define("tests.animation.FadeScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
    },

    update: function(app) {
        var p = app.pointing;
        // フェードアウト
        if (p.getPointingStart()) {
            var fadeout = tm.app.Shape(app.width, app.height).addChildTo(this);
            fadeout.originX = fadeout.originY = 0;
            fadeout.canvas.clearColor("white");
            fadeout.alpha = 0.0;

            /*
            var anim = tm.app.Animation(fadeout);
            anim.fadeIn(1500);
            anim.onanimationend = function() { this.getTarget().remove(); };
            */

            fadeout.animation.fadeIn(1500);
            fadeout.onanimationend = function() {
                this.remove();
            };
        }
    }
});

