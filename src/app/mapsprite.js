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
        init: function(path) {
            this.loaded = false;

            tm.util.Ajax.load({
                url: path,
                success: function(e) {
                    this._parse(e);
                }.bind(this),
            });
        },

        _parse: function(str) {
            var parser = new DOMParser();
            var xml = parser.parseFromString(str, 'text/xml');

            this.map = this._attrToJSON(xml.getElementsByTagName('map')[0]);

            var imgSrc = xml.getElementsByTagName('image')[0].getAttribute('source');
            this.image = new Image(imgSrc);
            this.image.src = imgSrc;

            this.image.onload = function() {
                this.map.xIndexMax = this.image.naturalWidth  / this.map.tilewidth;
                this.map.yIndexMax = this.image.naturalHeight / this.map.tileheight;
                this.loaded = true;
            }.bind(this);

            this.layers = [];
            var layers = xml.getElementsByTagName('layer');
            for (var i=0,len=layers.length; i<len; ++i) {
                var data = layers[i].getElementsByTagName('data')[0];
                var encoding = data.getAttribute("encoding");
                var layer = null;

                if (encoding == "csv") {
                    layer = this._parseCSV(data.textContent);
                }
                else if (encoding == "base64") {
                    layer = this._parseBase64(data.textContent);
                }

                this.layers.push(layer);

            }

            var objects = xml.getElementsByTagName('object');
        },

        _parseCSV: function(data) {
            var lines = data.split(',\n');
            var layer = [];

            lines.each(function(line, i) {
                layer[i] = [];
                line.split(',').each(function(elm) {
                    var num = parseInt(elm, 10) - 1;
                    layer[i].push(num);
                });
            });

            return layer;
        },

        /**
         * http://thekannon-server.appspot.com/herpity-derpity.appspot.com/pastebin.com/75Kks0WH
         */
        _parseBase64: function(data) {
            var layer = atob(data.trim());

            layer = layer.split('').map(function(e) {
                return e.charCodeAt(0);
            });

            var lines = [];
            for (var i=0; i<10; ++i) {
                lines[i] = [];
                for (var j=0; j<10; ++j) {
                    var n =layer[(i*10+j)*4];
                    lines[i][j] = parseInt(n, 10) - 1;
                }
            }

            return lines;
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

            var properties = source.getElementsByTagName('property');
            for (var k = 0;k < properties.length;k++) {
                obj[properties[k].getAttribute('name')] = properties[k].getAttribute('value');
            }
            return obj;
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

            this.width = chipWidth*this.mapSheet.map.width;
            this.height= chipWidth*this.mapSheet.map.height;
            this.canvas.resize(this.width, this.height);

            this.render();
        },

        render: function() {
            var self = this;
            var mapSheet = this.mapSheet;

            this.mapSheet.layers.each(function(layer) {
                layer.each(function(line, yIndex) {
                    line.each(function(type, xIndex) {
                        if (type == -1) {
                            return ;
                        }
                        type = Math.abs(type);

                        var mx = (type%mapSheet.map.xIndexMax);
                        var my = (type/mapSheet.map.xIndexMax)|0;

                        var dx = xIndex*self.chipWidth;
                        var dy = yIndex*self.chipHeight;

                        self.canvas.drawImage(mapSheet.image,
                            mx*mapSheet.map.tilewidth, my*mapSheet.map.tileheight, mapSheet.map.tilewidth, mapSheet.map.tileheight,
                            dx, dy, self.chipWidth, self.chipHeight
                            );
                    });
                });
            });
        },

    });

})();



