

testhelper.describe("tm.asset.Font", function() {

    testhelper.it("init", function() {
        tm.define("MainScene", {
            superClass: "tm.app.Scene",
            
            init: function() {
                this.superInit();

                var font = tm.asset.Font("../resource/font/IndieFlower.ttf", "IndieFlower");
                
                font.onload = function() {
                    // ラベルを表示
                    var label = tm.display.Label("Hello, world!").addChildTo(this);
                    label.fontFamily = "IndieFlower";
                    label.fontSize = 64;
                    label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
                }.bind(this);
            }
        });
    });

});

