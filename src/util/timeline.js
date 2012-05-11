/*
 * tmline.js
 */


tm.util = tm.util || {};

(function() {
    
    
    /**
     * @class
     * タイムラインクラス
     */
    tm.util.Timeline = tm.createClass({
        
        target  : null,
        tasks   : null,
        
        fps     : 30,
        
        /**
         * 初期化
         */
        init: function() {
            this.tasks = [];
            this.time = 0;
        },
        
        at: function(time, action) {
            this.tasks.push({
                time: time,
                action: action,
            });
            return this;
        },
        
        after: function(time, action) {
            this.at(this.time + time, action);
            return this;
        },
        
        clear: function() {
            this.tasks = [];
            return this;
        },
        
        removeTime: function(time) {
            // TODO: 
        },
        
        removeAction: function(action) {
            // TODO: 
        },
        
        start: function() {
            this.isPlaying = true;
            this._startTime();
            this._updateTime();
        },
        
        resume: function() {
            this.isPlaying = true;
            this._resumeTime();
            this._updateTime();
        },
        
        stop: function() {
            this.isPlaying = false;
        },
        
        rewind: function() {
            this.time = 0;
        },
        
        update: function() {
            // タスク更新
            if (this.tasks.length > 0) {
                for (var i=0,len=this.tasks.length; i<len; ++i) {
                    var task = this.tasks[i];
                    if (this.prev <= task.time && task.time < this.time) {
                        task.action();
                        // this.tasks.erase(task);
                        // break;
                    }
                }
            }
        },
        
        _startTime: function() {
            this.startTime = (new Date()).getTime();
        },
        
        _resumeTime: function() {
            this.startTime = (new Date()).getTime() - this.time;
        },
        
        _updateTime: function() {
            if (this.isPlaying) {
                this._nextTime();
                setTimeout(arguments.callee.bind(this), 1000/this.fps);
            }
        },
        
        _nextTime: function() {
            // 前回の時間
            this.prev = this.time;
            // 今回の時間
            this.time = (new Date()).getTime() - this.startTime;
            // 更新
            this.update();
        },
        
    });
    
})();

