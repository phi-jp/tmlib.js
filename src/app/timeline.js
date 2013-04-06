tm.namespace("tm.app", function() {
    tm.define("tm.app.Timeline", {
        superClass: "tm.event.EventDispatcher",
        
        /**
         * 初期化
         */
        init: function(elm) {
            this.superInit();
            
            this.setTarget(elm);

            this.fps = 30;
            
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
            this._addTween({
                props: props,
                duration: duration,
                fn: fn,
                delay: delay
            });
            
            return this;
        },
        
        /**
         * 関数を実行
         */
        call: function(func, delay) {
            this._addAction({
                "type": "call",
                func: func,
                delay: delay,
            });
            return this;
        },
        
        /**
         * プロパティをセット
         */
        set: function(props, delay) {
            this._addAction({
                "type": "set",
                props: props,
                delay: delay,
            });
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

        _addTween: function(tween) {
            tween.duration = tween.duration || 1000;
            tween.duration = this._dirty(tween.duration);
            tween.delay = tween.delay || 0;
            tween.delay = this._dirty(tween.delay);

            var tweenObj = tm.anim.Tween();
            tweenObj.to(this.element, tween.props, tween.duration, tween.fn);
            tweenObj.delay = tween.delay;

            this._tweens.push(tweenObj);
            this._updateDuration(tweenObj);
        },

        _addAction: function(action) {
            action.delay = action.delay || 0;
            action.delay = this._dirty(action.delay);

            this._actions.push(action);
            this._updateDuration(action);
        },
        
        _updateDuration: function(task) {
            var duration = task.delay + (task.duration ? task.duration : 0);
            if (this.duration < duration) this.duration = duration;
            return this;
        },

        _dirty: function(t) {
            return (t/this.fps).toInt();
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