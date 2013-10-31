/*
 * filter.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class tm.graphics.MonochromeFilter
     * モノクロフィルタ
     */
    tm.graphics.MonochromeFilter = tm.createClass({
        
        /**
         * @constructor
         */
        init: function() {},
        
        /**
         * apply
         */
        apply: function(src, dst) {
            var len = src.length;
            for (var i=0; i<len; ++i) {
                var p = src.getPixelIndex(i);
                var grayscale = p[0]*0.3 + p[1]*0.59 + p[2]*0.11;
                dst.setPixel32Index(i, grayscale, grayscale, grayscale, p[3]);
            }
            
            return dst;
        },
    });
    
    
})();




(function() {
    
    /**
     * @class tm.graphics.ReverseFilter
     * リバースフィルタ
     */
    tm.graphics.ReverseFilter = tm.createClass({
        
        /**
         * @constructor
         */
        init: function() {},
        
        /**
         * apply
         */
        apply: function(src, dst) {
            for (var i=0,len=src.width*src.height; i<len; ++i) {
                var p = src.getPixelIndex(i);
                p[0] = 255-p[0];
                p[1] = 255-p[1];
                p[2] = 255-p[2];
                dst.setPixel32Index(i, p[0], p[1], p[2], 255);
            }
            
            return dst;
        },
    });
    
    
})();


(function() {
    
    /**
     * @class tm.graphics.BlurFilter
     * ブラーフィルタ
     * 
     * ### Reference
     * - <http://www40.atwiki.jp/spellbound/pages/153.html>
     * - <http://www.flother.com/blog/2010/image-blur-html5-canvas/>
     */
    tm.graphics.BlurFilter = tm.createClass({

        /** @property blurX */
        /** @property blurY */
        /** @property quality */
        
        /**
         * @constructor
         */
        init: function(blurX, blurY, quality) {
            this.blurX      = blurX || 4;
            this.blurY      = blurY || 4;
            this.quality    = quality || 1;
        },
        
        /**
         * apply
         */
        apply: function(src, dst) {
            var halfX       = Math.floor(this.blurX/2);
            var halfY       = Math.floor(this.blurY/2);
            var rangeX      = this.blurX;
            var rangeY      = this.blurY;
            var srcWidth    = src.width;
            var srcHeight   = src.height;
            var len         = src.length;
            
            // ブラー処理
            var _apply = function(src, dst) {
                for (var i=0; i<len; ++i) {
                    var x = i%srcWidth;
                    var y = Math.floor(i/srcWidth);
                    var p = src.getPixelAverage(x-halfX, y-halfY, rangeX, rangeY);
                    dst.setPixel32Index(i, p[0], p[1], p[2], 255);
                }
            };
            
            // quality の回数だけブラーをかける
            var tempDst     = src;
            for (var i=0; i<this.quality; ++i) {
                src = tempDst;
                tempDst = tm.graphics.Bitmap(srcWidth, srcHeight);
                _apply(src, tempDst);
            }
            
            // 結果に代入
            //? メモリリークとか大丈夫なのかな
            dst.imageData = tempDst.imageData;
            
            return dst;
        },
    });
    
    
})();


(function() {
    
    // トゥーンテーブル
    var defaultToonTable = [];
    for(var i=0; i<255; ++i) {
        var n=0;
        
        if      (i<100) { n =  60; }
        else if (i<150) { n = 150; }
        else if (i<180) { n = 180; }
        else            { n = 220; }
        
        defaultToonTable[i] = n;
    }
    
    /**
     * @class tm.graphics.ToonFilter
     * トゥーンフィルタ
     */
    tm.graphics.ToonFilter = tm.createClass({
        
        /** トゥーンテーブル */
        toonTable: null,
        
        /**
         * @constructor
         */
        init: function(toonTable) {
            this.toonTable = toonTable || defaultToonTable;
        },
        
        /**
         * apply
         */
        apply: function(src, dst) {
            for (var i=0,len=src.width*src.height; i<len; ++i) {
                var pixel = src.getPixelIndex(i);
                var r = this.toonTable[ pixel[0] ];
                var g = this.toonTable[ pixel[1] ];
                var b = this.toonTable[ pixel[2] ];
                dst.setPixel32Index(i, r, g, b, 255);
            }
            
            return dst;
        },
    });
    
    
})();



(function() {
    
    /**
     * @class tm.graphics.ColorMatrixFilter
     * カラーマトリックスフィルタ
     * 
     * ### Reference
     * - <http://blog.boreal-kiss.com/2008/04/08113113.html/>
     * - <http://voglia.jp/2010/01/26/260>
     * - <http://hakuhin.jp/as/color.html#COLOR_02>
     * - <http://d.hatena.ne.jp/umezo/20090122/1232627694>
     * - <http://www40.atwiki.jp/spellbound/pages/188.html>
     */
    tm.graphics.ColorMatrixFilter = tm.createClass({
        
        /** @property colorMatrix */

        /**
         * @constructor
         */
        init: function(colorMatrix) {
            this.colorMatrix = colorMatrix;
        },
        
        /**
         * @property
         * apply
         */
        apply: function(src, dst) {
            var cm = this.colorMatrix;
            for (var i=0,len=src.length; i<len; ++i) {
                var pixel = src.getPixelIndex(i);
                var r = (pixel[0] * cm[0]) + (pixel[1] * cm[1]) + (pixel[2] * cm[2]) + (pixel[3] * cm[3]) + cm[4];
                var g = (pixel[0] * cm[5]) + (pixel[1] * cm[6]) + (pixel[2] * cm[7]) + (pixel[3] * cm[8]) + cm[9];
                var b = (pixel[0] * cm[10]) + (pixel[1] * cm[11]) + (pixel[2] * cm[12]) + (pixel[3] * cm[13]) + cm[14];
                var a = (pixel[0] * cm[15]) + (pixel[1] * cm[16]) + (pixel[2] * cm[17]) + (pixel[3] * cm[18]) + cm[19];
                dst.setPixel32Index(i, r, g, b, a);
            }
            
            return dst;
        }
        
    });
    
})();











