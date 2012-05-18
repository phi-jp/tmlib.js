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
        
        isAnimation: false,
        
        /**
         * 初期化
         */
        init: function(elm) {
            this.element    = elm;
            this.tweens     = [];
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
                        var e = tm.app.Event("animationend");
                        this.element.dispatchEvent(e);
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
                var e = tm.app.Event("animationstart");
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
        
        
        clear: function() {
            this.tweens = [];
            return this;
        },
    });
    
    
    /**
     * @property    animation
     * アニメーション
     */
    tm.app.Element.prototype.getter("animation", function() {
        if (!this._animation) {
            this._animation = tm.app.Animation(this);
            this.addEventListener("enterframe", function(e){
                this._animation.update(e.app);
            });
        }
        
        return this._animation;
    });
    
})();



