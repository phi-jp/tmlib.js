/*
 * querystring.js
 */

tm.util = tm.util || {};

(function() {
    
    /*
     * 
     */
    tm.util.QueryString = {
        /*
         * 
         */
        parse: function(str, sep, eq) {
            sep = sep || '&';
            eq  = eq  || '=';
            
            var obj = {};
            var params = str.split(sep);
            for (var i=0,len=params.length; i<len; ++i) {
                var param = params[i];
                var pos = param.indexOf(eq);
                if (pos>0) {
                    var key = param.substring(0, pos);
                    var val = param.substring(pos+1);
                    obj[key] = val;
                }
            }
            
            return obj;
        },
        
        /*
         * 
         */
        stringify: function(obj, sep, eq) {
            sep = sep || '&';
            eq  = eq  || '=';
            
            
            var strList = [];
            for (var key in obj) {
                var value = encodeURIComponent(obj[key]);
                strList.push(key + eq + value);
            }
            
            return strList.join(sep);
        },
    };
    
})();



