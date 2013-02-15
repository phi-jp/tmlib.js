/*
 * script.js
 */

tm.util = tm.util || {};

(function() {
    
    /**
     * @class
     * スクリプトクラス
     */
    tm.util.Script = tm.createClass({
        
        element: null,
        loaded: false,
        
        /**
         * 初期化
         */
        init: function(src, callback) {
            this.loaded = false;
            this.element = document.createElement("script");
            this.element.type = "text/javascript";
            this.element.src = src;
            this.element.charset = "UTF-8";
            this.element.setAttribute("defer", true);
            document.head.appendChild(this.element);
            
            var self = this;
            this.element.onload = function() {
                if (callback) callback.call(this);
                self.loaded = true;
            };
        },
        
        getElement: function() {
            return this.element;
        },
        
    });
    
})();

(function(){
    
    /**
     * @class
     * スクリプトマネージャクラス
     */
    tm.util.ScriptManager = {
        scriptList: {},
        loaded: true,
    };
    
    /**
     * @static
     * @method
     * 追加
     */
    tm.util.ScriptManager.load = function(src, callback)
    {
        this.scriptList[src] = tm.util.Script(src, callback);
    };

    /**
     * @static
     * @method
     * stats.js を動的ロード
     */
    tm.util.ScriptManager.loadStats = function(version)
    {
        version = version || "r11";
        var path = null;
        if (["r6", "r7", "r8", "r9", "10"].indexOf(version) != -1) {
            path = "https://raw.github.com/mrdoob/stats.js/" + version + "/build/Stats.js";
        }
        else {
            path = "https://raw.github.com/mrdoob/stats.js/" + version + "/build/stats.min.js";
        }
        this.load(path);
    };

    /**
     * @static
     * @method
     * Dat GUI を動的ロード
     */
    tm.util.ScriptManager.loadDatGUI = function(version)
    {
        // http://dat-gui.googlecode.com/git/build/dat.gui.min.js
        // https://dat-gui.googlecode.com/git-history/0.5/build/dat.gui.min.js

        version = version || "0.5";
//        var path = "https://dat-gui.googlecode.com/git-history/" + version + "/build/dat.gui.min.js";
//        var path = "http://dat-gui.googlecode.com/git/build/dat.gui.min.js";
        var path = "http://dat-gui.googlecode.com/git/build/dat.gui.js";
        this.load(path);
    };

    /**
     * @static
     * @method
     * Three.js を動的ロード
     */
    tm.util.ScriptManager.loadThree = function(version) {
        var THREE_JS_URL = "https://raw.github.com/mrdoob/three.js/{version}/build/three.js";
//        var THREE_JS_URL = "https://raw.github.com/mrdoob/three.js/{version}/build/three.min.js";
        version = version || "r55";

        var path = THREE_JS_URL.format({version: version});

        this.load(path);
    };

    /**
     * @static
     * @method
     * BulletML を動的ロード
     */
    tm.util.ScriptManager.loadBulletML = function(version) {
        var BULLETML_FOR_TMLIB_JS_URL   = "https://raw.github.com/daishihmr/bulletml.js/{version}/target/bulletml.for.tmlib.js";
        version = version || "v0.4.1";
        var path = BULLETML_FOR_TMLIB_JS_URL.format({version: version});        
        this.load(path);
    };
    
    /**
     * ロードチェック
     */
    tm.util.ScriptManager.isLoaded = function()
    {
        if (this.scriptList.length <= 0) return true;

        for (var key in this.scriptList) {
            if (this.scriptList[key].loaded == false) {
                return false;
            }
        }
        return true;
    };
    
    tm.addLoadCheckList(tm.util.ScriptManager);
    
})();


