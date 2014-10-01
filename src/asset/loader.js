

(function() {

    /**
     * @class tm.asset.Loader
     * @extends tm.event.EventDispatcher
     * アセットローダー
     */
    tm.define("tm.asset.Loader", {
        superClass: "tm.event.EventDispatcher",

        /** @property assets  アセット */
        
        /**
         * @constructor
         */
        init: function() {
            this.superInit();
            
            this.assets = {};
        },
        
        /**
         * キーと一致するアセットを含んでいるか
         * @param {Object} key
         */
        contains: function(key) {
            return (this.assets[key]) ? true : false;
        },
        
        /**
         * アセットのロード実行
         * @param {Object} arg
         */
        load: function(arg) {
            if (tm.util.Type.isObject(arg)) {
                this._loadByObject(arg);
            }
            else {
                this._loadString(arguments[0], arguments[1], arguments[2]);
            }
            
            return this;
        },

        /**
         * アセットのゲット
         * @param {Object} key
         */
        get: function(key) {
            return this.assets[key];
        },

        /**
         * アセットのセット
         * @param {Object} key
         * @param {Object} asset
         */
        set: function(key, asset) {
            this.assets[key] = asset;
            
            // manager の方にもセットする
            tm.asset.Manager.set(key, asset);
            
            return this;
        },
        
        /**
         * アセットのロード
         * @private
         * @param {Object} key
         * @param {Object} path
         * @param {Object} type
         */
        _load: function(key, path, type) {
            // if (tm.asset.Manager.contains(key)) {
            //     return tm.asset.Manager.get(key);
            // }
            
            path = path || key;
            // type が省略されている場合は拡張子から判定する
            type = type || path.split('?')[0].split('#')[0].split('.').last;
            
            var asset = tm.asset.Loader._funcs[type](path);
            this.set(key, asset);
            
            return asset;
        },
        /**
         * 文字列指定のアセットのロード
         * @private
         * @param {Object} key
         * @param {Object} path
         * @param {Object} type
         */
        _loadString: function(key, path, type) {
            
            var hash = {};
            hash[key] = {
                url: path,
                type: type,
            };
            this._loadByObject(hash);
        },
        /**
         * オブジェクト指定のアセットのロード
         * @private
         * @param {Object} hash
         */
        _loadByObject: function(hash) {
            var flow = tm.util.Flow(Object.keys(hash).length, function() {
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }.bind(this));
            
            var loadAsset = function(asset, key) {

                var e = tm.event.Event("progress");
                e.key = key;
                e.asset = asset;
                e.progress = (flow.counter+1)/flow.waits; // todo
                this.dispatchEvent(e);

                flow.pass();
            }.bind(this);
            
            Object.keys(hash).each(function(key) {
                var value = hash[key];
                var asset = null;

                if (typeof value == 'string') {
                    asset = this._load(key, value);
                }
                else {
                    asset = this._load(key, value['url'] || value['src'] || value['path'], value['type']);
                }
                
                if (asset.loaded) {
                    loadAsset(asset, key);
                }
                else {
                    asset.on("load", function() {
                        loadAsset(asset, key);
                    });
                }
            }.bind(this));
        },
    });
    
    
    tm.asset.Loader._funcs = [];
    tm.asset.Loader.defineFunction("register", function(type, func) {
        this._funcs[type] = func;
    });
    
    
    var _textureFunc = function(path) {
        var texture = tm.asset.Texture(path);
        return texture;
    };
    var _soundFunc = function(path) {
        var audio = tm.sound.WebAudio(path);
        return audio;
    };
    
    var _tmxFunc = function(path) {
        var mapSheet = tm.asset.MapSheet(path);
        return mapSheet;
    };
    
    var _tmssFunc = function(path) {
        var ss = tm.asset.SpriteSheet(path);
        return ss;
    };

    var _jsonFunc = function(path) {
        var file = tm.util.File();
        
        if (typeof path == 'string') {
            file.load({
                url: path,
                dataType: 'json',
            });
        }
        else {
            var data = path;
            file.setData(path);
            file.loaded = true;
        }

        return file;
    };

    // image
    tm.asset.Loader.register("png", _textureFunc);
    tm.asset.Loader.register("gif", _textureFunc);
    tm.asset.Loader.register("jpg", _textureFunc);
    tm.asset.Loader.register("jpeg", _textureFunc);

    // sound
    tm.asset.Loader.register("wav", _soundFunc);
    tm.asset.Loader.register("mp3", _soundFunc);
    tm.asset.Loader.register("ogg", _soundFunc);
    tm.asset.Loader.register("m4a", _soundFunc);

    // json
    tm.asset.Loader.register("json", _jsonFunc);

    // map data
    tm.asset.Loader.register("tmx", _tmxFunc);
    
    // spritesheet for tmlib.js
    tm.asset.Loader.register("tmss", _tmssFunc);


    
})();

