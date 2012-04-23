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
    
})();

