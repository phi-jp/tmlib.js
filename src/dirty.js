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

})();
