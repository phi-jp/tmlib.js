
tm.define("tests.sprite.DemoScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var texture = tm.asset.Texture("http://dummyimage.com/128x128/0000ff/fff.png&text=dummy");
        tm.asset.AssetManager.set("dummy", texture);
        
        texture.onload = function() {
            var sprite = tm.display.Sprite("dummy", 150, 50).addChildTo(this);
            sprite.x = 200; sprite.y = 100;
            
            var sprite = tm.display.Sprite("dummy").addChildTo(this);
            sprite.x = 200; sprite.y = 300;
        }.bind(this);
    },

});



