/*
 * phi
 */

/*
 * グローバル
 */
var app             = null;
var visibleTrace    = true;
var circleList      = [];
var target          = null;

/*
 * 定数
 */
var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 480;
var BOUNCINESS      = 0.8;
var FRICTION        = 0.99;
var GRAVITY         = tm.geom.Vector2(0, 0.8);
var CIRCLE_RADIUS   = 30;
var CIRCLE_MAX_NUM  = 15;
var CIRCLE_PURSUIT_RATE = 0.25;  // 収束率


/*
 * プレロード
 */
tm.preload(function() {
    
});

/*
 * メイン処理
 */
tm.main(function() {
    app = tm.app.CanvasApp("#c");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    // app.resizeWindow();
    app.fitWindow();
    app.background = "rgba(0, 0, 0, 0.25)";
    
    for (var i=0; i<CIRCLE_MAX_NUM; ++i) {
        var circle = Circle();
        app.currentScene.addChild(circle);
        circleList.push(circle);
    }
    
    for (var i=0; i<circleList.length-1; ++i) {
        var target = circleList[i];
        for (var j=i+1; j<circleList.length; ++j) {
            var other = circleList[j];
            target.collision.add(other);
        }
    }
    
    // Stats
    app.enableStats();
    
    // dat.GUI
    var gui = app.enableDatGUI();
    if (gui) {
        gui.add(window, "explode");
        gui.add(window, "visibleTrace").setValue(true).onChange(function(){
            app.background = (visibleTrace) ? "rgba(0, 0, 0, 0.25)" : "rgba(0, 0, 0, 1)";
        });
        gui.add(window, "BOUNCINESS", 0, 1, 0.1);
        gui.add(window, "FRICTION", 0, 1, 0.01);
        
        // gravity フォルダ
        var gravityFolder = gui.addFolder("gravity");
        gravityFolder.add(GRAVITY, "x", -2, 2, 0.1);
        gravityFolder.add(GRAVITY, "y", -2, 2, 0.1);
        gravityFolder.open();
    }
    
    app.update = function() {
        var scene = this.currentScene;
        var key = this.keyboard;
        // ポーズ
        if (key.getKeyDown("space") == true) {
            (scene.isUpdate == true) ? scene.sleep() : scene.wakeUp();
        }
    }
    
    // mdlclick でキャプチャ
    tm.dom.Element(app.getElement()).event.mdlclick(function() {
        app.canvas.saveAsImage();
    });
    
    app.run();
});


window.explode = function() {
    for (var i=0; i<circleList.length; ++i) {
        var circle = circleList[i];
        circle.explode();
    }
};


/*
 * サークルクラス
 */
var Circle = tm.createClass({
    superClass: tm.app.CanvasElement,
    
    init: function() {
        this.superInit(40, 40);
        
        // 位置をセット
        this.x = Math.rand(0, app.width);
        this.y = Math.rand(0, app.height);
        
        // パラメータセット
        this.radius = Math.rand(25, 50);
        this.m      = Math.PI*this.radius*this.radius;  // 面積 = 重さにする
        
        // 表示色設定
        this.colorAngle = Math.rand(0, 360);
        var canvas = document.createElement("canvas");
        var context= canvas.getContext("2d");
        var grad = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
        grad.addColorStop(0.0, "hsla({color}, 65%, 50%, 0.0)".format({color: this.colorAngle}));
        grad.addColorStop(0.95, "hsla({color}, 65%, 50%, 1.0)".format({color: this.colorAngle}));
        grad.addColorStop(1.0, "hsla({color}, 65%, 50%, 0.0)".format({color: this.colorAngle}));
        this.fillStyle  = grad;
        this.strokeStyle= "white";
        this.blendMode  = "lighter";
        
        // マウスやタッチ反応を有効化
        this.interaction;
        
        // 
        this.explode();
    },
    
    update: function(app) {
        // 掴んでいるサークルが自分だった場合
        if (this === target) {
            var p = app.pointing;
            this.position.set(this.x+this.pointing.x, this.y+this.pointing.y);
            this.velocity.set(p.dx, p.dy);
            return ;
        }
        
        this.velocity.mul(FRICTION);
        this.velocity.add(GRAVITY);
        this.position.add(this.velocity);
        
        // 
        var left    = this.radius;
        var right   = app.width-this.radius;
        var top     = this.radius;
        var bottom  = app.height-this.radius;
        if (this.x < left)  { this.x = left;    this.velocity.x*=-1; }
        if (this.x > right) { this.x = right;   this.velocity.x*=-1; }
        if (this.y < top)   { this.y = top;     this.velocity.y*=-1; }
        if (this.y > bottom){ this.y = bottom;  this.velocity.y*=-1; }
    },
    
    draw: function(canvas) {
        canvas.fillCircle(0, 0, this.radius);
    },
    
    explode: function() {
        // 向きをセット
        this.velocity = tm.geom.Vector2.random(0, 360, 32);
    },
    
    oncollisionstay: function(e) {
        var other = e.other;
        var abVec = tm.geom.Vector2.sub(other.position, this.position); // 自分から相手へのベクトル
        var len = abVec.length();
        if (len == 0) return ;
        abVec.normalize();
        var distance = (this.radius + other.radius)-len;    // 自分と相手の距離
        var sinkVec  = tm.geom.Vector2.mul(abVec, distance/2);
        this.position.sub(sinkVec);
        other.position.add(sinkVec);
        
        // 向きベクトルを調整する
        var V   = tm.geom.Vector2;
        var m0  = this.m;
        var m1  = other.m;
        var e   = BOUNCINESS;
        
        var ma = ( (m1 / (m0+m1))*(1+e) ) * V.dot(V.sub(other.velocity,  this.velocity), abVec);
        var mb = ( (m0 / (m0+m1))*(1+e) ) * V.dot(V.sub( this.velocity, other.velocity), abVec);
        
        this.velocity.add( V.mul(abVec, ma) );
        other.velocity.add( V.mul(abVec, mb) );
    },
    
    onmousedown: function() {
        console.log("a");
        target = this;
        this.velocity.set(0, 0);
    },
    
    onmouseup: function() {
        target = null;
    },
});







