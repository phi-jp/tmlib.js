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
        enabled: true,
        
        init: function(element) {
            this.element = element;
            this.setBoundingType("circle");
        },
        
        update: function(app) {
            if (this.enabled === false) return ;
            
            var elm = this.element;
            var p   = app.pointing;
            
            var prevHitFlag = this.hitFlag;
            
            this.hitFlag    = this.hitTestFunc.call(elm, p.x, p.y);
            
            if (!prevHitFlag && this.hitFlag) {
                var e = tm.event.Event("mouseover");
                e.app = app;
                elm.dispatchEvent(e);
            }
            
            if (prevHitFlag && !this.hitFlag) {
                elm.dispatchEvent(tm.event.Event("mouseout"));
            }
            
            if (this.hitFlag) {
                if (p.getPointingStart()) {
                    var e = tm.event.Event("mousedown");
                    e.app = app;
                    elm.dispatchEvent(e);
                    this.downFlag = true;
                }
            }
            
            if (this.downFlag) {
                var e = tm.event.Event("mousemove");
                e.app = app;
                elm.dispatchEvent(e);
            }
            
            if (this.downFlag==true && p.getPointingEnd()) {
                elm.dispatchEvent(tm.event.Event("mouseup"));
                this.downFlag = false;
            }
        },
        
        setBoundingType: function(type) {
            if (type == "rect") {
                this.hitTestFunc = tm.app.CanvasElement.prototype.isHitPointRectHierarchy;
            }
            else if (type == "circle"){
                this.hitTestFunc = tm.app.CanvasElement.prototype.isHitPointCircleHierarchy;
            }
            else {
                this.hitTestFunc = function() { return true };
            }
            return this;
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






