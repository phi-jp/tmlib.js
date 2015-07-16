/*
 * button.js
 */

tm.ui = tm.ui || {};


;(function() {

    tm.define("tm.ui.BaseButton", {
        superClass: "tm.display.CanvasElement",

        init: function(param) {
            this.superInit();

            param = param || {};
            this.width = param.width || 64;
            this.height = param.height || 64;

            this.setInteractive(true);
            this.boundingType = "rect";

            this.on("pointingend", function() {
                this.flare('push');
            });
        },
    });

})();


;(function() {

    tm.define("tm.ui.SpriteButton", {
        superClass: "tm.ui.BaseButton",

        init: function(image) {
            this.superInit();

            this.sprite = tm.display.Sprite(image).addChildTo(this);

            this.width = this.sprite.width;
            this.height = this.sprite.height;
        },
    });

})();


;(function() {
    
    /**
     * @class tm.ui.LabelButton
     * LabelButton
     * @extends tm.display.Label
     */
    tm.ui.LabelButton = tm.createClass({
        superClass: tm.display.Label,

        /**
         * @constructor
         */
        init: function(text) {
            this.superInit(text);
            
            this.alpha = tm.ui.LabelButton.DEFAULT_ALPHA;
            this.setAlign("center").setBaseline("middle");
            
            this.setInteractive(true);
            this.boundingType = "rect";
            
            this.addEventListener("pointingover", function() {
                this.tweener.clear();
                this.tweener.fadeIn(250);
            }.bind(this));
            this.addEventListener("pointingout", function() {
                this.tweener.clear();
                this.tweener.fade(tm.ui.LabelButton.DEFAULT_ALPHA, 250);
            }.bind(this));
            
            /*
            var d = this.draw;
            this.draw = function(canvas) {
                d.call(this, canvas);
                this.drawBoundingRect(canvas);
            }
            /*
            */
        }
    });
    
    /**
     * @static
     * @property
     * デフォルトとなるアルファ値
     */
    tm.ui.LabelButton.DEFAULT_ALPHA = 0.5;
    
})();


(function() {
    
    /**
     * @class tm.ui.IconButton
     * IconButton
     * @extends tm.display.Sprite
     */
    tm.ui.IconButton = tm.createClass({
        superClass: tm.display.Sprite,
        
        /**
         * @constructor
         */
        init: function() {
            this.superInit.apply(this, arguments);
            
            this.setInteractive(true);
            this.boundingType = "rect";

            this.on("pointingend", function() {
                this.flare('push');
            });
        },
    });
    
    /**
     * @static
     * @property
     * デフォルトとなるアルファ値
     */
    tm.ui.IconButton.DEFAULT_ALPHA = 0.5;
    
})();


(function() {
    
    /**
     * @class tm.ui.GlossyButton
     * glossy button
     * @extends tm.display.Shape
     */
    tm.ui.GlossyButton = tm.createClass({
        superClass: tm.display.Shape,

        /**
         * @constructor
         */
        init: function(width, height, backgroundColor, text) {
            this.superInit(width, height);
            
            text  = text  || "Button";
            this.backgroundColor = backgroundColor || "black";
            this.alpha = tm.ui.GlossyButton.DEFAULT_ALPHA;
            
            this.setInteractive(true);
            this.boundingType = "rect";
            this.addEventListener("pointingover", function() {
                this.tweener.clear();
                this.tweener.fade(1.0, 250);
            });
            this.addEventListener("pointingout", function() {
                this.tweener.clear();
                this.tweener.fade(tm.ui.GlossyButton.DEFAULT_ALPHA, 250);
            });
            
            // ラベル
            this.label = tm.display.Label(text || "").addChildTo(this);
            this.label.setAlign("center").setBaseline("middle");
            
            this._refresh();
        },

        /**
         * 背景色をセット
         */
        setBackgroundColor: function(backgroundColor) {
            this.backgroundColor = backgroundColor;
            
            this._refresh();
            
            return this;
        },

        /**
         * リフレッシュ
         * @private
         */
        _refresh: function() {
            // ボタン描画
            var c = this.canvas;
            c.resize(this.width, this.height);
            c.fillStyle = this.backgroundColor;
            c.fillRoundRect(2, 2, this.width-4, this.height-4, 10);
            c.strokeStyle   = "rgba(100,100,100,0.75)";
            c.lineWidth     = 2;
            c.strokeRoundRect(2, 2, this.width-4, this.height-4, 10);
            
            // テカリ
            c.roundRect(2, 2, this.width-4, this.height-4, 10);
            c.clip();
            
            var grad = tm.graphics.LinearGradient(0, 0, 0, this.height);
            
            // grad.addColorStop(0.0, "hsl(  0, 75%, 50%)");
            // grad.addColorStop(0.5, "hsl(120, 75%, 50%)");
            // grad.addColorStop(1.0, "hsl(240, 75%, 50%)");
            grad.addColorStop(0.0, "rgba(255,255,255,0.9)");
            grad.addColorStop(0.5, "rgba(255,255,255,0.5)");
            grad.addColorStop(0.51, "rgba(255,255,255,0.2)");
            grad.addColorStop(1.0, "rgba(255,255,255,0.0)");
            c.setGradient(grad);
            c.fillRect(2, 2, this.width-4, this.height-4, 10);
            
            // ラベルのサイズをリセット
            this.label.setSize(this.width, this.height);
        },
    });

    /**
     * @static
     * @property
     * デフォルトとなるアルファ値
     */
    tm.ui.GlossyButton.DEFAULT_ALPHA = 0.5;
    
    
})();


(function() {

    /**
     * @class tm.ui.FlatButton
     * フラットデザインのボタン
     * @extends tm.display.Shape
     */
    tm.define("tm.ui.FlatButton", {
        superClass: "tm.ui.BaseButton",

        /**
         * @constructor
         */
        init: function(param) {
            param = (param || {}).$safe(tm.ui.FlatButton.defaults);

            this.superInit(param);

            this.shape = tm.display.RoundRectangleShape(param).addChildTo(this);

            this.label = tm.display.Label(param.text).addChildTo(this);
            this.label.setFontSize(param.fontSize).setFontFamily(param.fontFamily).setAlign("center").setBaseline("middle");
        },
    });

    tm.ui.FlatButton.defaults = {
        width: 300,
        height: 100,
        fillStyle: "hsl(180, 60%, 50%)",
        strokeStyle: "transparent",
        text: "START",
        fontSize: 50,
        cornerRadius: 8,
        fontFamily: "'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif",
    };

})();



