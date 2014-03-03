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
         * アット
         */
        at: function(time, action) {
            this.tasks.push({
                time: time,
                action: action,
            });
            return this;
        },

        /**
         * アフター
         */
        after: function(time, action) {
            this.at(this.time + time, action);
            return this;
        },

        /**
         * クリア
         */
        clear: function() {
            this.tasks = [];
            return this;
        },

        /**
         * リムーブタイム
         */
        removeTime: function(time) {
            // TODO: 
        },

        /**
         * リムーブアクション
         */
        removeAction: function(action) {
            // TODO: 
        },
        
        /**
         * スタート
         */
        start: function() {
            this.isPlaying = true;
            this._startTime();
            this._updateTime();
        },

        /**
         * レジューム
         */
        resume: function() {
            this.isPlaying = true;
            this._resumeTime();
            this._updateTime();
        },

        /**
         * ストップ
         */
        stop: function() {
            this.isPlaying = false;
        },

        /**
         * レウィンド
         */
        rewind: function() {
            this.time = 0;
        },

        /**
         * 更新
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
         * @private
         */
        _startTime: function() {
            this.startTime = (new Date()).getTime();
        },

        /**
         * @private
         */
        _resumeTime: function() {
            this.startTime = (new Date()).getTime() - this.time;
        },

        /**
         * @private
         */
        _updateTime: function() {
            if (this.isPlaying) {
                this._nextTime();
                setTimeout(arguments.callee.bind(this), 1000/this.fps);
            }
        },
        
        /**
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

