/*
 * gradient.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    tm.graphics.Canvas.prototype.setGradient = function(gradient) {
        this.context.fillStyle = gradient.gradient;
    };
    
})();

(function() {
    
    /**
     * @class
     * 線形グラデーション
     */
    tm.graphics.LinearGradient = tm.createClass({
        
        init: function(x, y, width, height) {
            this.gradient = dummyContext.createLinearGradient(x, y, width, height);
        },
        
        addColorStop: function(offset, color) {
            this.gradient.addColorStop(offset, color);
            return this;
        },
        
        addColorStopList: function(prop) {
            for (var i=0,len=prop.length; i<len; ++i) {
                var offset  = prop[i].offset;
                var color   = prop[i].color;
                this.addColorStop(offset, color);
            }
            return this;
        },
        
        toStyle: function() {
            return this.gradient;
        },
        
    });
    
    
    var dummyCanvas = document.createElement("canvas");
    var dummyContext= dummyCanvas.getContext("2d");
    
    
})();


(function() {
    
    /**
     * @class
     * 円形グラデーション
     */
    tm.graphics.RadialGradient = tm.createClass({
        
        init: function(x0, y0, r0, x1, y1, r1) {
            this.gradient = dummyContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
        },
        
        addColorStop: function(offset, color) {
            this.gradient.addColorStop(offset, color);
            return this;
        },
        
        addColorStopList: function(prop) {
            for (var i=0,len=prop.length; i<len; ++i) {
                var offset  = prop[i].offset;
                var color   = prop[i].color;
                this.addColorStop(offset, color);
            }
            return this;
        },
        
        toStyle: function() {
            return this.gradient;
        },
        
    });
    
    
    var dummyCanvas = document.createElement("canvas");
    var dummyContext= dummyCanvas.getContext("2d");
    
})();























