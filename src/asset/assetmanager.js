/*
 * assetmanger.js
 */

(function() {

    tm.asset = tm.asset || {};


    tm.define("tm.asset.AssetManager", {
        superClass: "tm.event.EventDispatcher",

        init: function() {
            this.superInit();

            this.assets = [];

            this._funcs = [];
            this._loadedCounter = 0;
        },

        load: function(key, path) {
            if (typeof arguments[0] == 'string') {
                path = (arguments.length < 2) ? key : path;
                this._load(key, path);
            }
            else {
                var hash = arguments[0];
                for (var key in hash) {
                    var path = hash[key];
                    this._load(key, path);
                }
            }

            // 重複ロード対応
            if (this.isLoaded()) {
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }

            return this;
        },

        _load: function(key, path) {
            if (this.contains(key)) return ;

            var pathes = path.split('.');
            var ext = pathes.last;

            var asset = this._funcs[ext](path);
            asset.addEventListener("load", this._checkLoadedFunc.bind(this));
            this.assets[key] = asset;

            return this;
        },

        get: function(key) {
            return this.assets[key];
        },

        set: function(key, asset) {
            this.assets[key] = asset;

            return this;
        },

        contains: function(key) {
            return (this.assets[key]) ? true : false;
        },

        register: function(type, fn) {
            this._funcs[type] = fn;
        },

        isLoaded: function() {
            return (this._loadedCounter == Object.keys(this.assets).length);
        },

        _checkLoadedFunc: function() {
            this._loadedCounter++;

            if (this.isLoaded()) {
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }
        }

    });

    tm.asset.AssetManager = tm.asset.AssetManager();

    var _textureFunc = function(path) {
        var texture = tm.graphics.Texture(path);
        return texture;
    };

    tm.asset.AssetManager.register("png", _textureFunc);
    tm.asset.AssetManager.register("gif", _textureFunc);
    tm.asset.AssetManager.register("jpg", _textureFunc);
    tm.asset.AssetManager.register("jpeg", _textureFunc);

})();










