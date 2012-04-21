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
    
    console.dir(tm);
    
})();

