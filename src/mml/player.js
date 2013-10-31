/*
 * player.js
 */

tm.mml = tm.mml || {};


(function() {

    /*
     * 音色
     *
     * 0 sin
     * 1 upward saw
     * 2 downward saw
     * 3 triangle
     * 4 rectangle
     * 5 white noise
     * 6 noise
     */
    var timberFuncList = [
        Math.sin,
        function(p){ return p/Math.PI-1; },
        function(p){ return 1-p/Math.PI; },
        function(p){ p *= 2/Math.PI; return p<1 ? p : p<3 ? 2-p : p-4; },
        function(p){ return p<Math.PI ? 1 : -1; },
        function(p){ return Math.random() * 2 - 1; },
        (function(){
            var pp = 1, c = 5, r = 0.05;
            return function(p){
                if(!p) c = 5;
                if(!c--) r = p<0 ? -p : p;
                return pp = (Math.random() < r ? -pp : pp);
            };
        })()
    ];

    timberFuncList[9] = function() {

    }

    var fadeFuncList = [
      function(j){ return j<0.8 ? 1 : (1-j)/(1-0.8); },
      function(j){ return 1-j; },
      function(j){ return 1; }
    ];


    var frequency = (function() {
        var k0 = { c: -9, d: -7, e: -5, f: -4, g: -2, a: 0, b: 2 };
        var k1 = { '+': 1, '#': 1, '': 0, '-': -1 };
        return function(h, sign, oct) {
            return 13.75 * Math.pow(2, (k0[h] + k1[sign]) / 12 + (oct || 0));
        };
    })();


    /**
     * @class tm.mml.Driver
     * MML Player
     */
    tm.mml.Driver = {
        /**
         * コンパイル
         */
        compile: function(source) {
            var buffer = new Array();
            var trackList = source.split(';');
            var trackNum = trackList.length;

            var sampleRate = 22050;

            for(var track = 0; track < trackNum; track++){
                var cfg = {
                    loopStart: [],
                    loop: [],
                };
                var pos = 0;
                var timberFunc = timberFuncList[0];
                var fadeFunc  = fadeFuncList[0];
                var volume = 16;
                var octave = 5; // オクターブ
                var sndLen = 4;
                var tempo = 120;
                var re = new RegExp(/([a-z<>\[\]()@])([-+#]?)(\d*)/g);
                var s;
                while(s = re.exec(trackList[track])){
                    var val = s[3] | 0;
                    var freq, len;

                    switch(s[1]){
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                        case 'g':
                        case 'a':
                        case 'b':
                            freq = frequency(s[1], s[2], octave);
                            len = val || sndLen;
                            len = sampleRate * // sample/sec
                                  60 * // sec/min
                                  4 / // 四分音符/小節
                                  tempo / // 四分音符/min
                                  len; // 小節

                            for (var i=0; i<len; ++i) {
                                var index = pos + i | 0;
                                var p = 2 * Math.PI * (freq * i / sampleRate % 1);
                                if(buffer.length <= index) {
                                    buffer[index] = 0;
                                }
                                buffer[index] += volume / 16 * timberFunc(p) * fadeFunc((i/len)) / trackNum;
                            }
                            pos += len;

                            break;
                        case 'r':
                            len = (val || sndLen);
                            len = sampleRate * 60 * 4 / tempo / len;
                            for (var i=0; i<len; ++i) {
                                var index = pos + i | 0;
                                if(buffer.length <= index) {
                                    buffer[index] = 0;
                                }
                            }
                            pos += len;
                            break;
                        case '<': octave +=  val || 1; break;
                        case '>': octave -=  val || 1; break;
                        case 'l': if (val) sndLen = val; break;
                        case 't': if (val) tempo = val; break;
                        case 'v': if (val) volume = val; break;
                        case 'o': if (val) octave = val; break;
                        case '@': timberFunc = timberFuncList[val] || timberFuncList[0]; break;
                        default: break;
                    }
                }
            }

            // set buffer
            var channel = 1;
            var ctx = new webkitAudioContext();
            node = ctx.createBufferSource();
            node.buffer = ctx.createBuffer(channel, buffer.length, sampleRate);
            node.buffer.getChannelData(0).set(buffer);
            compiled = true;

            // node.connect(ctx.destination);
            // node.noteOn(0);

            var sound = tm.sound.WebAudio();
            sound.buffer = ctx.createBuffer(channel, buffer.length, sampleRate);
            sound.buffer.getChannelData(0).set(buffer);

            //? これやんないと何故か雑音が交じる
            sound.panner.coneInnerAngle = 0;


            return sound;
        }
    };

})();

