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
            
            this.canvas = tm.graphics.Canvas();
            this.srcRect = tm.geom.Rect(0, 0, this.width, this.height);
            
            this.width  = width;
            this.height = height;
            this.canvas.resize(width, height);
            this.srcRect.width  = this.width;
            this.srcRect.height = this.height;
            if (texture) { this.setImage(texture); }
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
            if (typeof texture == "string") texture = tm.graphics.TextureManager.get(texture);
            
            this.canvas.resize(texture.element.width, texture.element.height);
            this.canvas.drawImage(texture.element, 0, 0, texture.element.width, texture.element.height);
            // 画像をセットしたら一旦全て表示するようソース矩形のサイズをフィットさせる
            this.srcRect.x = 0;
            this.srcRect.y = 0;
            this.srcRect.width  = texture.element.width;
            this.srcRect.height = texture.element.height;
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
        
        _refreshSize: function() {
            
        },
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.app.Sprite.prototype.accessor("image", {
        "get": function()   { return this.canvas; },
        "set": function(v)  { this.setImage(v); }
    });
    
})();
