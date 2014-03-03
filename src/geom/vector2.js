/*
 * vector2.js
 */

/*
 * 幾何学
 */
tm.geom = tm.geom || {};


(function() {
    
    /**
     * @class tm.geom.Vector2
     * 2次元ベクトル
     */
    tm.geom.Vector2 = tm.createClass({
        /** x座標 */
        x: 0,
        /** y座標 */
        y: 0,
        
        /**
         * @constructor
         */
        init: function(x, y) {
            this.set(x, y);
        },
        
        
        /**
         * 複製
         */
        clone: function() {
            return tm.geom.Vector2(this.x, this.y);
        },
        
        
        /**
         * 等しいかどうかをチェック
         * @param   {tm.geom.Vector2}   v   比較対象となる２次元ベクトル
         */
        equals: function(v) {
            return (this.x === v.x && this.y === v.y) ? true : false;
        },
        
        /**
         * 数値と等しいかどうかをチェック
         * @param   {Number}   x    比較対象となる x 値
         * @param   {Number}   y    比較対象となる y 値
         */
        equalsNumber: function(x, y) {
            return (this.x === x && this.y === y) ? true : false;
        },
        
        /**
         * 配列と等しいかどうかをチェック
         * @param   {Number}   arr  比較対象となる配列
         */
        equalsArray: function(arr) {
            return (this.x === arr[0] && this.y === arr[1]) ? true : false;
        },
        
        
        /**
         * セッター
         */
        set: function(x, y) {
            this.x = x;
            this.y = y;
        },
        
        /**
         * 数値からセット
         */
        setNumber: function(x, y) {
            this.x = x;
            this.y = y;
            
            return this;
        },
        
        /**
         * 配列からセット
         */
        setArray: function(arr) {
            this.x = arr[0];
            this.y = arr[1];
            
            return this;
        },
        
        /**
         * オブジェクトからセット
         */
        setObject: function(obj) {
            this.x = obj.x;
            this.y = obj.y;
            
            return this;
        },
        
        /**
         * 文字列からセット
         */
        setString: function(str) {
            var m = str.match(/(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?)/);
            this.x = parseFloat(m[1]);
            this.y = parseFloat(m[3]);
            
            return this;
        },
        
        /**
         * 賢いセット
         */
        setSmart: function(x, y) {
            var v = arguments[0];
            // xyz
            if (arguments.length === 2) {
                this.x = x;
                this.y = y;
            }
            // Array
            else if (v instanceof Array) {
                this.x = v[0];
                this.y = v[1];
            }
            // Object
            else if (v instanceof Object) {
                this.x = v.x;
                this.y = v.y;
            }
            // String
            else if (typeof(v) == "string") {
                var m = v.match(/(-?\d+(\.{1}\d+)?),\s*(-?\d+(\.{1}\d+)?)/);
                this.x = parseFloat(m[1]);
                this.y = parseFloat(m[3]);
            }
            
            return this;
        },
        
        /**
         * 角度と長さでベクトルをセット
         * Angle は Degree 値で指定
         */
        setAngle: function(angle, len) {
            var rad = angle*Math.DEG_TO_RAD;
            
            len = len || 1;
            this.x = Math.cos(rad)*len;
            this.y = Math.sin(rad)*len;
            
            return this;
        },
        
        /**
         * 角度(radian)と長さでベクトルをセット
         */
        setRadian: function(radian, len) {
            len = len || 1;
            this.x = Math.cos(radian)*len;
            this.y = Math.sin(radian)*len;
            
            return this;
        },
        
        /**
         * 角度(degree)と長さでベクトルをセット
         */
        setDegree: function(degree, len) {
            var rad = degree*Math.DEG_TO_RAD;
            
            len = len || 1;
            this.x = Math.cos(rad)*len;
            this.y = Math.sin(rad)*len;
            
            return this;
        },
        
        /**
         * ランダムベクトルをセット
         */
        setRandom: function(min, max, len) {
            min = min || 0;
            max = max || 360;
            len = len || 1;
            this.setDegree(Math.randf(min, max), len);
            return this;
        },
        
        /**
         * 加算
         */
        add: function(v) {
            this.x += v.x;
            this.y += v.y;
            
            return this;
        },
        
        /**
         * 減算
         */
        sub: function(v) {
            this.x -= v.x;
            this.y -= v.y;
            
            return this;
        },
        
        /**
         * 乗算
         */
        mul: function(n) {
            this.x *= n;
            this.y *= n;
            
            return this;
        },
        
        /**
         * 除算
         */
        div: function(n) {
            //console.assert(n != 0, "0 division!!");
            n = n || 0.01;
            this.x /= n;
            this.y /= n;
            
            return this;
        },
        
        /**
         * 反転
         */
        negate: function() {
            this.x = -this.x;
            this.y = -this.y;
            
            return this;
        },

        /**
         * @method
         * 内積.
         * 投影ベクトルを求めたり, 類似度に使ったり.
         */
        dot: function(v) {
            return this.x * v.x + this.y * v.y;
        },

        /**
         * @method
         * 外積
         */
        cross: function(v) {
            return (this.x*v.y) - (this.y*v.x);
        },
        
        /**
         * 長さを取得
         * ### memo
         * magnitude って名前の方が良いかも. 検討中.
         */
        length: function() {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        },
        
        /**
         * 2乗された長さを取得
         * C# の名前を引用
         * or lengthSquare or lengthSqrt
         */
        lengthSquared: function() {
            return this.x*this.x + this.y*this.y;
        },
        
        /**
         * ２点間の距離を返す
         */
        distance: function(v) {
            return Math.sqrt( Math.pow(this.x-v.x, 2) + Math.pow(this.y-v.y, 2) );
        },
        
        /**
         * ２点間の距離を返す
         */
        distanceSquared: function(v) {
            return Math.pow(this.x-v.x, 2) + Math.pow(this.y-v.y, 2);
        },
        
        /**
         * 正規化
         */
        normalize: function() {
            var length = this.length();
            this.div(length);
            
            return this;
        },
        
        /**
         * 角度(radian)に変換
         */
        toAngle: function() {
            return Math.atan2(this.y, this.x);
        },

        /**
         * スタイル文字列に変換
         */
        toStyleString: function() {
            return "{x:{x}, y:{y}}".format(this);
        },

        /**
         * 文字列に変換
         */
        toString: function() {
            return "{x:{x}, y:{y}}".format(this);
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
        
    });
    
    
    /**
     * @method
     * @static
     * min
     */
    tm.geom.Vector2.min = function(lhs, rhs) {
        return tm.geom.Vector2(
            (lhs.x < rhs.x) ? lhs.x : rhs.x,
            (lhs.y < rhs.y) ? lhs.y : rhs.y
        );
    };
    
    /**
     * @method
     * @static
     * max
     */
    tm.geom.Vector2.max = function(lhs, rhs) {
        return tm.geom.Vector2(
            (lhs.x > rhs.x) ? lhs.x : rhs.x,
            (lhs.y > rhs.y) ? lhs.y : rhs.y
        );
    };
    
    /**
     * @method
     * @static
     * 加算
     */
    tm.geom.Vector2.add = function(lhs, rhs) {
        return tm.geom.Vector2(lhs.x+rhs.x, lhs.y+rhs.y);
    };
    
    /**
     * @method
     * @static
     * 減算
     */
    tm.geom.Vector2.sub = function(lhs, rhs) {
        return tm.geom.Vector2(lhs.x-rhs.x, lhs.y-rhs.y);
    };
    
    /**
     * @method
     * @static
     * 乗算
     */
    tm.geom.Vector2.mul = function(v, n) {
        return tm.geom.Vector2(v.x*n, v.y*n);
    };
    
    /**
     * @method
     * @static
     * 割算
     */
    tm.geom.Vector2.div = function(v, n) {
        return tm.geom.Vector2(v.x/n, v.y/n);
    };
    
    /**
     * @method
     * @static
     * 反転
     */
    tm.geom.Vector2.negate = function(v) {
        return tm.geom.Vector2(-v.x, -v.y);
    };
    
    /**
     * @method
     * @static
     * 内積.
     * 投影ベクトルを求めたり, 類似度に使ったり.
     */
    tm.geom.Vector2.dot = function(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    };
    

    /**
     * @method
     * @static
     * 外積
     */
    tm.geom.Vector2.cross = function(lhs, rhs) {
        return (lhs.x*rhs.y) - (lhs.y*rhs.x);
    };
    
    /**
     * @method
     * @static
     * ２点間の距離を返す
     */
    tm.geom.Vector2.distance = function(lhs, rhs) {
        return Math.sqrt( Math.pow(lhs.x-rhs.x, 2) + Math.pow(lhs.y-rhs.y, 2) );
    };
    
    /**
     * @method
     * @static
     * ２点間の距離を返す
     */
    tm.geom.Vector2.distanceSquared = function(lhs, rhs) {
        return Math.pow(lhs.x-rhs.x, 2) + Math.pow(lhs.y-rhs.y, 2);
    };

    /**
     * @method
     * @static
     * マンハッタン距離
     */
    tm.geom.Vector2.manhattanDistance = function(lhs, rhs) {
        return Math.abs(lhs.x-rhs.x) + Math.abs(lhs.y-rhs.y);
    };
    
    /**
     * @method
     * @static
     * 反射ベクトル
     */
    tm.geom.Vector2.reflect = function(v, normal) {
        var len = Vector2.dot(v, normal);
        var temp= Vector2.mul(normal, 2*len);
        
        return tm.geom.Vector2.sub(v, temp);
    };

    /**
     * @method
     * @static
     * 補間.
     * 0.5 で lhs と rhs の中間ベクトルを求めることができます.
     */
    tm.geom.Vector2.lerp = function(lhs, rhs, t) {
        // TODO: 
        return tm.geom.Vector2(
            lhs.x + (rhs.x-lhs.x)*t,
            lhs.y + (rhs.y-lhs.y)*t
        );
    };
    
    
    /**
     * @method
     * @static
     * 補間
     */
    tm.geom.Vector2.slerp = function(lhs, rhs, t) {
        // TODO:
        // cos...
    };
    

    /**
     * @method
     * @static
     * min ~ max の間でランダムな方向のベクトルを生成する. len で長さ指定.
     */
    tm.geom.Vector2.random = function(min, max, len) {
        min = min || 0;
        max = max || 360;
        len = len || 1;
        return tm.geom.Vector2().setDegree(Math.randf(min, max), len);
    };
    
    
    /**
     * @property
     * @static
     * zero
     */
    tm.geom.Vector2.ZERO    = tm.geom.Vector2( 0, 0);
    
    /**
     * @property
     * @static
     * left
     */
    tm.geom.Vector2.LEFT    = tm.geom.Vector2(-1, 0);
    
    
    /**
     * @property
     * @static
     * right
     */
    tm.geom.Vector2.RIGHT   = tm.geom.Vector2( 1, 0);
    
    /**
     * @property
     * @static
     * up
     */
    tm.geom.Vector2.UP      = tm.geom.Vector2( 0, 1);
    
    /**
     * @property
     * @static
     * down
     */
    tm.geom.Vector2.DOWN    = tm.geom.Vector2( 0,-1);
    
})();

