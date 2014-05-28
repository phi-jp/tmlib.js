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
         * @constructor
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
        title: "Time is money",
        titleSize: 32,
        width: 465,
        height: 465,
    };
    
    /**
     * @class tm.app.TitleScene
     * タイトルシーン
     * @extends tm.app.Scene
     */
    tm.app.TitleScene = tm.createClass({
        superClass: tm.app.Scene,
        
        /**
         * @constructor
         * @param {Object} param
         */
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);

            if (param.backgroundImage) {
                var texture = tm.asset.Manager.get(param.backgroundImage);
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
         * pointingstartイベント登録
         */
        onpointingstart: function() {
            var e = tm.event.Event("nextscene");
            this.dispatchEvent(e);
        },
    });
    
    
})();

