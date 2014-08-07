/*
 *
 */


tm.define("tests.baseapp.property", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.label = tm.display.Label().addChildTo(this);
        this.label.setPosition(SCREEN_CENTER_X, 300);
        this.label.fillStyle = "#aaa";
        this.label.fontSize = 48;
    },
 
    update: function(app) {
        var strings = [];
        ["frame", "fps", "deltaTime"].each(function(key) {
            strings.push("{0} = {1}".format(key, app[key]));
        });
        this.label.text = strings.join("\n");
    },

    onpointingstart: function(e) {
        e.app.timer.reset();
    }
});


