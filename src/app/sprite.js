/*
 * sprite.js
 */


tm.app = tm.app || {};


(function() {
    
    /**
     * @class
     * Sprite
     */
    tm.app.Sprite = tm.createClass({
        
        superClass: tm.app.CanvasElement,
        
        /**
         * 初期化
         */
        init: function(width, height)
        {
            this.superInit();
            
            this.width  = width;
            this.height = height;
            this.canvas = tm.graphics.Canvas();
            this.canvas.width = width;
            this.canvas.height= height;
        },
        
        /**
         * 描画
         */
        draw: function(canvas) {
            canvas.drawImage(this.canvas.canvas,
                0, 0, this.width, this.height,
                -this.width/2, -this.height/2, this.width, this.height);
            
            return ;
            
            canvas.drawImage(this.canvas.canvas, 0, 0, this.width, this.height);
            return ;
        },
        
        
        setImage: function(texture) {
            this.canvas.drawImage(texture.element, 0, 0, this.width, this.height);
        },
    });
    
})();
