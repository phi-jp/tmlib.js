/*
 * scene.js
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * シーンとして使用するゲームエレメントクラス
     */
    tm.app.Scene = tm.createClass({
        
        superClass: tm.app.CanvasElement,
        
        /**
         * 初期化
         */
        init: function() {
            this.superInit();
            
            // タッチに反応させる
            this.interaction.enabled = true;
            this.interaction.boundingType = "none";
        },
    });
    
})();
    
(function() {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
    };
    
    tm.app.LoadingScene = tm.createClass({
        superClass: tm.app.Scene,
        
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            var label = tm.app.Label("Loading");
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
            var piyo = tm.app.Shape(84, 84);
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
    
    tm.app.TitleScene = tm.createClass({
        superClass: tm.app.Scene,
        
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);

            if (param.backgroundImage) {
                this._backgroundImage = tm.app.Sprite(param.width, param.height, param.backgroundImage);
                this._backgroundImage.originX = this._backgroundImage.originY = 0;
                this.addChild(this._backgroundImage);
            }
            
            var label = tm.app.Label(param.title);
            label.x = param.width/2;
            label.y = param.height/2;
            label.width = param.width;
            label.align     = "center";
            label.baseline  = "middle";
            label.fontSize = param.titleSize;
            this.addChild(label);
        },
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
    
    tm.app.ResultScene = tm.createClass({
        
        superClass: tm.app.Scene,
        
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            var text = "SCORE: {score}, {msg}".format(param);
            var twitterURL = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : text,
                hashtags: param.hashtags,
                url     : param.url, // or window.document.location.href
            });

            if (param.backgroundImage) {
                this._backgroundImage = tm.app.Sprite(param.width, param.height, param.backgroundImage);
                this._backgroundImage.originX = this._backgroundImage.originY = 0;
                this.addChild(this._backgroundImage);
            }
            
            var scoreLabel = tm.app.Label("SCORE: {score}".format(param));
            scoreLabel.x = param.width/2;
            scoreLabel.y = param.height/2-70;
            scoreLabel.width = param.width;
            scoreLabel.align     = "center";
            scoreLabel.baseline  = "middle";
            scoreLabel.fontSize = 32;
            this.addChild(scoreLabel);
            
            var msgLabel = tm.app.Label(param.msg);
            msgLabel.x = param.width/2;
            msgLabel.y = param.height/2-20;
            msgLabel.width = param.width;
            msgLabel.align     = "center";
            msgLabel.baseline  = "middle";
            msgLabel.fontSize = 16;
            this.addChild(msgLabel);
            
            // ツイートボタン
            var tweetButton = tm.app.GlossyButton(120, 50, "blue", "Tweet").addChildTo(this);
            tweetButton.setPosition(param.width/2 - 65, param.height/2 + 50);
            tweetButton.onpointingstart = function() { window.open(twitterURL, "_self"); };
            
            // 戻るボタン
            var backButton = tm.app.GlossyButton(120, 50, "black", "Back").addChildTo(this);
            backButton.setPosition(param.width/2 + 65, param.height/2 + 50);
            backButton.onpointingstart = function() {
                var e = tm.event.Event("nextscene");
                this.dispatchEvent(e);
            }.bind(this);
        },
        
        /*
        onpointingstart: function() {
            var e = tm.event.Event("nextscene");
            this.dispatchEvent(e);
        },
        */
    });
    
})();
