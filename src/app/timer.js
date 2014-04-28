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
            this.fps = 30;
        },

        reset: function() {
            this.frame = 0;
            return this;
        },

        update: function() {
            ++this.frame;
            return this;
        },

        getFrame: function() {
            return this.frame;
        },

        getSeconds: function() {
            return (this.frame/this.fps)|0;
        },

        getMilliseconds: function() {
            return ((this.frame/this.fps)*1000)|0;
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
                end = start;
                start = end-this.frameTime;
            }
            var time = this.getMilliseconds();

            return Math.inside(time, start, end);
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
        "set": function(v){
            this._fps = v;
            this.frameTime = 1000/this._fps;
        },
    });    

    tm.app.Timer.default = {
        fps: 30,
    };

})();



