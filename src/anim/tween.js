/*
 * tween.js
 */

tm.anim = tm.anim || {};

(function() {
    
    var bind = function(fn, self) {
        return function() { return fn.apply(self, arguments); };
    };
    
    /**
     * @class
     * Tween クラス
     */
    tm.anim.Tween = tm.createClass({
        
        target      : null,
        prop        : null,
        now         : null,
        finish      : null,
        duration    : null,
        timerID     : null,
        isLooping   : null,
        isPlaying   : null,
        
        /**
         * frame rate
         */
        fps     : 30,
        
        init: function(target, prop, begin, finish, duration, func) {
            if (arguments.length == 1) {
                this.setObject(target);
            }
            else {
                this.set.apply(this, arguments);
            }
            
            this.time = 0;
            this.isPlaying = false;
        },
        
        set: function(target, prop, begin, finish, duration, func)
        {
            this.target = target;
            this.prop   = prop;
            this.begin  = begin;
            this.finish = finish;
            this.change = this.finish-this.begin;
            this.duration = duration;
            this.func = func || Math.linear;
        },
        
        setObject: function(obj)
        {
            this.set(obj.target, obj.prop, obj.begin, obj.finish, obj.duration, obj.func);
        },
        
        /**
         * 再開
         */
        resume: function() {
            this.isPlaying = true;
            this._resumeTime();
            this._updateTime();
            this.dispatchEvent("resume");
        },
        
        /**
         * 開始
         */
        start: function() {
            this.isPlaying = true;
            this._startTime();
            this._updateTime();
            this.dispatchEvent("start");
        },
        
        /**
         * ストップ
         */
        stop: function() {
            this.isPlaying = false;
            this.dispatchEvent("stop");
        },
        
        /**
         * 開始位置まで戻る
         */
        rewind: function() {
            this.time = 0;
            this.update();
        },
        
        /**
         * 最後位置まで早送り
         */
        fforward: function() {
            this.time = this.duration;
            this.update();
        },
        
        /**
         * ヨーヨー
         */
        yoyo: function() {
            var temp = this.finish;
            this.finish = this.begin;
            this.begin  = temp;
            this.change = this.finish-this.begin;
            this.start();
        },
        
        /**
         * 更新
         */
        update: function() {
            this.target[this.prop] = this.func(this.time, this.begin, this.change, this.duration);
            this.dispatchEvent("change");
            //this.target[this.prop] = this.begin + (this.finish - this.begin) * (this.time/this.duration);
        },
        
        /**
         * ディスパッチイベント
         */
        dispatchEvent: function(type) {
            var fnName = 'on'+type;
            if (this[fnName]) this[fnName](type);
        },
        
        _resumeTime: function() {
            this.startTime = (new Date()).getTime() - this.time;
        },
        
        _startTime: function() {
            this.startTime = (new Date()).getTime();
        },
        
        _updateTime: function() {
            if (this.isPlaying) {
                this._nextTime();
                setTimeout(bind(arguments.callee, this), 1000/this.fps);
            }
        },
        
        _nextTime: function() {
            var time = (new Date()).getTime() - this.startTime;
            // モーション終了
            if (time > this.duration) {
                // ループ
                if (this.isLooping) {
                    this.rewind();
                    // 座標を更新
                    this.update();
                    // イベント開始
                    this.dispatchEvent("loop");
                }
                // 終了
                else {
                    this.time = this.duration;
                    // 座標を更新
                    this.update();
                    // 停止
                    this.stop();
                    // イベント開始
                    this.dispatchEvent("finish");
                }
            }
            // 更新
            else {
                this.time = time;
                // 座標を更新
                this.update();
            }
        }
    });
    
    
})();

