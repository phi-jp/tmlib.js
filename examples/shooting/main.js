/*
 * phi
 */


/*
 * 定数
 */
var SCREEN_WIDTH = 720;
var SCREEN_HEIGHT= 480;

var CIRCLE_RADIUS   = 30;
var CIRCLE_MAX_NUM  = 15;
var CIRCLE_PURSUIT_RATE = 0.25;  // 収束率

/*
 * グローバル
 */
var app = null;
var pad = null;
var player = null;
var bulletGroup = null;
var enemyGroup  = null;
var attackButton = null;

var playerImage = (function(){
    var c = tm.graphics.Canvas();
    c.width = c.height = 40;
    c.setTransformCenter();
    c.setLineStyle(2, "round", "round");
    c.setColorStyle("white", "rgba(200, 200, 200, 0.9)");
    c.fillPolygon(0, 0, 20, 3, 0);
    c.strokePolygon(0, 0, 20, 3, 0);
    
    return c;
})();

var enemyImage = (function(){
    var c = tm.graphics.Canvas();
    c.width = c.height = 40;
    c.setTransformCenter();
    c.setLineStyle(1.5, "round", "round");
    c.setColorStyle("white", "rgb(255, 50, 50)");
    c.fillStar(0, 0, 20, 16, 0.6);    
    c.strokeStar(0, 0, 20, 16, 0.6);
    return c;
})()

var bulletImage = (function(){
    var c = tm.graphics.Canvas();
    c.width = c.height = 10;
    c.setTransformCenter();
    c.setColorStyle("white", "white");
    c.fillCircle(0, 0, 5);
    
    return c;
})();


/*
 * プレロード
 */
tm.preload(function() {
    tm.sound.SoundManager.add("bgm", "bgm/Loop_35", 1);
    tm.sound.SoundManager.add("shot", "se/chargeshot"); 
    tm.sound.SoundManager.add("crash", "se/crash21");   
});

/*
 * メイン処理
 */
tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fps = 30;
    app.fitWindow();
    app.enableStats();
    app.score = 0;
    
    // プレイヤー生成
    player = Player();
    player.x = 30;
    player.y = 220;
    app.currentScene.addChild(player);
    
    // 弾用グループ
    bulletGroup = tm.app.CanvasElement();
    app.currentScene.addChild(bulletGroup);
    
    // 敵用グループ
    enemyGroup = tm.app.CanvasElement();
    app.currentScene.addChild(enemyGroup);
    enemyGroup.update = function(app) {
        if (app.frame % 30 == 0) {
            var enemy = Enemy();
            enemy.position.set(SCREEN_WIDTH+40, Math.rand(20, SCREEN_HEIGHT-20));
            enemyGroup.addChild( enemy );
        }
    }
    
    // パッド生成
    pad = tm.app.Pad();
    pad.position.set(80, app.height-80);
    app.currentScene.addChild(pad);

    attackButton = tm.app.GlossyButton(100, 60, "blue", "Attack").addChildTo(app.currentScene);
    attackButton.x = SCREEN_WIDTH - 100;
    attackButton.y = SCREEN_HEIGHT - 60;
    attackButton.onpointingstart = function() {
        var bullet = Bullet();
        bullet.position.set(player.x+20, player.y);
        bulletGroup.addChild( bullet );
        // SE 再生
        tm.sound.SoundManager.get("shot").play();
    };

    // スコア生成
    var score = tm.app.Label("Score : " + app.score.padding(3, ' '));
    score.position.set(SCREEN_WIDTH-20, 20);
    score.align     = "end";
    score.baseline  = "top";
    score.width = 320;
    app.currentScene.addChild(score);
    
    app.currentScene.update = function() {
        score.text = "Score : " + app.score.padding(3, ' ');
    };
    
    app.update = function() {
        var scene = this.currentScene;
        var key = this.keyboard;
        // ポーズ
        if (key.getKeyDown("space") == true) {
            (scene.isUpdate == true) ? scene.sleep() : scene.wakeUp();
            bgm.stop();
        }
        
        // ショット
        if (app.keyboard.getKeyDown("Z")) {
            var bullet = Bullet();
            bullet.position.set(player.x+20, player.y);
            bulletGroup.addChild( bullet );
            // SE 再生
            tm.sound.SoundManager.get("shot").play();
        }
    }
    
    // mdlclick でキャプチャ
    tm.dom.Element(app.getElement()).event.mdlclick(function() {
        app.canvas.saveAsImage();
    });
    
    app.run();
    
    // bgm 再生
    var bgm = tm.sound.SoundManager.get("bgm");
    bgm.loop = true;
    bgm.play();
});







/*
 * プレイヤー
 */
var Player = tm.createClass({
    superClass: tm.app.Sprite,
    
    init: function() {
        this.superInit(40, 40);
        
        this.image = playerImage;
        this.velocity = tm.geom.Vector2(0, 0);
        this.speed  =  0;               // スピード
        
    },
    
    update: function(app) {
        // キーボードによる速度設定
        var angle = app.keyboard.getKeyAngle();
        if (angle != null) {
            this.velocity.setDegree( angle, 1 );
            this.velocity.y *= -1;
            this.speed      = 8;
        }
        
        if (pad.isTouching) {
            this.velocity = pad.direction;
            this.speed    = 8;
        }
        
        // マウスによる移動
        /*
        var p = app.pointing;
        if (p.getPointing()) {
            this.velocity.x = p.x - this.position.x;
            this.velocity.y = p.y - this.position.y;
            if (this.velocity.lengthSquared() > 20*20) {
                this.speed = 8;
            }
            this.velocity.normalize();
        }
        */
        
        // 移動
        if (this.velocity.length() > 0.2) {
            this.position.add( tm.geom.Vector2.mul(this.velocity, this.speed) );
        }
        
        // 摩擦的な
        this.speed *= 0.5;
    }
});

/*
 * エネミー
 */
var Enemy = tm.createClass({
    
    superClass: tm.app.Sprite,
    // 初期化
    init: function() {
        // 親のコンストラクタを実行
        this.superInit(40, 40, enemyImage);
        
        this.velocity = tm.geom.Vector2(0, 0);  // 速度
        this.radius = 20;                       // 半径
    },
    
    // 更新
    update: function() {
        this.x -= 4;
        this.rotation -= 4;
        if (this.x < -30) { this.remove(); }
        if (this.destroy == true) {
            this.remove();
        }
    }
    
});

/*
 * 弾
 */
var Bullet = tm.createClass({
    
    superClass: tm.app.Sprite,
    
    init: function() {
        // 親のコンストラクタを実行
        this.superInit(10, 10);
        
        this.image = bulletImage;
        this.velocity = tm.geom.Vector2(0, 0);  // 速度
        this.radius = 5;                        // 半径
    },
    
    update: function() {
        this.x += 16;
        if (this.x >= SCREEN_WIDTH+30) {
            this.remove();
        }
        if (this.destroy == true) {
            this.remove();
        }
        
        // 敵との衝突判定
        for (var i=0; i<enemyGroup.children.length; ++i) {
            var enemy = enemyGroup.children[i];
            if (this.isHitElement(enemy) == true) {
                this.remove();
                enemy.remove();
                
                var crash = Crash(enemy.x, enemy.y);
                app.currentScene.addChild(crash);
                
                // スコア加算
                app.score += 100;
                
                // SE 再生
                tm.sound.SoundManager.get("crash").play();
                
                break;
            }
        }
        
    }
    
});

/*
 * クラッシュ
 */
var Crash = tm.createClass({
    
    superClass: tm.app.CanvasElement,
    
    init: function(x, y) {
        // 親のコンストラクタを実行
        this.superInit();
        this.x = x;
        this.y = y;
        this.timer = 30;
        
        var self = this;
        for (var i=0; i<16; ++i) {
            var particle = tm.app.Sprite(40, 40);
            particle.scaleX = particle.scaleY = 0.5;
            particle.v = tm.geom.Vector2.random(0, 360, 2);
            particle.image = enemyImage;
            particle.blendMode = "lighter";
            particle.update = function() {
                this.x += this.v.x;
                this.y += this.v.y;
                this.v.mul(0.95);
                this.alpha = (self.timer/30.0);
            }
            this.addChild(particle);
        }
    },
    
    update: function() {
        this.timer -= 1;
        if (this.timer <= 0) {
            this.remove();
        }
    }
});
