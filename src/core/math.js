/*
 * math.js
 */


(function() {
    
    /**
     * @class Math
     * 数学
     */
    
    /**
     * @property    DEG_TO_RAD
     * Degree to Radian.
     */
    Math.DEG_TO_RAD = Math.PI/180;
    
    
    /**
     * @property    RAD_TO_DEG
     * Radian to Degree.
     */
    Math.RAD_TO_DEG = 180/Math.PI;
    
    /**
     * @method
     * Degree を Radian に変換
     */
    Math.degToRad = function(deg) {
        return deg * DEG_TO_RAD;
    };
    
    /**
     * @method
     * Radian を Degree に変換
     */
    Math.radToDeg = function(rad) {
        return rad * RAD_TO_DEG;
    };
    
    
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    Math.rand = function(min, max) {
        return window.Math.floor( Math.random()*(max-min+1) ) + min;
    };
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    Math.randf= function(min, max) {
        return window.Math.random()*(max-min)+min;
    };

    /**
     * @method
     * 長さを取得
     */
    Math.magnitude = function() {
        return Math.sqrt(Math.magnitudeSq.apply(null, arguments));
    };
    
    
    /**
     * @method
     * 長さの２乗を取得
     */
    Math.magnitudeSq = function() {
        var n = 0;
        
        for (var i=0,len=arguments.length; i<len; ++i) {
            n += arguments[i]*arguments[i];
        }
        
        return n;
    };
    
    /**
     * @method
     * Dummy
     */
    Math.linear = function(t, b, c, d) {
        return c*t/d + b;
    };
    
    Math.easeInQuad = function(t, b, c, d) {
        return c*(t/=d)*t + b;
    };
    
    /*
    tm.anim.bounceEaseOut = function(t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    }
     */
    
})();

