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

    tm.ui.LoadingScene = function(param) {
        console.warn('`tm.ui.LoadingScene` は `tm.game.LoadingScene` になりました!');
        return tm.game.LoadingScene(param);
    };
    tm.scene = tm.scene || {};
    tm.scene.LoadingScene = function(param) {
        console.warn('`tm.scene.LoadingScene` は `tm.game.LoadingScene` になりました!');
        return tm.game.LoadingScene(param);
    };

    tm.util.getter('Script', function() {
        console.warn('`tm.util.Script` は `tm.asset.Script` になりました!');
    });

    tm.scene.ResultScene = function(param) {
        console.warn('`tm.scene.ResultScene` は `tm.game.ResultScene` になりました!');
        return tm.game.ResultScene(param);
    };

})();
