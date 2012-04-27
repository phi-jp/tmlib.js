/*
 * prim.tm.js
 */

tm.prim = tm.prim || {};


(function() {
    
    /**
     *  @class
     * サークルスプライト 
     */
    tm.prim.CircleSprite = tm.createClass({
        superClass: tm.app.CanvasElement,
        
        init: function(radius, color) {
            this.superInit();
            
            this.radius = radius;
            this.color = color;
        },
        
        draw: function(c) {
            c.fillStyle = this.color;
            c.fillCircle(0, 0, this.radius);
        }
    });
    
    
    /**
     *  @class
     * レクトスプライト 
     */
    tm.prim.RectSprite = tm.createClass({
        superClass: tm.app.CanvasElement,
        
        init: function(width, height, color) {
            this.superInit();
            
            this.width = width;
            this.height = height;
            this.color = color;
        },
        
        draw: function(c) {
            c.fillStyle = this.color;
            c.fillRect(0, 0, this.width, this.height);
        }
    });
    
    
    /**
     *  @class
     * スタースプライト 
     */
    tm.prim.StarSprite = tm.createClass({
        superClass: tm.app.CanvasElement,
        
        init: function(radius, sides, sideIndent, offsetAngle, color) {
            this.superInit();
            
            this.radius     = radius    || 16;
            this.sides      = sides     || 5;
            this.sideIndent = sideIndent|| 0.5;
            this.offsetAngle= offsetAngle;
            this.color      = color     || "yellow";
        },
        
        draw: function(c) {
            c.fillStyle = this.color;
            c.fillStar(0, 0, this.radius, this.sides, this.sideIndent, this.offsetAngle);
        }
    });
    
})();

