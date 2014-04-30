


tm.define("tests.timer.frame", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";
    },
 
    update: function(app) {
        this.label.text = app.frame;
    },

    onpointingstart: function(e) {
        e.app.timer.reset();
    }
});


tm.define("tests.timer.fps", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";
    },
 
    update: function(app) {
        this.label.text = app.fps;
    },

    onpointingstart: function(e) {
        e.app.timer.reset();
    }
});



tm.define("tests.timer.fps", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";
    },
 
    update: function(app) {
        this.label.text = app.fps;
    },
});


tm.define("tests.timer.frameTime", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";
    },
 
    update: function(app) {
        this.label.text = app.timer.frameTime;
    },
});


tm.define("tests.timer.reset", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";
    },
 
    update: function(app) {
        this.label.text = app.frame;
    },

    onpointingstart: function(e) {
        e.app.timer.reset();
    }
});


tm.define("tests.timer.getSeconds", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";
    },
 
    update: function(app) {
        this.label.text = app.timer.getSeconds().floor();
    },

    onpointingstart: function(e) {
        e.app.timer.reset();
    }
});


tm.define("tests.timer.getMilliseconds", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";
    },
 
    update: function(app) {
        this.label.text = app.timer.getMilliseconds();
    },

    onpointingstart: function(e) {
        e.app.timer.reset();
    }
});


tm.define("tests.timer.checkIntervalEnd", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";

        this.counter = 0;
    },
 
    update: function(app) {
        if (app.timer.checkIntervalEnd(1000)) {
            this.label.text = this.counter++;
        }
    },

    onpointingstart: function(e) {
        e.app.timer.reset();
    }
});



