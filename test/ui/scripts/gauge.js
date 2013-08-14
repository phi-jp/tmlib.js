

tm.define("tests.canvaselement.GaugeTestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var gauge      = tm.app.Gauge(300, 25, "white", "left").addChildTo(this).setPosition(85, 100);
        var upButton   = tm.app.GlossyButton(100, 50, "red", "up").addChildTo(this).setPosition(SCREEN_CENTER_X-50, 350);
        var downButton = tm.app.GlossyButton(100, 50, "blue", "down").addChildTo(this).setPosition(SCREEN_CENTER_X+50, 350);
        
        upButton.onpointingstart = function() {
            gauge.value += 10;
        };
        downButton.onpointingstart = function() {
            gauge.value -= 10;
        };
    },

});


tm.define("tests.canvaselement.GaugeTest01Scene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var gauge0 = this.gauge0 = tm.app.Gauge(200, 20).setPosition(100, 50).addChildTo(this);
        var gauge1 = tm.app.Gauge(200, 20, "green", "right").setPosition(300, 80).addChildTo(this);
        var gauge2 = tm.app.Gauge(20, 200, "blue", "up").setPosition(20, 220).addChildTo(this);
        var gauge3 = tm.app.Gauge(20, 200, "white", "down").setPosition(50, 20).addChildTo(this);

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

        var gauge = tm.app.Gauge(200, 20, "red", "left").setPosition(100, 50).addChildTo(this);
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
