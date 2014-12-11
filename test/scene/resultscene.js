

testhelper.describe("tm.scene.ResultScene", function() {

    testhelper.it("default", function() {

        tm.define("MainScene", {
            superClass: "tm.scene.ResultScene",
            
            init: function() {
                this.superInit({
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    score: 10,
                });
            },
        });
        
    });

    testhelper.it("custom", function() {

        tm.define("MainScene", {
            superClass: "tm.scene.ResultScene",
            
            init: function() {
                this.superInit({
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    fontSize: 100,
                    fontColor: "white",
                    bgColor: "green",
                    
                    score: 10,
                    message: "これはリザルトシーンをカスタムしたものです!",
                    hashtags: "tmlib,test",
                    url: "http://twitter.com/phi_jp",
                });
            },
        });
        
    });

});
