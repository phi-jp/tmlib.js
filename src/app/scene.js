/*
 * 
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * シーンとして使用するゲームエレメントクラス
     */
    tm.app.Scene = tm.createClass({
        
        superClass: tm.app.CanvasElement,
        
        /**
         * 初期化
         */
        init: function() {
            tm.app.CanvasElement.prototype.init.apply(this);
            
            this.background = "black";
        },
        
    });
    
})();
