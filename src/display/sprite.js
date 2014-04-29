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
        
        /** @property srcRect          */
        /** @property width            width */
        /** @property height           height */
        /** @property @private _image  表示しているアセット(画像) */

        /**
         * @constructor
         */
        init: function(image, width, height) {
            this.superInit();
            
            console.assert(typeof image != 'number', "Sprite の第一引数はテクスチャもしくはテクスチャ名に変わりました");
            
            this._frameIndex = 0;
            this.srcRect = tm.geom.Rect(0, 0, 64, 64);
            
            // 引数あり
            if (arguments.length >= 1) {
                this.setImage(image).fitImage();

                if (width !== undefined) this.width = width;
                if (height !== undefined) this.height = height;
            }
        },

        /**
         * 表示するアセット(画像)をセット
         */
        setImage: function(image, width, height) {
            if (typeof image == "string") {
                var key = image;
                image = tm.asset.Manager.get(key);
                console.assert(image != null, "don't find '" + key + "' as image.");
            }
            
            this._image = image;
            this.srcRect.x = 0;
            this.srcRect.y = 0;
            this.srcRect.width  = image.element.width;
            this.srcRect.height = image.element.height;

            if (width  !== undefined) this.width  = width;
            if (height !== undefined) this.height = height;
            // this.width  = (width !== undefined)  ? width  : image.element.width;
            // this.height = (height !== undefined) ? height : image.element.height;

            return this;
        },

        /**
         * 表示しているアセット(画像)を取得
         */
        getImage: function() {
            return this._image;
        },

        /**
         * 自分自信を画像サイズと同じサイズにする
         */
        fitImage: function() {
            this.width  = this.image.width;
            this.height = this.image.height;

            return this;
        },
        
        /**
         * フレームインデックスをセット
         */
        setFrameIndex: function(index, width, height) {
            var tw  = width || this.width;      // tw
            var th  = height || this.height;    // th
            var row = ~~(this.image.width / tw);
            var col = ~~(this.image.height / th);
            var maxIndex = row*col;
            index = index%maxIndex;
            
            var x   = index%row;
            var y   = ~~(index/row);
            this.srcRect.x = x*tw;
            this.srcRect.y = y*th;
            this.srcRect.width  = tw;
            this.srcRect.height = th;

            this._frameIndex = index;

            return this;
        },
        
        /**
         * @private
         */
        _refreshSize: function() {},
    });
    
    /**
     * @property    image
     * 画像
     */
    tm.display.Sprite.prototype.accessor("image", {
        "get": function()   {
            return this._image;
        },
        "set": function(image)  {
            this.setImage(image);
        }
    });

    /**
     * @property    frameIndex
     * フレームインデックス
     */
    tm.display.Sprite.prototype.accessor("frameIndex", {
        "get": function()   {
            return this._frameIndex;
        },
        "set": function(value)  {
            this.setFrameIndex(value);
        }
    });
    
})();
