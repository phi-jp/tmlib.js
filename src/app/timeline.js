/*
 * timeline.js
 */

tm.namespace("tm.app", function() {
    /**
     * @class tm.app.Timeline
     * タイムラインクラス
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.app.Timeline", {
        superClass: "tm.event.EventDispatcher",
        
        /**
         * @property
         * コンストラクタ
         * @param {Object} elm
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
         * @property
         * 更新
         * @param {Object} app
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
        
        /**
         * @property
         * @TODO ?
         * @private
         */
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
        
        /**
         * @property
         * @TODO ?
         * @private
         */
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
         * @property
         * 指定した値までアニメーション
         * @param {Object} props
         * @param {Object} duration
         * @param {Object} delay
         * @param {Function} func
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
         * @property
         * 指定した値を足した値までアニメーション
         * @param {Object} props
         * @param {Object} duration
         * @param {Object} delay
         * @param {Function} func
         */
        by: function(props, duration, delay, fn) {
            for (var key in props) {
                props[key] += this.element[key] || 0;
            }
            this._addTween({
                props: props,
                duration: duration,
                fn: fn,
                delay: delay
            });
            
            return this;
        },
        
        /**
         * @property
         * 関数を実行
         * @param {Function} func
         * @param {Object} delay
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
         * @property
         * プロパティをセット
         * @param {Object} props
         * @param {Object} delay
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
         * @property
         * ターゲットをセット
         * @param {Object} target
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
         * @property
         * ターゲットをゲット
         */
        getTarget: function() {
            return this.element;
        },
        
        /**
         * @property
         * アニメーション開始
         * アニメーションが終了したら再度アニメーションを行う
         * @param {Number} frame
         */
        gotoAndPlay: function(frame) {
            this.isPlay = true;
            this.currentFrame = frame;
            this._updateTween();
        },
        
        /**
         * @property
         * アニメーション開始
         * アニメーションが終了したらストップする
         * @param {Number} frame
         */
        gotoAndStop: function(frame) {
            this.currentFrame = frame;
            this.isPlay = false;
            this._updateTween();
        },

        /**
         * @property
         * tween を追加
         * @private
         * @param {Object} tween
         */
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

        /**
         * @property
         * アニメーションを追加
         * @private
         * @param {Object} action
         */
        _addAction: function(action) {
            action.delay = action.delay || 0;
            action.delay = this._dirty(action.delay);

            this._actions.push(action);
            this._updateDuration(action);
        },
        
        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} task
         */
        _updateDuration: function(task) {
            var duration = task.delay + (task.duration ? task.duration : 0);
            if (this.duration < duration) this.duration = duration;
            return this;
        },

        /**
         * @property
         * @TODO ?
         * @private
         * @param {Object} t
         */
        _dirty: function(t) {
            return (t/this.fps).toInt();
        },
        
        /**
         * @property
         * @TODO ?
         * @param {Object} data
         */
        load: function(data) {
            
            for (var key in data.timeline) {
                var value = data.timeline[key];
            }
            
            return this;
        },
        
        /**
         * @property
         * アニメーションをクリア
         */
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