/*
 * twitter.js
 */

tm.social = tm.social || {};


(function() {
    
    /**
     * @class tm.social.Twitter
     * ツイッター関連ネームスペース
     */
    tm.social.Twitter = tm.social.Twitter || {};
    
    tm.social.Twitter.API_URL = "http://api.twitter.com/1";    // version 1 は廃止予定らしい
    var BASE_URL = "http://twitter.com/intent";


    /**
     * @member      tm.social.Twitter
     * Tweet する
     * @param {Object} prop
     * ### Reference
     * - <https://dev.twitter.com/docs/intents>
     * ### Example
     *      tm.social.Twitter.createURL({
     *          type        : "tweet",              // タイプ(tweet/retweet/favorite/user)
     *          tweet_id    : "210219483959263232", // 対象となる Tweet
     *          in_reply_to : "210219483959263232", // 返信する対象となる Tweet
     *          text        : "Test",               // テキスト
     *          screen_name : "phi_jp",             // スクリーンネーム
     *          hashtags    : "javascript,tmlibjs", // ハッシュタグ
     *          url         : "http://tmlife.net",  // url
     *          via         : "phi_jp",             // ～から
     *          related     : "tmlib.js tmlife",    // 関連ワード
     *      });
     */
    tm.social.Twitter.createURL = function(prop) {
        var param_string_list = [];
        for (var key in prop) {
            if (key == "type") continue;
            var value = encodeURIComponent(prop[key]);
            var param_string = key+"="+value;
            param_string_list.push(param_string);
        }
        
        var url = "{baseURL}/{type}?{param}".format({
            baseURL : BASE_URL,
            type    : prop.type,
            param   : param_string_list.join('&'),
        });
        
        return url;
    };
    
    
})();

(function() {
    
    var BASE_URL = "http://api.twitter.com/1/{type}/{kind}.json";

    /**
     * @member      tm.social.Twitter
     */
    tm.social.Twitter.api = function(type, kind, param, callback) {
        var url = BASE_URL.format({ type:type, kind:kind });
        var qs  = tm.util.QueryString.stringify(param);
        
        tm.util.Ajax.loadJSONP(url + "?" + qs, callback);
    };
    
})();



(function() {
    
    var BASE_URL = "http://search.twitter.com/search.json";

    /**
     * @member      tm.social.Twitter
     */
    tm.social.Twitter.search = function(param, callback) {
        var url = BASE_URL;
        var qs  = tm.util.QueryString.stringify(param);
        
        tm.util.Ajax.loadJSONP(url + "?" + qs, callback);
    };
    
})();


(function() {
    
    /*
     * format = xml or json
     */
    var BASE_URL = "http://api.twitter.com/1/statuses/followers.json";
    //http://api.twitter.com/1/statuses/followers.json?id=tmlife_jp
    
    /**
     * @member      tm.social.Twitter
     * 
     * user_id      ユーザーID
     * screen_name  screen_name
     * cursor       -1 を指定すると先頭から 100
     * include_entities     true を指定すると entities を取得できる
     * 
     */
    tm.social.Twitter.getFollowers = function(param, callback) {
        tm.social.Twitter.api("statuses", "followers", param, callback);
        
        /*
        tm.social.Twitter.api("statuses", "public_timeline", param, callback);
        tm.social.Twitter.api("statuses", "home_timeline", param, callback);
        tm.social.Twitter.api("statuses", "friends_timeline", param, callback);
        tm.social.Twitter.api("statuses", "user_timeline", param, callback);
        tm.social.Twitter.api("statuses", "replies", param, callback);
        tm.social.Twitter.api("statuses", "mentions", param, callback);
        */
    };
    
})();




































