tm.namespace("tm.app", function() {
    tm.define("tm.app.Timeline", {
        superClass: "tm.event.EventDispatcher",
        
        /**
         * 初期化
         */
        init: function(elm) {
            this.superInit();
            
            this.setTarget(elm);
            
            this.currentFrame = 0;
            this.duration = 0;
            this.isPlay = true;
            this._tweens  = [];
            this._actions = [];
        },
        
        /**
         * 更新
         */
        update: function(app) {
            if (!this.isPlay) return ;
            
            if (this.currentFrame > this.duration) {
//                this.gotoAndPlay(0);
            }
            else {
                this._updateTween();
                this._updateAction();
            }
            
            this.currentFrame++;
        },
        
        _updateTween: function() {
            var tweens = this._tweens;
            for (var i=0,len=tweens.length; i<len; ++i) {
                var tween = tweens[i];
                
                if (tween.delay > this.currentFrame) {
                    continue ;
                }
                
                var time = this.currentFrame - tween.delay;
                tween._setTime(time);
                if (tween.time >= tween.duration) {
                }
                else {
                    tween.update();
                }
            }
        },
        
        _updateAction: function() {
            var actions = this._actions;
            
            for (var i=0,len=actions.length; i<len; ++i) {
                var action = actions[i];
                
                if (action.delay == this.currentFrame) {
                    if (action.type == "call") {
                        action.func();
                    }
                    else if (action.type == "set") {
                        var props = action.props;
                        for (var key in props) {
                            this.element[key] = props[key];
                        }
                    }
                }
            }
        },
        
        /**
         * アニメーション
         */
        to: function(props, duration, delay, fn) {
            delay = delay || 0;
            var tween = tm.anim.Tween();
            tween.to(this.element, props, duration, fn);
            tween.delay = delay;
            
            this._tweens.push(tween);
            
            this._updateDuration(tween);
            
            return this;
        },
        
        /**
         * 関数を実行
         */
        call: function(func, delay) {
            delay = delay || 0;
            
            this._actions.push({
                "type": "call",
                func: func,
                delay: delay,
            });
            this._updateDuration(this._actions.last);
        },
        
        /**
         * プロパティをセット
         */
        set: function(props, delay) {
            delay = delay || 0;
            
            this._actions.push({
                "type": "set",
                props: props,
                delay: delay,
            });
            this._updateDuration(this._actions.last);
            return this;
        },
        
        /**
         * ターゲットをセット
         */
        setTarget: function(target) {
            if (this._fn) {
                this.element.removeEventListener("enterframe", this._fn);
            }
            
            this.element = target;
            this._fn = function(e) { this.update(e.app); }.bind(this);
            this.element.addEventListener("enterframe", this._fn);
        },
        
        /**
         * ターゲットをゲット
         */
        getTarget: function(target) {
            return this.element;
        },
        
        /**
         * ターゲットをゲット
         */
        gotoAndPlay: function(frame) {
            this.isPlay = true;
            this.currentFrame = frame;
            this._updateTween();
        },
        
        gotoAndStop: function(frame) {
            this.currentFrame = frame;
            this.isPlay = false;
            this._updateTween();
        },
        
        _updateDuration: function(task) {
            var duration = task.delay + (task.duration ? task.duration : 0);
            if (this.duration < duration) this.duration = duration;
            return this;
        },
        
        clear: function() {
            this.currentFrame = 0;
            this.duration = 0;
            this.isPlay = true;
            this._tweens  = [];
            this._actions = [];
        }
        
    });
    
    
    
    /**
     * @property    animation
     * アニメーション
     */
    tm.app.Element.prototype.getter("timeline", function() {
        if (!this._timeline) {
            this._timeline = tm.app.Timeline(this);
        }
        
        return this._timeline;
    });
    
});