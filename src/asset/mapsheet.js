/*
 * mapsheet.js
 */

(function() {

    /**
     * @class tm.asset.MapSheet
     * マップシート
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.asset.MapSheet", {
        superClass: "tm.event.EventDispatcher",

        /** @property loaded  */

        /**
         * @constructor
         */
        init: function(path) {
            this.superInit();

            this.loaded = false;

            if (typeof path == "string") {
                tm.util.Ajax.load({
                    url: path,
                    success: function(e) {
                        var d = this._parse(e);
                        this.$extend(d);
                        this._checkImage();
                    }.bind(this),
                });
            }
            else {
                this.$extend(arguments[0]);

                this._checkImage();
            }
        },

        /**
         * パース
         * @private
         */
        _parse: function(str) {
            var each = Array.prototype.forEach;
            var data = {};
            var parser = new DOMParser();
            var xml = parser.parseFromString(str, 'text/xml');
            var map = this._attrToJSON(xml.getElementsByTagName('map')[0]);

            this.$extend(map);

            // tilesets(image)
            data.tilesets = this._parseTilesets(xml);

            // layer
            data.layers = this._parseLayers(xml);

            return data;
        },

        /**
         * @private
         */
        _parseTilesets: function(xml) {
            var each = Array.prototype.forEach;
            var self = this;
            var data = [];
            var tilesets = xml.getElementsByTagName('tileset');
            each.call(tilesets, function(tileset) {
                var t = {};
                var props = self._propertiesToJson(tileset);

                if (props.src) {
                    t.image = props.src;
                }
                else {
                    t.image = tileset.getElementsByTagName('image')[0].getAttribute('source');
                }
                data.push(t);
            });

            return data;
        },

        /**
         * @private
         */
        _parseLayers: function(xml) {
            var each = Array.prototype.forEach;
            var data = [];

            var map = xml.getElementsByTagName("map")[0];
            var layers = [];
            each.call(map.childNodes, function(elm) {
                if (elm.tagName == "layer" || elm.tagName == "objectgroup") {
                    layers.push(elm);
                }
            });

            layers.each(function(layer) {
                if (layer.tagName == "layer") {
                    var d = layer.getElementsByTagName('data')[0];
                    var encoding = d.getAttribute("encoding");
                    var l = {
                        type: "layer",
                        name: layer.getAttribute("name"),
                    };

                    if (encoding == "csv") {
                        l.data = this._parseCSV(d.textContent);
                    }
                    else if (encoding == "base64") {
                        l.data = this._parseBase64(d.textContent);
                    }

                    var attr = this._attrToJSON(layer);
                    l.$extend(attr);

                    data.push(l);
                }
                else if (layer.tagName == "objectgroup") {
                    var l = {
                        type: "objectgroup",
                        objects: [],
                        name: layer.getAttribute("name"),
                    };
                    each.call(layer.childNodes, function(elm) {
                        if (elm.nodeType == 3) return ;

                        var d = this._attrToJSON(elm);
                        d.properties = this._propertiesToJson(elm);

                        l.objects.push(d);
                    }.bind(this));

                    data.push(l);
                }
            }.bind(this));

            return data;
        },

        /**
         * @private
         */
        _parseCSV: function(data) {
            var dataList = data.split(',');
            var layer = [];

            dataList.each(function(elm, i) {
                var num = parseInt(elm, 10) - 1;
                layer.push(num);
            });

            return layer;
        },

        /**
         * http://thekannon-server.appspot.com/herpity-derpity.appspot.com/pastebin.com/75Kks0WH
         * @private
         */
        _parseBase64: function(data) {
            var dataList = atob(data.trim());
            var rst = [];

            dataList = dataList.split('').map(function(e) {
                return e.charCodeAt(0);
            });

            for (var i=0,len=dataList.length/4; i<len; ++i) {
                var n = dataList[i*4];
                rst[i] = parseInt(n, 10) - 1;
            }

            return rst;
        },

        /**
         * @private
         */
        _propertiesToJson: function(elm) {
            var properties = elm.getElementsByTagName("properties")[0];
            var obj = {};
            if (properties === undefined) {
                return obj;
            }
            for (var k = 0;k < properties.childNodes.length;k++) {
                var p = properties.childNodes[k];
                if (p.tagName === "property") {
                    obj[p.getAttribute('name')] = p.getAttribute('value');
                }
            }

            return obj;
        },

        /**
         * @private
         */
        _attrToJSON: function(source) {
            var obj = {};
            for (var i = 0; i < source.attributes.length; i++) {
                var val = source.attributes[i].value;
                val = isNaN(parseFloat(val))? val: parseFloat(val);
                obj[source.attributes[i].name] = val;
            }

            return obj;
        },

        /**
         * @private
         */
        _checkImage: function() {
            var self = this;
            if (this.tilesets.length) {
                var i = 0;
                var len = this.tilesets.length;

                var _onloadimage = function() {
                    i++;
                    if (i==len) {
                        this.loaded = true;
                        var e = tm.event.Event("load");
                        this.dispatchEvent(e);
                    }
                }.bind(this);

                this.tilesets.each(function(elm) {
                    var image = tm.asset.Manager.get(elm.image)

                    if (image) {
                        if (image.loaded) {
                            // ロード済み
                            ++i;
                            if (i==len) {
                                this.loaded = true;
                                var e = tm.event.Event("load");
                                self.dispatchEvent(e);
                            }
                        }
                        else {
                            image.addEventListener("load", _onloadimage);
                        }
                    }
                    else {
                        var loader = tm.asset.Loader();
                        loader.load(elm.image);
                        var texture = tm.asset.Manager.get(elm.image);
                        texture.addEventListener("load", _onloadimage);
                    }
                });

            }
            else {
                this.loaded = true;
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }
        },
    });

})();