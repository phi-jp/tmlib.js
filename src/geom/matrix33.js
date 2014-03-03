/*
 * matrix33.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class   tm.geom.Matrix33
     * 3*3 マトリックスクラス
     */
    tm.define("tm.geom.Matrix33", {
        /**
         * 要素
         */
        m: null,
        
        /**
         * @constructor
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
         * クローン
         */
        clone: function() {
            var m = this.m;
            return tm.geom.Matrix33(
                m[0], m[3], m[6],
                m[1], m[4], m[7],
                m[2], m[5], m[8]
            );
        },
        
        /**
         * セッター
         */
        set: function(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
            console.assert(arguments.length>=9, "");
            
            // |m00, m01, m02|
            // |m10, m11, m12|
            // |m20, m21, m22|
            
            // |m[0], m[3], m[6]|
            // |m[1], m[4], m[7]|
            // |m[2], m[5], m[8]|
            
            // |a, b, tx|
            // |c, d, ty|
            // |0, 0,  1|
            
            this.m00 = m00; this.m01 = m01; this.m02 = m02;
            this.m10 = m10; this.m11 = m11; this.m12 = m12;
            this.m20 = m20; this.m21 = m21; this.m22 = m22;
            
            return this;
        },
        
        /**
         * 配列からセット
         */
        setArray: function(arr) {
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
        setObject: function(obj) {
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
            var m = this.m;
            
            m[0] = 1; m[3] = 0; m[6] = 0;
            m[1] = 0; m[4] = 1; m[7] = 0;
            m[2] = 0; m[5] = 0; m[8] = 1;
            
            return this;
        },
        
        /**
         * 転置
         */
        transpose: function() {
            this.m.swap(1, 3);
            this.m.swap(2, 6);
            this.m.swap(5, 7);
            
            return this;
        },
        
        /**
         * 逆行列
         */
        invert: function() {
            var m = this.m;
            var m00 = m[0], m01 = m[3], m02 = m[6];
            var m10 = m[1], m11 = m[4], m12 = m[7];
            var m20 = m[2], m21 = m[5], m22 = m[8];
            var det = this.determinant();
            
            // |m00, m01, m02|
            // |m10, m11, m12|
            // |m20, m21, m22|
            
            this.m00 = (m11*m22-m12*m21)/det;
            this.m01 = (m10*m22-m12*m20)/det*-1;
            this.m02 = (m10*m21-m11*m20)/det;
            
            this.m10 = (m01*m22-m02*m21)/det*-1;
            this.m11 = (m00*m22-m02*m20)/det;
            this.m12 = (m00*m21-m01*m20)/det*-1;
            
            this.m20 = (m01*m12-m02*m11)/det;
            this.m21 = (m00*m12-m02*m10)/det*-1;
            this.m22 = (m00*m11-m01*m10)/det;
            
            this.transpose();
            
            return this;
        },

        /**
         * 行列式
         */
        determinant: function() {
            var m = this.m;
            
            var m00 = m[0], m01 = m[3], m02 = m[6];
            var m10 = m[1], m11 = m[4], m12 = m[7];
            var m20 = m[2], m21 = m[5], m22 = m[8];
            
            return m00*m11*m22 + m10*m21*m02 + m01*m12*m20 - m02*m11*m20 - m01*m10*m22 - m12*m21*m00;
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
            var m = this.m;
            
            m[6] = m[0] * x + m[3] * y + m[6];
            m[7] = m[1] * x + m[4] * y + m[7];
            m[8] = m[2] * x + m[5] * y + m[8];
            
            return this;
            
            return this.multiply( tm.geom.Matrix33.translate(x, y) );
        },
        
        /**
         * X軸回転
         */
        rotateX: function(rad) {
            return this.multiply( tm.geom.Matrix33.rotateX(rad) );
        },
        
        /**
         * Y軸回転
         */
        rotateY: function(rad) {
            return this.multiply( tm.geom.Matrix33.rotateY(rad) );
        },
        
        /**
         * Z軸回転
         */
        rotateZ: function(rad) {
            var s = Math.sin(rad);
            var c = Math.cos(rad);
            var m = this.m;
            
            var m00 = m[0];
            var m10 = m[1];
            var m20 = m[2];
            var m01 = m[3];
            var m11 = m[4];
            var m21 = m[5];
            
            
            return this.multiply( tm.geom.Matrix33.rotateZ(rad) );
        },
        
        /**
         * スケーリング
         */
        scale: function(x, y) {
            var m = this.m;
            
            m[0] *= x; m[3] *= y;
            m[1] *= x; m[4] *= y;
            m[2] *= x; m[5] *= y;
            
            return this;
            return this.multiply( tm.geom.Matrix33.scale(x, y) );
        },
        
        /**
         * 掛け算
         */
        multiply: function(mat) {
            var tm = this.m;
            var om = mat.m;
            
            var a00 = tm[0], a01 = tm[3], a02 = tm[6];
            var a10 = tm[1], a11 = tm[4], a12 = tm[7];
            var a20 = tm[2], a21 = tm[5], a22 = tm[8];
            var b00 = om[0], b01 = om[3], b02 = om[6];
            var b10 = om[1], b11 = om[4], b12 = om[7];
            var b20 = om[2], b21 = om[5], b22 = om[8];
            
            
            tm[0] = a00*b00 + a01*b10 + a02*b20;
            tm[3] = a00*b01 + a01*b11 + a02*b21;
            tm[6] = a00*b02 + a01*b12 + a02*b22;
            
            tm[1] = a10*b00 + a11*b10 + a12*b20;
            tm[4] = a10*b01 + a11*b11 + a12*b21;
            tm[7] = a10*b02 + a11*b12 + a12*b22;
            
            tm[2] = a20*b00 + a21*b10 + a22*b20;
            tm[5] = a20*b01 + a21*b11 + a22*b21;
            tm[8] = a20*b02 + a21*b12 + a22*b22;
            
            return this;
        },
        
        /**
         * ベクトルとの掛け算
         */
        multiplyVector2: function(v) {
            var vx = this.m00*v.x + this.m01*v.y + this.m02;
            var vy = this.m10*v.x + this.m11*v.y + this.m12;
            
            return tm.geom.Vector2(vx, vy);
        },
        
        /**
         * ベクトルとの掛け算
         */
        multiplyVector3: function(v) {
            var vx = this.m00*v.x + this.m01*v.y + this.m02*v.z;
            var vy = this.m10*v.x + this.m11*v.y + this.m12*v.z;
            var vz = this.m20*v.x + this.m21*v.y + this.m22*v.z;
            
            return tm.geom.Vector3(vx, vy, vz);
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

    /**
     * @property    a
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("a", {
        "get": function()   { return this.m[0]; },
        "set": function(v)  { this.m[0] = v;    }
    });
    /**
     * @property    b
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("b", {
        "get": function()   { return this.m[3]; },
        "set": function(v)  { this.m[3] = v;    }
    });
    /**
     * @property    c
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("c", {
        "get": function()   { return this.m[1]; },
        "set": function(v)  { this.m[1] = v;    }
    });
    /**
     * @property    d
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("d", {
        "get": function()   { return this.m[4]; },
        "set": function(v)  { this.m[4] = v;    }
    });
    /**
     * @property    tx
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("tx", {
        "get": function()   { return this.m[6]; },
        "set": function(v)  { this.m[6] = v;    }
    });
    /**
     * @property    ty
     * 要素
     */
    tm.geom.Matrix33.prototype.accessor("ty", {
        "get": function()   { return this.m[7]; },
        "set": function(v)  { this.m[7] = v;    }
    });
    

    /**
     * @static
     * @method
     * 移動
     */
    tm.geom.Matrix33.translate = function(x, y) {
        return tm.geom.Matrix33(
            1, 0, x,
            0, 1, y,
            0, 0, 1
        );
    };
    
    /**
     * @static
     * @method
     * X軸回転
     */
    tm.geom.Matrix33.rotateX = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix33(
            1, 0, 0,
            0, c,-s,
            0, s, c
        );
    };
    
    /**
     * @static
     * @method
     * Y軸回転
     */
    tm.geom.Matrix33.rotateY = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix33(
             c, 0, s,
             0, 1, 0,
            -s, 0, c
        );
    };
    
    /**
     * @static
     * @method
     * Z軸回転
     */
    tm.geom.Matrix33.rotateZ = function(rad) {
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        
        return tm.geom.Matrix33(
            c,-s, 0,
            s, c, 0,
            0, 0, 1
        );
    };
    
    /**
     * @static
     * @method
     * スケーリング
     */
    tm.geom.Matrix33.scale = function(x, y) {
        var mat = tm.geom.Matrix33();
        
        if (y == undefined) y = x;
        
        mat.set(
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        );
        
        return mat;
    };
    
})();









