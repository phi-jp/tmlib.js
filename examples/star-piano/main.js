/*
 * phi
 */


/*
 * 定数
 */
var CIRCLE_RADIUS   = 30;
var CIRCLE_MAX_NUM  = 15;
var CIRCLE_PURSUIT_RATE = 0.25;  // 収束率

/*
 * グローバル
 */
var app = null;

/*
 * 定数
 */
var SOUND_FILE_LIST = [
    "C3" ,
    "D3" ,
    "E3" ,
    "F3" ,
    "G3" ,
    "A3" ,
    "B3" ,
    "C4" ,
    "pC3",
    "pD3",
    "pF3",
    "pG3",
    "pA3",
];

/*
 * プレロード
 */
tm.preload(function() {
    for (var i=0,len=SOUND_FILE_LIST.length; i<len; ++i) {
        var name = SOUND_FILE_LIST[i];
        tm.sound.SoundManager.add(
            name,
            "../../resource/se/piano/{0}.wav".format(name)
        );
    }
});

/*
 * メイン処理
 */
tm.main(function() {
    app = tm.app.CanvasApp("#c");
    app.fitWindow();
    app.enableStats();
    
    app.currentScene.update = function() {
        var p = app.pointing;
        if (p.getPointingStart() == true) {
            var rand = Math.rand(0, SOUND_FILE_LIST.length-1);
            var key = SOUND_FILE_LIST[rand];
            var star = Star(key);
            star.x = p.x;
            star.y = p.y;
            // star.fillStyle = "hsl(50, 75%, 50%)";
            star.fillStyle = "hsl({0}, 100%, 50%)".format(360/rand);
            this.addChild(star);
        }
    };
    
    app.run();
});


/*
 * スター
 */
var Star = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function(soundKey) {
        this.superInit();
        
        this.soundKey = soundKey;
        this.startAnim();
    },
    
    update: function(app) {
    },
    
    draw: function(canvas) {
        canvas.fillStyle = this.fillStyle;
        canvas.fillStar(0, 0, this.radius, 5);
    },
    
    startAnim: function() {
        this.tweener
            .to({ alpha:0, scaleX:2, scaleY:2, rotation:360 })
            .call(function() {
                this.remove();
            }.bind(this));
        
        // SE 再生
        tm.sound.SoundManager.get(this.soundKey).play();
    },
    
    
    onanimationend: function() {
        this.remove();
        // this.startAnim();
    },
    
});
