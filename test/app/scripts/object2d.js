

tm.define("tests.object2d.origin", {
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




tm.define("tests.object2d.isHitPoint", {
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

tm.define("tests.object2d.interaction", {
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


