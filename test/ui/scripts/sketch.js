/*
 *
 */

tm.define("tests.sketch.penColor", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        this.sketch = tm.ui.Sketch(300, 300).addChildTo(this);
        this.sketch.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        
        this.sketch.penColor = "red";
    },
});

tm.define("tests.sketch.bgColor", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        this.sketch = tm.ui.Sketch(300, 300).addChildTo(this);
        this.sketch.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        
        this.sketch.bgColor = "green";
    },
});

tm.define("tests.sketch.lineWidth", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        
        this.sketch = tm.ui.Sketch(300, 300).addChildTo(this);
        this.sketch.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        
        this.sketch.lineWidth = 64;
    },
});

tm.define("tests.sketch.Test", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        var self =this;
        
        this.sketch = tm.ui.Sketch(400, 400).addChildTo(this);
        this.sketch.origin.set(0, 0);
        this.sketch.sleep();
        
        this.point = tm.display.StarShape(100, 100).addChildTo(this).setPosition(50, 50);
    },
    
    onpointingstart: function(e) {
        if (this.point.isHitPoint(e.app.pointing.x, e.app.pointing.y)) {
            this.sketch.wakeUp();
            
            this.point.tweener
                .clear()
                .scale(1.2, 100)
                .scale(0.9, 100)
                .scale(1.1, 100)
                .scale(1.0, 100);
        }
    },
    
    onpointingend: function() {
        this.sketch.sleep();
    },
});
