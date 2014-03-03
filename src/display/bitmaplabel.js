/*
 * bitmaplabel.js
 */


tm.app = tm.app || {};


(function() {

	var CH_LIST = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|]~🐤";
    
    /**
     * @class tm.display.BitmapLabel
     * 画像を利用したラベルクラス
     * @extends tm.display.Shape
     */
    // tm.define("tm.display.BitmapLabel", {
    //     superClass: tm.display.Shape,
    // });

    
    tm.display.BitmapLabel = tm.createClass({
        superClass: tm.display.Shape,

        /** @property fontSize */
        /** @property spacing */
        /** @property texture */

        /**
         * @constructor
         */
        init: function(params) {
        	this.superInit();

        	this.fontSize = params.fontSize || 32;
        	this.spacing  = params.spacing || 0.75;

        	var texture = params.texture;
        	if (typeof texture == "string") texture = tm.asset.Manager.get(texture);
        	this.texture = texture;

        	this.render(params.text);
        },

        /**
         * 描画
         */
        render: function(text) {
        	var c = this.canvas;
        	var width = text.length*this.fontSize;
        	var height = this.fontSize;

        	this.width = width;
        	this.height = height;
        	c.resize(width, height);

        	var spacingSize = this.spacing*this.fontSize;

//        	c.clearColor("red");
        	for (var i=0,len=text.length; i<len; ++i) {
        		var ch = text[i];
        		var charCode = text.charCodeAt(i);
        		var charPos = charCode-32;
        		var charPos = CH_LIST.indexOf(ch);

        		var xIndex = charPos%16;
        		var yIndex = (charPos/16)|0;
        		var sx = xIndex*16;
        		var sy = yIndex*16;

        		var x = i*spacingSize;
        		var y = 0;

        		c.drawTexture(this.texture, sx, sy, 16, 16, x, y, this.fontSize, this.fontSize);
        	}
        }
    });

})();


