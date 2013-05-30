tm.define("tests.timeline.DemoScene", {
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
                this.alpha = 0.5;
                this.scaleX = this.scaleY = 1.0;
                this.timeline
                    .to({x: 200, "y": 400}, 1000, 200)
                    .to({"alpha": 1.0}, 1000, 0)
                    .call(function() {
                        console.log("finish");
                    }, 1500);
            };
            circle.startAnim();
 
            circle.onanimationend = function() {
                this.startAnim();
            };
 
        }
    }
});
 
tm.define("tests.timeline.ToTestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var shape = tm.app.StarShape().addChildTo(this);
        shape.setPosition(100, 100);
        
        shape.timeline
            .to({x:500}, 1000, 0)
            .to({y:400}, 1000, 1000)
            .to({alpha:0}, 1000, 2000);
    },
});
 
tm.define("tests.timeline.CallTestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var shape = tm.app.StarShape().addChildTo(this);
        shape.setPosition(100, 100);
        
        shape.timeline
            .to({x:500}, 1000, 0)
            .to({y:400}, 1000, 1000)
            .to({alpha:0}, 1000, 2000)
            .call(function() {
                alert("finish")
            }, 500);
    },
});


tm.define("tests.timeline.SetTestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var shape = tm.app.StarShape().addChildTo(this);
        shape.setPosition(100, 100);
        
        shape.timeline
            .to({x:500}, 1000, 0)
            .to({y:400}, 1000, 1000)
            .to({alpha:0}, 1000, 2000)
            .set({
            	x: 100,
            	y: 100,
            	alpha: 1.0,
            }, 3000);
    },
});
 
tm.define("tests.timeline.ConcentrationScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
    },
 
    update: function(app) {
        var p = app.pointing;
        
        if (this.children.length < 36 && app.frame%4 == 0) {
            var color = "hsla({0}, 75%, 50%, 0.5)".format(Math.rand(0, 360));
            var circle = tm.app.CircleShape(128, 128, {
                fillStyle: color,
            });
            circle.blendMode = "lighter";
            var rad = Math.degToRad(Math.rand(0, 360));
            circle.x = Math.cos(rad)*300 + app.width/2  + Math.rand(-50, 50);
            circle.y = Math.sin(rad)*300 + app.height/2 + Math.rand(-50, 50);
            this.addChild(circle);
 
            circle.startAnim = function() {
                
                this.alpha = 0;
                this.scaleX = 0.2;
                this.scaleY = 0.2;
                this.timeline
                    .set({alpha:0, scaleX:0.2, scaleY:0.2}, 0)
                    .to({"alpha": 1.0}, 1000, 0)
                    .to({x: app.width/2, "y": app.height/2}, 500, 1000)
                    .to({scaleX: 1, scaleY: 1}, 500, 1000)
                    .call(function() {
                        console.log("finish");
                    }, 2000);
                
            };
            circle.startAnim();
 
            circle.onanimationend = function() {
                this.startAnim();
            };
 
        }
    }
});


tm.define("tests.timeline.Demo22Scene", {
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

                this.timeline
                    .by({x:300}, 1000)
                    .by({y:300}, 1000, 500)
                    .to({alpha:0.0}, 1000, 500)
                    .to({scaleX:2, scaleY:2}, 1000, 500)
            };
            circle.startAnim();

            circle.onanimationend = function() {
                this.startAnim();
            };

        }
    }
});
