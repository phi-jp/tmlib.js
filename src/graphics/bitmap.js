/*
 * bitmap.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class
     * テクスチャクラス
     */
    tm.graphics.Bitmap = tm.createClass({
        
        imageData: null,
        
        /**
         * 初期化
         */
        init: function(imageData) {
            this.imageData = imageData;
            this.data = imageData.data;
        },
        
        /**
         * ピクセル値を取得
         * ### Memo
         * - index 指定か x, y 指定にするか検討中
         * - 配列で返すか数値で返すか検討中. 速度の早いやつを採用する
         */
        getPixel: function(index) {
            var i = index*4;
            return [
                this.imageData.data[i+0],
                this.imageData.data[i+1],
                this.imageData.data[i+2],
                this.imageData.data[i+3]
            ];
        },
        
        getPixelIndex: function(index) {
            var i = index*4;
            return [
                this.imageData.data[i+0],
                this.imageData.data[i+1],
                this.imageData.data[i+2],
                this.imageData.data[i+3]
            ];
        },
        
        getPixelXY: function(x, y) {
            return this.getPixelIndex(y*this.width + x);
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
                this.imageData.data[i+0],
                this.imageData.data[i+1],
                this.imageData.data[i+2],
                this.imageData.data[i+3]
            ];
        },
        
        getPixelAverage: function(index) {
            var x = index%this.width;
            var y = Math.floor(index/this.width);
            var f = 0;
            var temp   = [];
            var r, g, b, a;
            r = g = b = a = 0;
            
            // 中心
            temp.push(this.getPixel(index));
            // 上
            if (0 < y) {
                temp.push(this.getPixel(index-this.width));
                f |= 1;
            }
            // 右
            if (x < this.width) {
                temp.push(this.getPixel(index+1));
                f |= 2;
            }
            // 下
            if (y < this.height) {
                temp.push(this.getPixel(index+this.width));
                f |= 4;
            }
            // 左
            if (0 < x) {
                temp.push(this.getPixel(index-1));
                f |= 8;
            }
            
            // 右上
            if (f | 3) {
                temp.push(this.getPixel(index-this.width+1));
            }
            
            // 右下
            if (f | 6) {
                temp.push(this.getPixel(index+this.width+1));
            }
            
            // 左下
            if (f | 12) {
                temp.push(this.getPixel(index+this.width-1));
            }
            
            // 左上
            if (f | 9) {
                temp.push(this.getPixel(index-this.width-1));
            }
            
            var len = len=temp.length;
            for (var i=0; i<len; ++i) {
                r += temp[i][0];
                g += temp[i][1];
                b += temp[i][2];
                a += temp[i][3];
            }
            
            return [
                r/len,
                g/len,
                b/len,
                a/len
            ];
        },
        
        getPixelAverage2: function(x, y, width, height)
        {
            var temp = [];
            var r, g, b, a;
            r = g = b = a = 0;
            
            for (var i=y; i<y+height; ++i) {
                if (0 > i)              { continue ; }
                if (i >= this.height)    { continue ; }
                
                for (var j=x; j<x+width; ++j) {
                    if (0 > j)          { continue ; }
                    if (j >= this.width) { continue ; }
                    
                    temp.push(
                        this.getPixelXY(j, i)
                    );
                }
            }
            
            var len = len=temp.length;
            for (var i=0; i<len; ++i) {
                r += temp[i][0];
                g += temp[i][1];
                b += temp[i][2];
                a += temp[i][3];
            }
            
            return [
                r/len,
                g/len,
                b/len,
                a/len
            ];
        },
        
        setPixel: function(index, r, g, b)
        {
            var i = index*4;
            this.data[i+0] = r;
            this.data[i+1] = g;
            this.data[i+2] = b;
            return this;
        },
        
        setPixel32: function(index, r, g, b, a)
        {
            var i = index*4;
            this.data[i+0] = r;
            this.data[i+1] = g;
            this.data[i+2] = b;
            this.data[i+3] = a;
            return this;
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
        
        posToIndex: function(x, y) {
            return y*this.width + x;
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
        
        noise: function(low, high)
        {
            low = low  || 0;
            high= high || 255;
            range= high-low;
            this.filter({
                calc: function(p, index, x, y, imageData) {
                    p[0] = Math.random()*range + low;
                    p[1] = Math.random()*range + low;
                    p[2] = Math.random()*range + low;
                    imageData.setPixelFromArray(index, p);
                }
            })
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
    
    
    /**
     * @property    getBitmap
     * ビットマップ取得
     */
    tm.graphics.Canvas.prototype.getBitmap = function(x, y, width, height) {
        return tm.graphics.Bitmap(this.context.getImageData(x||0, y||0, width||this.width, height||this.height));
    };
    
    /**
     * @property    createBitmap
     * ビットマップ生成
     */
    tm.graphics.Canvas.prototype.createBitmap = function(width, height) {
        return tm.graphics.Bitmap(this.context.createImageData(width||this.width, height||this.height));
    };
    
})();

