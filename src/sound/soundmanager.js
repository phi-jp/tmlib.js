/*
 * soundmanager.js
 */

;(function() {

    /*
     * tm.sound.SoundManager
     * ### Ref
     * - http://evolve.reintroducing.com/_source/classes/as3/SoundManager/SoundManager.html
     * - https://github.com/nicklockwood/SoundManager
     */
    tm.sound.SoundManager = {
        volume: 0.8,
        musicVolume: 0.8,
        muteFlag: false,
        currentMusic: null,

        /*
         * 再生
         */
        play: function(name, volume, startTime, loop) {
            var sound = tm.asset.Manager.get(name).clone();

            sound.volume = this.getVolume();
            sound.play();

            return sound;
        },
        stop: function() {
            // TODO: 
        },
        pause: function() {
            // TODO: 
        },
        fade: function() {
            // TODO: 
        },
        setVolume: function(volume) {
            this.volume = volume;
        },
        getVolume: function() {
            return this.isMute() ? 0 : this.volume;
        },
        /*
         * ミュート(toggle)
         */
        mute: function() {
            this.muteFlag = (this.muteFlag === true) ? false : true;

            if (this.currentMusic) {
                this.currentMusic.volume = this.getVolumeMusic();
            }

            return this;
        },
        isMute: function() {
            return this.muteFlag;
        },

        /*
         * 音楽を再生
         */
        playMusic: function(name, loop, fade) {
            if (this.currentMusic) {
                this.stopMusic();
            }

            var music = tm.asset.Manager.get(name).clone();

            music.setLoop(true);
            music.volume = this.getVolumeMusic();
            music.play();

            if (fade === true || fade === undefined) {
                var time = 0;
                var volume = this.getVolumeMusic();

                music.volume = 0;
                var id = setInterval(function() {
                    time += 1;
                    var rate = time/10;
                    music.volume = rate*volume;

                    if (time >= 10) {
                        clearInterval(id);
                        return false;
                    }

                    return true;
                }, 100);
            }
            else {
                music.volume = this.getVolumeMusic();
            }
            this.currentMusic

            this.currentMusic = music;
            return this.currentMusic;
        },
        /*
         * 音楽を停止
         */
        stopMusic: function() {
            if (!this.currentMusic) { return ; }
            this.currentMusic.stop();
        },
        /*
         * 音楽を一時停止
         */
        pauseMusic: function() {
            if (!this.currentMusic) { return ; }
            this.currentMusic.pause();
        },
        /*
         * 音楽を再開
         */
        resumeMusic: function() {
            if (!this.currentMusic) { return ; }
            this.currentMusic.resume();
        },
        /*
         * 音楽のボリュームを設定
         */
        setVolumeMusic: function(volume) {
            this.musicVolume = volume;
            if (this.currentMusic) {
                this.currentMusic.volume = volume;
            }

            return this;
        },
        /*
         * 音楽のボリュームを取得
         */
        getVolumeMusic: function(volume) {
            return this.isMute() ? 0 : this.musicVolume;
        },
    };

})();

