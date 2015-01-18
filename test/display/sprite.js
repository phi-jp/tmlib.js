

testhelper.describe("tm.display.Sprite", function() {

    testhelper.it("init()", function() {

        tm.define("MainScene", {
            "superClass": "tm.app.Scene",
            
            init: function() {
                this.superInit();
                
                var texture = tm.asset.Texture("http://jsrun.it/assets/s/A/3/j/sA3jL.png");
                
                texture.onload = function() {
                    var sprite = tm.display.Sprite(texture).addChildTo(this);
                    sprite.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
                    sprite.setScale(2, 2);
                }.bind(this);
            }
        });

    });

    testhelper.it("when error", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
            
            init: function() {
                this.superInit();

                var loader = tm.asset.Loader();

                loader.onload = function() {
                    tm.display.Sprite("hoge").addChildTo(this).setPosition(100, 100);
                }.bind(this);

                loader.load({
                    "hoge": "hoge222.png",
                });
            },
        });

    });

});

