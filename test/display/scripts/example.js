/*
 * main scene
 */
tm.define("tests.example.Shodo", {
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

/*
 * main scene
 */
tm.define("tests.example.Keyboard", {
    superClass: "tm.app.Scene",
    
    init: function() {
        this.superInit();
        
        this.player = tm.display.TriangleShape().addChildTo(this);
        this.player.setPosition(320, 240);
    },

    update: function(app) {
        var direction = app.keyboard.getKeyDirection();
        this.player.position.add(direction.mul(8));
    }
});







