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

        /**
         * ボリューム
         */
        volume: 1.0,

        _playingSources: [],

        /**
         *　初期化
         */
        init: function(src) {
            this.context = tm.sound.WebAudioManager.context;
            if (src) {
                this._load(src);
            }
        },

        /**
         * 再生
         */
        play: function() {
            var source = this.context.createBufferSource();
            source.buffer = this.buffer;
            source.connect(this.context.destination);
            source.gain.value = this.volume;
            if (source.start) {
                source.start(0);
            } else {
                source.noteOn(0);
            }

            this._playingSources.push(source);
        },

        /**
         * 停止
         */
        stop: function() {
            for (var i = this._playingSources.length; i--; ) {
                var source = this._playingSources[i]
                if (source.stop) {
                    source.stop(0);
                } else {
                    source.noteOff(0);
                }
            }
            this._playingSources.splice(0);
        },

        /**
         * 複製
         */
        clone: function() {
            var c = tm.sound.WebAudio();
            c.loaded = true;
            c.buffer = this.buffer;
            c.volume = this.volume;
            return c;
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
                        });
                    } else {
                        onsole.error(xhr);
                    }
                }
            };
            xhr.open("GET", src, true);
            xhr.responseType = "arraybuffer";
            xhr.send();
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
        return this.sounds[name];
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

