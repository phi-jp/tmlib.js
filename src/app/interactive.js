/*
 * interactive.js
 */

tm.app = tm.app || {};



(function() {
    
    var _interactiveUpdate = function(app)
    {
        
    };
    
    /**
     * @class
     */
    tm.app.InteractiveCanvasElement = tm.createClass({
        
        superClass: tm.app.CanvasElement,
        
        /**
         * 初期化
         */
        init: function() {
            this.superInit();
        },
        
        /**
         * @method
         * 更新
         */
        update: _interactiveUpdate,
        
    });
    
    
    tm.app.Element.prototype.interact = function() {
        this.update = _interactiveUpdate;
    };
    
})();