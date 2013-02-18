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

        _playingSources: [],

        /**
         *　初期化
         */
        init: function(src_or_buffer) {
            this.context = tm.sound.WebAudioManager.context;

            if (typeof(src_or_buffer)==="string") {
                this._load(src_or_buffer);
            }
            else {
                this.buffer = src_or_buffer;
                this.loaded = true;
                this._setup();
            }
        },

        /**
         * 再生
         */
        play: function() {
            this.source.gain.value = this.volume;

            if (this.source.start) {
                this.source.start(0);
            } else {
                this.source.noteOn(0);
            }
        },

        /**
         * 停止
         */
        stop: function() {
            if (this.source.stop) {
                this.source.stop(0);
            } else {
                this.source.noteOff(0);
            }
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
        },
        /**
         * dummy
         */
        setVelocity: function(x, y, z) {
            this.panner.setVelocity(x, y||0, z||0);
        },
        /**
         * dummy
         */
        setOrientation: function(x, y, z) {
            this.panner.setOrientation(x, y||0, z||0);
        },

        _load: function(src) {
            var xhr = new XMLHttpRequest();
            var self = this;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        self.context.decodeAudioData(xhr.response, function(buffer) {
                            self.buffer = buffer;
                            self.loaded = true;
                            self._setup();
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
            this.source = this.context.createBufferSource();
            this.panner     = this.context.createPanner();
            this.analyser   = this.context.createAnalyser();

            this.source.buffer = this.buffer;
            
            this.source.connect(this.panner);
            this.panner.connect(this.context.destination);

            this.source.gain.value = this.volume;

            this.source.connect(this.analyser);
            this.analyser.connect(this.context.destination);
        }
    });
    
})();



(function() {

    /**
     * @class   WebAudioマネージャクラス
     * WebAudioを管理するクラス
     */
    tm.sound.WebAudioManager = {
        context: tm.global.webkitAudioContext ? new webkitAudioContext() : null,
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

