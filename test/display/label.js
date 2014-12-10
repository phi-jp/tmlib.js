

testhelper.describe("tm.display.Label", function() {

    testhelper.it("init", function() {
        tm.define("MainScene", {
            "superClass": "tm.app.Scene",
            
            init: function() {
                this.superInit();
                
                // ラベルを表示
                var label = tm.display.Label("Hello, world!").addChildTo(this);
                label.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
            }
        });
    });

});

