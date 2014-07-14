/*
 * mapsprite.js
 */


(function() {

    /**
     * @class tm.display.MapSprite
     * マップ描画クラス
     * @extends tm.display.CanvasElement
     */
    tm.define("tm.display.MapSprite", {
        superClass: "tm.display.CanvasElement",

        /** @property mapSheet */
        /** @property chipWidth */
        /** @property chipHeight */
        /** @property originX */
        /** @property originY */
        /** @property width */
        /** @property height */
        /** @property tileset */

        /**
         * @constructor
         */
        init: function(mapSheet, chipWidth, chipHeight) {
            this.superInit();

            if (typeof mapSheet == "string") {
                this.mapSheet = tm.asset.Manager.get(mapSheet);
            }
            else {
                this.mapSheet = mapSheet;
            }

            this.chipWidth  = chipWidth  || 32;
            this.chipHeight = chipHeight || 32;

            this.originX = this.originY = 0;

            this.width = chipWidth*this.mapSheet.width;
            this.height= chipWidth*this.mapSheet.height;

            this.tileset = [];
            this.tilesetInfo = {};
            this._build();
        },

        /**
         * @private
         */
        _build: function() {
            var self = this;

            this.mapSheet.tilesets.each(function(tileset, index) {
                self._buildTileset(tileset, index);
            });

            this.mapSheet.layers.each(function(layer, hoge) {
                if (layer.type == "objectgroup") {
                    self._buildObject(layer);
                }
                else {
                    self._buildLayer(layer);
                }
            });
        },

        /**
         * @private
         */
        _buildTileset: function(tileset, index) {
            var self      = this;
            var mapSheet  = this.mapSheet;
            var texture   = tm.asset.Manager.get(tileset.image);
            var xIndexMax = (texture.width / mapSheet.tilewidth)|0;
            var yIndexMax = (texture.height / mapSheet.tileheight)|0;

            var info = {
                begin: self.tileset.length,
                end: self.tileset.length + xIndexMax * yIndexMax
            };

            self.tilesetInfo[index] = info;

            if (tileset.name !== undefined) {
                self.tilesetInfo[tileset.name] = info;
            }

            yIndexMax.times(function(my) {
                xIndexMax.times(function(mx) {
                    var rect = tm.geom.Rect(
                        mx * mapSheet.tilewidth,
                        my * mapSheet.tileheight,
                        mapSheet.tilewidth,
                        mapSheet.tileheight
                        );
                    self.tileset.push({
                        image: tileset.image,
                        rect: rect
                    });
                });
            });
        },

        /**
         * @private
         */
        _buildLayer: function(layer) {
            var self     = this;
            var mapSheet = this.mapSheet;
            var shape    = tm.display.Shape(this.width, this.height).addChildTo(this);
            var visible  = (layer.visible === 1) || (layer.visible === undefined);
            var opacity  = layer.opacity === undefined ? 1 : layer.opacity;
            var tileset  = [];
            shape.origin.set(0, 0);

            if (layer.tilesets !== undefined) {
                var tilesets = null;
                if (Array.isArray(layer.tilesets)) {
                    tilesets = layer.tilesets;
                } else {
                    tilesets = [layer.tilesets];
                }
                tilesets.each(function(n) {
                    var info = self.tilesetInfo[n];
                    tileset = tileset.concat(self.tileset.slice(info.begin, info.end));
                });
            } else {
                tileset = self.tileset;
            }

            if (visible) {
                layer.data.each(function(d, index) {
                    var type = d;
                    if (type == -1) {
                        return ;
                    }
                    type = Math.abs(type);
                    if (tileset[type] === undefined) {
                        return ;
                    }

                    var xIndex = index%mapSheet.width;
                    var yIndex = (index/mapSheet.width)|0;
                    var dx = xIndex*self.chipWidth;
                    var dy = yIndex*self.chipHeight;

                    var tile = tileset[type];

                    var texture = tm.asset.Manager.get(tile.image);
                    var rect = tile.rect;

                    shape.canvas.globalAlpha = opacity;
                    shape.canvas.drawTexture(texture,
                        rect.x, rect.y, rect.width, rect.height,
                        dx, dy, self.chipWidth, self.chipHeight
                        );
                }.bind(this));
            }

        },

        /**
         * @private
         */
        _buildObject: function(layer) {
            var self = this;

            var group = tm.display.CanvasElement().addChildTo(self);
            group.width = layer.width;
            group.height = layer.height;

            layer.objects.forEach(function(obj) {
                var _class = tm.using(obj.type);
                if (Object.keys(_class).length === 0) {
                    _class=tm.display[obj.type];
                }

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

                group[obj.name] = element;
            });

            self[layer.name] = group;

        },

    });

})();



