/*
 *
 */


tm.define("tests.scene.event", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        tm.display.Label("Layer1").addChildTo(this)
            .setPosition(150, 100)
            .setFillStyle("#aaa")
            .setFontSize(32)
            ;
    },

    onpointingstart: function() {
        var scene = tm.app.Scene();

        scene.onpointingstart = function() {
            this.app.popScene();
        };
        scene.onexit = function(e) { console.log(e.type); };

        tm.display.Label("Layer2").addChildTo(scene)
            .setPosition(250, 200)
            .setFillStyle("#aaa")
            .setFontSize(32)
            ;

        this.app.pushScene(scene);
    },

    onenter: function(e)  { console.log(e.type); },
    onexit: function(e)   { console.log(e.type); },
    onpause: function(e)  { console.log(e.type); },
    onresume: function(e) { console.log(e.type); },
});
