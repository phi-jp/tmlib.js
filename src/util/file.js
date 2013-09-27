/*
 * file.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.File
     * @TODO ?
     */
    tm.util.File = tm.createClass({

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(params) {
            this.loaded = false;
            if (arguments.length == 1) {
                this.loadFile(params);
            }
        },
        
        /**
         * @property
         * @TODO ?
         */
        loadFile: function(params) {
            if (typeof params == "string") {
                var url = params;
                params = { url: url, };
            }
            
            var self = this;
            params.success = function(data) {
                self.loaded = true;
                self.data = data;
            };
            tm.util.Ajax.load(params);
        },
        
        /**
         * @property
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