tm.asset = tm.asset || {};

(function() {

    tm.define("tm.asset.Font", {
        superClass: "tm.event.EventDispatcher",

        init: function(path, key) {
            this.superInit();

            var testElement = tm.dom.Element("body").create("span");
            testElement.style
                .set("color", "rgba(0, 0, 0, 0)")
                .set("fontSize", "40px");
            testElement.text = "QW@HhsXJ=/()あいうえお＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝";

            var before = testElement.element.offsetWidth;

            testElement.style
                .set("fontFamily", "'{0}', 'monospace'".format(key));

            var fontFaceStyleElement = tm.dom.Element("head").create("style");
            fontFaceStyleElement.text = "@font-face { font-family: '{0}'; src: url({1}) format('truetype'); }".format(key, path);

            var checkLoadFont = function() {
                if (testElement.element.offsetWidth !== before) {
                    testElement.remove();
                    this.flare("load");
                    console.debug("webfont loaded", path, key);
                } else {
                    setTimeout(checkLoadFont, 100);
                }
            }.bind(this);
            setTimeout(checkLoadFont, 100);
        },
    });

    tm.asset.Loader.register("ttf", function(path, key) {
        return tm.asset.Font(path, key);
    });
    tm.asset.Loader.register("otf", function(path, key) {
        return tm.asset.Font(path, key);
    });
    tm.asset.Loader.register("woff", function(path, key) {
        return tm.asset.Font(path, key);
    });

})();
