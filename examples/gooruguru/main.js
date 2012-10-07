/*
 * phi
 */


var app = null;

/*
 * 定数(パラメータ)
 */
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 720;



/*
 * メイン
 */
tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fps = 30;
    app.fitWindow();
    // app.enableStats();
    
    app.background = "rgba(0, 0, 0, 0.5)";
    
    var circle = tm.app.Shape(64, 64).addChildTo(app.currentScene);
    circle.canvas.setFillStyle("red").setTransformCenter().fillCircle(0, 0, 30);
    var angle = 0;
    var len   = 100;
    
    app.currentScene.update = function() {
        var p = app.pointing;
        var k = app.keyboard;
        var basePos = p.position.clone();
        var angleV  = tm.geom.Vector2().setDegree(angle, len)
        
        basePos.add( angleV );
        
        if (p.getPointing() === true) {
            len += k.getKey("shift") ? -10 : 10;
        }
        
        circle.position.setObject(basePos);
        
        angle += 10;
    };
    
    app.run();
});

