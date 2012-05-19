/*
 * texture.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class
     * テクスチャクラス
     */
    tm.graphics.Texture = tm.createClass({
        
        element: null,
        loaded: false,
        
        /**
         * 初期化
         */
        init: function(src) {
            this.element = new Image();
            this.element.src = src;
            
            var self = this;
            this.element.onload = function() {
                self.loaded = true;
            };
        },
        
        getElement: function() {
            return this.element;
        },
        
    });
    
    /**
     * @property    width
     * 幅
     */
    tm.graphics.Texture.prototype.getter("width", function() {
        return this.element.width;
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.graphics.Texture.prototype.getter("height", function() {
        return this.element.height;
    });
    
})();

(function(){
    
    /**
     * @class
     * テクスチャマネージャクラス
     */
    tm.graphics.TextureManager = {
        textures: {},
        loaded: true,
    };
    
    /**
     * @static
     * @method
     * 追加
     */
    tm.graphics.TextureManager.add = function(name, src)
    {
        if (src === undefined) { src = name; }
        
        this.textures[name] = tm.graphics.Texture(src);
        this.loaded = false;
    };
    
    /**
     * @static
     * @method
     * 取得
     */
    tm.graphics.TextureManager.get = function(name)
    {
        return this.textures[name];
    };
    
    /**
     * ロードチェック
     */
    tm.graphics.TextureManager.isLoaded = function()
    {
        for (var key in this.textures) {
            if (this.textures[key].loaded == false) {
                return false;
            }
        }
        return true;
    };
    
    tm.addLoadCheckList(tm.graphics.TextureManager);
    
})();


