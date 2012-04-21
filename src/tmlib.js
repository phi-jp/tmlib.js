/**
 * @author phi
 */

(function() { "use strict"; })();


/**
 * tm namespace
 */
var tm = tm || {};

/**
 * 
 */
(function() {
    
    tm.VERSION = "0.0.0";
    
    
    tm.LIB_ROOT = (function(){
        if (!document) return ;
        
        var scripts = document.getElementsByTagName("script");
        for (var i=0, len=scripts.length; i<len; ++i) {
            
        }
    })();
    
    tm.BROWSER = (function() {
        if      (/chrome/i.test(navigator.userAgent))   { return "Chrome";  }
        else if (/safari/i.test(navigator.userAgent))   { return "Safari";  }
        else if (/firefox/i.test(navigator.userAgent))  { return "Firefox"; }
        else if (/opera/i.test(navigator.userAgent))    { return "Opera";   }
        else if (/getcko/i.test(navigator.userAgent))   { return "Getcko";  }
        else if (/msie/i.test(navigator.userAgent))     { return "IE";      }
        else { return null; }
    })();
    
    tm.isMobile = (function() {
        return (navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("Android") > 0);
    })();
    
    tm.extend = function(dest, source) {
        for (var property in source) {
            dest[property] = source[property];
        }
        return dest;
    };
    
    tm.createClass = function(prop) {
        // デフォルト値
        prop.init = prop.init || function() {};
        prop.superClass = prop.superClass || null;
        
        // クラス作成
        var tm_class = function() {
            var temp = new tm_class.prototype.creator();
            tm_class.prototype.init.apply(temp, arguments);
            return temp
        };
        
        // 継承
        if (prop.superClass) {
            tm_class.prototype = Object.create(prop.superClass.prototype);
        }
        
        // プロパティを追加
        for (var key in prop) {
            tm_class.prototype[key] = prop[key];
        }
        
        // クリエイタの生成
        tm_class.prototype.creator = function() { return this; };
        // クリエイタの継承
        tm_class.prototype.creator.prototype = tm_class.prototype;
        
        return tm_class;
    };
    
    tm.using = function() {
        for (var key in tm) {
            window[key] = tm[key];
        }
    };
    
})();

