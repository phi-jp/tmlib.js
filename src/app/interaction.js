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

            this.hitFlags = [];
            this.downFlags= [];
        },
        
        update: function(app) {
            if (this.enabled === false) return ;

            var elm = this.element;
            var p   = app.pointing;
            
            var prevHitFlag = this.hitFlag;
            
            this.hitFlag    = elm.isHitPoint(p.x, p.y);
            
            if (!prevHitFlag && this.hitFlag) {
                this._dispatchEvent("mouseover", "touchover", "pointingover");
            }
            
            if (prevHitFlag && !this.hitFlag) {
                this._dispatchEvent("mouseout", "touchout", "pointingout");
            }
            
            if (this.hitFlag) {
                if (p.getPointingStart()) {
                    this._dispatchEvent("mousedown", "touchstart", "pointingstart");
                    this.downFlag = true;
                }
            }
            
            if (this.downFlag) {
                this._dispatchEvent("mousemove", "touchmove", "pointingmove");
            }
            
            if (this.downFlag==true && p.getPointingEnd()) {
                this._dispatchEvent("mouseup", "touchend", "pointingend");
                this.downFlag = false;
            }
        },

        _check: function(app, p, index) {
            if (this.enabled === false) return ;

            var elm = this.element;
            
            var prevHitFlag = this.hitFlags[index];
            
            this.hitFlags[index]    = elm.isHitPoint(p.x, p.y);
            
            if (!prevHitFlag && this.hitFlags[index]) {
                this._dispatchEvent("mouseover", "touchover", "pointingover", app, p);
            }
            
            if (prevHitFlag && !this.hitFlags[index]) {
                this._dispatchEvent("mouseout", "touchout", "pointingout", app, p);
            }
            
            if (this.hitFlags[index]) {
                if (p.getPointingStart()) {
                    this._dispatchEvent("mousedown", "touchstart", "pointingstart", app, p);
                    this.downFlags[index] = true;
                }
            }
            
            if (this.downFlags[index]) {
                this._dispatchEvent("mousemove", "touchmove", "pointingmove", app, p);
            }
            
            if (this.downFlags[index]==true && p.getPointingEnd()) {
                this._dispatchEvent("mouseup", "touchend", "pointingend", app, p);
                this.downFlags[index] = false;
            }
        },

        _updatePC: function(app) {
            this._check(app, app.pointing, 0);
        },

        _updateMobile: function(app) {
            var self = this;
            app.touches.each(function(touch, i) {
                self._check(app, touch, i);
            });
        },

        _dispatchEvent: function(mouse, touch, pointing, app, p) {
            var elm = this.element;

            elm.dispatchEvent( tm.event.MouseEvent(mouse, app, p) );
            elm.dispatchEvent( tm.event.TouchEvent(touch, app, p) );
            elm.dispatchEvent( tm.event.PointingEvent(pointing, app, p) );
        },
        
        setBoundingType: function(type) { this.boundingType = type; },
    });
    
    tm.app.Interaction.prototype.update = (tm.isMobile) ?
        tm.app.Interaction.prototype._updateMobile : tm.app.Interaction.prototype._updatePC;

    
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






