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
        superClass: tm.display.RectangleShape,

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

            this.tweener.clear();
            if (anim) {
                var props = {};
                props[this._targetPropName] = this._targetValue;
                this.tweener.to(props, Math.abs(this._targetValue-this.targetProp)*10);
                /*
                this.animation.addTween({
                    prop: this._targetPropName,
                    begin: this.targetProp,
                    finish: this._targetValue,
                    duration: Math.abs(this._targetValue-this.targetProp)*10,
                });
*/
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
     * 値
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
     * パーセント
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
     * 比率
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
     * ターゲット
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



(function() {
    
    /**
     * @class
     * pad
     */
    tm.app.Pad = tm.createClass({
        superClass: tm.display.Shape,
        
        isTouching: false,
        circle: null,
        
        init: function() {
            this.superInit(120, 120);
            
            var c = this.canvas;
            c.fillStyle = "#fff";
            c.fillCircle(60, 60, 60);
            c.fillStyle = "#eee";
            
            this._createCircle();
            
            this.setInteractive(true);
            
            this.alpha = 0.75;
        },
        
        _createCircle: function() {
            var circle = this.circle = tm.display.Shape(80, 80);
            this.addChild(circle);
            
            var c = circle.canvas;
            c.fillStyle = "#222";
            c.setShadow("black", 2, 2, 2);
            c.fillCircle(40, 40, 35);
        },
        
        onpointingstart: function() {
            this.isTouching = true;
        },
        
        onpointingend: function() {
            this.isTouching = false;
            this.circle.position.set(0, 0);
        },
        
        onpointingmove: function(e) {
            if (this.isTouching==false) return ;
            var p = e.pointing;
            var v = tm.geom.Vector2(p.x - this.x, p.y - this.y);
            var len = v.length();
            v.div(len);
            if (len > 40) len = 40;
            
            this.angle = Math.radToDeg(v.toAngle());
            this.circle.position.set(v.x*len, v.y*len);
            
            // 大きさ
            this.distance  = len/40.0;
            // 向きベクトル
            this.direction = v.mul(this.distance);
        }
        
        
    });
    
})();



