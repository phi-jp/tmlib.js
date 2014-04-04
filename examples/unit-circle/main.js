/*
 * phi
 */


/*
 * 定数
 */
var SCREEN_WIDTH        = 640;
var SCREEN_HEIGHT       = 640;
var CENTER_X            = SCREEN_WIDTH /2;
var CENTER_Y            = SCREEN_HEIGHT/2;
var AXIS_LENGTH         = 300;
var UNIT_CIRCLE_RADIUS  = 200;
var UNIT_CIRCLE_IMAGE   = null;

/*
 * main 処理
 */
tm.preload(function() {
    var c = UNIT_CIRCLE_IMAGE = tm.graphics.Canvas();
    c.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    // 中央に移動
    c.setTransformCenter();
    // 単位円
    c.strokeStyle = "black";
    c.strokeCircle(0, 0, UNIT_CIRCLE_RADIUS);
    // X軸
    c.fillStyle = c.strokeStyle = "red";
    c.drawArrow(-AXIS_LENGTH, 0, AXIS_LENGTH, 0, 10);
    c.fillText("X", AXIS_LENGTH, 30);
    // Y軸
    c.fillStyle = c.strokeStyle = "green";
    c.drawArrow(0, AXIS_LENGTH, 0,-AXIS_LENGTH, 10);
    c.fillText("Y", 30, -AXIS_LENGTH);
});

/*
 * メイン処理
 */
tm.main(function() {
    app = tm.app.CanvasApp("#world");
    app.fps = 30;
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    app.background = "rgba(255, 255, 255, 0.25)";
    
    // 単位円クラス追加
    var unitCircle = UnitCircle("hsla({0}, 75%, 50%, 1)".format(Math.rand(0, 360)));
    unitCircle.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
    app.currentScene.addChild(unitCircle);
    
    // 更新
    var vector  = tm.geom.Vector2(1, 1).normalize().mul(UNIT_CIRCLE_RADIUS);
    var angle   = 45;
    app.currentScene.update = function() {
        var p = app.pointing;
        var k = app.keyboard;
        
        // アングル
        if (p.getPointing() == true) {
            vector.x = p.position.x - CENTER_X;
            vector.y =-(p.position.y - CENTER_Y);
            angle = Math.radToDeg( vector.toAngle() );
            // 0 ~ 360
            angle += 360;
            angle %= 360;
            angle = angle.round();
        }
        // 長さを固定
        if (k.getKey("ctrl")) {
            vector.normalize().mul(UNIT_CIRCLE_RADIUS);
        }
        // 5 skip
        if (k.getKey("shift")) {
            var len = vector.length();
            angle -= angle % 5
            vector.setDegree(angle, len);
        }
    };
    
    app.currentScene.draw = function(c) {
        // 三角形描画
        c.save();
        c.setTransformCenter();
        c.scale(1, -1);
        c.fillStyle = c.strokeStyle = "hsl({0}, 80%, 50%)".format(angle);
        c.drawLine(0, 0, vector.x, vector.y).fillCircle(vector.x, vector.y, 5);
        c.fillStyle = "hsla({0}, 80%, 50%, 0.5)".format(angle);
        c.fillTriangle(0, 0, vector.x, 0, vector.x, vector.y);
        c.restore();
        
        // 情報を描画
        var v = vector.clone();
        var len = v.length();
        v.normalize();
        v.x = v.x.round(4); v.y = v.y.round(4);
        var text_list = [];
        var rad = Math.degToRad(angle);
        text_list.push( "x        : {0}".format(v.x.padding(8, ' ')) );
        text_list.push( "y        : {0}".format(v.y.padding(8, ' ')) );
        text_list.push( "angle    : {0}".format(angle.padding(8, ' ')) );
        text_list.push( "len      : {0}".format( (len/UNIT_CIRCLE_RADIUS).floor(4).padding(8, ' ') ) );
        text_list.push( "sin({0}) : {1}".format(angle.padding(3, ' '), Math.sin(rad).floor(4).padding(8, ' ')) );
        text_list.push( "cos({0}) : {1}".format(angle.padding(3, ' '), Math.cos(rad).floor(4).padding(8, ' ')) );
        text_list.push( "tan({0}) : {1}".format(angle.padding(3, ' '), Math.tan(rad).floor(4).padding(8, ' ')) );
        
        c.save();
        c.font = "14px Consolas,'Lucida Console','DejaVu Sans Mono',monospace";
        c.fillStyle = "black";
        c.fillLabelArea({
            x: 440,
            y: 40,
            width: 400,
            height: 400,
            lineSpace: 1.1,
            letterSpace: 1.0,
            text: text_list.join("\n"),
        });
        c.restore();
    };
    
    app.run();
});


/**
 * 単位円クラス
 */
var UnitCircle = tm.createClass({
    superClass: tm.app.Sprite,
    
    init: function() {
        this.superInit(UNIT_CIRCLE_IMAGE, SCREEN_WIDTH, SCREEN_HEIGHT);
    },
});
