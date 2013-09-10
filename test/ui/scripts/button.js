/*
 *
 */

tm.define("tests.button.DemoScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        var ASSET = {
            "tmlibIcon": "https://rawgithub.com/phi1618/tmlib.js/0.1.5/examples/logo/icon.png",
            "blogIcon": "https://rawgithub.com/phi1618/tmlib.js/0.1.5/examples/logo/blog-icon.png"
        };

        var as = tm.asset.AssetManager;
        as.load(ASSET);
        as.onload = function() {
            this.setup();
        }.bind(this);
    },

    setup: function() {
        var as = tm.asset.AssetManager;
        var tmlibIcon = as.get("tmlibIcon");
        var blogIcon = as.get("blogIcon");

        // Consoleクラスがなくなったので仮実装
        var c = console;

        var labelButton = tm.ui.LabelButton("label").addChildTo(this);
        labelButton.setPosition(100, 100).setSize(100, 50);
        labelButton.onpointingstart = function() { c.log("click label button."); };
        
        var iconButton = tm.ui.IconButton(as.get("tmlibIcon")).addChildTo(this);
        iconButton.setPosition(100, 200).setSize(100, 100);
        iconButton.onpointingstart = function() { c.log("click icon button."); };
        var iconButton = tm.ui.IconButton(as.get("blogIcon")).addChildTo(this);
        iconButton.setPosition(250, 200).setSize(100, 100);
        iconButton.onpointingstart = function() { c.log("click icon button."); };
        
        var glossyButton = tm.ui.GlossyButton(100, 50, "red").addChildTo(this);
        glossyButton.setPosition(100, 300);
        glossyButton.onpointingstart = function() { c.log("click iphone button."); };
        var glossyButton = tm.ui.GlossyButton(100, 50, "green").addChildTo(this);
        glossyButton.setPosition(250, 300);
        glossyButton.onpointingstart = function() { c.log("click iphone button."); };
        var glossyButton = tm.ui.GlossyButton().addChildTo(this);
        glossyButton.setPosition(400, 300);
        glossyButton.onpointingstart = function() { c.log("click iphone button."); };
        glossyButton.setSize(100, 50);
        glossyButton.setBackgroundColor("blue");
    },

    onpointingstart: function(e) {
    }
});
