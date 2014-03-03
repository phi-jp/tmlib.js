/*
 * file.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.File
     * ファイルクラス
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
         * ロード
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
         * ローカルストレージからロード
         */
        loadLocalStorage: function() {
            
        },
        

    });
    
    
})();


