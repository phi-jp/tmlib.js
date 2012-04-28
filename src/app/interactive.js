/*
 * interactive.js
 */

tm.app = tm.app || {};



(function() {
    
    var _interactiveUpdate = function(app)
    {
        var prevOnMouseFlag = this._onMouseFlag;
        this._onMouseFlag   = this.isHitPoint(app.pointing.x, app.pointing.y);
        
        if (!prevOnMouseFlag && this._onMouseFlag) {
            this.dispatchEvent(tm.app.Event("mouseover"));
        }
        
        if (prevOnMouseFlag && !this._onMouseFlag) {
            this.dispatchEvent(tm.app.Event("mouseout"));
        }
        
        if (this._onMouseFlag) {
            if (app.pointing.getPointingStart()) {
                this.dispatchEvent(tm.app.Event("mousedown"));
                this.mouseDowned = true;
            }
            
            this.dispatchEvent(tm.app.Event("mousemove"));
        }
        
        if (this.mouseDowned==true && app.pointing.getPointingEnd()) {
            this.dispatchEvent(tm.app.Event("mouseup"));
            this.mouseDowned = false;
        }
        
        // 衝突判定
        this.dispatchEvent(tm.app.Event("enterframe"));
    };
    
    /**
     * @class
     * インタラクティブキャンバスクラス
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