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
            
            var tween = tm.anim.Tween();
            var begin = {}; begin[param.prop] = param.begin;
            var finish= {}; finish[param.prop] = param.finish;
            tween.fromTo(param.target, begin, finish, param.duration, param.func);
            
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
        
        move: function(x, y, duration, fn)
        {
            duration = (duration !== undefined) ? duration : 1000;
            fn       = fn || "linear";
        
            this.by("x", x, duration, fn);
            this.by("y", y, duration, fn);

            return this;
        },
        
        moveTo: function(x, y, duration, fn)
        {
            duration = (duration !== undefined) ? duration : 1000;
            fn       = fn || "linear";

            this.to("x", x, duration, fn);
            this.to("y", y, duration, fn);
            
            return this;
        },
        
        scale: function(value, duration, delay)
        {
            duration = (duration !== undefined) ? duration : 1000;

            this.to("scaleX", value, duration, delay);
            this.to("scaleY", value, duration, delay);

            return this;
        },

        rotate: function(value, duration, delay) {
            this.to("rotation", value, duration, delay);
            return this;
        },
        
        fade: function(value, duration, delay) {
            this.to("alpha", value, duration, delay);
            return this;
        },

        fadeIn: function(duration, delay)
        {
            return this.fade(1.0, duration, delay);
        },
        
        fadeOut: function(duration, delay)
        {
            return this.fade(0.0, duration, delay);
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

        by: function(prop, value, duration, delay, fn) {
            duration = (duration !== undefined) ? duration : 1000;
            this.addTween({
                prop: prop,
                begin: this.element[prop],
                finish: this.element[prop] + value,
                duration: duration,
                delay: delay,
                func: fn,
            });

            return this;
        },

        to: function(prop, value, duration, delay, fn) {
            duration = (duration !== undefined) ? duration : 1000;
            this.addTween({
                prop: prop,
                begin: this.element[prop],
                finish: value,
                duration: duration,
                delay: delay,
                func: fn,
            });

            return this;
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




