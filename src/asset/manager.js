/*
 * manager.js
 */

(function() {

    tm.asset = tm.asset || {};
    
    /**
     * アセットマネージャー
     */
    tm.asset.Manager = {
        /** アセット */
        assets: {},
        
        /**
         * アセットのゲット
         * @param {Object} key
         */
        get: function(key) {
            return this.assets[key];
        },

        /**
         * アセットのセット
         * @param {Object} key
         * @param {Object} asset
         */
        set: function(key, asset) {
            this.assets[key] = asset;
            return this;
        },

        /**
         * キーと一致するアセットを含んでいるか
         * @param {Object} key
         */
        contains: function(key) {
            return (this.assets[key]) ? true : false;
        },

    };

})();










