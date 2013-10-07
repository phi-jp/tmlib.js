

tm.define("tests.label.DemoScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var label = tm.display.Label("hoge").addChildTo(this);
        label.x = 100; label.y = 100;

        var label = tm.display.Label("hoge\nBBBB").addChildTo(this);
        label.x = 350; label.y = 100;

        var label = tm.display.Label("hogehogehogehoge").addChildTo(this);
        label.x = 100; label.y = 140;

        var label = tm.display.Label("hogehogehogehoge\nbbbbb").addChildTo(this);
        label.x = 100; label.y = 180;
        label.maxWidth = 100;

        var label = tm.display.Label("ABCDEFG").addChildTo(this);
        label.x = 100; label.y = 260;
        label.fontFamily = "'Helvetica Neue'";

        var label = tm.display.Label("ABCDEFG").addChildTo(this);
        label.x = 300; label.y = 260;
        label.fontFamily = "'Helvetica Neue'";
        label.fontWeight = "bold"
        
        label.tweener.clear().fadeOut();
    },

});



