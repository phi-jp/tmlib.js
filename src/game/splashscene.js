/*
 * splash
 */

;(function() {
    var SPLASH_IMAGE_PATH = "https://files.gitter.im/phi-jp/tmlib.js/t5F7/splash.png";

    tm.define("SplashScene", {
        superClass: "tm.app.Scene",

        init: function(param) {
            this.superInit();

            this.param = param;

            this.splashImage = tm.asset.Texture(param.path || SPLASH_IMAGE_PATH);
            this.splashImage.onload = this._init.bind(this);
        },

        _init: function() {
            var width = this.param.width;
            var height = this.param.height;
            
            tm.display.Shape({
                width: width,
                height: height,
                bgColor: "white"
            }).setOrigin(0, 0).addChildTo(this);

            tm.display.Sprite(this.splashImage, width, height)
                .setOrigin(0, 0)
                .setAlpha(0)
                .addChildTo(this)
                .tweener
                    .clear()
                    .wait(250)
                    .fadeIn(500)
                    .wait(1000)
                    .fadeOut(500)
                    .wait(250)
                    .call(function() {
                        this.app.popScene();
                    }.bind(this));
        },
    });
})();

