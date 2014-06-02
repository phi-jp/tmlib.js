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
                    scoreText: {
                        type: "Label",
                        text: "score",
                        x: param.width/2,
                        y: param.height/10*2,
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize*0.5,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        align: "center",
                        baseline: "middle",
                    },
                    scoreLabel: {
                        type: "Label",
                        text: param.score,
                        x: param.width/2,
                        y: param.height/10*3,
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        align: "center",
                        baseline: "middle",
                    },
                    shareButton: {
                        type: "FlatButton",
                        init: [
                            {
                                text: "Share",
                                width: 200,
                                bgColor: "hsl(240, 80%, 70%)",
                            }
                        ],
                        x: param.width/10*3,
                        y: param.height/10*7,
                    },
                    backButton: {
                        type: "FlatButton",
                        init: [
                            {
                                text: "Back",
                                width: 200,
                                bgColor: "hsl(240, 80%, 0%)",
                            }
                        ],
                        x: param.width/10*7,
                        y: param.height/10*7,
                    }
                }
            });

            // setup tweet
            var text = "SCORE: {score}, {message}".format(param);
            var twitterURL = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : text,
                hashtags: param.hashtags,
                url     : param.url, // or window.document.location.href
            });
            this.shareButton.onclick = function() {
                window.open(twitterURL, 'share window', 'width=400, height=300');
            };

            // back
            this.backButton.onpointingstart = this._back.bind(this);

            this.autopop = param.autopop;
        },

        _back: function() {
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
        fontColor: "#444",
        fontSize: 90,
        bgColor: "rgb(240,240,240)",
        bgImage: null,
        autopop: true,
    };

})();

