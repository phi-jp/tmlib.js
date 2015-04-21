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
            var origin = tm.asset.Manager.get(name);
            if (origin == null) {
                console.warn('not found ' + name);
                return ;
            }
            var sound = origin.clone();

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
        playMusic: function(name, fadeTime, loop) {
            if (this.currentMusic) {
                this.stopMusic(fadeTime);
            }

            var origin = tm.asset.Manager.get(name);
            if (origin == null) {
                console.warn('not found ' + name);
                return ;
            }
            var music = origin.clone();

            music.setLoop(true);
            music.volume = this.getVolumeMusic();
            music.play();

            if (fadeTime > 0) {
                var count = 32;
                var counter = 0;
                var unitTime = fadeTime/count;
                var volume = this.getVolumeMusic();

                music.volume = 0;
                var id = setInterval(function() {
                    counter += 1;
                    var rate = counter/count;
                    music.volume = rate*volume;

                    if (rate >= 1) {
                        clearInterval(id);
                        return false;
                    }

                    return true;
                }, unitTime);
            }
            else {
                music.volume = this.getVolumeMusic();
            }

            this.currentMusic = music;

            return this.currentMusic;
        },

        /*
         * 音楽を停止
         */
        stopMusic: function(fadeTime) {
            if (!this.currentMusic) { return ; }

            var music = this.currentMusic;

            if (fadeTime > 0) {
                var count = 32;
                var counter = 0;
                var unitTime = fadeTime/count;
                var volume = this.getVolumeMusic();

                music.volume = 0;
                var id = setInterval(function() {
                    counter += 1;
                    var rate = counter/count;
                    music.volume = volume*(1-rate);

                    if (rate >= 1) {
                        music.stop();
                        clearInterval(id);
                        return false;
                    }

                    return true;
                }, unitTime);
            }
            else {
                this.currentMusic.stop();
            }
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

