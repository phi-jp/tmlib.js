/*
 * phi
 */


var app = null;

/*
 * 定数(パラメータ)
 */
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 720;
var CIRCLE_RADIUS   = 5;
var CIRCLE_NUM      = 100;
var TAP_RANGE       = 150;
var TITLE_LIST      = [ "赤ちゃん", "素人", "プロ", "変態", "ネ申" ];
var UI_DATA = {
    TITLE_SCENE: {
        children: [
            {
                type:"tm.display.Label",name:"titleLabel",
                x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2-170,width:SCREEN_WIDTH,fillStyle:"white",
                text:"Enclose Circle",fontSize:60,align:"center",baseline:"middle"
            },
            {
                type:"tm.ui.LabelButton",name:"startButton",
                x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2+40,width:140,
                fillStyle:"white",shadowColor:"#00f",shadowBlur:16,
                text:"Start",fontSize:40,align:"center",baseline:"middle"
            },
            {
                type:"tm.ui.LabelButton",name:"tweetButton",
                x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2+100,width:140,
                fillStyle:"white",shadowColor:"#00f",shadowBlur:16,
                text:"Tweet",fontSize:40,align:"center",baseline:"middle"
            },
            {
                type:"tm.ui.LabelButton",name:"rankingButton",
                x:SCREEN_WIDTH/2,y:SCREEN_HEIGHT/2+160,width:140,
                fillStyle:"white",shadowColor:"#00f",shadowBlur:16,
                text:"Ranking",fontSize:40,align:"center",baseline:"middle"
            },
        ]
    },
    RESULT_SCENE: {
        children: [
            {
                type:"tm.display.Label",name:"scoreLabel",
                x:SCREEN_WIDTH/2, y:300, width:SCREEN_WIDTH,
                fillStyle:"white",
                text:"Score:", fontSize: 30, align:"center",
            },
            {
                type:"tm.display.Label",name:"titleLabel",
                x:SCREEN_WIDTH/2, y:350, width:SCREEN_WIDTH,
                fillStyle:"white",
                text:"Title:", fontSize: 30, align:"center",
            },
            {
                type:"tm.ui.LabelButton",name:"backButton",
                x:SCREEN_WIDTH-100,y:SCREEN_HEIGHT-50,width:160,height:50,
                fillStyle:"white",shadowColor:"#00f",shadowBlur:16,
                text:"Back Title",fontSize:25
            },
        ]
    },
    
};


var ASSETS = {
    "touch": "touch.wav",
    "decide": "decide.wav",
};

/*
 * メイン
 */
tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fps = 30;
    app.fitWindow();
    // app.enableStats();

    var loading = tm.app.LoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
    });

    app.replaceScene(loading);
    
    app.run();
});



/*
 * サークルクラス
 */
var Circle = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function(color) {
        this.superInit(CIRCLE_RADIUS+15, CIRCLE_RADIUS+15);
        
        this.radius     = CIRCLE_RADIUS;
        this.alpha      = 0.75;
        this.v          = tm.geom.Vector2.random(0, 360, tm.util.Random.randfloat(4, 8));
        
        // 移動範囲制御用矩形
        this.worldRect = tm.geom.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        this.worldRect.padding(this.radius);
        
        // 描画
        this.canvas
            .setColorStyle("white", color).setLineStyle(2)
            .setTransformCenter()
            .fillCircle(0, 0, this.radius).strokeCircle(0, 0, this.radius+1);
    },
    
    update: function() {
        this.position.add(this.v);
        
        // 画面からはみ出ないよう制御
        if      (this.worldRect.left   > this.x) { this.x = this.worldRect.left;   this.v.x*=-1; }
        else if (this.worldRect.right  < this.x) { this.x = this.worldRect.right;  this.v.x*=-1; }
        if      (this.worldRect.top    > this.y) { this.y = this.worldRect.top;    this.v.y*=-1; }
        else if (this.worldRect.bottom < this.y) { this.y = this.worldRect.bottom; this.v.y*=-1; }
    },
    
    disappear: function() {
        this.update = null;
        var duration = tm.util.Random.randint(500, 1500);
        this.tweener
            .to({
                scaleX: 4,
                scaleY: 4,
                alpha: 0.0
            }, duration)
            .call(function() {
                this.remove();
            }.bind(this));
    },
    
});

/*
 * タップエフェクトクラス
 */
var TapEffect = tm.createClass({
    superClass: tm.app.Shape,
    
    init: function(radius) {
        this.superInit(TAP_RANGE*2+15, TAP_RANGE*2+15);
        
        this.radius = radius;
        
        // 描画
        this.canvas
            .setColorStyle("white", "white").setLineStyle(2)
            .setShadow("blue", 0, 0, 8)
            .setTransformCenter()
            .strokeCircle(0, 0, this.radius);
        
        this.tweener.fadeOut(1000).call(function() {
            this.remove();
        }.bind(this));
    },
});

/*
 * メインシーンクラス
 */
var MainScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        this.circleList = [];
        
        for (var i=0; i<CIRCLE_NUM; ++i) {
            var circle = Circle( "hsla({0}, 75%, 50%, 0.75)".format(Math.rand(0, 360)) );
            circle.setPosition(tm.util.Random.randint(CIRCLE_RADIUS, SCREEN_WIDTH-CIRCLE_RADIUS), tm.util.Random.randint(CIRCLE_RADIUS, SCREEN_HEIGHT-CIRCLE_RADIUS));
            circle.addChildTo(this);
            this.circleList.push(circle);
        }
        
        app.frame = 0;
        app.score = 0;
    },
    
    update: function(app) {
        var p = app.pointing;
        
        if (p.getPointingStart()) {
            tm.asset.AssetManager.get("touch").clone().play();
            // タップエフェクト
            TapEffect(TAP_RANGE).addChildTo(this).setPosition(p.x, p.y);
            // 衝突判定
            for (var i=0,len=this.circleList.length; i<len; ++i) {
                var circle = this.circleList[i];
                var d = tm.geom.Vector2.distanceSquared(p.position, circle.position);
                if (d < TAP_RANGE*TAP_RANGE) {
                    app.score += 100;
                    circle.disappear();
                }
                circle.update = function() {};
            }
            this.update = this.wait;
            this.update = function() {};

            this.timeline.call(function() {
                app.replaceScene(ResultScene());
            }, 1000);
        };
    },
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});

/*
 * タイトルシーンクラス
 */
var TitleScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        // 背景
        for (var i=0; i<20; ++i) {
            this.circle = Circle( "hsla({0}, 75%, 50%, 0.5)".format(Math.rand(0, 360)) );
            this.circle.setPosition(tm.util.Random.randint(40, SCREEN_WIDTH-40), tm.util.Random.randint(40, SCREEN_HEIGHT-40));
            this.circle.addChildTo(this);
        }
        
        
        // UI
        var group = tm.display.CanvasElement().addChildTo(this);
        group.fromJSON(UI_DATA.TITLE_SCENE);

        // ゲームスタート
        group.startButton.onpointingstart = function() {
            this.dispatchEvent(tm.event.Event("startbuttondown"));
        }.bind(this);
        // ツイート
        group.tweetButton.onpointingstart = function() {
            window.open(tm.social.Twitter.createURL({
                type    : "tweet",
                text    : "『Enclose Circle』\ntmlib.js を使ってミニゲームを作りました. 10 秒で遊べるシンプルなゲームだよん♪",
                hashtags: "enclosecircle,tmlibjs",
                url     : "http://phi1618.github.com/tmlib.js/examples/enclose-circle/index.html",
            }), "_self");
        };
        // ランキング
        group.rankingButton.onpointingstart = function() {
            window.open("https://twitter.com/#!/search/%23enclosecircle%23tmlibjs", "_self");
        };
        
        // フェード
        this.alpha = 0;
        this.tweener.fadeIn();
    },
    
    onstartbuttondown: function(e) {
        tm.asset.AssetManager.get("decide").clone().play();

        this.tweener.clear();
        this.tweener
            .fadeOut(500)
            .call(function() {
                app.replaceScene(MainScene());
            });
    },
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});

/*
 * リザルトシーンクラス
 */
var ResultScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        
        // 称号
        var titleIndex = Math.min( Math.floor(app.score/1000), TITLE_LIST.length-1 );
        var title = TITLE_LIST[titleIndex];
        
        
        // 背景
        for (var i=0; i<20; ++i) {
            this.circle = Circle( "hsla({0}, 75%, 50%, 0.5)".format(Math.rand(0, 360)) );
            this.circle.setPosition(tm.util.Random.randint(40, SCREEN_WIDTH-40), tm.util.Random.randint(40, SCREEN_HEIGHT-40));
            this.circle.addChildTo(this);
        }
        
        // UI
        var group = tm.display.CanvasElement().addChildTo(this);
        group.fromJSON(UI_DATA.RESULT_SCENE);
        group.scoreLabel.text += app.score;    // スコアをセット
        group.titleLabel.text += title;
        group.backButton.onpointingstart = function() {
            this.dispatchEvent(tm.event.Event("backbuttondown"));
        }.bind(this);
        // tweet url
        var msg = "『{gameTitle}』\nScore:{score}, 称号:{title}".format({
            gameTitle: document.title,
            score: app.score,
            title: title,
        });
        var url = tm.social.Twitter.createURL({
            type    : "tweet",
            text    : msg,
            hashtags: "enclosecircle,tmlibjs",
            url     : "http://phi1618.github.com/tmlib.js/examples/enclose-circle/index.html",
        });
        // ツイートボタン
        var tweetButton = tm.ui.GlossyButton(150, 50, "blue", "Tweet").addChildTo(this);
        tweetButton.setPosition(SCREEN_WIDTH/2, 470);
        tweetButton.onpointingstart = function() { window.open(url, "_self"); };
        
        
        // フェード
        this.alpha = 0.0;
        this.tweener.fadeIn();
    },
    
    onbackbuttondown: function() {
        tm.asset.AssetManager.get("decide").clone().play();
        
        var shape = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        shape.originX = shape.originY = 0;
        shape.canvas.clearColor("#fff");
        shape.blendMode = "lighter";
        shape.alpha = 0;

        shape.tweener
            .fadeIn(500)
            .call(function() {
                app.replaceScene(TitleScene());
            });
    },
    
    _onpointingstart: function() {
        tm.sound.SoundManager.get("decide").play();
        
        var fadeout = tm.fade.FadeOut(SCREEN_WIDTH, SCREEN_HEIGHT, "#fff", 500, function() {
            app.replaceScene(StartScene());
        });
        fadeout.blendMode = "lighter";
        this.addChild( fadeout );
    },
    
    onblur: function() {
        app.pushScene(PauseScene());
    }
    
});

/*
 * ポーズシーンクラス
 */
var PauseScene = tm.createClass({
    superClass: tm.app.Scene,
    
    init: function(color) {
        this.superInit();
        
        var filter = tm.app.Shape(SCREEN_WIDTH, SCREEN_HEIGHT);
        filter.setPosition(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
        filter.canvas.clearColor("rgba(0, 0, 0, 0.75)");
        this.addChild(filter);
        
        app.stop();
    },
    
    onfocus: function() { app.start(); },
    
    onblur: function() { app.stop(); },
    
    onpointingstart: function() {
        tm.sound.SoundManager.get("main_bgm").play();
        app.popScene();
    },
});





