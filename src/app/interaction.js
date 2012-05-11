/*
 * interactive.js
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * インタラクティブクラス
     */
    tm.app.Interaction = tm.createClass({
        
        hitFlag: false,
        downFlag: false,
        
        init: function(element) {
            this.element = element;
        },
        
        update: function(app) {
            var elm = this.element;
            var p   = app.pointing;
            
            var prevHitFlag = this.hitFlag;
            
            this.hitFlag   = elm.isHitPoint(p.x, p.y);
            
            if (!prevHitFlag && this.hitFlag) {
                var e = tm.app.Event("mouseover");
                e.app = app;
                elm.dispatchEvent(e);
            }
            
            if (prevHitFlag && !this.hitFlag) {
                elm.dispatchEvent(tm.app.Event("mouseout"));
            }
            
            if (this.hitFlag) {
                if (p.getPointingStart()) {
                    var e = tm.app.Event("mousedown");
                    e.app = app;
                    elm.dispatchEvent(e);
                    this.downFlag = true;
                }
            }
            
            if (this.downFlag) {
                var e = tm.app.Event("mousemove");
                e.app = app;
                elm.dispatchEvent(e);
            }
            
            if (this.downFlag==true && p.getPointingEnd()) {
                elm.dispatchEvent(tm.app.Event("mouseup"));
                this.downFlag = false;
            }
        },
        
    });
    
    
    /**
     * @member      tm.app.Element
     * @property    interaction
     * インタラクション
     */
    tm.app.Element.prototype.getter("interaction", function() {
        if (!this._interaction) {
            this._interaction = tm.app.Interaction(this);
            this.addEventListener("enterframe", function(e){
                this._interaction.update(e.app);
            });
        }
        
        return this._interaction;
    });
    
})();






