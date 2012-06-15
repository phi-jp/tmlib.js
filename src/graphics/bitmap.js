/*
 * bitmap.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class
     * ビットマップクラス
     */
    tm.graphics.Bitmap = tm.createClass({
        
        imageData: null,
        
        /**
         * 初期化
         */
        init: function(imageData) {
            if (arguments.length == 1) {
                this.imageData = imageData;
                this.data = imageData.data;
            }
            else if (arguments.length == 2) {
                var w = arguments[0];
                var h = arguments[1];
                this.imageData = dummyContext.createImageData(w, h);
                this.data = this.imageData.data;
            }
        },
        
        /**
         * index 指定でピクセル値を取得
         * 最も高速
         */
        getPixelIndex: function(index) {
            var i = index*4;
            return [
                this.data[i+0],
                this.data[i+1],
                this.data[i+2],
                this.data[i+3]
            ];
        },
        
        /**
         * x, y 指定でピクセル値を取得
         */
        getPixelXY: function(x, y) {
            return this.getPixelIndex( this.posToIndex(x, y) );
        },
        
        /**
         * ピクセル値を取得
         * ### Memo
         * - index 指定か x, y 指定にするか検討中
         * - 配列で返すか数値で返すか検討中. 速度の早いやつを採用する
         */
        getPixel: function(x, y) {
            return this.getPixelIndex( this.posToIndex(x, y) );
        },
        
        getPixelAsNumber: function(index) {
            var i = index*4;
            return (this.data[i+3] << 24) | (this.data[i+0] << 16) | (this.data[i+1] << 8) | this.data[i+2];
        },
        
        getPixelAsObject: function(index) {
            var i = index*4;
            return {
                r: this.data[i+0],
                g: this.data[i+1],
                b: this.data[i+2],
                a: this.data[i+3]
            };
        },
        
        getPixelAsArray: function(index) {
            var i = index*4;
            return [
                this.data[i+0],
                this.data[i+1],
                this.data[i+2],
                this.data[i+3]
            ];
        },
        
        /**
         * 指定した範囲内のピクセル平均値を取得
         */
        getPixelAverage: function(x, y, width, height)
        {
            var rgba = [0, 0, 0, 0];
            
            // 範囲
            var l = x;
            var r = x+width;
            var t = y;
            var b = y+height;
            
            // ハミ出し調整
            if (l < 0) { l = 0; }
            if (r > this.width) { r = this.width; }
            if (t < 0) { t = 0; }
            if (b > this.height) { b = this.height; }
            
            // 範囲内のピクセル全てを取得
            var temp = [];
            var bitmapWidth = this.width;
            for (var i=t; i<b; ++i) {
                for (var j=l; j<r; ++j) {
                    var index = bitmapWidth*i + j;
                    temp.push( this.getPixelIndex(index) );
                    // temp.push( this.getPixelXY(j, i) );
                }
            }
            
            // 平均を求める
            var len = len=temp.length;
            for (var i=0; i<len; ++i) {
                rgba[0] += temp[i][0];
                rgba[1] += temp[i][1];
                rgba[2] += temp[i][2];
                rgba[3] += temp[i][3];
            }
            
            rgba[0]/=len;
            rgba[1]/=len;
            rgba[2]/=len;
            rgba[3]/=len;
            
            return rgba;
        },
        
        
        /**
         * index 指定でピクセル値をセット
         * 最も高速
         */
        setPixelIndex: function(index, r, g, b)
        {
            var i = index*4;
            this.data[i+0] = r;
            this.data[i+1] = g;
            this.data[i+2] = b;
            return this;
        },
        
        /**
         * x, y指定でピクセル値をセット
         */
        setPixelXY: function(x, y, r, g, b)
        {
            return this.setPixelIndex(y*this.imageData.width+x, r, g, b);
        },
        
        /**
         * ピクセル値をセット
         */
        setPixel: function(index, r, g, b)
        {
            return this.setPixelIndex(y*this.imageData.width+x, r, g, b);
        },
        
        setPixel32Index: function(index, r, g, b, a)
        {
            var i = index*4;
            this.data[i+0] = r;
            this.data[i+1] = g;
            this.data[i+2] = b;
            this.data[i+3] = a;
            return this;
        },
        
        setPixel32: function(x, y, r, g, b, a)
        {
            return this.setPixel32Index(y*this.width+x, r, g, b, a);
        },
        
        setPixel32XY: function(x, y, r, g, b, a)
        {
            return this.setPixel32Index(y*this.width+x, r, g, b, a);
        },
        
        setPixelFromArray: function(index, pixel)
        {
            return this.setPixel(index, pixel[0], pixel[1], pixel[2]);
        },
        
        setPixel32FromArray: function(index, pixel)
        {
            return this.setPixel32(index, pixel[0], pixel[1], pixel[2], pixel[3]);
        },

        /**
         * argb
         */
        setPixelFromNumber: function(index, pixel)
        {
            return this.setPixel(index, (pixel & 0x00ff0000)>>>16, (pixel & 0x0000ff00)>>>8, (pixel & 0x000000ff)>>>0);
        },

        /**
         * argb
         */
        setPixel32FromNumber: function(index, pixel)
        {
            return this.setPixel32(index, (pixel & 0x00ff0000)>>>16, (pixel & 0x0000ff00)>>>8, (pixel & 0x000000ff)>>>0, (pixel & 0xff000000)>>>24);
        },
        
        /**
         * object
         */
        setPixelFromObject: function(index, pixel)
        {
            return this.setPixel(pixel.r, pixel.g, pixel.b);
        },
        setPixel32FromObject: function(index, pixel)
        {
            return this.setPixel32(pixel.r, pixel.g, pixel.b, pixel.a);
        },
        
        /**
         * string
         * rgb, hsl, #... #...... などに対応予定
         */
        setPixelFromString: function(index, pixel)
        {
            
        },
        
        /**
         * 位置をインデックスに変換
         */
        posToIndex: function(x, y) {
            return y*this.imageData.width + x;
        },
        
        // filter: function(rect, filter)
        filter: function(filter)
        {
            for (var i=0; i<this.height; ++i) {
                for (var j=0; j<this.width; ++j) {
                    var index = this.posToIndex(j, i);
                    var p = this.getPixel(index);
                    
                    filter.calc(p, index, j, i, this);
                }
            }
            
            return this;
        },
        
        /**
         * ノイズ
         */
        noise: function(low, high)
        {
            low = low  || 0;
            high= high || 255;
            range= high-low;
            
            for (var i=0,len=this.length; i<len; ++i) {
                var p = this.getPixelIndex(i);
                p[0] = Math.random()*range + low;
                p[1] = Math.random()*range + low;
                p[2] = Math.random()*range + low;
                p[3] = 255;
                this.setPixel32Index(i, p[0], p[1], p[2], p[3]);
            }
        },
        
        applyFilter: function(filter) {
            
        },
        
    });
    
    
    tm.graphics.Bitmap.prototype.accessor("width", {
        "get": function()   { return this.imageData.width; },
        "set": function(v)  { this.iamgeData.width = v;    }
    });
    
    tm.graphics.Bitmap.prototype.accessor("height", {
        "get": function()   { return this.imageData.height; },
        "set": function(v)  { this.iamgeData.height = v;    }
    });
    
    tm.graphics.Bitmap.prototype.getter("length", function() {
        return this.imageData.width*this.imageData.height;
    });
    
    
    /**
     * @member      tm.graphics.Canvas
     * @property    getBitmap
     * ビットマップ取得
     */
    tm.graphics.Canvas.prototype.getBitmap = function(x, y, width, height) {
        return tm.graphics.Bitmap(this.context.getImageData(x||0, y||0, width||this.width, height||this.height));
    };
    
    /**
     * @member      tm.graphics.Canvas
     * @property    createBitmap
     * ビットマップ生成
     */
    tm.graphics.Canvas.prototype.createBitmap = function(width, height) {
        return tm.graphics.Bitmap(this.context.createImageData(width||this.width, height||this.height));
    };
    
    var dummyCanvas = document.createElement("canvas");
    var dummyContext= dummyCanvas.getContext("2d");
    
})();

