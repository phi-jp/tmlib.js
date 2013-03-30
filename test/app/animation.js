
tm.define("TestScene", {
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
		        this.animation.addTween({
		            prop: "x",
		            begin: this.startX,
		            finish: this.startX + 300,
		            duration: 1000,
		        });
		        this.x = this.startX;
		        
		        this.animation.addTween({
		            prop: "y",
		            begin: this.startY,
		            finish: this.startY + 300,
		            duration: 1000,
		            delay: 500,
		        });
		        this.y = this.startY;
		        
		        this.animation.addTween({
		            prop: "alpha",
		            begin: 1,
		            finish: 0,
		            duration: 1000,
		        });
		        
		        this.animation.addTween({
		            prop: "scaleX",
		            begin: 1,
		            finish: 2,
		            duration: 1000,
		        });
		        
		        this.animation.addTween({
		            prop: "scaleY",
		            begin: 1,
		            finish: 2,
		            duration: 1000,
		        });
            };
            circle.startAnim();

            circle.onanimationend = function() {
                this.startAnim();
            };

        }
	}
});


tm.define("FadeScene", {
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
