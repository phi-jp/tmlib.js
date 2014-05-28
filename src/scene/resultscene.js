/*
 * ResultScene
 */

    
(function() {

    tm.define("tm.scene.ResultScene", {
        superClass: "tm.app.Scene",

        init: function(param) {
            this.superInit();

            param = {}.$extend(tm.scene.ResultScene.default, param);

            this.fromJSON({
                children: {
                    bg: {
                        type: "tm.display.RectangleShape",
                        init: [param.width, param.height, {
                            fillStyle: param.bgColor,
                            strokeStyle: "transparent",
                        }],
                        originX: 0,
                        originY: 0,
                    }
                }
            });

            if (param.bgImage) {
                this.fromJSON({
                    children: {
                        bgImage: {
                            type: "tm.display.Sprite",
                            init: [param.bgImage],
                            originX: 0,
                            originY: 0,
                        }
                    }
                });
            }

            this.fromJSON({
                children: {
                    scoreLabel: {
                        type: "Label",
                        text: param.title,
                        x: param.width/2,
                        y: param.height/10*2,
                        fillStyle: param.titleColor,
                        fontSize: param.titleSize,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        align: "center",
                        baseline: "middle",
                    },
                    touchLabel: {
                        type: "Label",
                        text: "TOUCH START",
                        x: param.width/2,
                        y: param.height/10*8,
                        fillStyle: param.titleColor,
                        fontSize: 26,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        align: "center",
                        baseline: "middle",
                    }
                }
            });

            this.autopop = param.autopop;
        },

        onpointingstart: function() {
            this.flare("finish");

            if (this.autopop) {
                this.app.popScene();
            }
        },
    });

    tm.scene.ResultScene.default = {
        score: 256,
        message: "this is tmlib.js",
        hashtags: "tmlibjs,game",
        related: "tmlib.js tmlife javascript",
        url: "http://phi-jp.github.io/tmlib.js/",

        width: 640,
        height: 960,
        bgColor: "white",
        bgImage: null,
        autopop: true,
    };

})();

