/*
 * anim.js
 */

tm.dom = tm.dom || {};

(function() {
    
    var prefix = tm.VENDER_PREFIX;
    
    var ANIMATION                   = prefix + "Animation";
    var ANIMATION_END               = prefix + "AnimationEnd";
    var ANIMATION_PLAY_STATE        = prefix + "AnimationPlayState";
    var ANIMATION_NAME              = prefix + "AnimationName";
    var ANIMATION_DURATION          = prefix + "AnimationDuration";
    var ANIMATION_TIMING_FUNCTION   = prefix + "AnimationTimingFunction";
    var ANIMATION_DELAY             = prefix + "AnimationDelay";
    var ANIMATION_DIRECTION         = prefix + "AnimationDirection";
    var ANIMATION_ITERATION_COUNT   = prefix + "AnimationIterationCount";
    
    /**
     * @class tm.dom.Anim
     * アニメーションクラス
     */
    tm.dom.Anim = tm.createClass({
        
        /** @property element */

        /**
         * @constructor
         */
        init: function(element) {
            this.element = element;
            
            // アニメーションが終了したらステートを "paused" にする(何度も再生できるようにする為)
            var self = this;
            this.element.addEventListener(ANIMATION_END, function() {
                self.stop();
            }, false);
        },
        
        /**
         * アニメーション開始
         */
        start: function() {
            this.element.style[ANIMATION_PLAY_STATE] = "running";
            return this;
        },
        
        /**
         * アニメーション終了
         */
        stop: function() {
            this.element.style[ANIMATION_PLAY_STATE] = "paused";
            return this;
        },
        
        /**
         * プロパティをセット
         */
        setProperty: function(prop) {
            if (typeof prop == "string") {
                this.element.style[ANIMATION] = prop;
            }
            else {
                for (var key in prop) {
                    var fn = ANIM_SETTER_FUNC_NAME_MAP[key];
                    var value = prop[key];
                    fn.call(this, value);
                }
            }
            return this;
        },
        
        /**
         * 名前をセット
         */
        setName: function(name) {
            this.element.style[ANIMATION_NAME] = name;
            return this;
        },
        
        /**
         * アニメーション時間の長さをセット
         */
        setDuration: function(s) {
            this.element.style[ANIMATION_DURATION] = s;
            return this;
        },
        
        /**
         * 補間関数をセット
         */
        setTimingFunction: function(func) {
            this.element.style[ANIMATION_TIMING_FUNCTION] = func;
            return this;
        },
        
        /**
         * イテレータカウントをセット
         */
        setIterationCount: function(n) {
            this.element.style[ANIMATION_ITERATION_COUNT] = n;
            return this;
        },
        
        /**
         * アニメーション開始待ち時間をセット
         */
        setDelay: function(s) {
            this.element.style[ANIMATION_DELAY] = s;
            return this;
        },
        
        /**
         * 判定再生させるかどうかを指定
         * "normal" or "alternate"
         */
        setDirection: function(t) {
            this.element.style[ANIMATION_DURATION] = t;
            return this;
        },
    });
    
    var ANIM_SETTER_FUNC_NAME_MAP = {
        // 小文字対応
        "name"          : tm.dom.Anim.prototype.setName,
        "duration"      : tm.dom.Anim.prototype.setDuration,
        "timingFunction": tm.dom.Anim.prototype.setTimingFunction,
        "iterationCount": tm.dom.Anim.prototype.setIterationCount,
        "delay"         : tm.dom.Anim.prototype.setDelay,
        
        // 大文字対応
        "Name"          : tm.dom.Anim.prototype.setName,
        "Duration"      : tm.dom.Anim.prototype.setDuration,
        "TimingFunction": tm.dom.Anim.prototype.setTimingFunction,
        "IterationCount": tm.dom.Anim.prototype.setIterationCount,
        "Delay"         : tm.dom.Anim.prototype.setDelay,
    };
    
    /**
     * @property    anim
     */
    tm.dom.Element.prototype.getter("anim", function() {
        return this._anim || (this._anim = tm.dom.Anim(this.element));
    });
    
})();

