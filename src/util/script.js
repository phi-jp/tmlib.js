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


