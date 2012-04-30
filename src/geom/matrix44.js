/*
 * matrix44.js
 */

tm.geom = tm.geom || {};

(function() {
    
    /**
     * @class
     * 4*4 マトリックスクラス
     */
    tm.geom.Matrix44 = tm.createClass({
        /**
         * 要素
         */
        m: null,
        

        /**
         * 初期化
         */
        init: function() {
            this.m = [];
            if (arguments.length >= 16) {
                this.set.apply(this, arguments);
            }
            else {
                this.identity();
            }
        },
        
        /**
         * セット
         */
        set: function(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)
        {
            console.assert(arguments.length>=16, "");
            
            // |m00, m10, m20, m30|
            // |m01, m11, m21, m31|
            // |m02, m12, m22, m32|
            // |m03, m13, m23, m33|
            
            this.m[0]  = arguments[0];  // m00
            this.m[1]  = arguments[1];  // m01
            this.m[2]  = arguments[2];  // m02
            this.m[3]  = arguments[3];  // m03
            this.m[4]  = arguments[4];  // m10
            this.m[5]  = arguments[5];  // m11
            this.m[6]  = arguments[6];  // m12
            this.m[7]  = arguments[7];  // m13
            this.m[8]  = arguments[8];  // m20
            this.m[9]  = arguments[9];  // m21
            this.m[10] = arguments[10]; // m22
            this.m[11] = arguments[11]; // m23
            this.m[12] = arguments[12]; // m30
            this.m[13] = arguments[13]; // m31
            this.m[14] = arguments[14]; // m32
            this.m[15] = arguments[15]; // m33
            
            return this;
        },
        
        /**
         * 配列からセット
         */
        setFromArray: function(arr)
        {
            this.set.apply(this, arr);
        },
        
        /**
         * オブジェクトからセット.
         * Matrix44 もこいつでいける!!
         */
        setFromObject: function(obj)
        {
            this.m[0]  = obj.m00;
            this.m[1]  = obj.m01;
            this.m[2]  = obj.m02;
            this.m[3]  = obj.m03;
            this.m[4]  = obj.m10;
            this.m[5]  = obj.m11;
            this.m[6]  = obj.m12;
            this.m[7]  = obj.m13;
            this.m[8]  = obj.m20;
            this.m[9]  = obj.m21;
            this.m[10] = obj.m22;
            this.m[11] = obj.m23;
            this.m[12] = obj.m30;
            this.m[13] = obj.m31;
            this.m[14] = obj.m32;
            this.m[15] = obj.m33;
            
            return this;
        },
        
        
        /**
         * 単位行列
         */
        identity: function() {
            this.set(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
            return this;
        },
        
        /**
         * 移動
         */
        translate: function(x, y, z) {
            var mat = tm.geom.Matrix44();
            mat.m30 = x;
            mat.m31 = y;
            mat.m32 = z;
            // console.log(mat.toString());
            
            return this.mult(mat);
        },
        
        /**
         * 回転
         */
        rotate: function(angle) {
            // TODO: いつか実装する
            console.error("Unimplemented");
        },
        
        /**
         * X軸を基軸に angle(radian)回転する
         */
        rotateX: function(angle) {
            
            var mat = tm.geom.Matrix44();
            
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            mat.m11 =  c; mat.m21 = -s;
            mat.m12 =  s; mat.m22 =  c;
            
            return this.mult(mat);
        },
        
        /**
         * Y軸を基軸に angle(radian)回転する
         */
        rotateY: function(angle) {
            var mat = tm.geom.Matrix44();
            
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            mat.m00 =  c; mat.m20 = s;
            mat.m02 = -s; mat.m22 = c;
            
            return this.mult(mat);
        },
        
        /**
         * Z軸を基軸に angle(radian)回転する
         */
        rotateZ: function(angle) {
            var mat = tm.geom.Matrix44();
            
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            mat.m00 = c; mat.m10 =-s;
            mat.m01 = s; mat.m11 = c;
            
            return this.mult(mat);
        },
        
        /**
         * スケーリング
         */
        scale: function(x, y, z) {
            var mat = tm.geom.Matrix44();
            
            if (arguments.length == 1) {
                mat.m00 = arguments[0];
                mat.m11 = arguments[0];
                mat.m22 = arguments[0];
            }
            else {
                mat.m00 = x;
                mat.m11 = y;
                mat.m22 = z;
            }
            
            return this.mult(mat);
        },
        
        /**
         * ゼロ
         */
        zero: function() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            return this;
        },
        
        /**
         * 乗算
         * this * mat
         */
        mult: function(mat)
        {
            var m00 = this.m00*mat.m00 + this.m01*mat.m10 + this.m02*mat.m20 + this.m03*mat.m30;
            var m01 = this.m00*mat.m01 + this.m01*mat.m11 + this.m02*mat.m21 + this.m03*mat.m31;
            var m02 = this.m00*mat.m02 + this.m01*mat.m12 + this.m02*mat.m22 + this.m03*mat.m32;
            var m03 = this.m00*mat.m03 + this.m01*mat.m13 + this.m02*mat.m23 + this.m03*mat.m33;
            
            var m10 = this.m10*mat.m00 + this.m11*mat.m10 + this.m12*mat.m20 + this.m13*mat.m30;
            var m11 = this.m10*mat.m01 + this.m11*mat.m11 + this.m12*mat.m21 + this.m13*mat.m31;
            var m12 = this.m10*mat.m02 + this.m11*mat.m12 + this.m12*mat.m22 + this.m13*mat.m32;
            var m13 = this.m10*mat.m03 + this.m11*mat.m13 + this.m12*mat.m23 + this.m13*mat.m33;
            
            var m20 = this.m20*mat.m00 + this.m21*mat.m10 + this.m22*mat.m20 + this.m23*mat.m30;
            var m21 = this.m20*mat.m01 + this.m21*mat.m11 + this.m22*mat.m21 + this.m23*mat.m31;
            var m22 = this.m20*mat.m02 + this.m21*mat.m12 + this.m22*mat.m22 + this.m23*mat.m32;
            var m23 = this.m20*mat.m03 + this.m21*mat.m13 + this.m22*mat.m23 + this.m23*mat.m33;
            
            var m30 = this.m30*mat.m00 + this.m31*mat.m10 + this.m32*mat.m20 + this.m33*mat.m30;
            var m31 = this.m30*mat.m01 + this.m31*mat.m11 + this.m32*mat.m21 + this.m33*mat.m31;
            var m32 = this.m30*mat.m02 + this.m31*mat.m12 + this.m32*mat.m22 + this.m33*mat.m32;
            var m33 = this.m30*mat.m03 + this.m31*mat.m13 + this.m32*mat.m23 + this.m33*mat.m33;
            
            return this.set(
                m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                m30, m31, m32, m33
            );
        },
        
        /*
        getAxisX: function() { return TM.Geom.Vector3(this.m00, this.m10, this.m20); },
        getAxisY: function() { return TM.Geom.Vector3(this.m01, this.m11, this.m21); },
        getAxisZ: function() { return TM.Geom.Vector3(this.m02, this.m12, this.m22); },
        */
        
        getAxisX: function() { return TM.Geom.Vector3(this.m00, this.m01, this.m02); },
        getAxisY: function() { return TM.Geom.Vector3(this.m10, this.m11, this.m12); },
        getAxisZ: function() { return TM.Geom.Vector3(this.m20, this.m21, this.m22); },
        
        setAxisX: function(v) { this.m00=v.x, this.m01=v.y, this.m02=v.z; },
        setAxisY: function(v) { this.m10=v.x, this.m11=v.y, this.m12=v.z; },
        setAxisZ: function(v) { this.m20=v.x, this.m21=v.y, this.m22=v.z; },
        
        /**
         * Matrix33 に変換
         */
        toMatrix33: function() {
            // TODO:
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
            return "|{m00}, {m10}, {m20}, {m30}|\n|{m01}, {m11}, {m21}, {m31}|\n|{m02}, {m12}, {m22}, {m32}|\n|{m03}, {m13}, {m23}, {m33}|".format(this);
        }
        
    });
    
    
    /**
     * @property    m00
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m00", {
        "get": function()   { return this.m[0]; },
        "set": function(v)  { this.m[0] = v;    }
    });
    /**
     * @property    m01
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m01", {
        "get": function()   { return this.m[1]; },
        "set": function(v)  { this.m[1] = v;    }
    });
    /**
     * @property    m02
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m02", {
        "get": function()   { return this.m[2]; },
        "set": function(v)  { this.m[2] = v;    }
    });
    /**
     * @property    m03
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m03", {
        "get": function()   { return this.m[3]; },
        "set": function(v)  { this.m[3] = v;    }
    });
    
    /**
     * @property    m10
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m10", {
        "get": function()   { return this.m[4]; },
        "set": function(v)  { this.m[4] = v;    }
    });
    /**
     * @property    m11
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m11", {
        "get": function()   { return this.m[5]; },
        "set": function(v)  { this.m[5] = v;    }
    });
    /**
     * @property    m12
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m12", {
        "get": function()   { return this.m[6]; },
        "set": function(v)  { this.m[6] = v;    }
    });
    /**
     * @property    m13
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m13", {
        "get": function()   { return this.m[7]; },
        "set": function(v)  { this.m[7] = v;    }
    });
    
    /**
     * @property    m20
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m20", {
        "get": function()   { return this.m[8]; },
        "set": function(v)  { this.m[8] = v;    }
    });
    /**
     * @property    m21
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m21", {
        "get": function()   { return this.m[9]; },
        "set": function(v)  { this.m[9] = v;    }
    });
    /**
     * @property    m22
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m22", {
        "get": function()   { return this.m[10]; },
        "set": function(v)  { this.m[10] = v;    }
    });
    /**
     * @property    m23
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m23", {
        "get": function()   { return this.m[11]; },
        "set": function(v)  { this.m[11] = v;    }
    });
        
    /**
     * @property    m30
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m30", {
        "get": function()   { return this.m[12]; },
        "set": function(v)  { this.m[12] = v;    }
    });
    /**
     * @property    m31
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m31", {
        "get": function()   { return this.m[13]; },
        "set": function(v)  { this.m[13] = v;    }
    });
    /**
     * @property    m32
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m32", {
        "get": function()   { return this.m[14]; },
        "set": function(v)  { this.m[14] = v;    }
    });
    /**
     * @property    m33
     * 要素
     */
    tm.geom.Matrix44.prototype.accessor("m33", {
        "get": function()   { return this.m[15]; },
        "set": function(v)  { this.m[15] = v;    }
    });
    
    
})();
