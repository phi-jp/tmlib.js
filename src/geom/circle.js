/*
 * circle.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class tm.geom.Circle
     * 円クラス
     */
    tm.define("tm.geom.Circle", {
        x: 0,
        y: 0,
        radius: 0,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(x, y, radius) {
            this.set(x, y, radius);
        },
        
        /**
         * @property
         * セッター
         */
        set: function(x, y, radius) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            
            return this;
        },
        
        /**
         * @property
         * 移動
         */
        move: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        
        /**
         * @property
         * 現在位置を基準に移動
         */
        moveBy: function(x, y) {
            this.x += x;
            this.y += y;
            return this;
        },
        
        /**
         * @property
         * リサイズ
         */
        resize: function(size) {
            this.radius = size;
            return this;
        },
        
        /**
         * @property
         * 現在のサイズを基準にリサイズ
         */
        resizeBy: function(size) {
            this.radius += size;
            return this;
        },

        /**
         * @property
         * クローン作成
         */
        clone: function() {
            return tm.geom.Circle(this.x, this.y, this.radius);
        },
        
        /**
         * @property
         * 四角形に変換
         */
        toRect: function() {
            return tm.geom.Rect(
                this.x - this.radius,
                this.y - this.radius,
                this.radius*2, this.radius*2
                );
        },
        
        /**
         * @property
         * 配列に変換
         */
        toArray: function() {
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

