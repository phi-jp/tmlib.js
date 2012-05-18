
var fs      = require("fs");
var merger  = require("merger");
var uglify  = require("uglify-js");
var codeText   = "";

var base = "../src/";
var target = [
    "tmlib.js",
    
    "core/object.js",
    "core/array.js",
    "core/date.js",
    "core/function.js",
    "core/math.js",
    "core/number.js",
    "core/string.js",
    "core/list.js",
    
    "util/random.js",
    
    "geom/vector2.js",
    "geom/vector3.js",
    "geom/matrix33.js",
    "geom/matrix44.js",
    "geom/rect.js",
    "geom/circle.js",
    
    "dom/element.js",
    "dom/event.js",
    "dom/anim.js",
    
    "event/eventdispatcher.js",
    
    "input/keyboard.js",
    "input/mouse.js",
    "input/touch.js",
    
    "graphics/color.js",
    "graphics/canvas.js",
    "graphics/texture.js",
    "graphics/bitmap.js",
    "graphics/filter.js",
    "graphics/gradient.js",
    
    "anim/tween.js",
    
    "app/element.js",
    "app/canvaselement.js",
    "app/sprite.js",
    "app/label.js",
    "app/scene.js",
    "app/canvasapp.js",
    "app/event.js",
    "app/interaction.js",
    "app/collision.js",
    "app/animation.js",
    
    "sound/sound.js",
];
for (var i=0,len=target.length; i<len; ++i) {
    target[i] = base + target[i];
}

// merge
(function() {
    // マージ
    var outputFile  = fs.createWriteStream("../build/tmlib.js");
    
    codeText    = merger.merge(target);
    outputFile.write(codeText);
})();


// minify
(function() {
    var outputFile = fs.createWriteStream("../build/tmlib.min.js");
    
    // パース
    var ast = uglify.parser.parse(codeText);
    ast = uglify.uglify.ast_mangle(ast);
    ast = uglify.uglify.ast_squeeze(ast);
    var finalCode = uglify.uglify.gen_code(ast);
    
    // 出力
    outputFile.write(finalCode);
})();

