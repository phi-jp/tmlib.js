/*
 * button.js
 */


tm.app = tm.app || {};




(function() {
    
    /**
     * @class
     * LabelButton
     */
    tm.app.LabelButton = tm.createClass({
        superClass: tm.app.Label,
        
        init: function(text) {
            this.superInit(text);
            
            this.alpha = tm.app.LabelButton.DEFAULT_ALPHA;
            this.setAlign("center").setBaseline("middle");
            
            
            this.interaction.enabled = true;
            this.interaction.boundingType = "rect";
            
            this.addEventListener("pointingover", function() {
                this.animation.fade(1.0, 250);
            });
            this.addEventListener("pointingout", function() {
                this.animation.fade(tm.app.LabelButton.DEFAULT_ALPHA, 250);
            });
            
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
    
    tm.app.LabelButton.DEFAULT_ALPHA = 0.5;
    
})();


(function() {
    
    /**
     * @class
     * IconButton
     */
    tm.app.IconButton = tm.createClass({
        
        superClass: tm.app.Sprite,
        
        /**
         * 初期化
         */
        init: function(texture)
        {
            if (texture) {
                this.superInit(texture.width, texture.height, texture);
            }
            else {
                this.superInit();
            }
            
            this.alpha = tm.app.IconButton.DEFAULT_ALPHA;
            
            
            this.interaction.enabled = true;
            this.interaction.boundingType = "rect";
            this.addEventListener("pointingover", function() {
                this.animation.fade(1.0, 250);
            });
            this.addEventListener("pointingout", function() {
                this.animation.fade(tm.app.IconButton.DEFAULT_ALPHA, 250);
            });
        },
    });
    
    tm.app.IconButton.DEFAULT_ALPHA = 0.5;
    
})();


(function() {
    
    /**
     * @class
     * iPhone button
     */
    tm.app.iPhoneButton = tm.createClass({
        superClass: tm.app.Sprite,
        
        init: function(width, height, color, text) {
            this.superInit(width, height);
            
            
            
            this.alpha = tm.app.iPhoneButton.DEFAULT_ALPHA;
            
            this.interaction.enabled = true;
            this.interaction.boundingType = "rect";
            this.addEventListener("pointingover", function() {
                this.animation.fade(1.0, 250);
            });
            this.addEventListener("pointingout", function() {
                this.animation.fade(tm.app.iPhoneButton.DEFAULT_ALPHA, 250);
            });
            
            // ボタン描画
            var c = this.canvas;
            c.fillStyle = color;
            c.fillRoundRect(2, 2, width-4, height-4, 10);
            c.strokeStyle   = "rgba(100,100,100,0.75)";
            c.lineWidth     = 2;
            c.strokeRoundRect(2, 2, width-4, height-4, 10);
            
            // テカリ
            c.roundRect(2, 2, width-4, height-4, 10);
            c.clip();
            
            var grad = tm.graphics.LinearGradient(0, 0, 0, 50);
            
            // grad.addColorStop(0.0, "hsl(  0, 75%, 50%)");
            // grad.addColorStop(0.5, "hsl(120, 75%, 50%)");
            // grad.addColorStop(1.0, "hsl(240, 75%, 50%)");
            grad.addColorStop(0.0, "rgba(255,255,255,0.9)");
            grad.addColorStop(0.5, "rgba(255,255,255,0.5)");
            grad.addColorStop(0.51, "rgba(255,255,255,0.2)");
            grad.addColorStop(1.0, "rgba(255,255,255,0.0)");
            c.setGradient(grad);
            c.fillRect(2, 2, width-4, height-4, 10);
            
            
            // ラベル
            this.label = tm.app.Label(text || "").addChildTo(this);
            this.label.setAlign("center").setBaseline("middle");
            this.label.setSize(width, height);
        }
    });
    
    
    tm.app.iPhoneButton.DEFAULT_ALPHA = 0.5;
    
})();

