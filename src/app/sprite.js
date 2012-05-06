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
        
        originX: 0.5,
        originY: 0.5,
        
        /**
         * 初期化
         */
        init: function(width, height, texture)
        {
            this.superInit();
            
            this.width  = width;
            this.height = height;
            
            this.canvas = tm.graphics.Canvas();
            this.canvas.width = width;
            this.canvas.height= height;
            if (texture) { this.setImage(texture); }
            
            this.srcRect = {
                x: 0,
                y: 0,
                width: width,
                height: height,
            };
        },
        
        /**
         * 描画
         */
        draw: function(canvas) {
            var srcRect = this.srcRect;
            canvas.drawImage(this.canvas.canvas,
                srcRect.x, srcRect.y, srcRect.width, srcRect.height,
                -this.width*this.originX, -this.height*this.originY, this.width, this.height);
            return ;
            canvas.drawImage(this.canvas.canvas, 0, 0, this.width, this.height);
            return ;
        },
        
        setImage: function(texture) {
            this.canvas.resize(texture.element.width, texture.element.height);
            this.canvas.drawImage(texture.element, 0, 0, texture.element.width, texture.element.height);
        },
        
        setFrameIndex: function(index, width, height) {
            var w   = width || this.width;
            var h   = width || this.height;
            var row = ~~(this.canvas.width / w)
            var x   = index%row;
            var y   = ~~(index/row);
            this.srcRect.x = x*w;
            this.srcRect.y = y*h;
            this.srcRect.width  = w;
            this.srcRect.height = h;
        },
    });
    
})();
