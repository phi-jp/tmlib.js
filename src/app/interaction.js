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
        hitTestFunc: null,
        
        _boundingType: "circle",
        
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
                elm.dispatchEvent( tm.event.MouseEvent("mouseover", app) );
                elm.dispatchEvent( tm.event.TouchEvent("touchover", app) );
                elm.dispatchEvent( tm.event.PointingEvent("pointingover", app) );
            }
            
            if (prevHitFlag && !this.hitFlag) {
                elm.dispatchEvent( tm.event.MouseEvent("mouseout", app) );
                elm.dispatchEvent( tm.event.TouchEvent("touchout", app) );
                elm.dispatchEvent( tm.event.PointingEvent("pointingout", app) );
            }
            
            if (this.hitFlag) {
                if (p.getPointingStart()) {
                    elm.dispatchEvent( tm.event.MouseEvent("mousedown", app) );
                    elm.dispatchEvent( tm.event.TouchEvent("touchstart", app) );
                    elm.dispatchEvent( tm.event.PointingEvent("pointingstart", app) );
                    this.downFlag = true;
                }
            }
            
            if (this.downFlag) {
                elm.dispatchEvent( tm.event.MouseEvent("mousemove", app) );
                elm.dispatchEvent( tm.event.TouchEvent("touchmove", app) );
                elm.dispatchEvent( tm.event.PointingEvent("pointingmove", app) );
            }
            
            if (this.downFlag==true && p.getPointingEnd()) {
                elm.dispatchEvent( tm.event.MouseEvent("mouseup", app) );
                elm.dispatchEvent( tm.event.TouchEvent("touchend", app) );
                elm.dispatchEvent( tm.event.PointingEvent("pointingend", app) );
                this.downFlag = false;
            }
        },
        
        setBoundingType: function(type) { this.boundingType = type; },
        
        _setHitTestFunc: function() {
            if (this.boundingType == "rect") {
                this.hitTestFunc = tm.app.CanvasElement.prototype.isHitPointRectHierarchy;
            }
            else if (this.boundingType == "circle") {
                this.hitTestFunc = tm.app.CanvasElement.prototype.isHitPointCircleHierarchy;
            }
            else {
                this.hitTestFunc = function() { return true };
            }
            return this;
        },
        
    });
    
    /**
     * @property    boundingType
     * バウンディングタイプ
     */
    tm.app.Interaction.prototype.accessor("boundingType", {
        "get": function()   { return this._boundingType; },
        "set": function(v)  { this._boundingType = v; this._setHitTestFunc(); }
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






