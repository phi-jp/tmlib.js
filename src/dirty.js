;(function() {
    
    /**
     * @member      tm.app.Element
     * @property    interaction
     * インタラクション
     */
    tm.app.Element.prototype.getter("interaction", function() {
        console.assert(false, "interaction は Object2d に統合されました. obj.setInteractive(true); とすればタッチ判定が有効になります.");
    });
    
    
    var dirtyClass = [
        "Sprite",
        "Shape",
        "CircleShape",
        "TriangleShape",
        "RectangleShape",
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
    ];
    
    dirtyClass.each(function(className) {
        tm.app[className] = tm.display[className];
    });


})();
