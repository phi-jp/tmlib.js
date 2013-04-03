(function() {

    tm.define("tm.app.Tweener", {
        superClass: "tm.event.EventDispatcher",

        init: function(elm) {
            this.superInit();

            this._index = 0; // or seek
            this._tasks = [];
            this.setTarget(elm);

            this._func = this._updateTask;
            this.isPlaying = true;
        },

        setTarget: function(target) {
            if (this._fn) {
                this.element.removeEventListener("enterframe", this._fn);
            }

            this.element = target;
            this._fn = function(e) { this.update(e.app); }.bind(this);
            this.element.addEventListener("enterframe", this._fn);
        },

        /**
         * @method
         * 更新
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

        _updateTask: function(app) {
            if (!this.isPlaying) return ;

            var task = this._tasks[this._index];
            if (!task) return ;
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
                task.data.func();
            }
            else if (task.type == "set") {
                this.element.$extend(task.data.values);
            }
        },

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

        _updateWait: function(app) {
            var wait = this._wait;
            wait.time += 1000/app.fps;

            if (wait.time >= wait.limit) {
                delete this._wait;
                this._wait = null;
                this._func = this._updateTask;
            }
        },

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

        move: function(x, y, duration) {
            return this.to({x:x, y:y}, duration);
        },

        moveBy: function(x, y, duration) {
            return this.by({x:x, y:y}, duration);
        },

        fade: function(value, duration) {
            this.to({"alpha":value}, duration);
            return this;
        },

        fadeIn: function(duration) {
            this.fade(1.0, duration);
            return this;
        },

        fadeOut: function(duration) {
            this.fade(0.0, duration);
            return this;
        },

        by: function(props, duration, fn) {
            this._addTweenTask({
                props: props,
                duration: duration,
                fn: fn,
                type: "by"
            });
            return this;
        },

        to: function(props, duration, fn) {
            this._addTweenTask({
                props: props,
                duration: duration,
                fn: fn,
                type: "to"
            });
            return this;
        },

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

        wait: function(time) {
            this._tasks.push({
                type: "wait",
                data: {
                    limit: time
                }
            });
            return this;
        },

        call: function(fn) {
            this._tasks.push({
                type: "call",
                data: {
                    func: fn
                }
            });

            return this;
        },

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

        play: function() {
            this.isPlaying = true;
        },

        pause: function() {
            this.isPlaying = false;
        },

    });

    tm.app.Element.prototype.getter("tweener", function() {
        if (!this._tweener) {
            this._tweener = tm.app.Tweener(this);
        }
        
        return this._tweener;
    });
})();
