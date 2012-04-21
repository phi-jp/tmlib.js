/*
 * vector3.js
 */

/*
 * 幾何学
 */
tm.geom = tm.geom || {};


(function() {
    
    /**
     * 3次元ベクトル
     */
    tm.geom.Vector3 = tm.createClass({
        /**
         * @cfg {Number}    X 座標
         */
        x: 0,
        /**
         * @cfg {Number}    Y 座標
         */
        y: 0,
        /**
         * @cfg {Number}    Z 座標
         */
        z: 0,
        

        /**
         * @constructor
         * ３次元ベクトル
         * 
         * - [Test Program](http://tmlib-js.googlecode.com/svn/trunk/test/geom/vector-test.html)
         */
        init: function(x, y, z) {
            this.set(x, y, z);
        },
        
        /**
         * セット
         */
        set: function(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            
            return this;
        },
        
        /**
         * 数値からセット
         */
        setFromNumber: function(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            
            return this;
        },
        
        /**
         * 配列からセット
         */
        setFromArray: function(arr) {
            this.x = arr[0];
            this.y = arr[1];
            this.z = arr[2];
            
            return this;
        },
        
        /**
         * オブジェクトからセット
         */
        setFromObject: function(obj) {
            this.x = obj.x;
            this.y = obj.y;
            this.z = obj.z;
            
            return this;
        },
        
        /**
         * 文字列からセット
         */
        setFromString: function(str) {
            var m = str.match(/(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?)/);
            this.x = parseFloat(m[1]);
            this.y = parseFloat(m[3]);
            this.z = parseFloat(m[5]);
            
            return this;
        },
        
        /**
         * 角度(radian)と長さでベクトルをセット
         */
        setFromAngle: function(thetaRad, phiRad, len) {
            len = len || 1;
            
            this.x = len * Math.cos(thetaRad) * Math.sin(phiRad);
            this.y = len * Math.sin(thetaRad);
            this.z = len * Math.cos(thetaRad) * Math.cos(phiRad);
            
            return this;
        },
        
        /**
         * 角度(radian)と長さでベクトルをセット
         */
        setFromRadian: function(thetaRad, phiRad, len) {
            return this.setFromAngle(thetaRad, phiRad, len);
        },
        
        /**
         * 角度(degree)と長さでベクトルをセット
         */
        setFromDegree: function(thetaDegree, phiDegree, len) {
            return this.setFromAngle(thetaDegree*Math.PI/180, phiDegree*Math.PI/180, len);
        },

        /**
         * 角度(radian)と長さでベクトルをセット
         */
        setFromAngle2D: function(radian, len) {
            len = len || 1;
            this.x = Math.cos(radian)*len;
            this.y = Math.sin(radian)*len;
            this.z = 0;
            return this;
        },
        
        /**
         * 角度(radian)と長さでベクトルをセット
         */
        setFromRadian2D: function(radian, len) {
            len = len || 1;
            this.x = Math.cos(radian)*len;
            this.y = Math.sin(radian)*len;
            this.z = 0;
            return this;
        },
        
        /**
         * 角度(degree)と長さでベクトルをセット
         */
        setFromDegree2D: function(degree, len) {
            len = len || 1;
            radian = degree * Math.PI/180;
            this.x = Math.cos(radian)*len;
            this.y = Math.sin(radian)*len;
            this.z = 0;
            return this;
        },
                
        /**
         * 賢いセット
         */
        setSmart: function(x, y, z) {
            var v = arguments[0];
            // xyz
            if (arguments.length === 3) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            // Array
            else if (v instanceof Array) {
                this.x = v[0];
                this.y = v[1];
                this.z = v[2];
            }
            // Object
            else if (v instanceof Object) {
                this.x = v.x;
                this.y = v.y;
                this.z = v.z;
            }
            // String
            else if (typeof(v) == "string") {
                var m = v.match(/(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?)/);
                this.x = parseFloat(m[1]);
                this.y = parseFloat(m[3]);
                this.z = parseFloat(m[5]);
            }
            
            return this;
        },
        
        /**
         * 加算
         */
        add: function(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            
            return this;
        },
        
        /**
         * 減算
         */
        sub: function(v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            
            return this;
        },
        
        /**
         * 乗算
         */
        mul: function(n) {
            this.x *= n;
            this.y *= n;
            this.z *= n;
            
            return this;
        },
        
        /**
         * 除算
         */
        div: function(n) {
            console.assert(n != 0, "0 division!!");
            this.x /= n;
            this.y /= n;
            this.z /= n;
            
            return this;
        },
        
        /**
         * 反転
         */
        negate: function() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            
            return this;
        },
        
        /**
         * 長さを取得
         * or magnitude
         */
        length: function() {
            return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        },
        
        /**
         * 2乗された長さを取得
         * C# の名前を引用
         * or lengthSquare or lengthSqrt
         */
        lengthSquared: function() {
            return this.x*this.x + this.y*this.y + this.z*this.z;
        },
        
        /**
         * 正規化
         */
        normalize: function() {
            var length = this.length();
            this.div(length);
            
            return this;
        },
        

        toVector2: function() {
            // TODO:
        },
        

        /**
         * 角度(radian)に変換
         */
        toAngleXY: function() {
            return Math.atan2(this.y, this.x);
        },
        
        
        /**
         * 3D化する
         */
        to3D: function() {
            // TODO: 3d化する
        },
        
        toStyleString: function() {
            return "{x:{x}, y:{y}, z:{z}}".format(this);
        },
        
        toString: function() {
            return "{x:{x}, y:{y}, z:{z}}".format(this);
        },
        
        
        /**
         * X値をセット
         * チェーンメソッド用セッター
         */
        setX: function(x) {
            this.x = x;
            return this;
        },
        
        /**
         * Y値をセット
         * チェーンメソッド用セッター
         */
        setY: function(y) {
            this.y = y;
            return this;
        },
        
        /**
         * Z値をセット
         * チェーンメソッド用セッター
         */
        setZ: function(z) {
            this.z = z;
            return this;
        }
    });
    
})();

