/*
 * circle.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class
     * 円クラス
     */
    tm.geom.Circle = tm.createClass({
        x: 0,
        y: 0,
        radius: 0,
        
        /**
         * 初期化
         */
        init: function(x, y, radius)
        {
            this.set(x, y, radius);
        },
        
        /**
         * セッター
         */
        set: function(x, y, radius)
        {
            this.x = x;
            this.y = y;
            this.radius = radius;
            
            return this;
        },
        
        /**
         * 移動
         */
        move: function(x, y)
        {
            this.x = x;
            this.y = y;
            return this;
        },
        
        /**
         * 現在位置を基準に移動
         */
        moveBy: function(x, y)
        {
            this.x += x;
            this.y += y;
            return this;
        },
        
        /**
         * リサイズ
         */
        resize: function(size)
        {
            this.radius = size;
            return this;
        },
        
        /**
         * 現在のサイズを基準にリサイズ
         */
        resizeBy: function(size)
        {
            this.radius += size;
            return this;
        },
        
        clone: function()
        {
            
        },
        
        /**
         * 四角形に変換
         */
        toRectangle: function()
        {
            return tm.geom.Rectangle(this.x, this.y, this.radius*2, this.radius*2);
        },
        
        /**
         * 配列に変換
         */
        toArray: function()
        {
            return [this.x, this.y, this.radius];
        }
    });
    
    /**
     * @property    left
     * left
     */
    tm.geom.Circle.prototype.getter("left", function() {
        return this.x - this.radius;
    });
    
    /**
     * @property    top
     * top
     */
    tm.geom.Circle.prototype.getter("top", function() {
        return this.y - this.radius;
    });
    
    /**
     * @property    right
     * right
     */
    tm.geom.Circle.prototype.getter("right", function() {
        return this.x + this.radius;
    });
    
    /**
     * @property    bottom
     * bottom
     */
    tm.geom.Circle.prototype.getter("bottom", function() {
        return this.y + this.radius;
    });
    
})();

