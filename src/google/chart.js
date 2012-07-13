/*
 * chart.js
 */

tm.google = tm.google || {};


(function() {
    
    /**
     * @class
     * チャートネームスペース
     */
    tm.google.Chart = tm.google.Chart || {};
    
    var BASE_URL = "https://chart.googleapis.com/chart?chs={size}&cht={type}&chl={text}";
    
    
    /**
     * Tweet する
     * @param {Object} prop
     * ### Reference
     * - <https://developers.google.com/chart/?hl=ja#qrcodes>
     * - <https://developers.google.com/chart/infographics/?hl=ja>
     * - <https://google-developers.appspot.com/chart/infographics/docs/overview>
     * ### Example
     *      tm.google.Chart.createQRCode("160x160", "http://tmlife.net");
     *      tm.google.Chart.createQRCode("160x160", "Hello, world");
     */
    tm.google.Chart.createQRCode = function(size, text) {
        text = encodeURIComponent(text);
        
        return BASE_URL.format({
            type:"qr",
            size:size,
            text:text,
        });
    };
    
})();

