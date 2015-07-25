tm.asset = tm.asset || {};

(function() {

    tm.define("tm.asset.Font", {
        superClass: "tm.event.EventDispatcher",

        init: function(path, key, format) {
            this.superInit();

            var fontFaceStyleElement = tm.dom.Element("head").create("style");
            fontFaceStyleElement.text = "@font-face { font-family: '{0}'; src: url({1}) format('{2}'); }".format(key, path, format);

            tm.asset.Font.checkLoaded(key, function() {
                this.flare("load");
            }.bind(this));
        },
    });

    tm.asset.Font.checkLoaded = function (font, callback) {
        var canvas = tm.graphics.Canvas();
        var DEFAULT_FONT = canvas.context.font.split(' ')[1];
        canvas.context.font = '40px ' + DEFAULT_FONT;

        var checkText = "1234567890-^\\qwertyuiop@[asdfghjkl;:]zxcvbnm,./\!\"#$%&'()=~|QWERTYUIOP`{ASDFGHJKL+*}ZXCVBNM<>?_１２３４５６７８９０－＾￥ｑｗｅｒｔｙｕｉｏｐａｓｄｆｇｈｊｋｌｚｘｃｖｂｎｍ，．あいうかさたなをん時は金なり";

        var before = canvas.context.measureText(checkText).width;
        canvas.context.font = '40px ' + font + ', ' + DEFAULT_FONT;

        var checkLoadFont = function () {
            if (canvas.context.measureText(checkText).width !== before) {
                callback && callback();
            } else {
                setTimeout(checkLoadFont, 100);
            }
        };
        setTimeout(checkLoadFont, 100);
    };

    tm.asset.Loader.register("ttf", function(path, key) {
        return tm.asset.Font(path, key, "truetype");
    });
    tm.asset.Loader.register("otf", function(path, key) {
        return tm.asset.Font(path, key, "opentype");
    });
    tm.asset.Loader.register("woff", function(path, key) {
        return tm.asset.Font(path, key, "woff");
    });
    tm.asset.Loader.register("woff2", function(path, key) {
        return tm.asset.Font(path, key, "woff2");
    });

})();
