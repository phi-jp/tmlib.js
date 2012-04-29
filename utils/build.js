
var fs      = require("fs");
var merger  = require("./modules/merger");
var compressor = require("C:/Users/phi/node_modules/node-minify/lib/node-minify");


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
    
    "geom/vector2.js",
    "geom/vector3.js",
    "geom/matrix33.js",
    "geom/matrix44.js",
    
    "dom/element.js",
    "dom/event.js",
    "dom/anim.js",
    
    "input/keyboard.js",
    "input/mouse.js",
    "input/touch.js",
    
    "graphics/color.js",
    "graphics/canvas.js",
    "graphics/texture.js",
    
    "app/element.js",
    "app/canvaselement.js",
    "app/sprite.js",
    "app/label.js",
    "app/scene.js",
    "app/interactive.js",
    "app/canvasapp.js",
    "app/event.js",
    
    "sound/sound.js",
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


(function() {
    new compressor.minify({
        /*
        type: 'gcc',
        type: 'uglifyjs',
        */
        type: 'yui',
        fileIn : '../build/tmlib.js',
        fileOut: '../build/tmlib.min.js',
        callback: function(err) {
            console.log(err);
        }
    });
})();

