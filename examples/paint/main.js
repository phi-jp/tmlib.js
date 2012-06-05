/*
 * phi
 */


window.onload = function() {
    var e = tm.dom.Element("#world");
    var c = tm.graphics.Canvas(e.element);
    c.resizeWindow();
    c.clearColor("white");
    
    c.setLineStyle(8, "round", "round", 10);
    
    // マウス用イベント登録
    var pointX = null, pointY = null;
    
    e.event.pointstart(function(e) {
        // 位置をセット
        pointX = e.pointX; pointY = e.pointY;
        e.stop();
    });
    e.event.pointmove(function(e) {
        // null の時は描画しない
        if (pointX === null || pointY === null) return ;
        
        c.drawLine(pointX, pointY, e.pointX, e.pointY);
        pointX = e.pointX; pointY = e.pointY;
        e.stop();
    });
    e.event.pointend(function(e) {
        // ボタンを押していない時は null をセット
        pointX = pointY = null;
        e.stop();
    });
    
    // ダブルクリックで保存
    e.event.mdlclick( function() { c.saveAsImage(); } );
};
