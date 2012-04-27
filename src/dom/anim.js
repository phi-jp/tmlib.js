/*
 * anim.js
 */

tm.dom = tm.dom || {};

(function() {
    
    /**
     * @class
     * アニメーションクラス
     */
    tm.dom.Anim = tm.createClass({
        
        /**
         * 初期化
         */
        init: function(element) {
            this.element = element;
            
            // アニメーションが終了したらステートを "paused" にする(何度も再生できるようにする為)
            var self = this;
            this.element.addEventListener("webkitAnimationEnd", function() {
                self.stop();
            }, false);
        },
        
        
        /**
         * アニメーション開始
         */
        start: function() {
            this.element.style["webkitAnimationPlayState"] = "running";
            return this;
        },
        
        /**
         * アニメーション終了
         */
        stop: function() {
            this.element.style["webkitAnimationPlayState"] = "paused";
            return this;
        },
        
        /**
         * プロパティをセット
         */
        setProperty: function(prop) {
            if (typeof prop == "string") {
                this.element.style["webkitAnimation"] = prop;
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
            this.element.style["webkitAnimationName"] = name;
            return this;
        },
        
        /**
         * アニメーション時間の長さをセット
         */
        setDuration: function(s) {
            this.element.style["webkitAnimationDuration"] = s;
            return this;
        },
        
        /**
         * 補間関数をセット
         */
        setTimingFunction: function(func) {
            this.element.style["webkitAnimationTimingFunction"] = func;
            return this;
        },
        
        /**
         * イテレータカウントをセット
         */
        setIterationCount: function(n) {
            this.element.style["webkitAnimationIterationCount"] = n;
            return this;
        },
        
        /**
         * アニメーション開始待ち時間をセット
         */
        setDelay: function(s) {
            this.element.style["webkitAnimationDelay"] = s;
            return this;
        },
        
        /**
         * 判定再生させるかどうかを指定
         * "normal" or "alternate"
         */
        setDirection: function(t) {
            this.element.style["webkitAnimationDirection"] = t;
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
     * アニメーション
     */
    tm.dom.Element.prototype.getter("anim", function() {
        return this._anim || (this._anim = tm.dom.Anim(this.element));
    });
    
})();

