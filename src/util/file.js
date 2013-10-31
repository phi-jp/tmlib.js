/*
 * file.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.File
     * @TODO ?
     */
    tm.define("tm.util.File", {
        superClass: "tm.event.EventDispatcher",

        /** deta */
        data: null,
        /** deta */
        loaded: false,

        /**
         * @constructor
         */
        init: function(params) {
            this.superInit();

            this.loaded = false;
            if (arguments.length == 1) {
                this.load(params);
            }
        },
        
        /**
         * @TODO ?
         */
        load: function(params) {
            if (typeof params == "string") {
                var url = params;
                params = { url: url, };
            }
            
            var self = this;
            params.success = function(data) {
                self.setData(data);
                var e = tm.event.Event("load");
                self.dispatchEvent( e );
            };
            tm.util.Ajax.load(params);
        },

        /**
         * setData
         */
        setData: function(data) {
            this.data = data;
            this.loaded = true;
        },
        
        /**
         * @TODO ?
         */
        loadLocalStorage: function() {
            
        },
        

    });
    
    
})();



(function() {
    
    /**
     * @class tm.util.FileManager
     * ファイルマネージャ
     */
    tm.util.FileManager = {
        files: {}
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.FileManager.load = function(key, params) {
        var file = tm.util.File(params);
        this.files[key] = file;
        return file;
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.FileManager.get = function(key) {
        return this.files[key];
    };
    
    /**
     * @static
     * @method  isLoaded
     * ロードチェック
     */
    tm.util.FileManager.isLoaded = function() {
        for (var key in this.files) {
            var file = this.files[key];
            
            if (file.loaded == false) {
                return false;
            }
        }
        return true;
    };
    
    tm.addLoadCheckList(tm.util.FileManager);
    
})();