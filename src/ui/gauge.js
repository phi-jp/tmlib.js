/*
 *  gauge.js
 */



(function() {

    /**
     * @class tm.ui.Gauge
     * ゲーム用ゲージクラス
     * @extends tm.display.CanvasElement
     */
    tm.ui.Gauge = tm.createClass({
        superClass: tm.display.CanvasElement,
        
        
        /**
         * アニメーションさせるかどうかのフラグ
         */
        animationFlag: true,
        /**
         * 0~100 に変化する際にかかる時間
         * つまり10*1000 だった場合は, 0~10に変化するさいに　1秒かかる
         */
        animationTime: 10*1000, // 10 秒

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
         * 満タンかをチェック
         */
        isFull: function() {
            return this._value === this._maxValue;
        },

        /**
         * 空っぽかをチェック
         */
        isEmpty: function() {
            return this._value == 0;
        },

        /**
         * @private
         */
        _reset: function(direction) {
            this.originX = 0;
            this._value = 100;
            this._value = this._maxValue = 100;
        },

        /**
         * 値をセット
         */
        setValue: function(value) {
            value= Math.clamp(value, 0, this._maxValue);

            this._realValue = value;
            
            // end when now value equal value of argument
            if (this._value === value) return ;
            
            // fire value change event
            this.fire(tm.event.Event("change"));
            
            if (this.isAnimation()) {
                this.tweener.clear();

                var time = (Math.abs(this._value-value)/100)*this.animationTime;
                this.tweener.clear()
                    .to({ "_value":value }, time)
                    .call(function() {
                        this.fire(tm.event.Event("changed"));

                        if (this.isEmpty()) {
                            this.fire(tm.event.Event("empty"));
                        }
                        else if (this.isFull()) {
                            this.fire(tm.event.Event("full"));
                        }
                    }.bind(this));
            }
            else {
                this._value = value;
                this.fire(tm.event.Event("changed"));
                
                if (this.isEmpty()) {
                    this.fire(tm.event.Event("empty"));
                }
                else if (this.isFull()) {
                    this.fire(tm.event.Event("full"));
                }
            }
            
            return this;
        },

        /**
         * 値をゲット
         */
        getValue: function() {
            return this.value;
        },

        /**
         * 値を％でセット
         */
        setPercent: function(percent) {
            return this.setValue(this._maxValue*percent*0.01);
        },

        /**
         * 値を％でゲット
         */
        getPercent: function() {
            return (this._value/this._maxValue)*100;
        },

        /**
         * 値を比率でセット
         */
        setRatio: function(ratio) {
            return this.setValue(this._maxValue*percent);
        },

        /**
         * 値を比率でゲット
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
    
    /**
     * @class tm.ui.FlatGauge
     * ゲーム用ゲージクラス
     * @extends tm.ui.Gauge
     */
    tm.define("tm.ui.FlatGauge", {
        superClass: "tm.ui.Gauge",
        
        /**
         * @constructor
         */
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
    
    /**
     * @class tm.ui.GlossyGauge
     * ゲーム用ゲージクラス
     * @extends tm.ui.Gauge
     */
    tm.define("tm.ui.GlossyGauge", {
        superClass: "tm.ui.Gauge",
        
        init: function(param) {
            param = param || {};
            param.borderWidth = param.borderWidth || 2;
            this.superInit(param);
        },
        
        /**
         * @constructor
         */
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


