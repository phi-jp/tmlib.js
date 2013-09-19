/*
 * texture.js
 */

(function() {
    
    /**
     * @class tm.asset.Texture
     * テクスチャクラス
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.asset.Texture", {
        superClass: "tm.event.EventDispatcher",
        
        element: null,
        loaded: false,
        
        /**
         * 初期化
         */
        init: function(src) {
            this.superInit();
            
            this.element = new Image();
            this.element.src = src;
            
            var self = this;
            this.element.onload = function() {
                self.loaded = true;
                var e = tm.event.Event("load");
                self.dispatchEvent( e );
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
    tm.asset.Texture.prototype.getter("width", function() {
        return this.element.width;
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.asset.Texture.prototype.getter("height", function() {
        return this.element.height;
    });
    
})();

(function(){

    /*
     * @static
     * @method
     * ### ref
     * http://dummyimage.com/
     */
    /*
    tm.graphics.TextureManager.loadDummy = function(key, param)
    {
        param = param || {};

        var paths = ["http://dummyimage.com"];
        paths.push(param.size || 256);
        paths.push(param.bgColor || "aaa");
        paths.push(param.color || "000");
        paths.push(param.format || "png");

        var src = paths.join('/');
        if (param.text) {
            src += '&text=' + param.text;
        }

        this.textures[key] = tm.graphics.Texture(src);
        this.loaded = false;
    };
    */

})();


