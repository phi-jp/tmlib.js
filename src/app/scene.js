/*
 * scene.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class tm.app.Scene
     * シーンとして使用するゲームエレメントクラス
     * @extends tm.app.Object2D
     */
    tm.app.Scene = tm.createClass({
        superClass: tm.app.Object2D,
    
        /**
         * @property
         * @TODO ?
         * @private
         */
        _sceneResultCallback: null,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.superInit();
            
            this.boundingType = "none";
            
            // タッチに反応させる
            this.setInteractive(true);
        },

    });
    
})();

(function() {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
    };
    
    /**
     * @class tm.app.LoadingScene
     * ローディングシーン
     * @extends tm.app.Scene
     */
    tm.app.LoadingScene = tm.createClass({
        superClass: tm.app.Scene,
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} param
         */
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            var label = tm.display.Label("Loading");
            label.x = param.width/2;
            label.y = param.height/2;
            label.width = param.width;
            label.align     = "center";
            label.baseline  = "middle";
            label.fontSize = 32;
            label.counter = 0;
            label.update = function(app) {
                if (app.frame % 30 == 0) {
                    this.text += ".";
                    this.counter += 1;
                    if (this.counter > 3) {
                        this.counter = 0;
                        this.text = "Loading";
                    }
                }
            };
            this.addChild(label);

            // ひよこさん
            var piyo = tm.display.Shape(84, 84);
            piyo.setPosition(param.width, param.height - 80);
            piyo.canvas.setColorStyle("white", "yellow").fillCircle(42, 42, 32);
            piyo.canvas.setColorStyle("white", "black").fillCircle(27, 27, 2);
            piyo.canvas.setColorStyle("white", "brown").fillRect(40, 70, 4, 15).fillTriangle(0, 40, 11, 35, 11, 45);
            piyo.update = function(app) {
                piyo.x -= 4;
                if (piyo.x < -80) piyo.x = param.width;
                piyo.rotation -= 7;
            };

            this.addChild(piyo);

            this.alpha = 0.0;
            this.tweener.clear().fadeIn(100).call(function() {
                if (param.assets) {
                    tm.asset.AssetManager.onload = function() {
                        this.tweener.clear().fadeOut(200).call(function() {
                            this.app.replaceScene(param.nextScene());
                        }.bind(this));
                    }.bind(this);
                    tm.asset.AssetManager.load(param.assets);
                }
            }.bind(this));
        },
    });
    
    
})();
    
(function() {
    
    var DEFAULT_PARAM = {
        title: "Time is money",
        titleSize: 32,
        width: 465,
        height: 465,
    };
    
    /**
     * @class tm.app.TitleScene
     * ローディングシーン
     * @extends tm.app.Scene
     */
    tm.app.TitleScene = tm.createClass({
        superClass: tm.app.Scene,
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} param
         */
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);

            if (param.backgroundImage) {
                var texture = tm.asset.AssetManager.get(param.backgroundImage);
                this._backgroundImage = tm.display.Sprite(texture, param.width, param.height);
                this._backgroundImage.originX = this._backgroundImage.originY = 0;
                this.addChild(this._backgroundImage);
            }
            
            var label = tm.display.Label(param.title);
            label.x = param.width/2;
            label.y = param.height/2;
            label.width = param.width;
            label.align     = "center";
            label.baseline  = "middle";
            label.fontSize = param.titleSize;
            this.addChild(label);
        },

        /**
         * @property
         * pointingstartイベント登録
         */
        onpointingstart: function() {
            var e = tm.event.Event("nextscene");
            this.dispatchEvent(e);
        },
    });
    
    
})();

(function() {
    
    
    var DEFAULT_PARAM = {
        score: 256,
        msg: "tmlib.js のサンプルです!",
        hashtags: "tmlibjs",
        url: "https://github.com/phi1618/tmlib.js/",
        width: 465,
        height: 465,
        related: "tmlib.js tmlife javascript",
    };
    
    /**
     * @class tm.app.ResultScene
     * ローディングシーン
     * @extends tm.app.Scene
     */
    tm.app.ResultScene = tm.createClass({
        superClass: tm.app.Scene,
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} param
         */
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            var text = "SCORE: {score}, {msg}".format(param);
            var twitterURL = this.tweetURL = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : text,
                hashtags: param.hashtags,
                url     : param.url, // or window.document.location.href
            });

            if (param.backgroundImage) {
                var texture = tm.asset.AssetManager.get(param.backgroundImage);
                this._backgroundImage = tm.display.Sprite(texture, param.width, param.height);
                this._backgroundImage.originX = this._backgroundImage.originY = 0;
                this.addChild(this._backgroundImage);
            }
            
            var scoreLabel = tm.display.Label("SCORE: {score}".format(param));
            scoreLabel.x = param.width/2;
            scoreLabel.y = param.height/2-70;
            scoreLabel.width = param.width;
            scoreLabel.align     = "center";
            scoreLabel.baseline  = "middle";
            scoreLabel.fontSize = 32;
            this.addChild(scoreLabel);
            
            var msgLabel = tm.display.Label(param.msg);
            msgLabel.x = param.width/2;
            msgLabel.y = param.height/2-20;
            msgLabel.width = param.width;
            msgLabel.align     = "center";
            msgLabel.baseline  = "middle";
            msgLabel.fontSize = 16;
            this.addChild(msgLabel);
            
            // ツイートボタン
            var tweetButton = this.tweetButton = tm.ui.GlossyButton(120, 50, "blue", "Tweet").addChildTo(this);
            tweetButton.setPosition(param.width/2 - 65, param.height/2 + 50);
            tweetButton.onclick = function() {
                window.open(twitterURL);
            };
            
            // 戻るボタン
            var backButton = tm.ui.GlossyButton(120, 50, "black", "Back").addChildTo(this);
            backButton.setPosition(param.width/2 + 65, param.height/2 + 50);
            backButton.onpointingstart = function() {
                var e = tm.event.Event("nextscene");
                this.dispatchEvent(e);
            }.bind(this);


        },
    });
    
})();
