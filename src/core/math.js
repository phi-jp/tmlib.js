/*
 * math.js
 */


(function() {
    
    /**
     * @class Math
     * 数学
     */
    
    /**
     * @method
     * ランダムな値を指定された範囲内で生成
     */
    Math.rand = function(min, max) {
        return window.Math.floor( Math.randf(min, max) );
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
     * Degree を Radian に変換
     */
    Math.degToRad = function(deg) {
        return deg / 180.0 * Math.PI;
    };
    
    /**
     * @method
     * Radian を Degree に変換
     */
    Math.radToDeg = function(rad) {
        return rad * 180.0 / Math.PI;
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
    
})();

