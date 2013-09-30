
tm.define("tests.shape.ShapeTest", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        // json load
        this.group = tm.display.CanvasElement().addChildTo(this);
        this.group.fromJSON({
            children: [
                { type: "CircleShape", name: "circle", x: 100, y: 100 },
                { type: "TriangleShape", name: "triangle", x: 200, y: 100 },
                { type: "RectangleShape", name: "rectangle", x: 300, y: 100 },
                { type: "StarShape", name: "star", x: 400, y: 100 },
                { type: "PolygonShape", name: "polygon", x: 500, y: 100 },
                { type: "HeartShape", init: [50, 50], name: "heart", x: 300, y: 200 },
                { type: "TextShape", init: [200, 50, {

                }], name: "text", x: 300, y: 300 },
            ],
        });

        // tm.app.TextShape(150, 50, {
        //     text: "AAAAAAAAAAAAAAA",
        //     fillStyle: "red",
        //     strokeStyle: "hsla(240, 50%, 50%, 1.0)",
        //     lineWidth: "4",
        // }).addChildTo(this).setPosition(100, 50);
    },

    update: function(app) {
        var p = app.pointing;
        if (p.getPointing() == true) {
            this.group.circle.tweener.clear().to({x:p.x, y:p.y}, 1000, "easeInOutBounce");
            this.group.triangle.tweener.clear().to({x:p.x, y:p.y}, 800, "easeInOutBounce");
            this.group.rectangle.tweener.clear().to({x:p.x, y:p.y}, 600, "easeInOutBounce");
            this.group.star.tweener.clear().to({x:p.x, y:p.y}, 400, "easeInOutBounce");
            this.group.polygon.tweener.clear().to({x:p.x, y:p.y}, 200, "easeInOutBounce");
        };
    }

});



tm.define("tests.bitmaplabel.Test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var self = this;

        tm.asset.AssetManager.load("font", "../../resource/img/font.png");
        tm.asset.AssetManager.onload = function() {
            var bitmapLabel = tm.display.BitmapLabel({
                texture: "font",
                text: "Hello, world!~🐤",
            }).addChildTo(self);
            bitmapLabel.setPosition(390, 200);

            var bitmapLabel = tm.display.BitmapLabel({
                texture: "font",
                text: "This font was made by @CarasOhmi.",
                fontSize: 20,
                lineHeight: 1.2,
            }).addChildTo(self);
            bitmapLabel.setPosition(400, 250);

        };
    },

});



tm.define("tests.bitmaplabel.Test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var self = this;

        tm.asset.AssetManager.load("font", "../../resource/img/font.png");
        tm.asset.AssetManager.onload = function() {
            var bitmapLabel = tm.display.BitmapLabel({
                texture: "font",
                text: "Hello, world!~🐤",
            }).addChildTo(self);
            bitmapLabel.setPosition(390, 200);

            var bitmapLabel = tm.display.BitmapLabel({
                texture: "font",
                text: "This font was made by @CarasOhmi.",
                fontSize: 20,
                lineHeight: 1.2,
            }).addChildTo(self);
            bitmapLabel.setPosition(400, 250);

        };
    },

});




/*
 * main scene
 */
tm.define("tests.shape.Shodo", {
    superClass: "tm.app.Scene",
    
    init: function() {
        this.superInit();
        
        this.shape = tm.display.Shape(SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        this.shape.origin.set(0, 0);
        this.shape.canvas.clearColor("#eee");
        
        this.sodouImage = tm.asset.Texture("http://jsrun.it/assets/a/h/k/M/ahkMh.png");
    },
    
    update: function(app) {
        if (app.pointing.getPointing()) {
            this.drawShodo(app.pointing);
        }
    },
    
    drawShodo: function(p) {
        var c = this.shape.canvas;
        
        c.save();
        
        var image = this.sodouImage;
        
        var deltaLength = p.deltaPosition.length();
        
        console.log(deltaLength);
        
        if (deltaLength == 0) {
            var finalX = p.x;
            var finalY = p.y;
            
            c.translate(-image.width/2, -image.height/2);
            c.drawTexture(image, finalX, finalY);
            
            this.prevScale = 1;
        }
        else {
            var index = 0;
            var next = tm.geom.Vector2.add(p.position, p.deltaPosition);
            var scale = (400-deltaLength)/400;
            for (var t=0; t<1;) {
                index++;
                var finalPos = tm.geom.Vector2.lerp(p.prevPosition, p.position, t);
                var finalScale = this.prevScale + (scale-this.prevScale)*t;
                c.save();
                c.translate(finalPos.x+Math.random()*4-2, finalPos.y+Math.random()*4-2);
                c.scale(finalScale, finalScale);
                c.globalAlpha = 0.25;
                c.translate(-image.width/2, -image.height/2);
                c.drawTexture(image, 0, 0);
                c.globalAlpha = 1.0;
                c.restore();
                
                t += 1 / deltaLength;
            };
            this.prevScale = scale;
        }
        
        c.restore();
    }
});














