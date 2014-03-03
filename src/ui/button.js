/*
 * button.js
 */

tm.ui = tm.ui || {};


(function() {
    
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
        init: function(texture) {
            if (texture) {
                this.superInit(texture, texture.width, texture.height);
            }
            else {
                this.superInit();
            }
            
            this.alpha = tm.ui.IconButton.DEFAULT_ALPHA;
            
            this.setInteractive(true);
            this.boundingType = "rect";
            this.addEventListener("pointingover", function() {
                this.tweener.clear();
                this.tweener.fade(1, 250);
            });
            this.addEventListener("pointingout", function() {
                this.tweener.clear();
                this.tweener.fade(tm.ui.LabelButton.DEFAULT_ALPHA, 250);
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
        superClass: tm.display.Shape,

        /**
         * @constructor
         */
        init: function(param) {
            param.$safe({
                width: 300,
                height: 100,
                bgColor: "rgb(180, 180, 180)",
                text: "ABC",
                fontSize: 50,
                fontFamily: "'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif",
            });

            this.superInit(param.width, param.height);

            this.canvas.clearColor(param.bgColor);

            this.setInteractive(true);
            this.setBoundingType("rect");

            this.label = tm.display.Label(param.text).addChildTo(this);
            this.label.setFontSize(param.fontSize).setFontFamily(param.fontFamily).setAlign("center").setBaseline("middle");
        },
    });



})();



