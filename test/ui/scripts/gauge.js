

tm.define("tests.gauge.GaugeTest", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var gauge      = tm.ui.Gauge().addChildTo(this).setPosition(85, 100);
        var upButton   = tm.ui.GlossyButton(100, 50, "red", "up").addChildTo(this).setPosition(SCREEN_CENTER_X-50, 350);
        var downButton = tm.ui.GlossyButton(100, 50, "blue", "down").addChildTo(this).setPosition(SCREEN_CENTER_X+50, 350);
        
        upButton.onpointingstart = function() {
            gauge.value += 10;
        };
        downButton.onpointingstart = function() {
            gauge.value -= 10;
        };
    },

});



tm.define("tests.gauge.FlatGaugeTest", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var gauge = tm.ui.FlatGauge({
            color: "hsl(220, 100%, 50%)",
            bgColor: "red",
            borderColor: "white",
        }).addChildTo(this).setPosition(85, 100);
        var upButton   = tm.ui.GlossyButton(100, 50, "red", "up").addChildTo(this).setPosition(SCREEN_CENTER_X-50, 350);
        var downButton = tm.ui.GlossyButton(100, 50, "blue", "down").addChildTo(this).setPosition(SCREEN_CENTER_X+50, 350);
        
        upButton.onpointingstart = function() {
            gauge.value += 10;
            updateColor();
        };
        downButton.onpointingstart = function() {
            gauge.value -= 10;
            updateColor();
        };
        
        var updateColor = function() {
            var angle = 360*gauge.getRatio();
            gauge.fillStyle = "hsl({0}, 80%, 50%)".format(angle);
        };
        updateColor();
    },

});


tm.define("tests.gauge.GlossyGaugeTest", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var gauge      = tm.ui.GlossyGauge({
            color: "hsl(220, 100%, 50%)",
            bgColor: "#444",
            borderColor: "white",
        }).addChildTo(this).setPosition(85, 100);
        var upButton   = tm.ui.GlossyButton(100, 50, "red", "up").addChildTo(this).setPosition(SCREEN_CENTER_X-50, 350);
        var downButton = tm.ui.GlossyButton(100, 50, "blue", "down").addChildTo(this).setPosition(SCREEN_CENTER_X+50, 350);
        
        upButton.onpointingstart = function() {
            gauge.value += 10;
            // updateColor();
        };
        downButton.onpointingstart = function() {
            gauge.value -= 10;
            // updateColor();
        };
        
        var updateColor = function() {
            var angle = 360*gauge.getRatio();
            gauge.fillStyle = "hsl({0}, 80%, 50%)".format(angle);
        };
        // updateColor();
    },

});


tm.define("tests.canvaselement.GaugeTest01Scene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var gauge0 = this.gauge0 = tm.ui.Gauge(200, 20).setPosition(100, 50).addChildTo(this);
        var gauge1 = tm.ui.Gauge(200, 20, "green", "right").setPosition(300, 80).addChildTo(this);
        var gauge2 = tm.ui.Gauge(20, 200, "blue", "up").setPosition(20, 220).addChildTo(this);
        var gauge3 = tm.ui.Gauge(20, 200, "white", "down").setPosition(50, 20).addChildTo(this);

        var updateGauge = function() {
            this.percent += this.v;
            if (this.isEmpty()) {
                this.v = 1;
            }
            if (this.isFull()) {
                this.v = -1;
            }
        }

        gauge0.v = -1; gauge0.update = updateGauge;
        gauge1.v = -1; gauge1.update = updateGauge;
        gauge2.v = -1; gauge2.update = updateGauge;
        gauge3.v = -1; gauge3.update = updateGauge;
    },

});

tm.define("tests.canvaselement.GaugeTest02Scene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var gauge = tm.ui.Gauge(200, 20, "red", "left").setPosition(100, 50).addChildTo(this);
        gauge.v = 1;

//                    gauge.setValue(10);
//                    gauge.setRatio(0.5);
        gauge.update = function() {
            this.percent += this.v;
            if (this.isEmpty()) {
                this.v = 1;
            }
            if (this.isFull()) {
                this.v = -1;
            }
        }
    },

});
