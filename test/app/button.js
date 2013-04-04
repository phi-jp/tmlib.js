/*
 *
 */

tm.preload(function() {
    tm.graphics.TextureManager.add("tmlibIcon", "https://raw.github.com/phi1618/tmlib.js/0.1.5/examples/logo/icon.png");
    tm.graphics.TextureManager.add("blogIcon", "https://raw.github.com/phi1618/tmlib.js/0.1.5/examples/logo/blog-icon.png");
});

tm.define("tests.button.DemoScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        var labelButton = tm.app.LabelButton("label").addChildTo(this);
        labelButton.setPosition(100, 100).setSize(100, 50);
        labelButton.onpointingstart = function() { c.log("click label button."); };
        
        var iconButton = tm.app.IconButton(tm.graphics.TextureManager.get("tmlibIcon")).addChildTo(this);
        iconButton.setPosition(100, 200).setSize(100, 100);
        iconButton.onpointingstart = function() { c.log("click icon button."); };
        var iconButton = tm.app.IconButton(tm.graphics.TextureManager.get("blogIcon")).addChildTo(this);
        iconButton.setPosition(250, 200).setSize(100, 100);
        iconButton.onpointingstart = function() { c.log("click icon button."); };
        
        var glossyButton = tm.app.GlossyButton(100, 50, "red").addChildTo(this);
        glossyButton.setPosition(100, 300);
        glossyButton.onpointingstart = function() { c.log("click iphone button."); };
        var glossyButton = tm.app.GlossyButton(100, 50, "green").addChildTo(this);
        glossyButton.setPosition(250, 300);
        glossyButton.onpointingstart = function() { c.log("click iphone button."); };
        var glossyButton = tm.app.GlossyButton().addChildTo(this);
        glossyButton.setPosition(400, 300);
        glossyButton.onpointingstart = function() { c.log("click iphone button."); };
        glossyButton.setSize(100, 50);
        glossyButton.setBackgroundColor("blue");
    },

    onpointingstart: function(e) {
    }
});
