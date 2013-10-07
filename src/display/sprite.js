/*
 * sprite.js
 */


tm.display = tm.display || {};


(function() {
    
    /**
     * @class tm.display.Sprite
     * 画像の描画を行うクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.Sprite = tm.createClass({
        superClass: tm.display.CanvasElement,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(texture, width, height) {
            this.superInit();
            
            console.assert(arguments.length == 0 || texture instanceof tm.asset.Texture || typeof texture == "string", "Sprite の第一引数はテクスチャもしくはテクスチャ名に変わりました");
            
            this.srcRect = tm.geom.Rect(0, 0, 64, 64);
            
            // 画像のみ渡された場合
            if (arguments.length == 1) {
                var texture = arguments[0];
                if (typeof texture == "string") texture = tm.asset.AssetManager.get(texture);
                
                this.width = texture.width;
                this.height= texture.height;
                
                this.image = texture;
            }
            // その他
            else {
                width = width   || 64;
                height= height  || 64;
                
                this.width  = width;
                this.height = height;
                if (texture) {
                    this.image  = texture;
                }
            }
        },
        
        /**
         * @property
         * @TODO ?
         */
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

            return this;
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         */
        _refreshSize: function() {},

        _update: tm.display.CanvasElement.prototype._update,
    });
    
    /**
     * @property    image
     * 高さ
     */
    tm.display.Sprite.prototype.accessor("image", {
        "get": function()   {
            return this._image;
        },
        "set": function(image)  {
            if (typeof image == "string") image = tm.asset.AssetManager.get(image);
            
            this._image = image;
            this.srcRect.x = 0;
            this.srcRect.y = 0;
            this.srcRect.width  = image.element.width;
            this.srcRect.height = image.element.height;
        }
    });
    
})();
