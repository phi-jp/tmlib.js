;(function() {
    
    /**
     * @member      tm.app.Element
     * @property    interaction
     * インタラクション
     */
    tm.app.Element.prototype.getter("interaction", function() {
        console.assert(false, "interaction は Object2d に統合されました. obj.setInteractive(true); とすればタッチ判定が有効になります.");
    });
    
    
    var dirtyClass = {
        "display": [
            "Sprite",
            "Shape",
            "CircleShape",
            "TriangleShape",
            "RectangleShape",
            "RoundRectangleShape",
            "StarShape",
            "PolygonShape",
            "HeartShape",
            "TextShape",
            "CanvasRenderer",
            "BoundingRectRenderer",
            "Label",
            "MapSprite",
            "CanvasElement",
            "CanvasApp",
            "AnimationSprite",
            "SpriteSheet",
        ],
        "ui": [
            "LabelButton",
            "IconButton",
            "GlossyButton",
            "FlatButton",
            "LoadingScene",
        ],
    };
    
    for (var key in dirtyClass) {
        var namespace = dirtyClass[key];
        namespace.each(function(className) {
            tm.app[className] = tm[key][className];
        });
    }
    
    tm.asset.AssetManager = tm.asset.Manager;

    tm.util.getter('Script', function() {
        console.warn('`tm.util.Script` は `tm.asset.Script` になりました!');
    });

    tm.ui.LoadingScene = function(param) {
        console.warn('`tm.ui.LoadingScene` は `tm.game.LoadingScene` になりました!');
        return tm.game.LoadingScene(param);
    };

    tm.scene = tm.scene || {};
    tm.scene.ManagerScene = tm.game.ManagerScene;
    tm.scene.LoadingScene = tm.game.LoadingScene;
    tm.scene.TitleScene = tm.game.TitleScene;
    tm.scene.ResultScene = tm.game.ResultScene;
    tm.scene.NumericalInputScene = tm.game.NumericalInputScene;
    
    tm.getter('scene', function() {
        debugger;
        console.warn('tm.scene は tm.game に変更されました');
        return tm.game;
    });

})();
