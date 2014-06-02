/*
 * TitleScene
 */

    
(function() {

    tm.define("tm.scene.TitleScene", {
        superClass: "tm.app.Scene",

        init: function(param) {
            this.superInit();

            param = {}.$extend(tm.scene.TitleScene.default, param);

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
                    titleLabel: {
                        type: "Label", name: "titleLabel",
                        text: param.title,
                        x: param.width/2,
                        y: param.height/10*2,
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        align: "center",
                        baseline: "middle",
                    },
                    touchLabel: {
                        type: "Label", name: "nextLabel",
                        text: "TOUCH START",
                        x: param.width/2,
                        y: param.height/10*8,
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

        onpointingstart: function() {
            this.flare("finish");

            if (this.autopop) {
                this.app.popScene();
            }
        },
    });

    tm.scene.TitleScene.default = {
        title: "Time is money",
        fontSize: 72,
        fontColor: "#444",
        width: 640,
        height: 960,
        bgColor: "rgb(240,240,240)",
        bgImage: null,
        autopop: true,
    };

})();

