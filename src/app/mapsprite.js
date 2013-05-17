/*
 * mapsprite.js
 */

tm.app = tm.app || {};

(function() {
    tm.app.MapSheetManager = {
        maps: {},
    };

    tm.app.MapSheetManager.load = function(key, path) {
        this.maps[key] = tm.app.MapSheet(path);
    };

    tm.app.MapSheetManager.get = function(key) {
        return this.maps[key];
    };

    tm.define("tm.app.MapSheet", {
        superClass: "tm.event.EventDispatcher",
        
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
        
        _propertiesToJson: function(elm) {
            var obj = {};
            var properties = elm.getElementsByTagName('property');
            for (var k = 0;k < properties.length;k++) {
                obj[properties[k].getAttribute('name')] = properties[k].getAttribute('value');
            }
            
            return obj;
        },
        
        _attrToJSON: function(source) {
            var obj = {};
            for (var i = 0; i < source.attributes.length; i++) {
                if (source.attributes[i].name !== 'name') {
                    //attributeのvalueが数値にパースできたら数値を、
                    //出来なかったらそのまま突っ込む
                    var val = source.attributes[i].value;
                    val = isNaN(parseFloat(val))? val: parseFloat(val);
                    obj[source.attributes[i].name] = val;
                }
            }
            
            return obj;
        },
        
        _checkImage: function() {
            if (this.tilesets) {
                var i = 0;
                var len = this.tilesets.length;
                
                var onloadimage = function() {
                    i++;
                    if (i==len) {
                        this.loaded = true;
                        var e = tm.event.Event("load");
                        this.dispatchEvent(e);
                    }
                }.bind(this);
                this.tilesets.each(function(elm) {
                    var image = tm.graphics.TextureManager.get(elm.image)
                    
                    if (image && image.loaded) {
                        // ロード済み
                        ++i;
                    }
                    else {
                        var texture = tm.graphics.TextureManager.add(elm.image);
                        texture.addEventListener("load", onloadimage);
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

(function() {

    tm.define("tm.app.MapSprite", {
        superClass: "tm.app.Shape",

        init: function(chipWidth, chipHeight, mapSheet) {
            this.superInit();

            if (typeof mapSheet == "string") {
                this.mapSheet = tm.app.MapSheetManager.get(mapSheet);
            }
            else {
                this.mapSheet = mapSheet;
            }

            this.chipWidth  = chipWidth;
            this.chipHeight = chipHeight;

            this.originX = this.originY = 0;

            this.width = chipWidth*this.mapSheet.width;
            this.height= chipWidth*this.mapSheet.height;
            this.canvas.resize(this.width, this.height);

            this._build();
        },

        _build: function() {
            var self = this;

            this.mapSheet.layers.each(function(layer, hoge) {
                if (layer.type == "objectgroup") {
                    self._buildObject(layer);
                }
                else {
                    self._buildLayer(layer);
                }
            });
        },

        _buildLayer: function(layer) {
            var self        = this;
            var mapSheet    = this.mapSheet;
            var texture     = tm.graphics.TextureManager.get(mapSheet.tilesets[0].image);
            var xIndexMax   = (texture.width/mapSheet.tilewidth)|0;
            var shape       = tm.app.Shape(this.width, this.height).addChildTo(this);
            shape.origin.set(0, 0);

            layer.data.each(function(d, index) {
                var type = d;
                if (type == -1) {
                    return ;
                }
                type = Math.abs(type);

                var xIndex = index%mapSheet.width;
                var yIndex = (index/mapSheet.width)|0;

                var mx = (type%xIndexMax);
                var my = (type/xIndexMax)|0;

                var dx = xIndex*self.chipWidth;
                var dy = yIndex*self.chipHeight;

                shape.canvas.drawTexture(texture,
                    mx*mapSheet.tilewidth, my*mapSheet.tileheight, mapSheet.tilewidth, mapSheet.tileheight,
                    dx, dy, self.chipWidth, self.chipHeight
                    );
            }.bind(this));

        },

        _buildObject: function(layer) {
            var self = this;
            
            var group = tm.app.CanvasElement().addChildTo(self);
            group.width = layer.width;
            group.height = layer.height;
            
            layer.objects.forEach(function(obj) {
                var _class  = window[obj.type] || tm.app[obj.type];
                var initParam = null;
                if (obj.properties.init) {
                    initParam = JSON.parse(obj.properties.init);
                }
                var element = _class.apply(null, initParam).addChildTo(group);
                var props   = obj.properties;
                for (var key in props) {
                    if (key == "init") continue ;
                    var value = props[key];
                    element[key] = value;
                }
                
                element.x = obj.x;
                element.y = obj.y;
                element.width = obj.width;
                element.height = obj.height;
            });

            self[layer.name] = group;

        },

    });

})();



