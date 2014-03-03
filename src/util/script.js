/*
 * script.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.Script
     * スクリプトクラス
     */

    tm.define("tm.util.Script", {

        superClass: "tm.event.EventDispatcher",

        /** element */
        element: null,
        /** loaded */
        loaded: false,
        
        /**
         * @constructor
         */
        init: function(src) {
            this.superInit();

            this.loaded = false;
            this.element = document.createElement("script");
            this.element.type = "text/javascript";
            this.element.src = src;
            this.element.charset = "UTF-8";
            this.element.setAttribute("defer", true);
            document.head.appendChild(this.element);
            
            var self = this;
            this.element.onload = function() {
                self.loaded = true;
                self.fire(tm.event.Event("load"));
            };
        },
        
        /**
         * getElement
         */
        getElement: function() {
            return this.element;
        },
        
    });

    tm.util.Script.load = function(src) {
        var script = tm.util.Script(src);

        return script;
    };

    /**
     * @static
     * @method
     * Stats を動的ロード
     */
    tm.util.Script.loadStats = function(version) {
        version = version || "r11";
        var path = null;
        if (["r6", "r7", "r8", "r9", "10"].indexOf(version) != -1) {
            path = "http://rawgithub.com/mrdoob/stats.js/" + version + "/build/Stats.js";
        }
        else {
            path = "http://rawgithub.com/mrdoob/stats.js/" + version + "/build/stats.min.js";
        }

        return this.load(path);
    };

    /**
     * @static
     * @method
     * datGUI を動的ロード
     */
    tm.util.Script.loadDatGUI = function(version) {
        // http://dat-gui.googlecode.com/git/build/dat.gui.min.js
        // https://dat-gui.googlecode.com/git-history/0.5/build/dat.gui.min.js

        version = version || "0.5";
//        var path = "https://dat-gui.googlecode.com/git-history/" + version + "/build/dat.gui.min.js";
//        var path = "http://dat-gui.googlecode.com/git/build/dat.gui.min.js";
        var path = "http://dat-gui.googlecode.com/git/build/dat.gui.js";
        return this.load(path);
    };

    /**
     * @static
     * @method
     * Three.js を動的ロード
     */
    tm.util.Script.loadThree = function(version) {
        var THREE_JS_URL = "http://rawgithub.com/mrdoob/three.js/{version}/build/three.js";
//        var THREE_JS_URL = "https://raw.github.com/mrdoob/three.js/{version}/build/three.min.js";
        version = version || "r55";

        var path = THREE_JS_URL.format({version: version});

        return this.load(path);
    };

    /**
     * @static
     * @method
     * BulletML.js を動的ロード
     */
    tm.util.Script.loadBulletML = function(version) {
        var BULLETML_FOR_TMLIB_JS_URL   = "http://rawgithub.com/daishihmr/bulletml.js/{version}/target/bulletml.for.tmlib.js";
        version = version || "v0.4.2";
        var path = BULLETML_FOR_TMLIB_JS_URL.format({version: version});        
        return this.load(path);
    };


})();
