/*
 * tweener.js
 */

(function() {

    /**
     * @class tm.app.Tweener
     * トゥイーナークラス
     * @extends tm.event.EventDispatcher
     */
    tm.define("tm.app.Tweener", {
        superClass: "tm.app.Element",

        /**
         * @constructor
         * @param {Object} elm
         */
        init: function(elm) {
            this.superInit();

            this.setTarget(elm || {});
            this.loop = false;

            this._init();
        },

        /**
         * 初期化
         */
        _init: function() {
            this._index = 0;
            this._tasks = [];
            this._func = this._updateTask;
            this.isPlaying = true;
        },

        /**
         * ターゲットのセット
         * @param {Object} target
         */
        setTarget: function(target) {
            this.element = target;

            return this;
        },

        /**
         * 更新
         * @param {Object} app
         */
        update: function(app) {
            this._func(app);
            return ;
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
                        var e = tm.event.Event("finish");
                        this.element.fire(e);
                        this.dispatchEvent(e);
                    }
                }
                else {
                    tween.update();
                }
            }
        },

        /**
         * タスクの更新
         * @private
         * @param {Object} app
         */
        _updateTask: function(app) {
            if (!this.isPlaying) return ;

            var task = this._tasks[this._index];
            if (!task) {

                if (this.loop === true) {
                    this._index = 0;
                }
                else {
                    this.isPlaying = false;
                }

                return ;
            }
            this._index++;

            if (task.type == "tween") {
                var data = task.data;
                var fnStr= task.data.type;
                var args = task.data.args;
                this._tween = tm.anim.Tween();

                this._tween[fnStr].apply(this._tween, args);

                this._func = this._updateTween;
                this._func(app);
            }
            else if (task.type == "wait") {
                this._wait = task.data;
                this._wait.time = 0;

                this._func = this._updateWait;
                this._func(app);
            }
            else if (task.type == "call") {
                task.data.func.apply(task.data.self, task.data.args);
                // 1フレーム消費しないよう再帰
                this._updateTask(app);
            }
            else if (task.type == "set") {
                this.element.$extend(task.data.values);
                // 1フレーム消費しないよう再帰
                this._updateTask(app);
            }
        },

        /**
         * Tween の更新
         * @private
         * @param {Object} elm
         */
        _updateTween: function(app) {
            var tween = this._tween;
            var time = tween.time + 1000/app.fps;
            tween._setTime(time);
            
            if (tween.time >= tween.duration) {
                // 削除
                delete this._tween;
                this._tween = null;
                this._func = this._updateTask;
            }
            else {
                tween.update();
            }

        },

        /**
         * 時間の更新
         * @private
         * @param {Object} elm
         */
        _updateWait: function(app) {
            var wait = this._wait;
            wait.time += 1000/app.fps;

            if (wait.time >= wait.limit) {
                delete this._wait;
                this._wait = null;
                this._func = this._updateTask;
            }
        },

        /**
         * 追加
         * @param {Object} param
         */
        add: function(param) {
            if (!param.target) param.target = this.element;

            this._tasks.push({
                type: "tween",
                data: param
            });

            if (this.isAnimation == false) {
                this.isAnimation = true;
                var e = tm.event.Event("animationstart");
                this.element.dispatchEvent(e);
            }
            
            return this;
        },

        /**
         * 指定した値を足した値までアニメーション
         * @param {Object} props
         * @param {Object} duration
         * @param {Function} fn
         */
        by: function(props, duration, fn) {
            this._addTweenTask({
                props: props,
                duration: duration,
                fn: fn,
                type: "by"
            });
            return this;
        },

        /**
         * 指定した値までアニメーション
         * @param {Object} props
         * @param {Object} duration
         * @param {Function} fn
         */
        to: function(props, duration, fn) {
            this._addTweenTask({
                props: props,
                duration: duration,
                fn: fn,
                type: "to"
            });
            return this;
        },

        from: function(props, duration, fn) {
            this._addTweenTask({
                props: props,
                duration: duration,
                fn: fn,
                type: "from"
            });
            return this;
        },

        /**
         * 移動アニメーション
         * @param {Number} x
         * @param {Number} y
         * @param {Object} duration
         * @param {Function} fn
         */
        move: function(x, y, duration, fn) {
            return this.to({x:x, y:y}, duration, fn);
        },

        /**
         * 指定した値を足した座標までアニメーション
         * @param {Number} x
         * @param {Number} y
         * @param {Object} duration
         * @param {Function} fn
         */
        moveBy: function(x, y, duration, fn) {
            return this.by({x:x, y:y}, duration, fn);
        },

        /**
         * 回転アニメーション
         * @param {Number} rotation
         * @param {Object} duration
         * @param {Function} fn
         */
        rotate: function(rotation, duration, fn) {
            return this.to({rotation:rotation}, duration, fn);
        },

        /**
         * 拡縮アニメーション
         * @param {Number} scale
         * @param {Object} duration
         * @param {Function} fn
         */
        scale: function(scale, duration, fn) {
            return this.to({scaleX:scale, scaleY:scale}, duration, fn);
        },

        /**
         * フェードアニメーション
         * @param {Object} value
         * @param {Object} duration
         */
        fade: function(value, duration) {
            this.to({"alpha":value}, duration);
            return this;
        },

        /**
         * フェードイン
         * @param {Object} duration
         */
        fadeIn: function(duration) {
            this.fade(1.0, duration);
            return this;
        },

        /**
         * フェードアウト
         * @param {Object} duration
         */
        fadeOut: function(duration) {
            this.fade(0.0, duration);
            return this;
        },

        /**
         * Tween のタスクを追加
         * @private
         * @param {Object} param
         */
        _addTweenTask: function(param) {
            param.target   = (param.target !== undefined) ? param.target : this.element;
            param.duration = (param.duration !== undefined) ? param.duration : 1000;

            this._tasks.push({
                type: "tween",
                data: {
                    args: [param.target, param.props, param.duration, param.fn],
                    type: param.type
                }
            });

            if (this.isAnimation == false) {
                this.isAnimation = true;
                var e = tm.event.Event("animationstart");
                this.element.dispatchEvent(e);
            }
            
            return this;
        },

        /**
         * 待ち時間
         * @param {Object} time
         */
        wait: function(time) {
            this._tasks.push({
                type: "wait",
                data: {
                    limit: time
                }
            });
            return this;
        },

        /**
         * コールバックを登録
         * @param {Function} fn
         * @param {Object} args
         */
        call: function(fn, self, args) {
            this._tasks.push({
                type: "call",
                data: {
                    func: fn,
                    self: self || this,
                    args: args,
                },
            });

            return this;
        },

        /**
         * プロパティをセット
         * @param {Object} key
         * @param {Object} value
         */
        set: function(key, value) {
            var values = null;
            if (arguments.length == 2) {
                values = {};
                values[key] = value;
            }
            else {
                values = key;
            }
            this._tasks.push({
                type: "set",
                data: {
                    values: values
                }
            });

            return this;
        },

        /**
         * アニメーション開始
         */
        play: function() {
            this.isPlaying = true;
            return this;
        },

        /**
         * アニメーションを一時停止
         */
        pause: function() {
            this.isPlaying = false;
            return this;
        },

        /**
         * アニメーションを巻き戻す
         */
        rewind: function() {
            this._func = this._updateTask;
            this._index = 0;
            this.play();
            return this;
        },

        /**
         * アニメーションループ設定
         * @param {Boolean} flag
         */
        setLoop: function(flag) {
            this.loop = flag;
            return this;
        },

        /**
         * アニメーションをクリア
         */
        clear: function() {
            this._init();
            return this;
        }
    });

    /**
     * @member      tm.app.Element
     * @property    tweener
     * トゥイーンアニメーション
     */
    tm.app.Element.prototype.getter("tweener", function() {
        if (!this._tweener) {
            this._tweener = tm.app.Tweener(this);
            this.on("enterframe", function(e) {
                this._tweener.update(e.app);
            });
        }
        
        return this._tweener;
    });
})();
