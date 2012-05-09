/*
 * file.js
 */

tm.util = tm.util || {};

(function() {
    
    tm.util.File = tm.createClass({
        
        init: function(params) {
            this.loaded = false;
            if (arguments.length == 1) {
                this.loadFile(params);
            }
        },
        
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
        
        loadLocalStorage: function() {
            
        },
        
    });
    
    
})();



(function() {
    
    /**
     * @class
     * ファイルマネージャ
     */
    tm.util.FileManager = {
        files: {}
    };
    
    tm.util.FileManager.load = function(key, params)
    {
        var file = tm.util.File(params);
        this.files[key] = file;
        return file;
    };
    
    tm.util.FileManager.get = function(key) {
        return this.files[key];
    };
    
    /**
     * @static
     * @method  isLoaded
     * ロードチェック
     */
    tm.util.FileManager.isLoaded = function()
    {
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