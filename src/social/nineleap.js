/*
 * nineleap.js
 */

tm.social = tm.social || {};


(function() {

    /**
     * @class tm.social.NineLeap
     * 9leap ネームスペース
     */
    tm.social.Nineleap = tm.social.Nineleap || {};

    var BASE_URL = "http://9leap.net/games/{id}/result?score={score}&result={result}";

    /**
     * @member      tm.social.Nineleap
     */
    tm.social.Nineleap.DEBUG_GAME_ID = "0";

    /**
     * @member      tm.social.Nineleap
     * @method      createURL
     * 9leap 用の URL を生成
     */
    tm.social.Nineleap.createURL = function(id, score, result) {
        return BASE_URL.format({
            id      : id,
            score   : score,
            result  : result
        });
    };

    /**
     * @member      tm.social.Nineleap
     * @method      postRanking
     * 9leap でランキングを POST
     */
    tm.social.Nineleap.postRanking = function(score, result) {
        if (location.hostname == 'r.jsgames.jp') {
            var id = location.pathname.match(/^\/games\/(\d+)/)[1];
            location.replace( this.createURL(id, score, result) );
        }
        else {
            console.warn("9leap に投稿されていません!");
        }
    };

    /**
     * @member      tm.social.Nineleap
     * @method      gotoLogin
     * 9leapログインページヘ遷移する.
     */
    tm.social.Nineleap.gotoLogin = function() {
        window.location.replace("http://9leap.net/api/login");
    };

    /**
     * @member      tm.social.Nineleap
     * @method      isOn9leap
     * アプリケーションが9leap上にデプロイされているか
     */
    tm.social.Nineleap.isOn9leap = function() {
        return window.location.hostname === "r.jsgames.jp";
    };

    /**
     * @member      tm.social.Nineleap
     * @method      getGameId
     * 9leapのゲームIDを取得する
     */
    tm.social.Nineleap.getGameId = function() {
        if (tm.social.Nineleap.isOn9leap()) {
            return window.location.pathname.match(/^\/games\/(\d+)/)[1];
        } else {
            return tm.social.Nineleap.DEBUG_GAME_ID;
        }
    };

    /**
     * @member      tm.social.Nineleap
     * @method      getMyData
     * プレイヤーのゲームデータを取得する
     */
    tm.social.Nineleap.getMyData = function(callback) {
        tm.util.Ajax.loadJSONP(tm.social.Nineleap.createMyDataURL(), callback);
    };

    /**
     * @member      tm.social.Nineleap
     * @method      postMyData
     * プレイヤーのゲームデータを保存する
     */
    tm.social.Nineleap.postMyData = function(data, callback) {
        tm.util.Ajax.load({
            type: "POST",
            url: tm.social.Nineleap.createMemoryURL("user_memory.json"),
            dataType: "json",
            data: "json=" + JSON.stringify(data),
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            async: false,
            beforeSend: function(xhr) {
                xhr.withCredentials = true;
            },
            success: callback,
            error: function(responseText) {
                console.error(responseText);
            }
        });
    };

    /**
     * @member      tm.social.Nineleap
     * @method      createMemoryURL
     * 9leap Memory API へアクセスするURLを生成
     */
    tm.social.Nineleap.createMemoryURL = function() {
        var url = [
            "http://9leap.net/api/memory/",
            tm.social.Nineleap.getGameId() + "/",
        ];
        for (var i = 0, len = arguments.length; i < len; i++) {
            url.push(arguments[i]);
        }

        return url.join("");
    };
    /**
     * @member      tm.social.Nineleap
     * @method      createMyDataURL
     * ユーザデータURLを生成
     */
    tm.social.Nineleap.createMyDataURL = function() {
        return tm.social.Nineleap.createMemoryURL("user_memory.json");
    };
    /**
     * @member      tm.social.Nineleap
     * @method      createUserDataURL
     * 他のユーザのプレイデータURLを生成
     */
    tm.social.Nineleap.createUserDataURL = function(screenName) {
        return tm.social.Nineleap.createMemoryURL("u/", screenName + ".json");
    };
    /**
     * @member      tm.social.Nineleap
     * @method      createRecentDataURL
     * 最近プレイしたユーザのプレイデータURLを生成
     */
    tm.social.Nineleap.createRecentDataURL = function(max) {
        max = max || 30;
        return tm.social.Nineleap.createMemoryURL("recent_memories.json", "?max=" + max);
    };
    /**
     * @member      tm.social.Nineleap
     * @method      createFriendDataURL
     * TwitterでフォローしているユーザのプレイデータURLを生成
     */
    tm.social.Nineleap.createFriendDataURL = function(max) {
        max = max || 30;
        return tm.social.Nineleap.createMemoryURL("friends_memories.json", "?max=" + max);
    };
    /**
     * @member      tm.social.Nineleap
     * @method      createRankingDataURL
     * スコアランキング上位のユーザのプレイデータURLを生成
     */
    tm.social.Nineleap.createRankingDataURL = function(max) {
        max = max || 30;
        return tm.social.Nineleap.createMemoryURL("ranking_memories.json", "?max=" + max);
    };
})();

