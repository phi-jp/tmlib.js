

testhelper.describe("tm.game.TitleScene", function() {

    testhelper.it("default", function() {

        tm.define("MainScene", {
            superClass: "tm.game.TitleScene",
            
            init: function() {
                this.superInit({
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    score: 10,
                });
            },
        });
        
    });

    testhelper.it("yoko", function() {

        var SCREEN_WIDTH = 960;
        var SCREEN_HEIGHT = 640;

        tm.define("MainScene", {
            superClass: "tm.game.TitleScene",
            
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
            superClass: "tm.game.TitleScene",
            
            init: function() {
                this.superInit({
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    fontSize: 32,
                    fontColor: "white",
                    bgColor: "green",
                });
            },
        });
        
    });

});


testhelper.describe("tm.game.ResultScene", function() {

    testhelper.it("default", function() {

        tm.define("MainScene", {
            superClass: "tm.game.ResultScene",
            
            init: function() {
                this.superInit({
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    score: 10,
                });
            },
        });
        
    });

    testhelper.it("yoko", function() {

        var SCREEN_WIDTH = 960;
        var SCREEN_HEIGHT = 640;

        tm.define("MainScene", {
            superClass: "tm.game.ResultScene",
            
            init: function() {
                this.superInit({
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    score: 10,
                    fontSize: 64,
                });
            },
        });
        
    });

    testhelper.it("custom", function() {

        tm.define("MainScene", {
            superClass: "tm.game.ResultScene",
            
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



testhelper.describe("tm.game.LoadingScene", function() {

    testhelper.it("load", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
            
            init: function() {
                this.superInit();
            },

            onenter: function() {
                var loading = tm.game.LoadingScene({
                    assets: {
                        "image1": "http://dummyimage.com/512x512/aaa/fff.png?&text=1&"+(new Date()).getTime(),
                        "image2": "http://dummyimage.com/512x512/aaa/fff.png?&text=2&"+(new Date()).getTime(),
                        "image3": "http://dummyimage.com/512x512/aaa/fff.png?&text=3&"+(new Date()).getTime(),
                        "image4": "http://dummyimage.com/512x512/aaa/fff.png?&text=4&"+(new Date()).getTime(),
                        "image5": "http://dummyimage.com/512x512/aaa/fff.png?&text=5&"+(new Date()).getTime(),
                        "image6": "http://dummyimage.com/512x512/aaa/fff.png?&text=6&"+(new Date()).getTime(),
                        "image7": "http://dummyimage.com/512x512/aaa/fff.png?&text=7&"+(new Date()).getTime(),
                        "image8": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image9": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image10": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image11": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image12": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image13": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image14": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image15": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image16": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image17": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image18": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image19": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                        "image20": "http://dummyimage.com/512x512/aaa/fff.png?&text=8&"+(new Date()).getTime(),
                    },
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                });
                this.app.replaceScene(loading);
                
                this.onenter =  null;
                
                loading.onprogress = function(e) {
                    console.log(e.type, e.progress);
                };
                var self = this;
                loading.onload = function(e) {
                    console.log(e.type, e.progress);

                    this.app.replaceScene(self);
                    
                    tm.display.Sprite("image1").addChildTo(self).setPosition(320, 480);
                };

            },
        });
        
    });
});




testhelper.describe("tm.game.NumericalInputScene", function() {

    testhelper.it("load", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
            
            init: function() {
                this.superInit();

            },

            onenter: function() {
                var scene = tm.game.NumericalInputScene();
                scene.ondecided = function(e) {
                    alert(e.value);
                };
                this.app.pushScene(scene);
            },

        });
        
    });
});






testhelper.describe("tm.game.ManagerScene", function() {

    testhelper.it("init", function() {

        tm.define("SimpleScene", {
            superClass: "tm.app.Scene",

            init: function(param) {
                this.superInit();

                this.name = param.name;
                this.label = tm.display.Label("name: {name}".format(param))
                    .setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y)
                    .addChildTo(this);
            },
            onpointingstart: function() {
                this.app.popScene();
            },
        });

        tm.define("MainScene", {
            superClass: "tm.game.ManagerScene",
         
            init: function() {
                this.superInit({
                    scenes: [
                        {
                            className: "tm.game.TitleScene",
                            label: "title",
                        },
                        {
                            className: "SimpleScene",
                            arguments: { name: "Game1", },
                            label: "game1",
                        },
                        {
                            className: "SimpleScene",
                            arguments: { name: "Game2", },
                            label: "game2",
                        },
                        {
                            className: "tm.game.ResultScene",
                            label: "result",
                            nextLabel: "title",
                        },
                    ],
                });
            },

            onfinish: function() {
                console.log("finish!");
            }
        });
    });

    testhelper.it("startLabel", function() {

        tm.define("MainScene", {
            superClass: "tm.game.ManagerScene",
         
            init: function() {
                this.superInit({
                    startLabel: "result",
                    scenes: [
                        {
                            className: "tm.game.TitleScene",
                            label: "title",
                        },
                        {
                            className: "tm.game.ResultScene",
                            label: "result",
                            nextLabel: "title",
                        },
                    ],
                });
            },

            onfinish: function() {
                console.log("finish!");
            }
        });
    });


    testhelper.it("nextLabel", function() {

        tm.define("SimpleScene", {
            superClass: "tm.app.Scene",

            init: function(param) {
                this.superInit();

                this.name = param.name;
                this.label = tm.display.Label("name: {name}".format(param))
                    .setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y)
                    .addChildTo(this);

                // タイトルに飛ぶようにする
                this.nextLabel = "title";
            },
            onpointingstart: function() {
                this.app.popScene();
            },
        });

        tm.define("MainScene", {
            superClass: "tm.game.ManagerScene",
         
            init: function() {
                this.superInit({
                    scenes: [
                        {
                            className: "tm.game.TitleScene",
                            label: "title",
                        },
                        {
                            className: "SimpleScene",
                            arguments: { name: "Game1", },
                            label: "game1",
                        },
                        {
                            className: "SimpleScene",
                            arguments: { name: "Game2", },
                            label: "game2",
                        },
                        {
                            className: "tm.game.ResultScene",
                            label: "result",
                            nextLabel: "title",
                        },
                    ],
                });
            },

            onfinish: function() {
                console.log("finish!");
            }
        });
    });


    testhelper.it("nextArguments", function() {

        tm.define("SimpleScene", {
            superClass: "tm.app.Scene",

            init: function(param) {
                this.superInit();

                this.name = param.name;
                this.label = tm.display.Label("name: {name}".format(param))
                    .setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y)
                    .addChildTo(this);

                // 次のシーンに渡すパラメータ
                this.nextArguments = {
                    "name": "書き換えたよ♪"
                };
            },
            onpointingstart: function() {
                this.app.popScene();
            },
        });

        tm.define("MainScene", {
            superClass: "tm.game.ManagerScene",
         
            init: function() {
                this.superInit({
                    scenes: [
                        {
                            className: "tm.game.TitleScene",
                            label: "title",
                        },
                        {
                            className: "SimpleScene",
                            arguments: { name: "Game1", },
                            label: "game1",
                        },
                        {
                            className: "SimpleScene",
                            arguments: { name: "Game2", },
                            label: "game2",
                        },
                        {
                            className: "tm.game.ResultScene",
                            label: "result",
                            nextLabel: "title",
                        },
                    ],
                });
            },

            onfinish: function() {
                console.log("finish!");
            }
        });
    });



});




testhelper.describe("tm.game.CountScene", function() {

    testhelper.it("init", function() {

        tm.define("MainScene", {
            superClass: "tm.game.CountScene",
         
            init: function() {
                this.superInit({
                    count: 10,
                });
            },
            onfinish: function() {
                console.log("finish!");
            },
        });
    });

    testhelper.it("start", function() {

        tm.define("MainScene", {
            superClass: "tm.game.CountScene",
         
            init: function() {
                this.superInit({
                    count: [3, 2, 1, 'Start'],
                    fontSize: 100,
                });
            },
            onfinish: function() {
                console.log("finish!");
            },
        });
    });

    testhelper.it("ready", function() {

        tm.define("MainScene", {
            superClass: "tm.game.CountScene",
         
            init: function() {
                this.superInit({
                    count: ['Ready'],
                    fontSize: 100,
                });
            },
            onfinish: function() {
                console.log("finish!");
            },
        });
    });

});


;(function() {





/*
 * managerscene.js
 */

})

