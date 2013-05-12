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
                var layer = layers[i];
                var lines = layers[i].getElementsByTagName('data')[0].textContent.split(',\n');
                var temp = [];

                lines.each(function(line, i) {
                    temp[i] = [];
                    line.split(',').each(function(elm) {
                        var num = parseInt(elm, 10) - 1;
                        temp[i].push(num);
                    });
                });

                this.layers.push(temp);
            }

            var objects = xml.getElementsByTagName('object');

            console.dir(this);
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
            console.log(obj);
            return obj;
        },
    });



})();

(function() {

    tm.define("tm.app.MapSprite", {
        superClass: "tm.app.Shape",

        init: function(mapSheet) {
            this.superInit();

            if (typeof mapSheet == "string") {
                this.mapSheet = tm.app.MapSheetManager.get(mapSheet);
            }
            else {
                this.mapSheet = mapSheet;
            }

            this.originX = this.originY = 0;

            this.width = 1200;
            this.height= 1200;
            this.canvas.resize(1200, 1200);

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

                        var dx = xIndex*mapSheet.map.width;
                        var dy = yIndex*mapSheet.map.height;

                        self.canvas.drawImage(mapSheet.image,
                            mx*mapSheet.map.tilewidth, my*mapSheet.map.tileheight, mapSheet.map.tilewidth, mapSheet.map.tileheight,
                            dx, dy, mapSheet.map.width, mapSheet.map.height
                            );
                    });
                });
            });
        },

    });

})();



