/*
 *  gauge.js
 */



(function() {

    /**
     * @class tm.ui.Gauge
     * ゲーム用ゲージクラス
     * @extends tm.display.RectangleShape
     */
    tm.ui.Gauge = tm.createClass({
        superClass: tm.display.CanvasElement,
        
        animationFlag: true,

        /**
         * @constructor
         */
        init: function(param) {
            this.superInit();
            
            param = param || {};
            param.$safe({
                width: 300,
                height: 25,
                color: "hsl(220, 100%, 50%)",
                bgColor: "#444",
                borderColor: "white",
                borderWidth: 4,
            });
            
            this.$extend(param);
            
            this._reset();
        },

        /**
         * @TODO ?
         */
        isFull: function() {
            return this.targetProp === this._maxValue;
        },

        /**
         * @TODO ?
         */
        isEmpty: function() {
            return this.targetProp == 0;
        },

        /**
         * @TODO ?
         * @private
         */
        _reset: function(direction) {
            this.originX = 0;
            this._value = 100;
            this._value = this._maxValue = 100;
        },

        /**
         * @TODO ?
         */
        setValue: function(value) {
            value= Math.clamp(value, 0, this._maxValue);

            this._realValue = value;
            
            if (this._value === value) return ;
            
            if (this.isAnimation()) {
                this.tweener.clear();
                this.tweener.to({
                        "_value":value
                    },
                    Math.abs(this._value-value)*10
                );
            }
            else {
                this._value = value;
            }
            
            return this;
        },

        /**
         * @TODO ?
         */
        getValue: function() {
            return this.value;
        },

        /**
         * @TODO ?
         */
        setPercent: function(percent) {
            this.setValue(this._maxValue*percent*0.01);
        },

        /**
         * @TODO ?
         */
        getPercent: function() {
            return (this._value/this._maxValue)*100;
        },

        /**
         * @TODO ?
         */
        setRatio: function(ratio) {
            this.setValue(this._maxValue*percent);
        },

        /**
         * @TODO ?
         */
        getRatio: function() {
            return this._value/this._maxValue;
        },
        
        isAnimation: function() {
            return this.animationFlag;
        },
        
        draw: function(canvas) {
            canvas.save();
            
            // bg
            canvas.fillStyle = this.bgColor;
            canvas.fillRect(0, 0, this.width, this.height);
            
            // bar
            canvas.fillStyle = this.color;
            canvas.fillRect(0, 0, this.width*this.getRatio(), this.height);
            
            // border
            canvas.strokeStyle = this.borderColor;
            canvas.lineWidth = this.borderWidth;
            canvas.strokeRect(0, 0, this.width, this.height);
            
            canvas.restore();
        }
    });
    
    /**
     * @property    value
     * 値
     */
    tm.ui.Gauge.prototype.accessor("value", {
        get: function() {
            return this._value;
        },
        set: function(v) {
            this.setValue(v);
        },
    });

    /**
     * @property    percent
     * パーセント
     */
    tm.ui.Gauge.prototype.accessor("percent", {
        get: function() {
            return this.getPercent();
        },
        set: function(v) {
            this.setPercent(v);
        },
    });
    
    
    /**
     * @property    ratio
     * 比率
     */
    tm.ui.Gauge.prototype.accessor("ratio", {
        get: function() {
            return this.getRatio();
        },
        set: function(v) {
            this.setRatio(v);
        },
    });
    
})();


;(function() {
    
    tm.define("tm.ui.FlatGauge", {
        superClass: "tm.ui.Gauge",
        
        init: function(param) {
            this.superInit(param);
        },
        
        draw: function(canvas) {
            canvas.save();
            
            canvas.save();
            
            canvas.roundRect(0, 0, this.width, this.height, this.height/2);
            canvas.clip();
            
            // bg
            canvas.fillStyle = this.bgColor;
            canvas.fillRect(0, 0, this.width, this.height);
            
            // bar
            canvas.fillStyle = this.color;
            canvas.fillRect(0, 0, this.width*this.getRatio(), this.height);
            
            canvas.restore();
            
            // border
            canvas.strokeStyle = this.borderColor;
            canvas.lineWidth = this.borderWidth;
            canvas.strokeRoundRect(0, 0, this.width, this.height, this.height/2);
            
            canvas.restore();
        },
    });
    
})();



;(function() {
    
    tm.define("tm.ui.GlossyGauge", {
        superClass: "tm.ui.Gauge",
        
        init: function(param) {
            param = param || {};
            param.borderWidth = param.borderWidth || 2;
            this.superInit(param);
        },
        
        draw: function(c) {
            c.save();
            
            // clip
            c.roundRect(0, 0, this.width, this.height, this.height/2);
            c.clip();
            
            // bg
            c.fillStyle = this.bgColor;
            c.fillRect(0, 0, this.width, this.height);
            
            // bar
            c.fillStyle = this.color;
            c.fillRect(0, 0, this.width*this.getRatio(), this.height);
            var grad = tm.graphics.LinearGradient(0, 0, 0, this.height);
            grad.addColorStop(0.0,  "rgba(255,255,255,0.9)");
            grad.addColorStop(0.5,  "rgba(255,255,255,0.5)");
            grad.addColorStop(0.51, "rgba(255,255,255,0.2)");
            grad.addColorStop(1.0,  "rgba(255,255,255,0.0)");
            c.setGradient(grad);
            c.fillRect(0, 0, this.width*this.getRatio(), this.height);
            
            c.restore();
            
            // border
            c.lineWidth = this.borderWidth;
            c.strokeStyle = this.borderColor;
            c.strokeRoundRect(0, 0, this.width, this.height, this.height/2);
        },
    });
    
})();


