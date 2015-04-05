/*
 * ResultScene
 */

    
(function() {

    tm.define("tm.game.ResultScene", {
        superClass: "tm.app.Scene",

        init: function(param) {
            this.superInit();

            param = {}.$extend(tm.game.ResultScene.default, param);
            this.param = param;

            var userData = this._getUserData();
            var bestScore = (userData.bestScore) ? userData.bestScore : 0;
            var highScoreFlag = (param.score > bestScore);

            if (param.record) {
                if (highScoreFlag) {
                    userData.bestScore = param.score;
                    this._record(userData);
                }
            }

            this.fromJSON({
                children: {
                    bg: {
                        type: "tm.display.RectangleShape",
                        init: {
                            width: param.width,
                            height: param.height,
                            fillStyle: param.bgColor,
                            strokeStyle: "transparent",
                        },
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

            var baseLabelParam = {
                type: "Label",
                fillStyle: param.fontColor,
                fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
            };

            this.fromJSON({
                children: {
                    scoreText: baseLabelParam.$extend({
                        text: "score",
                        x: this._toGridX(4),
                        y: this._toGridY(3),
                        fontSize: param.fontSize*0.5,
                    }),
                    scoreLabel: {
                        type: "Label",
                        text: param.score,
                        x: this._toGridX(4),
                        y: this._toGridY(4),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                    },
                    bestText: {
                        type: "Label",
                        text: "best",
                        x: this._toGridX(8),
                        y: this._toGridY(3),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize*0.5,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                    },
                    bestLabel: {
                        type: "Label",
                        text: bestScore,
                        x: this._toGridX(8),
                        y: this._toGridY(4),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                    },

                    newRecordText: {
                        type: "Label",
                        text: "new record!",
                        x: this._toGridX(6),
                        y: this._toGridY(6),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize*0.5,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        visible: false,
                    },

                    messageText: {
                        type: "Label",
                        text: param.message,
                        x: this._toGridX(6),
                        y: this._toGridY(7),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize*0.5,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                    },

                    shareButton: {
                        type: "FlatButton",
                        init: {
                            text: "Share",
                            width: 200,
                            fillStyle: "hsl(240, 100%, 64%)",
                        },
                        x: this._toGridX(4),
                        y: this._toGridY(9),
                    },
                    backButton: {
                        type: "FlatButton",
                        init: {
                            text: "Back",
                            width: 200,
                            fillStyle: "hsl(240, 80%, 0%)",
                        },
                        x: this._toGridX(8),
                        y: this._toGridY(9),
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

            // setup back
            this.backButton.onpointingstart = this._back.bind(this);
            this.autopop = param.autopop;

            // setup record
            if (highScoreFlag) {
                this.newRecordText.show();
                this.newRecordText.tweener
                    .set({alpha:0.0})
                    .fadeIn(2000)
                    .setLoop(true)
                    ;
            }
        },

        _getUserData: function() {
            var key = location.pathname.toCRC32();
            var data = localStorage.getItem(key);
            return (data) ? JSON.parse(data) : {};
        },

        _record: function(data) {
            var key = location.pathname.toCRC32();
            var dataString = JSON.stringify(data);
            localStorage.setItem(key, dataString);
            return this;
        },

        _toGridX: function(index) {
            return this.param.width/12*index;
        },

        _toGridY: function(index) {
            return this.param.height/12*index;
        },

        _back: function() {
            this.flare("finish");

            if (this.autopop) {
                this.app.popScene();
            }
        },
    });

    tm.game.ResultScene.default = {
        score: 0,
        message: "this is tmlib.js project.",
        hashtags: "tmlibjs,game",
        related: "tmlib.js tmlife javascript",
        url: "http://phi-jp.github.io/tmlib.js/",

        width: 640,
        height: 960,
        fontColor: "#444",
        fontSize: 90,
        bgColor: "rgba(255,255,255, 0.9)",
        bgImage: null,
        record: true,
        autopop: true,
    };

})();

