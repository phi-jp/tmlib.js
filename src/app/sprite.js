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
        init: function(width, height, texture)
        {
            this.superInit();
            
            width = width   || 64;
            height= height  || 64;
            
            this.srcRect = tm.geom.Rect(0, 0, this.width, this.height);
            
            this.width  = width;
            this.height = height;
            if (texture) {
                this.image  = texture;
            }
        },
        
        setFrameIndex: function(index, width, height) {
            var w   = width || this.width;
            var h   = width || this.height;
            var row = ~~(this.image.width / w)
            var x   = index%row;
            var y   = ~~(index/row);
            this.srcRect.x = x*w;
            this.srcRect.y = y*h;
            this.srcRect.width  = w;
            this.srcRect.height = h;
        },
        
        _refreshSize: function() {
            
        },

        _update: tm.app.CanvasElement.prototype._update,
    });
    
    /**
     * @property    image
     * 高さ
     */
    tm.app.Sprite.prototype.accessor("image", {
        "get": function()   {
            return this._image;
        },
        "set": function(image)  {
            if (typeof image == "string") image = tm.graphics.TextureManager.get(image);
            
            this._image = image;
            this.srcRect.x = 0;
            this.srcRect.y = 0;
            this.srcRect.width  = image.element.width;
            this.srcRect.height = image.element.height;
        }
    });
    
})();
