/*
 * data.js
 */


(function() {
    
    /**
     * @class
     * データマネージャ
     */
    tm.util.DataManager = {
        data: {}
    };
    
    tm.util.DataManager.save = function(key)
    {
        // TODO: ローカルストレージ?
    };
    
    tm.util.DataManager.load = function(key, params)
    {
        // TODO: ローカルストレージ?
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