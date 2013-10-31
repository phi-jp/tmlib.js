/*
 * tmline.js
 */

tm.util = tm.util || {};


(function() {
    
    /**
     * @class tm.util.Timeline
     * タイムラインクラス
     */
    tm.util.Timeline = tm.createClass({
        
        /** target */
        target  : null,
        /** tasks */
        tasks   : null,
        /** fps */
        fps     : 30,
        
        /**
         * @constructor
         */
        init: function() {
            this.tasks = [];
            this.time = 0;
        },
        
        /**
         * @TODO ?
         */
        at: function(time, action) {
            this.tasks.push({
                time: time,
                action: action,
            });
            return this;
        },

        /**
         * @TODO ?
         */
        after: function(time, action) {
            this.at(this.time + time, action);
            return this;
        },

        /**
         * @TODO ?
         */
        clear: function() {
            this.tasks = [];
            return this;
        },

        /**
         * @TODO ?
         */
        removeTime: function(time) {
            // TODO: 
        },

        /**
         * @TODO ?
         */
        removeAction: function(action) {
            // TODO: 
        },
        
        /**
         * @TODO ?
         */
        start: function() {
            this.isPlaying = true;
            this._startTime();
            this._updateTime();
        },

        /**
         * @TODO ?
         */
        resume: function() {
            this.isPlaying = true;
            this._resumeTime();
            this._updateTime();
        },

        /**
         * @TODO ?
         */
        stop: function() {
            this.isPlaying = false;
        },

        /**
         * @TODO ?
         */
        rewind: function() {
            this.time = 0;
        },

        /**
         * @TODO ?
         */
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
        
        /**
         * @TODO ?
         * @private
         */
        _startTime: function() {
            this.startTime = (new Date()).getTime();
        },

        /**
         * @TODO ?
         * @private
         */
        _resumeTime: function() {
            this.startTime = (new Date()).getTime() - this.time;
        },

        /**
         * @TODO ?
         * @private
         */
        _updateTime: function() {
            if (this.isPlaying) {
                this._nextTime();
                setTimeout(arguments.callee.bind(this), 1000/this.fps);
            }
        },
        
        /**
         * @TODO ?
         * @private
         */
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

