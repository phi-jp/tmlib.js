/*
 * grid.tm.js
 * グリッド表示
 * 位置合わせに使える
 * http://www.fmod.jp/justnet/smu/smu06E/smu06E.html
 * http://www.tutorial9.net/tutorials/photoshop-tutorials/tip-use-the-grid-in-photoshop/
 */

(function() {
    
    tm.Grid = tm.createClass({
        
        element: null,
        interval: 25,
        color: "rgba(0, 255, 255, 0.5)",
        
        init: function(arg) {
            if (typeof arg == "string") {
                this.element = document.querySelector(arg);
            }
            else {
                this.element = arg;
            }
            
            this._fit();
            this._draw();
        },
        
        _fit: function() {
            var e = tm.dom.Element(this.element);
            e.style.set("position", "absolute");
            e.x = 0;
            e.y = 0;
            
            var c = tm.graphics.Canvas(this.element);
            c.resize(innerWidth, innerHeight);
        },
        
        _draw: function() {
            var c = tm.graphics.Canvas(this.element);
            
            // c.clearColor("red");
            c.strokeStyle = this.color;
            for (var i=0; i<c.width; i+=this.interval) {
                c.drawLine(i, 0, i, c.height);
            }
            for (var i=0; i<c.height; i+=this.interval) {
                c.drawLine(0, i, c.width, i);
            }
        },
        
    });
    
})();



