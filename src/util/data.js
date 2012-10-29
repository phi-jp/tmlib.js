/*
 * data.js
 */

tm.util = tm.util || {};

(function() {
    
    /**
     * @class
     * データマネージャ
     */
    tm.util.DataManager = {
        data: {}
    };
    
    tm.util.DataManager.save = function()
    {
        // TODO: ローカルストレージ?
        for (var key in this.data) {
            var data = this.data[key];
            localStorage[key] = JSON.stringify( data );
        }
    };
    
    tm.util.DataManager.load = function(key)
    {
        // TODO: ローカルストレージ?
        for (var key in localStorage) {
            this.data[key] = JSON.parse(localStorage[key]);
        }
    };
    
    tm.util.DataManager.set = function(key, value)
    {
        this.data[key] = value;
        return this;
    };
    
    tm.util.DataManager.get = function(key) {
        return this.data[key];
    };
    
    
    // tm.addLoadCheckList(tm.util.DataManager);
    
})();