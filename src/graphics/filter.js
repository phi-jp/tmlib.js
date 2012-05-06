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
                dst.setPixel32(i, grayscale, grayscale, grayscale, 255);
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
                dst.setPixel32(i, p[0], p[1], p[2], 255);
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
    tm.graphics.BlurFilter = tm.createClass({
        
        level: 1,
        
        /**
         * 初期化
         */
        init: function(level) {
            this.level = level || 4;
        },
        
        /**
         * apply
         */
        apply: function(src, dst) {
            var range = this.level*2 + 1;
            for (var i=0,len=src.width*src.height; i<len; ++i) {
                // var p = src.getPixelAverage(i);
                
                var x = i%src.width;
                var y = Math.floor(i/src.width);
                var p = src.getPixelAverage2(x-this.level, y-this.level, range, range);
                dst.setPixel32(i, p[0], p[1], p[2], 255);
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
                dst.setPixel32(i, r, g, b, 255);
            }
            
            return dst;
        },
    });
    
    
})();










