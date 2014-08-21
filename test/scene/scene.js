

/*
 * loadingscene
 */
tm.define("tests.loadingscene.test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
    },
    
    onenter: function() {
        
        var loading = tm.scene.LoadingScene({
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
        
    }

});


/*
 * titlescene
 */

tm.define("tests.titlescene.test", {
    superClass: "tm.scene.TitleScene",
 
    init: function() {
        this.superInit({
            title: "hoge",
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            // bgColor: "red",
            // fontColor: "#222",
        });
    },

    onfinish: function() {
        console.log("finish!");
    }
});




/*
 * resultscene
 */

tm.define("tests.resultscene.test", {
    superClass: "tm.scene.ResultScene",
 
    init: function() {
        this.superInit({
            // title: "hoge",
            // width: SCREEN_WIDTH,
            // height: SCREEN_HEIGHT,
            // bgColor: "red",
            // titleColor: "#222",
        });
    },

    onfinish: function() {
        console.log("finish!");
    }
});





/*
 * numericalinputscene
 */

tm.define("tests.numericalinputscene.test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

    },

    onenter: function() {
        var scene = tm.scene.NumericalInputScene();
        scene.ondecided = function(e) {
            alert(e.value);
        };
        this.app.pushScene(scene);
    },

});






/*
 * managerscene.js
 */
tm.define("TestScene", {
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


tm.define("tests.managerscene.test", {
    superClass: "tm.scene.ManagerScene",
 
    init: function() {
        this.superInit({
            scenes: [
                {
                    className: "TestScene",
                    arguments: {
                        name: "Title",
                    },
                    label: "title",
                },
                {
                    className: "TestScene",
                    arguments: {
                        name: "Game",
                    },
                    label: "game",
                },
                {
                    className: "tm.scene.ResultScene",
                    arguments: {
                        name: "Result",
                    },
                    label: "result",
                    nextLabel: "title",
                },
            ],
        });
    },

    ongoto: function(e) {
        console.log(this.currentScene.name);
    },

    // onstart: function() {
    //     this.gotoScene(0);
    // },

    // onnext: function(e) {
    //     if (this.getCurrentLabel() == "result") {
    //         alert("終わり");
    //     }
    //     else {
    //         this.gotoNext();
    //     }
    // },

    onfinish: function() {
        console.log("finish!");
    }
});
