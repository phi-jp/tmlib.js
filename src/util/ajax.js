/*
 * ajax.js
 */


tm.util = tm.util || {};

(function() {
    
    var AJAX_DEFAULT_SETTINGS = {
        type :"POST",
        async: true,
        data: null,
        contentType: 'application/x-www-form-urlencoded',
        dataType: 'text',
        username: null,
        password: null,
        success : function(data){ alert("success!!\n"+data); },
        error   : function(data){ alert("error!!"); }
    };
    
    
    tm.util.Ajax = {
        load: function(params)
        {
            for (var key in AJAX_DEFAULT_SETTINGS) {
                params[key] = params[key] || AJAX_DEFAULT_SETTINGS[key];
            }
            
            var httpRequest = new XMLHttpRequest();
            var ajax_params = "";
            var conv_func = tm.util.Ajax.DATA_CONVERTE_TABLE[params.dataType];
            
            // コールバック
            httpRequest.onreadystatechange = function()
            {
                if (httpRequest.readyState == 4) {
                    // 成功
                    if (httpRequest.status === 200) {
                        // タイプ別に変換をかける
                        var data = conv_func(httpRequest.responseText);
                        params.success(data);
                    }
                    // status === 0 はローカルファイル用
                    else if (httpRequest.status === 0) {
                        // タイプ別に変換をかける
                        var data = conv_func(httpRequest.responseText);
                        params.success(data);
                    }
                    else {
                        params.error(httpRequest.responseText);
                    }
                }
                else {
                    //console.log("通信中");
                }
            };
            
            httpRequest.open(params.type, params.url, params.async, params.username, params.password);   // オープン
            httpRequest.setRequestHeader('Content-Type', params.contentType);        // ヘッダをセット
            httpRequest.send(null);
        },
        
        loadJSONP: function(url, callback) {
            var g = tm.global;
            g.tmlib_js_dummy_func_count = tm.global.tmlib_js_dummy_func || 0;
            var dummy_func_name = "tmlib_js_dummy_func" + (g.tmlib_js_dummy_func_count++);
            g[dummy_func_name]  = callback;
            
            var elm = document.createElement("script");
            elm.type = "text/javascript";
            elm.charset = "UTF-8";
            elm.src = url + "&callback=" + dummy_func_name;
            elm.setAttribute("defer", true);
            document.getElementsByTagName("head")[0].appendChild(elm);
        }
    };
    
    /**
     * データコンバータテーブル
     */
    tm.util.Ajax.DATA_CONVERTE_TABLE = {
        undefined: function(data) {
            return data;
        },
        
        text: function(data) {
            return data;
        },
        
        xml: function(data) {
            var div = document.createElement("div");
            div.innerHTML = data;
            return div;
        },
        
        dom: function(data) {
            var div = document.createElement("div");
            div.innerHTML = data;
            return tm.dom.Element(div);
        },
        
        json: function(data) {
            return JSON.parse(data);
        },
        
        script: function(data) {
            eval(data);
            return data;
        },
        
        /**
         * ### Reference
         * - <http://efcl.info/adiary/Javascript/treat-binary>
         * @param {Object} data
         */
        bin: function(data) {
            var bytearray = [];
            for (var i=0, len=data.length; i<len; ++i) {
                bytearray[i] = data.charCodeAt(i) & 0xff;
            }
            return bytearray;
        },
        
    };
    
})();
