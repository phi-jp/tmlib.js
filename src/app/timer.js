/*
 * Timer
 */


(function() {

    tm.define("tm.app.Timer", {
        /** フレーム */
        frame: 0,
        fps: 30,
        frameTime: 1000/30,

        init: function() {
            this.frame = 0;
            this.fps = tm.app.Timer.default.fps;
        },

        reset: function() {
            this.frame = 0;
            return this;
        },

        update: function() {
            this.frame = this.frame + 1;
            return this;
        },

        getFrame: function() {
            return this.frame;
        },

        getSeconds: function() {
            return this._seconds;
        },

        getMilliseconds: function() {
            return this._milliseconds;
        },

        checkIntervalEnd: function(time) {
            var t = (time/this.fps)|0;
            if (this.frame % t == 0) {
                return true;
            }
            return false;
        },

        // start ~ end の間かを判定する
        checkBetween: function(start, end) {
            if (arguments.length == 1) {
                end = Math.max(start, 0);
                start = end-this.frameTime;
            }
            var time = (this.frame/this.fps)*1000;

            return start <= time < end;
            return Math.inside(time, start, end);
        },

        _update: function() {
            var time = (this.frame/this.fps);
            this._seconds = time|0;
            this._milliseconds = (time*1000)|0;
        }
    });

    tm.app.Timer.prototype.accessor("frame", {
        "get": function() {
            return this._frame;
        },
        "set": function(frame){
            this._frame = frame;
            this._update();
        },
    });
    
    /**
     * @property fps
     * fps
     */
    tm.app.Timer.prototype.accessor("fps", {
        "get": function() {
            return this._fps;
        },
        "set": function(fps){
            if (fps !== this._fps) {
                this.frameTime = (1000/fps);
            }
            this._fps = fps;
            this._update();
        },
    });    

    tm.app.Timer.default = {
        fps: 30,
    };

})();



