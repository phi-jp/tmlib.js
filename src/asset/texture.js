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
        
        /** window.document.Image */
        element: null,

        /** ロード済みかどうか */
        loaded: false,
        
        /**
         * @constructor
         */
        init: function(src) {
            this.superInit();
            
            this.element = new Image();
            if ( !tm.isLocal() && !(/^data:/.test(src)) ) {
                // this.element.crossOrigin = "anonymous";
            }
            this.element.src = src;
            
            var self = this;
            this.element.onload = function() {
                self.loaded = true;
                var e = tm.event.Event("load");
                self.dispatchEvent( e );
            };

            this.element.onerror = function(e) {
                console.error("[tmlib] {0}の読み込みに失敗!".format(src));
                
                var key = src.split('/').last.replace('.png', '').split('?').first.split('#').first;
                var elm = e.target;
                
                elm.src = "http://dummyimage.com/128x128/444444/eeeeee&text=" + key;
                elm.onerror = null;
            };
        },
        
        /**
         * window.document.Image クラスのインスタンスを返す
         */
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
    tm.graphics.TextureManager.loadDummy = function(key, param) {
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


