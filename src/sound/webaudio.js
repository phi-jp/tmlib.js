/*
 * webaudio.js
 */

tm.sound = tm.sound || {};


(function() {

    var context = null;
    if (tm.global.webkitAudioContext) {
        context = new webkitAudioContext();
    } else if (tm.global.mozAudioContext) {
        context = new mozAudioContext();
    } else if (tm.global.AudioContext) {
        context = new AudioContext();
    }

    /**
     * @class tm.sound.WebAudio
     * WebAudioクラス
     * @extends tm.event.EventDispatcher
     */
    tm.sound.WebAudio = tm.createClass({
        superClass: tm.event.EventDispatcher,

        /** loaded */
        loaded: false,
        /** context */
        context: null,
        /** panner */
        panner: null,
        /** volume */
        volume: 0.8,
        /** playing **/
        playing: false,

        _pannerEnabled: true,

        /**
         * @constructor
         */
        init: function(src_or_buffer) {
            this.superInit();

            this.context = context;
            var type = typeof(src_or_buffer);

            if (type==="string") {
                this.loaded = false;
                this._load(src_or_buffer);
            }
            else if (type==="object") {
                this._setup();
                this.buffer = src_or_buffer;
                this.loaded = true;
                this.dispatchEvent( tm.event.Event("load") );
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
            if (this.playing == true) { return ; }
            this.playing = true;

            if (time === undefined) time = 0;

            this.source.start(this.context.currentTime + time);
            
            var self = this;
            var time = (this.source.buffer.duration/this.source.playbackRate.value)*1000;
            window.setTimeout(function() {
                var e = tm.event.Event("ended");
                self.fire(e);
            }, time);

            return this;
        },

        /**
         * 停止
         */
        stop: function(time) {
            if (this.playing == false) { return ; }
            this.playing = false;

            if (time === undefined) time = 0;
            if (this.source.playbackState == 0) {
                return ;
            }
            this.source.stop(this.context.currentTime + time);
            
            var buffer = this.buffer;
            var volume = this.volume;
            var loop   = this.loop;
            
            this.source = this.context.createBufferSource();
            this.source.connect(this.gainNode);
            this.buffer = buffer;
            this.volume = volume;
            this.loop = loop;

            return this;
        },

        /**
         * ポーズ
         */
        pause: function() {
            this.source.disconnect();

            return this;
        },

        /**
         * レジューム
         */
        resume: function() {
            this.source.connect(this.gainNode);

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

        /**
         * @private
         */
        _load: function(src) {
            if (!this.context) return ;

            var self = this;
            tm.util.Ajax.load({
                type: "GET",
                url: src,
                responseType: "arraybuffer",
                success: function(data) {
                    // console.debug("WebAudio ajax load success");
                    self.context.decodeAudioData(data, function(buffer) {
                        console.debug("WebAudio decodeAudioData success");
                        self._setup();
                        self.buffer = buffer;
                        self.loaded = true;
                        self.dispatchEvent( tm.event.Event("load") );
                    });
                }
            });
        },

        /**
         * @private
         */
        _setup: function() {
            this.source     = this.context.createBufferSource();
            this.gainNode   = this.context.createGain();
            this.panner     = this.context.createPanner();
            this.analyser   = this.context.createAnalyser();

            this.source.connect(this.gainNode);
            this.gainNode.connect(this.panner);
            this.panner.connect(this.analyser);
            this.analyser.connect(this.context.destination);

            // TODO 暫定的対応
            if (tm.BROWSER === "Firefox") {
                this.pannerEnabled = false;
            }
        },

        /**
         * トーン
         */
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

    /**
     * @property    buffer
     * バッファー
     */
    tm.sound.WebAudio.prototype.accessor("buffer", {
        get: function()  { return this.source.buffer; },
        set: function(v) { this.source.buffer = v; }
    });

    /**
     * @property    loop
     * ループフラグ
     */
    tm.sound.WebAudio.prototype.accessor("loop", {
        get: function()  { return this.source.loop; },
        set: function(v) { this.source.loop = v; }
    });

    /**
     * @property    valume
     * ボリューム
     */
    tm.sound.WebAudio.prototype.accessor("volume", {
        get: function()  { return this.gainNode.gain.value; },
        set: function(v) { this.gainNode.gain.value = v; }
    });

    /**
     * @property    playbackRate
     * プレイバックレート
     */
    tm.sound.WebAudio.prototype.accessor("playbackRate", {
        get: function()  { return this.source.playbackRate.value; },
        set: function(v) { this.source.playbackRate.value = v; }
    });

    /**
     * @property    pannerEnabled
     * panner有効
     */
    tm.sound.WebAudio.prototype.accessor("pannerEnabled", {
        get: function()  { return this._pannerEnabled; },
        set: function(v) {
            this.gainNode.disconnect();
            this.panner.disconnect();
            if (v) {
                this.gainNode.connect(this.panner);
                this.panner.connect(this.analyser);
            } else {
                this.gainNode.connect(this.analyser);
            }
            this._pannerEnabled = v;

            // console.debug("WebAudio pannerEnabled: " + v);
        }
    });

    /** @static @property */
    tm.sound.WebAudio.isAvailable = (tm.global.webkitAudioContext || tm.global.mozAudioContext || tm.global.AudioContext) ? true : false;

})();



