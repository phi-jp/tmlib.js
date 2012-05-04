/*
 * tween.js
 */

tm.anim = tm.anim || {};

(function() {
    
    tm.anim.Tween = tm.createClass({
        
        target      : null,
        prop        : null,
        now         : null,
        finish      : null,
        duration    : null,
        timerID     : null,
        isLoop      : null,
        isPlaying   : null,
        
        /**
         * frame rate
         */
        fps     : 30,
        
        init: function(target, prop, begin, finish, duration, func) {
            if (arguments.length == 1) {
                this.setObject(arugments);
            }
            else {
                this.set.apply(this, arguments);
            }
            
            this.isPlaying = false;
        },
        
        set: function(target, prop, begin, finish, duration, func)
        {
            this.target = target;
            this.prop   = prop;
            this.begin  = begin;
            this.finish = finish;
            this.duration = duration;
            this.func = func;
        },
        
        setObject: function(obj)
        {
            this.set(obj.target, obj.prop, obj.begin, obj.finsih, obj.duration, obj.func);
        },
        
        /**
         * 最後位置まで早送り
         */
        fforward: function() {
            this._time = this.duration;
            this.update();
        },
        
        /**
         * 開始位置まで戻る
         */
        rewind: function() {
            this._time = 0;
            this.update();
        },
        
        /**
         * 開始
         */
        start: function() {
            this.isPlaying = true;
            
            var self = this;
            var startTime = (new Date()).getTime();
            
            this.timerID = setTimeout(function() {
                self._time = (new Date()).getTime() - startTime;
                
                self.update();
                
                if (self._time > self.duration) {
                    self.isPlaying = false;
                }
                
                if (self.isPlaying) {
                    self.timerID = setTimeout(arguments.callee, 1000/self.fps);
                }
                else {
                    self.target[self.prop] = self.finish;
                    if (self.isLoop) { self.start(); }
                }
            }, 1000/this.fps);
        },
        
        /**
         * ストップ
         */
        stop: function() {
            clearTimeout(this.timerID);
        },
        
        /**
         * ヨーヨー
         */
        yoyo: function() {
            
        },
        
        update: function() {
            var passRatio = this._time/this.duration;
            // 更新
            this.target[this.prop] = this.begin + (this.finish - this.begin) * passRatio;
        },
        
    });
    
})();

