


/*
 * titlescene
 */

tm.define("tests.sprite.error", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var loader = tm.asset.Loader();

        loader.onload = function() {
            this.setup();
        }.bind(this);

        loader.load({
            "hoge": "hoge222.png",
        });
    },

    setup: function() {
        tm.display.Sprite("hoge").addChildTo(this).setPosition(100, 100);
    },

    onfinish: function() {
        console.log("finish!");
    }
});

