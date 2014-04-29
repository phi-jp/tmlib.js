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

            this._build();
        },

        /**
         * @private
         */
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

        /**
         * @private
         */
        _buildLayer: function(layer) {
            var self        = this;
            var mapSheet    = this.mapSheet;
            var texture     = tm.asset.Manager.get(mapSheet.tilesets[0].image);
            var xIndexMax   = (texture.width/mapSheet.tilewidth)|0;
            var shape       = tm.display.Shape(this.width, this.height).addChildTo(this);
            var visible = (layer.visible === 1) || (layer.visible === undefined);
            var opacity = layer.opacity === undefined ? 1 : layer.opacity;
            shape.origin.set(0, 0);

            if (visible) {
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

                    shape.canvas.globalAlpha = opacity;
                    shape.canvas.drawTexture(texture,
                        mx*mapSheet.tilewidth, my*mapSheet.tileheight, mapSheet.tilewidth, mapSheet.tileheight,
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



