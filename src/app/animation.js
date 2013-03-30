/*
 * anim.js
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * アニメーションクラス
     */
    tm.app.Animation = tm.createClass({
        
        superClass: tm.event.EventDispatcher,

        isAnimation: false,
        
        /**
         * 初期化
         */
        init: function(elm) {
            this.superInit();

            this.tweens     = [];
            this.setTarget(elm);
        },
        
        /**
         * @method
         * 更新
         */
        update: function(app) {
            var tweens = this.tweens.clone();
            for (var i=0,len=tweens.length; i<len; ++i) {
                var tween = tweens[i];
                
                // 待ちチェック
                if (tween.delay > 0) {
                    tween.delay -= 1000/app.fps;
                    continue;
                }
                
                var time = tween.time + 1000/app.fps;
                tween._setTime(time);
                
                if (tween.time >= tween.duration) {
                    // 削除
                    this.tweens.erase(tween);
                    
                    // 全てのアニメーション終了チェック
                    if (this.tweens.length <= 0) {
                        this.isAnimation = false;
                        var e = tm.event.Event("animationend");
                        this.element.dispatchEvent(e);
                        this.dispatchEvent(e);
                    }
                }
                else {
                    tween.update();
                }
            }
        },
        
        addTween: function(param)
        {
            if (!param.target) param.target = this.element;
            
            var tween = tm.anim.Tween(param);
            tween.delay = param.delay || 0;
            this.tweens.push(tween);
            
            if (this.isAnimation == false) {
                this.isAnimation = true;
                var e = tm.event.Event("animationstart");
                this.element.dispatchEvent(e);
            }
            
            return tween;
        },
        
        addTweens: function(args)
        {
            for (var i=0,len=arguments.length; i<len; ++i) {
                var param = arguments[i];
                this.addTween(param);
            }
            
            return this;
        },
        
        fade: function(value, duration) {
            this._to("alpha", value, duration);
            return this;
        },
        
        move: function(x, y, duration, fn)
        {
            duration = (duration !== undefined) ? duration : 1000;
            fn       = fn || "linear";
        
            this._by("x", x, duration, fn);
            this._by("y", y, duration, fn);

            return this;
        },
        
        moveTo: function(x, y, duration, fn)
        {
            duration = (duration !== undefined) ? duration : 1000;
            fn       = fn || "linear";

            this._to("x", x, duration, fn);
            this._to("y", y, duration, fn);
            
            return this;
        },
        
        scale: function(value, duration)
        {
            duration = (duration !== undefined) ? duration : 1000;
                        this._to("rotation", value, duration);

            this.addTween({
                prop: "scaleX",
                begin: this.element.scaleX,
                finish: value,
                duration: duration,
            });
            this.addTween({
                prop: "scaleY",
                begin: this.element.scaleY,
                finish: value,
                duration: duration,
            });
            
            return this;
        },

        rotate: function(value, duration) {
            this._to("rotation", value, duration);
            return this;
        },
        
        fadeIn: function(duration)
        {
            return this.fade(1.0, duration);
        },
        
        fadeOut: function(duration)
        {
            return this.fade(0.0, duration);
        },
        
        clear: function() {
            this.tweens = [];
            return this;
        },

        setTarget: function(target) {
            if (this._fn) {
                this.element.removeEventListener("enterframe", this._fn);
            }

            this.element = target;
            this._fn = function(e) { this.update(e.app); }.bind(this);
            this.element.addEventListener("enterframe", this._fn);
        },
        getTarget: function(target) {
            return this.element;
        },

        _by: function(prop, value, duration, fn) {
            duration = (duration !== undefined) ? duration : 1000;
            this.addTween({
                prop: prop,
                begin: this.element[prop],
                finish: this.element[prop] + value,
                duration: duration,
                func: fn,
            });
        },

        _to: function(prop, value, duration, fn) {
            duration = (duration !== undefined) ? duration : 1000;
            this.addTween({
                prop: prop,
                begin: this.element[prop],
                finish: value,
                duration: duration,
                func: fn,
            });
        }
    });
    
    
    /**
     * @property    animation
     * アニメーション
     */
    tm.app.Element.prototype.getter("animation", function() {
        if (!this._animation) {
            this._animation = tm.app.Animation(this);
        }
        
        return this._animation;
    });
    
})();



