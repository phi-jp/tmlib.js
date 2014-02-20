
tm.define("tests.sprite.init", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var texture = tm.asset.Texture("http://dummyimage.com/128x128/0000ff/fff.png&text=dummy");
        tm.asset.Manager.set("dummy", texture);
        
        texture.onload = function() {
            // 画像名だけだと画像のサイズそのままで表示される
            var sprite = tm.display.Sprite("dummy").addChildTo(this);
            sprite.x = 100; sprite.y = 200;
            
            // 幅上書き
            var sprite = tm.display.Sprite("dummy", 100).addChildTo(this);
            sprite.x = 300; sprite.y = 200;
            
            // 幅, 高さ上書き
            var sprite = tm.display.Sprite("dummy", 50, 200).addChildTo(this);
            sprite.x = 500; sprite.y = 200;
        }.bind(this);
    },

});



tm.define("tests.sprite.fitImage", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var loader = tm.asset.Loader().load({
            "image1": {
                path: "http://dummyimage.com/128x128/0000ff/fff.png&text=small",
                type: "png",
            },
            "image2": {
                path: "http://dummyimage.com/256x128/0000ff/fff.png&text=big",
                type: "png",
            }
        });

        loader.onload = function() {
            var normal = tm.display.Sprite("image1").addChildTo(this);
            normal.x = 100; normal.y = 100;
            normal.image = "image2";

            var fitTarget = tm.display.Sprite("image1").addChildTo(this);
            fitTarget.x = 300; fitTarget.y = 100;
            fitTarget.image = "image2";
            fitTarget.fitImage();

            tm.display.Sprite().addChildTo(this).hide();
        }.bind(this);
    },
});




tm.define("tests.sprite.frameIndex", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var loader = tm.asset.Loader().load({
            "image": {
                path: "../../resource/img/crash/01.png",
                type: "png",
            },
        });

        loader.onload = function() {
            // setFrameIndex で指定
            tm.display.RectangleShape(64, 64).addChildTo(this).setPosition(100, 100);
            var sprite = tm.display.Sprite("image").addChildTo(this);
            sprite.x = 100; sprite.y = 100;
            sprite.setSize(64, 64);
            sprite.setFrameIndex(16, 64, 64);

            // frameIndex で指定
            tm.display.RectangleShape(64, 64).addChildTo(this).setPosition(200, 100);
            var sprite = tm.display.Sprite("image").addChildTo(this);
            sprite.x = 200; sprite.y = 100;
            sprite.setSize(64, 64);
            sprite.update = function(app) {
                if (app.frame % 4 == 0) {
                    this.frameIndex++;
                }
            };
        }.bind(this);
    },
});



