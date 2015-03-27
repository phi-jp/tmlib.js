


testhelper.describe("tm.app.Object2d", function() {

    testhelper.it("origin", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();
                
                var group = tm.display.RectangleShape(200, 100).addChildTo(this);
                group.setOrigin(0, 0);
                group.setPosition(100, 100);
                
                var shape = tm.display.CircleShape().addChildTo(group);
                shape.setAlpha(0.5).setOrigin(0, 0);
                
                var shape = tm.display.CircleShape().addChildTo(group);
                shape.setAlpha(0.5).setOrigin(1, 0);
                
                var shape = tm.display.CircleShape().addChildTo(group);
                shape.setAlpha(0.5).setOrigin(0, 1);
                
                var shape = tm.display.CircleShape().addChildTo(group);
                shape.setAlpha(0.5).setOrigin(0.5, 0.5);
                
                var shape = tm.display.CircleShape().addChildTo(group);
                shape.setAlpha(0.5).setOrigin(1, 1);
                
                this.one("pointingstart", function() {
                    console.log("hoge");
                });
            },

        });


    });

    testhelper.it("isHitPoint", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();
                
                this.player = tm.display.CircleShape(64, 64, {fillStyle:"red"}).addChildTo(this);
                this.enemyGroup = tm.display.CanvasElement().addChildTo(this);
                for (var i=0; i<10; ++i) {
                    var x = tm.util.Random.randint(0, SCREEN_WIDTH);
                    var y = tm.util.Random.randint(0, SCREEN_HEIGHT);
                    var enemy = tm.display.CircleShape(32, 32, {fillStyle:"blue"})
                        .addChildTo(this.enemyGroup)
                        .setPosition(x, y);
                }
            },
            
            update: function(app) {
                var p = app.pointing;
                
                this.player.x = p.x;
                this.player.y = p.y;
                
                var self = this;
                this.enemyGroup.children.each(function(elm) {
                    if (self.player.isHitElement(elm)) {
                        elm.setAlpha(1.0);
                    }
                    else {
                        elm.setAlpha(0.5);
                    }
                });
            }
        });

    });

    testhelper.it("interaction", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();

                var circle = tm.display.CircleShape(100, 100).addChildTo(this);
                circle.position.set(100, 100);
                circle.alpha = 0.5;
                circle.boundingType = "circle";
                circle.setInteractive(true);
                circle.onmouseover = function(e) { this.alpha = 1.0; };
                circle.onmouseout  = function(e) { this.alpha = 0.5; };

                var rect = tm.display.RectangleShape(100, 100).addChildTo(this);
                rect.position.set(100, 300);
                rect.alpha = 0.5;
                rect.boundingType = "rect";
                rect.setInteractive(true);
                rect.onmouseover = function(e) { this.alpha = 1.0; };
                rect.onmouseout  = function(e) { this.alpha = 0.5; };
                
                
                var group = tm.display.CanvasElement().addChildTo(this);
                group.position.set(500, 20);
                group.rotation = 45;
                group.scaleX = 1.5;
                
                var circle = tm.display.CircleShape(100, 100).addChildTo(group);
                circle.position.set(100, 100);
                circle.alpha = 0.5;
                circle.boundingType = "circle";
                circle.checkHierarchy = true;
                circle.setInteractive(true);
                circle.onmouseover = function(e) { this.alpha = 1.0; };
                circle.onmouseout  = function(e) { this.alpha = 0.5; };
                
                var rect = tm.display.RectangleShape(100, 100).addChildTo(group);
                rect.position.set(100, 300);
                rect.alpha = 0.5;
                rect.boundingType = "rect";
                rect.checkHierarchy = true;
                rect.setInteractive(true);
                rect.onpointingover = function(e) { this.alpha = 1.0; };
                rect.onpointingout  = function(e) { this.alpha = 0.5; };
            }
        });

    });

    testhelper.it("left", function() {
        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();

                var base = tm.display.CircleShape({fillStyle:'blue', width:100, height:100}).addChildTo(this);
                base.position.set(100, 100);
                console.log(base.left);
                
                var circle = tm.display.CircleShape({fillStyle:'red', width:100, height:100}).addChildTo(this);
                circle.position.set(100, 200);
                circle.left = 100;
                console.log(circle.left);
                
                var circle2 = tm.display.CircleShape({fillStyle:'green', width:100, height:100}).addChildTo(this);
                circle2.position.set(100, 300);
                circle2.originX = 0;
                circle2.left = 100;
                console.log(circle2.left);
                
                var circle3 = tm.display.CircleShape({fillStyle:'yellow', width:100, height:100}).addChildTo(this);
                circle3.position.set(100, 400);
                circle3.originX = 0;
                circle3.left = 100;
                console.log(circle3.left);
            }
        });
    });

    testhelper.it("right", function() {
        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();

                var base = tm.display.CircleShape({fillStyle:'blue', width:100, height:100}).addChildTo(this);
                base.position.set(100, 100);
                console.log(base.right);
                
                var circle = tm.display.CircleShape({fillStyle:'red', width:100, height:100}).addChildTo(this);
                circle.position.set(100, 200);
                circle.right = 100;
                console.log(circle.right);
                
                var circle2 = tm.display.CircleShape({fillStyle:'green', width:100, height:100}).addChildTo(this);
                circle2.position.set(100, 300);
                circle2.originX = 0;
                circle2.right = 100;
                console.log(circle2.right);
                
                var circle3 = tm.display.CircleShape({fillStyle:'yellow', width:100, height:100}).addChildTo(this);
                circle3.position.set(100, 400);
                circle3.originX = 0;
                circle3.right = 100;
                console.log(circle3.right);
            }
        });
    });

    testhelper.it("top", function() {
        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();

                var base = tm.display.CircleShape({fillStyle:'blue', width:100, height:100}).addChildTo(this);
                base.position.set(100, 100);
                console.log(base.top);
                
                var circle = tm.display.CircleShape({fillStyle:'red', width:100, height:100}).addChildTo(this);
                circle.position.set(200, 100);
                circle.top = 100;
                console.log(circle.top);
                
                var circle2 = tm.display.CircleShape({fillStyle:'green', width:100, height:100}).addChildTo(this);
                circle2.position.set(300, 100);
                circle2.originY = 0;
                circle2.top = 100;
                console.log(circle2.top);
                
                var circle3 = tm.display.CircleShape({fillStyle:'yellow', width:100, height:100}).addChildTo(this);
                circle3.position.set(400, 100);
                circle3.originY = 0;
                circle3.top = 100;
                console.log(circle3.top);
            }
        });
    });

    testhelper.it("bottom", function() {
        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();

                var base = tm.display.CircleShape({fillStyle:'blue', width:100, height:100}).addChildTo(this);
                base.position.set(100, 100);
                console.log(base.bottom);
                
                var circle = tm.display.CircleShape({fillStyle:'red', width:100, height:100}).addChildTo(this);
                circle.position.set(200, 100);
                circle.bottom = 100;
                console.log(circle.bottom);
                
                var circle2 = tm.display.CircleShape({fillStyle:'green', width:100, height:100}).addChildTo(this);
                circle2.position.set(300, 100);
                circle2.originY = 0;
                circle2.bottom = 100;
                console.log(circle2.bottom);
                
                var circle3 = tm.display.CircleShape({fillStyle:'yellow', width:100, height:100}).addChildTo(this);
                circle3.position.set(400, 100);
                circle3.originY = 0;
                circle3.bottom = 100;
                console.log(circle3.bottom);
            }
        });
    });
});

