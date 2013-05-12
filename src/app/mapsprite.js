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
                        temp[i].push(elm);
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



    tm.define("tm.app.ChipSheet", {
        init: function(param) {

        },
        init: function(chipWidth, chipHeight, image) {
            this.chipWidth  = chipWidth;
            this.chipHeight = chipHeight;
            this.image      = tm.graphics.TextureManager.get(image);

            this.xIndexMax = this.image.width/this.chipWidth;
            this.yIndexMax = this.image.height/this.chipHeight;
            console.log(this.xIndexMax);
        },
        getFrame: function(index) {
            return tm.geom.Rectangle(
                index*this.chipWidth,
                0,
                this.chipWidth,
                this.chipHeight
                );
        },
    });


    tm.define("tm.app.MapSprite2", {
        superClass: "tm.app.Shape",

        init: function(mapSheet) {
            this.superInit();

            this.mapSheet = mapSheet;
            this.canvas.resize(width, height);
        },

        render: function(width, height, mapData) {

            for (var i=0,colLen=mapData.length; i<colLen; ++i) {
                var colData = mapData[i];
                for (var j=0,len=colData.length; j<len; ++j) {
                    var type = colData[j];

                    if (type == -1) continue ;
                    type = Math.abs(type);

                    var mx = (type%this.chipSheet.xIndexMax);
                    var my = (type/this.chipSheet.xIndexMax)|0;

                    var dx = j*width;
                    var dy = i*height;

                    this.canvas.drawTexture(
                        this.chipSheet.image,
                        mx*this.chipSheet.chipWidth,
                        my*this.chipSheet.chipHeight,
                        this.chipSheet.chipWidth,
                        this.chipSheet.chipHeight,
                        dx,
                        dy,
                        width,
                        height
                        );

                    // var x = 
                }
            }
        },

        _renderMap: function() {

        },

        _getChipRect: function(xIndex, yIndex) {
            return tm.geom.Rectangle(
                xIndex*this.chipWidth,
                yIndex*this.chipHeight,
                this.chipWidth,
                this.chipHeight
                );
        },
    });


    tm.define("tm.app.MapSprite", {
        superClass: "tm.app.Shape",

        init: function(width, height, chipSheet) {
            this.superInit();

            this.chipSheet = chipSheet;
            this.width  = width;
            this.height = height;
            this.canvas.resize(width, height);
        },

        render: function(width, height, mapData) {

            for (var i=0,colLen=mapData.length; i<colLen; ++i) {
                var colData = mapData[i];
                for (var j=0,len=colData.length; j<len; ++j) {
                    var type = colData[j];

                    if (type == -1) continue ;
                    type = Math.abs(type);

                    var mx = (type%this.chipSheet.xIndexMax);
                    var my = (type/this.chipSheet.xIndexMax)|0;

                    var dx = j*width;
                    var dy = i*height;

                    this.canvas.drawTexture(
                        this.chipSheet.image,
                        mx*this.chipSheet.chipWidth,
                        my*this.chipSheet.chipHeight,
                        this.chipSheet.chipWidth,
                        this.chipSheet.chipHeight,
                        dx,
                        dy,
                        width,
                        height
                        );

                    // var x = 
                }
            }
        },

        _renderMap: function() {

        },

        _getChipRect: function(xIndex, yIndex) {
            return tm.geom.Rectangle(
                xIndex*this.chipWidth,
                yIndex*this.chipHeight,
                this.chipWidth,
                this.chipHeight
                );
        },
    });

})();



