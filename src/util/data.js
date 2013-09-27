/*
 * util/data.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.DataManager
     * データマネージャ
     */
    tm.util.DataManager = {
        data: {}
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.DataManager.save = function() {
        // TODO: ローカルストレージ?
        for (var key in this.data) {
            var data = this.data[key];
            localStorage[key] = JSON.stringify( data );
        }
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.DataManager.load = function(key) {
        // TODO: ローカルストレージ?
        for (var key in localStorage) {
            this.data[key] = JSON.parse(localStorage[key]);
        }
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.DataManager.set = function(key, value) {
        this.data[key] = value;
        return this;
    };

    /**
     * @static
     * @method
     * @TODO ?
     */
    tm.util.DataManager.get = function(key) {
        return this.data[key];
    };
    
    
    // tm.addLoadCheckList(tm.util.DataManager);
    
})();