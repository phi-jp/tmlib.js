/*
 * メイン処理(ページ読み込み後に実行される)
 */
tm.main(function() {
    // アプリケーション作成
    var app = tm.app.CanvasApp("#world");
    app.resizeWindow(); // 画面サイズに合わせる
    app.fitWindow();    // リサイズ対応
    app.background = "rgba(0, 0, 0, 0.1)";  // 背景色をセット
    
    // 星スプライト
    var star = tm.app.Sprite(64, 64);
    star.canvas.setColorStyle("white", "yellow").fillStar(32, 32, 32, 5);
    app.currentScene.addChild(star);    // シーンに追加
    
    // 更新
    app.currentScene.update = function(app) {
        // マウス位置 or タッチ位置に移動
        star.x = app.pointing.x;
        star.y = app.pointing.y;
        // クリック or タッチ中は回転させる
        if (app.pointing.getPointing() == true) { star.rotation += 15; }
    };
    
    // 実行
    app.run();
});