/*
 * userinterface.js
 */


tm.app = tm.app || {};


(function() {

	/**
	 * @class
	 * Gauge
	 */
	tm.app.Gauge = tm.createClass({
        superClass: tm.app.RectangleShape,

        init: function(width, height, color, direction) {
            this.superInit(width, height, {
                fillStyle: color || "red",
                strokeStyle: "rgba(255, 255, 255, 0)"
            });

            this._reset(direction);
        },

        isFull: function() {
            return this.targetProp === this._maxValue;
        },

        isEmpty: function() {
            return this.targetProp == 0;
        },

        _reset: function(direction) {
            this.direction = direction || "left";
            switch (this.direction) {
                case "left":
                    this.originX = 0;
                    this._targetPropName = "width";
                    this._value     = this.width;
                    this._value = this._maxValue = this.width;
                    break;
                case "right":
                    this.originX = 1;
                    this._targetPropName = "width";
                    this._value = this._maxValue = this.width;
                    break;
                case "up":
                    this.originY = 1;
                    this._targetPropName = "height";
                    this._value     = this.height;
                    this._value = this._maxValue = this.height;
                    break;
                case "down":
                    this.originY = 0;
                    this._targetPropName = "height";
                    this._value     = this.height;
                    this._value = this._maxValue = this.height;
                    break;
            }
        },

        setValue: function(value, anim) {
        	value= Math.clamp(value, 0, this._maxValue);
            anim = (anim !== undefined) ? anim : true;

            this._value = value;
            this._targetValue = (value/this._maxValue)*this._maxValue;

            if (this._targetValue == this.targetProp) return ;

            this.animation.clear();
            if (anim) {
                this.animation.addTween({
                    prop: this._targetPropName,
                    begin: this.targetProp,
                    finish: this._targetValue,
                    duration: Math.abs(this._targetValue-this.targetProp)*10,
                });
            }
            else {
                this.targetProp = this._targetValue;
            }

            return this;
        },
        getValue: function() {
            return this.value;
        },

        setPercent: function(percent, anim) {
            this.setValue(this._maxValue*percent*0.01, anim);
        },
        getPercent: function() {
            return (this._value/this._maxValue)*100;
        },

        setRatio: function(ratio) {
            this.setValue(this._maxValue*percent, anim);
        },
        getRatio: function() {
            return this._value/this._maxValue;
        },
    });
    
    /**
     * @property    value
     */
    tm.app.Gauge.prototype.accessor("value", {
        get: function() {
            return this._value;
        },
        set: function(v) {
            this.setValue(v);
        },
    });

    /**
     * @property    percent
     */
    tm.app.Gauge.prototype.accessor("percent", {
        get: function() {
            return this.getPercent();
        },
        set: function(v) {
            this.setPercent(v);
        },
    });
    
    
    /**
     * @property    ratio
     */
    tm.app.Gauge.prototype.accessor("ratio", {
        get: function() {
            return this.getRatio();
        },
        set: function(v) {
            this.setRatio(v);
        },
    });
    
    /**
     * @property    targetProp
     */
    tm.app.Gauge.prototype.accessor("targetProp", {
        get: function() {
            return this[this._targetPropName];
        },
        set: function(v) {
            this[this._targetPropName] = v;
        },
    });
    
})();


