/*
 * countscene.js
 */

;(function() {

    tm.define("tm.game.CountScene", {
        superClass: "tm.app.Scene",

        init: function(param) {
            this.superInit();

            param = param.$safe({
                width: 640,
                height: 960,
                bgColor: '#444',
                count: 3,
                autopop: true,
                fontSize: 180,
            });

            param = param || {};

            this.fromJSON({
                children: {
                    bg: {
                        type: "tm.display.Shape",
                        width: param.width,
                        height: param.height,
                        bgColor: param.bgColor,
                        originX: 0,
                        originY: 0,
                    },
                    label: {
                        type: "tm.display.Label",
                        fillStyle: "white",
                        fontSize: param.fontSize,
                        x: SCREEN_CENTER_X,
                        y: SCREEN_CENTER_Y,
                    },
                }
            });

            if (param.count instanceof Array) {
                this.countList = param.count.reverse();
            }
            else {
                this.countList = Array.range(1, param.count+1);
            }
            this.counter = this.countList.length;
            this.autopop = param.autopop;
            this._updateCount();
        },

        _updateCount: function() {
            var endFlag = this.counter <= 0;
            var index = --this.counter;

            this.label.text = this.countList[index];

            this.label.scale.set(1, 1);
            this.label.tweener
                .clear()
                .to({
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                }, 250)
                .wait(500)
                .to({
                    scaleX: 1.5,
                    scaleY: 1.5,
                    alpha: 0.0
                }, 250)
                .call(function() {
                    if (this.counter <= 0) {
                        this.flare('finish');
                        if (this.autopop) {
                            this.app.popScene();
                        }
                    }
                    else {
                        this._updateCount();
                    }
                }, this);
        },

    });

})();