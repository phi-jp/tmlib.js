
var fs      = require("fs");
var merger  = require("./modules/merger");

var base = "../src/";
var target = [
    "tmlib.js",
    
    "core/array.js",
    "core/date.js",
    "core/function.js",
    "core/math.js",
    "core/number.js",
    "core/object.js",
    "core/string.js",
    
    "geom/vector2.js",
    "geom/vector3.js",
    "geom/matrix33.js",
    "geom/matrix44.js",
    
    "dom/element.js",
    "dom/event.js",
    
    "input/keyboard.js",
    "input/mouse.js",
    "input/touch.js",
    
    "graphics/color.js",
    "graphics/canvas.js",
    
    "app/element.js",
    "app/canvaselement.js",
    "app/scene.js",
    "app/interactive.js",
    "app/canvasapp.js",
];
for (var i=0,len=target.length; i<len; ++i) {
    target[i] = base + target[i];
}

// main
(function() {
    // マージ
    var outputFile  = fs.createWriteStream("../build/tmlib.js");
    var codeText    = merger.merge(target);
    
    outputFile.write(codeText);
})();



