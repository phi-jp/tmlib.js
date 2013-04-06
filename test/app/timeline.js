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
                    .to({x: 200, "y": 400}, 30, 10)
                    .to({"alpha": 1.0}, 30, 0)
                    .call(function() {
                        console.log("finish");
                    }, 40);
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
            .to({x:500}, 30, 0)
            .to({y:400}, 30, 30)
            .to({alpha:0}, 30, 60);
    },
});
 
tm.define("tests.timeline.CallTestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var shape = tm.app.StarShape().addChildTo(this);
        shape.setPosition(100, 100);
        
        shape.timeline
            .to({x:500}, 30, 0)
            .to({y:400}, 30, 30)
            .to({alpha:0}, 30, 60)
            .call(function() {
                alert("finish")
            }, 90);
    },
});
 
tm.define("tests.timeline.SetTestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var shape = tm.app.StarShape().addChildTo(this);
        shape.setPosition(100, 100);
        
        shape.timeline
            .to({x:500}, 30, 0)
            .to({y:400}, 30, 30)
            .to({alpha:0}, 30, 60)
            .set({
            	x: 100,
            	y: 100,
            	alpha: 1.0,
            }, 90);
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
                    .to({"alpha": 1.0}, 30, 0)
                    .to({x: app.width/2, "y": app.height/2}, 15, 30)
                    .to({scaleX: 1, scaleY: 1}, 15, 30)
                    .call(function() {
                        console.log("finish");
                    }, 50);
                
            };
            circle.startAnim();
 
            circle.onanimationend = function() {
                this.startAnim();
            };
 
        }
    }
});