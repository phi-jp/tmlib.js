/*
 * matrix33.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class
     * 3*3 マトリックスクラス
     */
    tm.geom.Matrix33 = tm.createClass({
        /**
         * 要素
         */
        m: null,
        
        /**
         * 初期化
         */
        init: function() {
            this.m = [];
            if (arguments.length >= 9) {
                this.set.apply(this, arguments);
            }
            else {
                this.identity();
            }
        },
        

        /**
         * セッター
         */
        set: function(m00, m01, m02, m10, m11, m12, m20, m21, m22)
        {
            console.assert(arguments.length>=9, "");
            
            // |m00, m01, m02|
            // |m10, m11, m12|
            // |m20, m21, m22|
            
            this.m00 = m00; this.m01 = m01; this.m02 = m02;
            this.m10 = m10; this.m11 = m11; this.m12 = m12;
            this.m20 = m20; this.m21 = m21; this.m22 = m22;
            
            return this;
        },
        
        /**
         * 配列からセット
         */
        setArray: function(arr)
        {
            this.set(
                arr[0], arr[3], arr[6],
                arr[1], arr[4], arr[7],
                arr[2], arr[5], arr[8]
            );
            
            return this;
        },
        
        /**
         * オブジェクトからセット
         */
        setObject: function(obj)
        {
            this.set(
                obj.m00, obj.m01, obj.m02,
                obj.m10, obj.m11, obj.m12,
                obj.m20, obj.m21, obj.m22
            );
            
            return this;
        },
        
        /**
         * 単位行列
         */
        identity: function() {
            this.set(
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            );
            return this;
        },
        
        /**
         * 転地
         */
        transpose: function() {
            this.m.swap(1, 3);
            this.m.swap(2, 6);
            this.m.swap(5, 7);
            
            return this;
        },
        
        /**
         * ゼロクリア
         */
        zero: function() {
            this.set(
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            );
            
            return this;
        },
        
        /**
         * 移動
         */
        translate: function(x, y) {
            this.set(
                0, 0, x,
                0, 0, y,
                0, 0, 0
            );
            
            return this;
        },
        
        /**
         * X軸回転
         */
        rotateX: function(rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            
            this.set(
                1, 0, 0,
                0, c,-s,
                0, s, c
            );
            
            return this;
        },
        
        /**
         * Y軸回転
         */
        rotateY: function(rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            
            this.set(
                 c, 0, s,
                 0, 1, 0,
                -s, 0, c
            );
            
            return this;
        },
        
        /**
         * Z軸回転
         */
        rotateZ: function(rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            
            this.set(
                c,-s, 0,
                s, c, 0,
                0, 0, 1
            );
            
            return this;
        },
        
        /**
         * スケーリング
         */
        scale: function(x, y) {
            if (arguments.length == 1) {
                this.set(
                    x, 0, 0,
                    0, x, 0,
                    0, 0, 0
                );
            }
            else {
                this.set(
                    x, 0, 0,
                    0, y, 0,
                    0, 0, 0
                );
            }
            
            return this;
        },
        
        /**
         * 配列に変換
         */
        toArray: function() {
            return this.m.slice();
        },
        
        /**
         * 文字列化
         */
        toString: function() {
            return "|{m00}, {m01}, {m02}|\n|{m10}, {m11}, {m12}|\n|{m20}, {m21}, {m22}|".format(this);
        },
        
    });
    
    
    
    /**
     * @property    m00
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m00", {
        "get": function()   { return this.m[0]; },
        "set": function(v)  { this.m[0] = v;    }
    });
    /**
     * @property    m10
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m10", {
        "get": function()   { return this.m[1]; },
        "set": function(v)  { this.m[1] = v;    }
    });
    /**
     * @property    m20
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m20", {
        "get": function()   { return this.m[2]; },
        "set": function(v)  { this.m[2] = v;    }
    });
    
    /**
     * @property    m01
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m01", {
        "get": function()   { return this.m[3]; },
        "set": function(v)  { this.m[3] = v;    }
    });
    /**
     * @property    m11
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m11", {
        "get": function()   { return this.m[4]; },
        "set": function(v)  { this.m[4] = v;    }
    });
    /**
     * @property    m21
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m21", {
        "get": function()   { return this.m[5]; },
        "set": function(v)  { this.m[5] = v;    }
    });
    
    /**
     * @property    m02
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m02", {
        "get": function()   { return this.m[6]; },
        "set": function(v)  { this.m[6] = v;    }
    });
    /**
     * @property    m12
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m12", {
        "get": function()   { return this.m[7]; },
        "set": function(v)  { this.m[7] = v;    }
    });
    /**
     * @property    m22
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("m22", {
        "get": function()   { return this.m[8]; },
        "set": function(v)  { this.m[8] = v;    }
    });
    
})();
