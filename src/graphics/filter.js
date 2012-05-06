/*
 * bitmap.js
 */

tm.graphics = tm.graphics || {};


(function() {
    
    /**
     * @class
     * フィルタ
     */
    tm.graphics.MonochromeFilter = tm.createClass({
        
        /**
         * 初期化
         */
        init: function() {
            
        },
        
        /**
         * apply
         */
        apply: function(src, dst) {
            for (var i=0,len=src.width*src.height; i<len; ++i) {
                var p = src.getPixel(i);
                var grayscale = p[0]*0.3 + p[1]*0.59 + p[2]*0.11;
                dst.setPixel32Index(i, grayscale, grayscale, grayscale, 255);
            }
            
            return dst;
        },
    });
    
    
})();




(function() {
    
    /**
     * @class
     * フィルタ
     */
    tm.graphics.ReverseFilter = tm.createClass({
        
        /**
         * 初期化
         */
        init: function() {
            
        },
        
        /**
         * apply
         */
        apply: function(src, dst) {
            for (var i=0,len=src.width*src.height; i<len; ++i) {
                var p = src.getPixel(i);
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
     * @class
     * ブラーフィルタ
     */
    tm.graphics.BlurFilter = tm.createClass({
        
        /**
         * 初期化
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
            
            /* 速度的には大差ないっぽい
            for (var i=0; i<srcHeight; ++i) {
                for (var j=0; j<srcWidth; ++j) {
                    var x = j;
                    var y = i;
                    var p = src.getPixelAverage(x-level, y-level, range, range);
                    dst.setPixel32XY(x, y, p[0], p[1], p[2], 255);
                }
            }
            return dst;
            */
            
            for (var i=0; i<len; ++i) {
                var x = i%srcWidth;
                var y = Math.floor(i/srcWidth);
                var p = src.getPixelAverage(x-halfX, y-halfY, rangeX, rangeY);
                dst.setPixel32Index(i, p[0], p[1], p[2], 255);
            }
            
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
     * @class
     * フィルタ
     */
    tm.graphics.ToonFilter = tm.createClass({
        
        toonTable: null,
        
        /**
         * 初期化
         */
        init: function(toonTable) {
            this.toonTable = toonTable || defaultToonTable;
        },
        
        /**
         * apply
         */
        apply: function(src, dst) {
            for (var i=0,len=src.width*src.height; i<len; ++i) {
                var pixel = src.getPixel(i);
                var r = this.toonTable[ pixel[0] ];
                var g = this.toonTable[ pixel[1] ];
                var b = this.toonTable[ pixel[2] ];
                dst.setPixel32Index(i, r, g, b, 255);
            }
            
            return dst;
        },
    });
    
    
})();










