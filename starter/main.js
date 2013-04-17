/*
 * constant
 */
var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 480;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;


/*
 * メイン処理(ページ読み込み後に実行される)
 */
tm.main(function() {
    // アプリケーション作成
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT); // リサイズ
    app.fitWindow();    // 自動フィット
    
    // シーンを切り替える
    app.replaceScene(MainScene());
    
    // 実行
    app.run();
});


tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();

        // 星スプライト
        this.star = tm.app.StarShape(64, 64);
        this.addChild(this.star);    // シーンに追加
    },

    update: function(app) {
        var p = app.pointing;
        // マウス位置 or タッチ位置に移動
        this.star.x = p.x;
        this.star.y = p.y;
        // クリック or タッチ中は回転させる
        if (app.pointing.getPointing() == true) {
            this.star.rotation += 15;
        }
    },
});
