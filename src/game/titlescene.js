/*
 * TitleScene
 */

    
(function() {

    tm.define("tm.game.TitleScene", {
        superClass: "tm.app.Scene",

        init: function(param) {
            this.superInit();

            param = {}.$extend(tm.game.TitleScene.default, param);
            this.param = param;

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

            this.fromJSON({
                children: {
                    titleLabel: {
                        type: "Label", name: "titleLabel",
                        text: param.title,
                        x: this._toGridX(6),
                        y: this._toGridY(3),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        align: "center",
                        baseline: "middle",
                    },
                    messageLabel: {
                        type: "Label", name: "nextLabel",
                        text: param.message || "",
                        x: this._toGridX(6),
                        y: this._toGridY(6),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize*0.36,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        align: "center",
                        baseline: "middle",
                    },
                    touchLabel: {
                        type: "Label", name: "nextLabel",
                        text: "TOUCH START",
                        x: this._toGridX(6),
                        y: this._toGridY(9),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize*0.4,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        align: "center",
                        baseline: "middle",
                    }
                }
            });
            
            this.touchLabel.tweener
                .fadeOut(500)
                .fadeIn(1000)
                .setLoop(true);

            this.autopop = param.autopop;
        },

        _toGridX: function(index) {
            return this.param.width/12*index;
        },

        _toGridY: function(index) {
            return this.param.height/12*index;
        },

        onpointingstart: function() {
            this.flare("finish");

            if (this.autopop) {
                this.app.popScene();
            }
        },
    });

    tm.game.TitleScene.default = {
        title: "Time is money",
        message: "",
        fontSize: 72,
        fontColor: "#444",
        width: 640,
        height: 960,
        bgColor: "rgb(240,240,240)",
        bgImage: null,
        autopop: true,
    };

})();

