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

    tm.asset.Font.checkLoaded = function(font, callback) {
        var element = tm.dom.Element("body").create("span");
        element.style
            .set("color", "rgba(0, 0, 0, 0)")
            .set("fontSize", "40px");
        element.text = "QW@HhsXJ=/()あいうえお＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝";

        var before = element.element.offsetWidth;
        element.style
            .set("fontFamily", "'{0}', 'monospace'".format(font));

        var checkLoadFont = function() {
            if (element.element.offsetWidth !== before) {
                element.remove();
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
