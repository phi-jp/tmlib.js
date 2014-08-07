
tm.define("tests.baseapp.deltaTime", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
        this.label.fillStyle = "#aaa";
        this.label.fontSize = 64;
    },
 
    update: function(app) {
        this.label.text = app.deltaTime;
    },

    onpointingstart: function(e) {
        e.app.timer.reset();
    }
});
