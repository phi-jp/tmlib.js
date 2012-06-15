/*
 * fade.tm.js
 */

tm.fade = tm.fade || {};


(function() {
    
    /**
     *  @class
     * 
     */
    tm.fade.FadeOut = tm.createClass({
        superClass: tm.app.CanvasElement,
        
        init: function(width, height, color, time, func) {
            this.superInit();
            
            this.setPosition(0, 0);
            this.setSize(width, height);
            
            this.fillStyle = color;
            this.alpha = 0.0;
            this.animation.addTween({
                prop: "alpha",
                begin: 0.0,
                finish: 1.0,
                duration: time,
                onfinish: function() {
                    if (func) func();
                    this.remove();
                }.bind(this)
            });
        },
        
        draw: function(c) {
            c.clearColor(this.fillStyle);
        }
    });
    
    /**
     *  @class
     * 
     */
    tm.fade.FadeIn = tm.createClass({
        superClass: tm.app.CanvasElement,
        
        init: function(width, height, color, time, func) {
            this.superInit();
            
            this.setPosition(0, 0);
            this.setSize(width, height);
            
            this.fillStyle = color;
            this.alpha = 1.0;
            this.animation.addTween({
                prop: "alpha",
                begin: 1.0,
                finish: 0.0,
                duration: time,
                onfinish: function() {
                    if (func) func();
                    this.remove();
                }.bind(this)
            });
        },
        
        draw: function(c) {
            c.clearColor(this.fillStyle);
        }
    });
    
    
})();

