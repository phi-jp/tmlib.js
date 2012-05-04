/*
 * anim.js
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * インタラクティブキャンバスクラス
     */
    tm.app.Anim = tm.createClass({
        
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
                tween.time += 1000/app.fps;
                
                if (tween.time > tween.duration) {
                    tween.time = tween.duration;
                    tween.update();
                    tween.dispatchEvent("finish");
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
        
        addTween: function(param) {
            if (!param.target) param.target = this.element;
            
            var tween = tm.anim.Tween(param);
            this.tweens.push(tween);
            
            if (this.isAnimation == false) {
                this.isAnimation = true;
                var e = tm.app.Event("animationstart");
                this.element.dispatchEvent(e);
            }
            
            return tween;
        },
        
    });
    
    
    /**
     * @property    anim
     * アニメーション
     */
    tm.app.Element.prototype.getter("anim", function() {
        if (!this._anim) {
            this._anim = tm.app.Anim(this);
            this.addEventListener("enterframe", function(e){
                this._anim.update(e.app);
            });
        }
        
        return this._anim
    });
    
})();