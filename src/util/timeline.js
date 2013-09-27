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
        
        target  : null,
        tasks   : null,
        
        fps     : 30,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this.tasks = [];
            this.time = 0;
        },
        
        /**
         * @property
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
         * @property
         * @TODO ?
         */
        after: function(time, action) {
            this.at(this.time + time, action);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        clear: function() {
            this.tasks = [];
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        removeTime: function(time) {
            // TODO: 
        },

        /**
         * @property
         * @TODO ?
         */
        removeAction: function(action) {
            // TODO: 
        },
        
        /**
         * @property
         * @TODO ?
         */
        start: function() {
            this.isPlaying = true;
            this._startTime();
            this._updateTime();
        },

        /**
         * @property
         * @TODO ?
         */
        resume: function() {
            this.isPlaying = true;
            this._resumeTime();
            this._updateTime();
        },

        /**
         * @property
         * @TODO ?
         */
        stop: function() {
            this.isPlaying = false;
        },

        /**
         * @property
         * @TODO ?
         */
        rewind: function() {
            this.time = 0;
        },

        /**
         * @property
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
         * @property
         * @TODO ?
         * @private
         */
        _startTime: function() {
            this.startTime = (new Date()).getTime();
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _resumeTime: function() {
            this.startTime = (new Date()).getTime() - this.time;
        },

        /**
         * @property
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
         * @property
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

