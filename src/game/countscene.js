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
                        fontSize: 200,
                        x: SCREEN_CENTER_X,
                        y: SCREEN_CENTER_Y,
                    },
                }
            });

            this.counter = param.count;
            this.autopop = param.autopop;
            this._updateCount();
        },

        _updateCount: function() {
            var endFlag = this.counter <= 0;

            this.label.text = this.counter--;

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