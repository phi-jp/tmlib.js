/*
 * webaudio.js
 */

tm.sound = tm.sound || {};

(function() {

    /**
     * @class
     * WebAudioクラス
     */
    tm.sound.WebAudio = tm.createClass({
        loaded: false,
        context: null,
        buffer: null,
        panner: null,

        /**
         * ボリューム
         */
        volume: 0.8,

        /**
         *　初期化
         */
        init: function(src_or_buffer) {
            this.context = tm.sound.WebAudioManager.context;
            var type = typeof(src_or_buffer);

            if (type==="string") {
                this.loaded = false;
                this._load(src_or_buffer);
            }
            else if (type==="object") {
                this._setup();
                this.buffer = src_or_buffer;
                this.loaded = true;
            }
            else {
                this._setup();
                this.loaded = false;
            }
        },

        /**
         * 再生
         * - noteGrainOn ... http://www.html5rocks.com/en/tutorials/casestudies/munkadoo_bouncymouse/
         */
        play: function(time) {
            if (time === undefined) time = 0;
            this.source.noteOn(this.context.currentTime + time);
            /*
            this.source.noteGrainOn(this.context.currentTime + time, 0, this.buffer.duration);
            console.dir(this.buffer.duration);
            console.dir(this.context.currentTime)
            */

            return this;
        },

        /**
         * 停止
         */
        stop: function(time) {
            if (time === undefined) time = 0;
            this.source.noteOff(this.context.currentTime + time);
            
            var buffer = this.buffer;
            var volume = this.volume;
            var loop   = this.loop;
            
            this.source = this.context.createBufferSource();
            this.source.connect(this.panner);
            this.buffer = buffer;
            this.volume = volume;
            this.loop = loop;

            return this;
        },

        pause: function() {
            this.source.disconnect();

            return this;
        },

        resume: function() {
            this.source.connect(this.panner);

            return this;
        },

        /**
         * 複製
         */
        clone: function() {
            var webAudio = tm.sound.WebAudio(this.buffer);
            webAudio.volume = this.volume;
            return webAudio;
        },
        /**
         * dummy
         */
        setPosition: function(x, y, z) {
            this.panner.setPosition(x, y||0, z||0);

            return this;
        },
        /**
         * dummy
         */
        setVelocity: function(x, y, z) {
            this.panner.setVelocity(x, y||0, z||0);

            return this;
        },
        /**
         * dummy
         */
        setOrientation: function(x, y, z) {
            this.panner.setOrientation(x, y||0, z||0);

            return this;
        },

        /**
         * dummy
         * チェーンメソッド用
         */
        setBuffer: function(v) {
            this.buffer = v;
            return this;
        },


        /**
         * dummy
         * チェーンメソッド用
         */
        setLoop: function(v) {
            this.loop = v;
            return this;
        },


        /**
         * dummy
         * チェーンメソッド用
         */
        setVolume: function(v) {
            this.volume = v;
            return this;
        },


        /**
         * チェーンメソッド用
         */
        setPlaybackRate: function(v) {
            this.playbackRate = v;
            return this;
        },

        _load: function(src) {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        self.context.decodeAudioData(xhr.response, function(buffer) {
                            self._setup();
                            self.buffer = buffer;
                            self.loaded = true;
                        });
                    } else {
                        onsole.error(xhr);
                    }
                }
            };
            xhr.open("GET", src, true);
            xhr.responseType = "arraybuffer";
            xhr.send();
        },

        _setup: function() {
            this.source     = this.context.createBufferSource();
//            this.gainNode   = this.context.createGainNode();
            this.panner     = this.context.createPanner();
            this.analyser   = this.context.createAnalyser();

            this.source.connect(this.panner);
            this.panner.connect(this.analyser);
            this.analyser.connect(this.context.destination);
        },

        tone: function(hertz, seconds) {
            // handle parameter
            hertz   = hertz !== undefined ? hertz : 200;
            seconds = seconds !== undefined ? seconds : 1;
            // set default value    
            var nChannels   = 1;
            var sampleRate  = 44100;
            var amplitude   = 2;
            // create the buffer
            var buffer  = this.context.createBuffer(nChannels, seconds*sampleRate, sampleRate);
            var fArray  = buffer.getChannelData(0);
            // fill the buffer
            for(var i = 0; i < fArray.length; i++){
                var time    = i / buffer.sampleRate;
                var angle   = hertz * time * Math.PI;
                fArray[i]   = Math.sin(angle)*amplitude;
            }
            // set the buffer
            this.buffer = buffer;
            return this;    // for chained API
        },
    });

    tm.sound.WebAudio.prototype.accessor("buffer", {
        get: function()  { return this.source.buffer; },
        set: function(v) { this.source.buffer = v; }
    });

    tm.sound.WebAudio.prototype.accessor("loop", {
        get: function()  { return this.source.loop; },
        set: function(v) { this.source.loop = v; }
    });

    tm.sound.WebAudio.prototype.accessor("volume", {
        get: function()  { return this.source.gain.value; },
        set: function(v) { this.source.gain.value = v; }
    });

    tm.sound.WebAudio.prototype.accessor("playbackRate", {
        get: function()  { return this.source.playbackRate.value; },
        set: function(v) { this.source.playbackRate.value = v; }
    });

    tm.sound.WebAudio.isAvailable = tm.global.webkitAudioContext ? true : false;

})();



(function() {

    /**
     * @class   WebAudioマネージャクラス
     * WebAudioを管理するクラス
     */
    tm.sound.WebAudioManager = {
        context: tm.sound.WebAudio.isAvailable ? new webkitAudioContext() : null,
        sounds: {}
    };

    /**
     * @static
     * @method
     * 追加
     */
    tm.sound.WebAudioManager.add = function(name, src) {
        this.sounds[name] = tm.sound.WebAudio(src);
        return this;
    };

    /**
     * @static
     * @method
     * 取得
     */
    tm.sound.WebAudioManager.get = function(name) {
        return this.sounds[name].clone();
    };

    /**
     * @static
     * @method
     * ロードチェック
     */
    tm.sound.WebAudioManager.isLoaded = function() {
        for (var key in this.sounds) {
            if (this.sounds[key].loaded === false) {
                return false;
            }
        }
        return true;
    };

    tm.addLoadCheckList(tm.sound.WebAudioManager);

})();