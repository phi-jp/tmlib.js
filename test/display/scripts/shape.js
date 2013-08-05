
tm.define("tests.bitmaplabel.Test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var self = this;

        tm.asset.AssetManager.load("font", "../../resource/img/font.png");
        tm.asset.AssetManager.onload = function() {
            var bitmapLabel = tm.app.BitmapLabel({
                texture: "font",
                text: "Hello, world!~🐤",
            }).addChildTo(self);
            bitmapLabel.setPosition(390, 200);

            var bitmapLabel = tm.app.BitmapLabel({
                texture: "font",
                text: "This font was made by @CarasOhmi.",
                fontSize: 20,
                lineHeight: 1.2,
            }).addChildTo(self);
            bitmapLabel.setPosition(400, 250);

        };
    },

});


