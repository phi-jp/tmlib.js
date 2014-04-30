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
        superClass: "tm.app.Element",
        
        /**
         * @constructor
         * @param {Object} elm
         */
        init: function(elm) {
            this.superInit();
            
            this.setTarget(elm || {});

            this.timer = tm.app.Timer();
            this.prevTime = 0;
            
            this.currentTime = 0;
            this.duration = 0;
            this.isPlay = true;
            this._tweens  = [];
            this._actions = [];
        },
        
        /**
         * 更新
         * @param {Object} app
         */
        update: function(app) {
            if (!this.isPlay) return ;

            // fps を app から引き継ぐ
            if (this.timer.fps != app.timer.fps) {
                this.timer.fps = app.timer.fps;
            }

            // 更新
            var time = this.timer.getMilliseconds();

            if (this.prevTime <= this.duration) {
                this._updateTween(time);
                this._updateAction(time);

            }
            this.prevTime = time;
            this.timer.update();
        },
        
        /**
         * トゥイーンを更新
         * @private
         */
        _updateTween: function(time) {
            var tweens = this._tweens;
            for (var i=0,len=tweens.length; i<len; ++i) {
                var tween = tweens[i];
                
                if (tween.delay > time) {
                    continue ;
                }
                
                var t = time - tween.delay;
                tween._setTime(t);
                if (tween.time >= tween.duration) {
                }
                else {
                    tween.update();
                }
            }
        },
        
        /**
         * アクションを更新
         * @private
         */
        _updateAction: function(time) {
            var actions = this._actions;
            // console.log(time);

            for (var i=0,len=actions.length; i<len; ++i) {
                var action = actions[i];
                
                var frame = (action.delay/this.timer.fps)|0;
                if (this.timer.frame == frame) {
                    if (action.type == "call") {
                        action.func.call(action.self);
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
         * 指定した値までアニメーション
         * @param {Object} delay
         * @param {Object} props
         * @param {Object} duration
         * @param {Function} func
         */
        to: function(delay, props, duration, fn) {
            console.assert(typeof delay == "number", "to の第一引数はdelayに変わりました");
            this._addTween({
                props: props,
                duration: duration,
                fn: fn,
                delay: delay
            });
            
            return this;
        },

        /**
         * 指定した値を足した値までアニメーション
         * @param {Object} delay
         * @param {Object} props
         * @param {Object} duration
         * @param {Function} func
         */
        by: function(delay, props, duration, fn) {
            console.assert(typeof delay == "number", "by の第一引数はdelayに変わりました");
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
         * 関数を実行
         * @param {Object} delay
         * @param {Function} func
         */
        call: function(delay, func, self) {
            console.assert(typeof delay == "number", "call の第一引数はdelayに変わりました");
            this._addAction({
                "type": "call",
                func: func,
                self: self || this,
                delay: delay,
            });
            return this;
        },
        
        /**
         * プロパティをセット
         * @param {Object} delay
         * @param {Object} props
         */
        set: function(delay, props) {
            console.assert(typeof delay == "number", "set の第一引数はdelayに変わりました");
            this._addAction({
                "type": "set",
                props: props,
                delay: delay,
            });
            return this;
        },
        
        /**
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
         * ターゲットをゲット
         */
        getTarget: function() {
            return this.element;
        },
        
        /**
         * アニメーション開始
         * アニメーションが終了したら再度アニメーションを行う
         * @param {Number} frame
         */
        gotoAndPlay: function(frame) {
            this.isPlay = true;
            this.timer.frame = frame;
            this._updateTween();
        },
        
        /**
         * アニメーション開始
         * アニメーションが終了したらストップする
         * @param {Number} frame
         */
        gotoAndStop: function(frame) {
            this.timer.frame = frame;
            this.isPlay = false;
            this._updateTween();
        },

        /**
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
         * 時間を更新
         * @private
         * @param {Object} task
         */
        _updateDuration: function(task) {
            var duration = task.delay + (task.duration ? task.duration : 0);
            if (this.duration < duration) this.duration = duration;
            return this;
        },

        /**
         * dirty method
         * @private
         * @param {Object} t
         */
        _dirty: function(t) {
            return t;
//            return (t/this.fps).toInt();
        },
        
        /**
         * ロード
         * @param {Object} data
         */
        load: function(data) {
            
            for (var key in data.timeline) {
                var value = data.timeline[key];
            }
            
            return this;
        },
        
        /**
         * アニメーションをクリア
         */
        clear: function() {
            this.timer.reset();
            this.prevTime = 0;
            this.duration = 0;
            this.isPlay = true;
            this._tweens  = [];
            this._actions = [];
            
            return this;
        }
        
    });
    
    
    
    /**
     * @member      tm.app.Element
     * @property    timeline
     * タイムラインアニメーション
     */
    tm.app.Element.prototype.getter("timeline", function() {
        if (!this._timeline) {
            this._timeline = tm.app.Timeline(this);
        }
        
        return this._timeline;
    });
    
});
