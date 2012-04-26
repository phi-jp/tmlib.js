/*
 * scene.js
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * イベントクラス
     */
    tm.app.Event = tm.createClass({
        
        /**
         * タイプ
         */
        type: null,
        
        /**
         * 初期化
         */
        init: function(type) {
            this.type = type;
        },
        
    });
    
})();
