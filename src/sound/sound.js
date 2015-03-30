/*
 * sound.js
 */

tm.sound = tm.sound || {};


(function() {
    
    tm.sound.globalVolume = 1.0;
    
})();


(function() {
    
    /**
     * @class tm.sound.Sound
     * サウンドクラス
     */
    tm.sound.Sound = tm.createClass({
        superClass: tm.event.EventDispatcher,

        /** element */
        element     : null,
        /** loaded */
        loaded      : false,
        /** isPlay */
        isPlay      : false,
        
        /**
         * @constructor
         */
        init: function(src) {
            this.superInit();
            
            this.element = new Audio();
            this.element.src = src;
            this.element.load();
            this.element.setAttribute("preload", "auto");
            
            var self = this;
            this.element.addEventListener("canplaythrough", function(){
                self.loaded = true;
                self.fire(tm.event.Event("load"));
            });
            this.element.addEventListener("ended", function(){
                self.isPlay = false;
            });
            this.element.addEventListener("error", function(){
                console.warn(this.src + "の読み込みに失敗しました");
            });
            
            this.element.volume = 1.0;
            
            //? モバイル系は音が不安定なので一時対応
            if (tm.isMobile) {
                this.loaded = true;
            }
        },
        
        /**
         * 再生
         */
        play: function() {
            this.element.play();
            this.isPlay = true;
            return this;
        },
        
        /**
         * 停止
         */
        stop: function() {
            this.element.pause();
            //? スマホだと止まるので応急対応
            if (!tm.isMobile) {
                this.element.currentTime = 0;
            }
            this.isPlay = false;
            return this;
        },
        
        /**
         * 一時停止
         */
        pause: function() {
            this.element.pause();
            return this;
        },
        
        /**
         * クローン
         */
        clone: function() {
            return tm.sound.Sound( this.element.src );
        },
        
    });
    
    
    
    /**
     * @property    volume
     * ボリューム
     */
    tm.sound.Sound.prototype.accessor("volume", {
        "get": function() { return this.element.volume; },
        "set": function(v){ this.element.volume = v; }
    });
    
    
    if ((new Audio()).loop !== undefined) {
    
        /**
         * @property    loop
         * ループフラグ
         */
        tm.sound.Sound.prototype.accessor("loop", {
            "get": function() { return this.element.loop; },
            "set": function(v){ this.element.loop = v; }
        });
    }
    // firefox 対応
    else {
        var onLoopFunc = function() {
            this.play();
        }
        tm.sound.Sound.prototype.accessor("loop", {
            "get": function() { return this.element.loop; },
            "set": function(v){
                // ループが false の状態で ture が来た場合ループ用関数を登録する
                if (this.element.loop != true && v == true) {
                    this.element.addEventListener("ended", onLoopFunc, false);
                }
                // 関数が登録されていて false が設定された場合ループ用関数を解除する
                else if (this.element.loop == true && v == false) {
                    this.element.removeEventListener("ended", onLoopFunc, false);
                }
                this.element.loop = v;
            }
        });
    }
    
    
    /**
     * @static
     * サポートしている拡張子
     */
    tm.sound.Sound.SUPPORT_EXT = (function(){
        var ext     = "";
        var audio   = new Audio();
        
        if      (audio.canPlayType("audio/wav") == 'maybe') { ext="wav"; }
        else if (audio.canPlayType("audio/mp3") == 'maybe') { ext="mp3"; }
        else if (audio.canPlayType("audio/ogg") == 'maybe') { ext="ogg"; }
        
        return ext;
    })();
    
})();
