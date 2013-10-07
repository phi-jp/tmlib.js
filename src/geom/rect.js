/*
 * rect.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class tm.geom.Rect
     * 四角形クラス
     */
    tm.geom.Rect = tm.createClass({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(x, y, width, height) {
            this.set(x, y, width, height);
        },
        
        /**
         * @property
         * セッター
         */
        set: function(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            
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
        resize: function(w, h) {
            this.width = w;
            this.height= h;
            return this;
        },
        
        /**
         * @property
         * 現在のサイズを基準にリサイズ
         */
        resizeBy: function(w, h) {
            this.width += w;
            this.height+= h;
            return this;
        },
        
        /**
         * @property
         * パディング.
         * 縮めたりなど. 画面ハミ出しチェック時などに便利
         * ## example
         *     var circle = TM.$Circle(10, 10, 10);
         *     var windowRect = TM.$Rect(0, 0, window.innerWidth, window.innerHiehgt);
         *     windowRect.padding(circle.radius);
         *     if (circle.x < windowRect.left) {
         *         // 左にはみ出した時の処理
         *     }
         */
        padding: function(top, right, bottom, left) {
            // css の padding に合わせて時計回りにパラメータ調整
            switch (arguments.length) {
                case 1:
                    top = right = bottom = left = arguments[0];
                    break;
                case 2:
                    top     = bottom= arguments[0];
                    right   = left  = arguments[1];
                    break;
                case 3:
                    top     = arguments[0];
                    right   = left = arguments[1];
                    bottom  = arguments[2];
                    break;
            }
            
            this.x += left;
            this.y += top;
            this.width -= left+right;
            this.height-= top +bottom;
            
            return this;
        },

        /**
         * @property
         * クローン
         */
        clone: function() {
            
        },
        
        /**
         * @property
         * @TODO ?
         */
        toCircle: function() {
            return tm.geom.Circle(
                this.centerX,
                this.centerY,
                (this.width < this.height) ? this.width : this.height
                );
        },

        /**
         * @property
         * @TODO ?
         */
        toArray: function() {
            return [this.x, this.y, this.width, this.height];
        },
        
    });
    
    
    /**
     * @property    left
     * left
     */
    tm.geom.Rect.prototype.accessor("left", {
        "get": function()   { return this.x; },
        "set": function(v)  { this.width -= v-this.x; this.x = v; }
    });
    
    /**
     * @property    top
     * top
     */
    tm.geom.Rect.prototype.accessor("top", {
        "get": function()   { return this.y; },
        "set": function(v)  { this.height -= v-this.y; this.y = v; }
    });
    
    /**
     * @property    right
     * right
     */
    tm.geom.Rect.prototype.accessor("right", {
        "get": function()   { return this.x + this.width; },
        "set": function(v)  { this.width += v-this.right; }
    });
    
    /**
     * @property    bottom
     * bottom
     */
    tm.geom.Rect.prototype.accessor("bottom", {
        "get": function()   { return this.y + this.height; },
        "set": function(v)  { this.height += v-this.bottom; }
    });
    
    /**
     * @property    centerX
     * centerX
     */
    tm.geom.Rect.prototype.accessor("centerX", {
        "get": function()   { return this.x + this.width/2; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
    
    /**
     * @property    centerY
     * centerY
     */
    tm.geom.Rect.prototype.accessor("centerY", {
        "get": function()   { return this.y + this.height/2; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
    
})();

