tm.define("tests.object2d.OriginTest", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var shape = tm.app.CircleShape().addChildTo(this);
        shape.originX = 0;
    },

});

tm.define("tests.object2d.InteractionScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var circle = tm.app.CircleShape(100, 100).addChildTo(this);
        circle.position.set(100, 100);
        circle.alpha = 0.5;
        circle.boundingType = "circle";
        circle.setInteractive(true);
        circle.onmouseover = function(e) { this.alpha = 1.0; };
        circle.onmouseout  = function(e) { this.alpha = 0.5; };

        var rect = tm.app.RectangleShape(100, 100).addChildTo(this);
        rect.position.set(100, 300);
        rect.alpha = 0.5;
        rect.boundingType = "rect";
        rect.setInteractive(true);
        rect.onmouseover = function(e) { this.alpha = 1.0; };
        rect.onmouseout  = function(e) { this.alpha = 0.5; };
        
        
        var group = tm.app.CanvasElement().addChildTo(this);
        group.position.set(500, 20);
        group.rotation = 45;
        group.scaleX = 1.5;
        
        var circle = tm.app.CircleShape(100, 100).addChildTo(group);
        circle.position.set(100, 100);
        circle.alpha = 0.5;
        circle.boundingType = "circle";
        circle.checkHierarchy = true;
        circle.setInteractive(true);
        circle.onmouseover = function(e) { this.alpha = 1.0; };
        circle.onmouseout  = function(e) { this.alpha = 0.5; };
        
        var rect = tm.app.RectangleShape(100, 100).addChildTo(group);
        rect.position.set(100, 300);
        rect.alpha = 0.5;
        rect.boundingType = "rect";
        rect.checkHierarchy = true;
        rect.setInteractive(true);
        rect.onpointingover = function(e) { this.alpha = 1.0; };
        rect.onpointingout  = function(e) { this.alpha = 0.5; };
    }
});



tm.define("tests.bitmaplabel.Test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var self = this;

        tm.asset.AssetManager.load("font", "../../resource/img/font.png");
        tm.asset.AssetManager.onload = function() {
            var bitmapLabel = tm.app.BitmapLabel({
                texture: "font",
                text: "Hello, world!~🐤",
            }).addChildTo(self);
            bitmapLabel.setPosition(390, 200);

            var bitmapLabel = tm.app.BitmapLabel({
                texture: "font",
                text: "This font was made by @CarasOhmi.",
                fontSize: 20,
                lineHeight: 1.2,
            }).addChildTo(self);
            bitmapLabel.setPosition(400, 250);

        };
    },

});


