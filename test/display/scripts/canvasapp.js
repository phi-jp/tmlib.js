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

