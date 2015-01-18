

testhelper.describe("tm.social.Twitter", function() {

    testhelper.it("init", function() {
        tm.define("MainScene", {
            "superClass": "tm.app.Scene",
            
            init: function() {
                this.superInit();
                
                // reply
                var url = tm.social.Twitter.createURL({
                    type        : "tweet",
                    in_reply_to : "210219483959263232",
                    text        : "テストだよ～",
                    url         : "http://tmlife.net",
                    hashtags    : "web,javascript,tmlibjs",
                    via         : "phi_jp",
                });
                console.log("[reply]")
                console.log(url);

                // retweet
                var url = tm.social.Twitter.createURL({
                    type: "retweet",
                    tweet_id: "210219483959263232",
                });
                console.log("[retweet]")
                console.log(url);
                
                // favorite
                var url = tm.social.Twitter.createURL({
                    type: "favorite",
                    text: "テスト",
                    tweet_id: "210219483959263232",
                });
                console.log("[favorite]")
                console.log(url);
                
                // follow
                var url = tm.social.Twitter.createURL({
                    type: "user",
                    text: "テスト",
                    screen_name: "phi_jp",
                });
                console.log("[follow]")
                console.log(url);
            }
        });
    });

});

testhelper.describe("tm.social.Nineleap", function() {

    testhelper.it("createURL(gameid,score,message)", function() {
        tm.define("MainScene", {
            "superClass": "tm.app.Scene",
            
            init: function() {
                this.superInit();

                var url = tm.social.Nineleap.createURL(1024, 5096, "message");
                console.log(url);
            },
        });
    });

});

