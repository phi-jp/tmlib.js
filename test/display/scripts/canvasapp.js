tm.define("tests.canvasapp.scene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var self = this;


        tm.define("TitleScene", {
            superClass: "tm.app.TitleScene",

            init: function() {
                this.superInit({
                    width: 640,
                    height: 480,
                    backgroundImage: "title-bg"
                });
            },

            onnextscene: function() {
                app.replaceScene(ResultScene());
            },
        });

        tm.define("ResultScene", {
            superClass: "tm.app.ResultScene",

            init: function() {
                this.superInit({
                    width: 640,
                    height: 480,
                    backgroundImage: "result-bg"
                });
            },

            onnextscene: function() {
                app.replaceScene(TitleScene());
            },
        });
    },

    onpointingstart: function() {
        var ASSETS = {
            "title-bg": "http://dummyimage.com/300?.png",
            "result-bg": "http://dummyimage.com/400?.png"
        };
        var loadingScene = tm.ui.LoadingScene({
            assets: ASSETS,
            nextScene: TitleScene,
        });
        app.replaceScene(loadingScene);
    }

});




tm.define("tests.canvasapp.push", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.labelX = 50;
        this.labelY = 0;

        this.addIndex = 0;
        this.addableFlag = true;
    },

    onenter: function() {
        this.pushScene();
    },

    pushScene: function() {

        if (this.addableFlag == false) {
            this.app.popScene();
        }
        else {
            var scene = this.createScene();
            this.app.pushScene(scene);
        }

        if (this.addIndex++ > 4) {
            this.addableFlag = false;
        }
    },

    createScene: function() {
        var scene = tm.app.Scene();

        scene.fromJSON({
            children: {
                label: {
                    type: "Label",
                    text: "SCENE だよ:" + this.addIndex,
                    x: this.labelX+=50,
                    y: this.labelY+=40,
                    fillStyle: "red",
                }
            }
        });

        scene.onpointingstart = function() {
            this.pushScene();
        }.bind(this);

        return scene;
    },

});


tm.define("tests.canvasapp.result", {
    superClass: "tm.app.ResultScene",
 
    init: function() {
        this.superInit({

        });
    },

    onnextscene: function() {
        this.app.replaceScene(tm.app.Scene());
    }

});
