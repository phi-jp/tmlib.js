/**
 *
 */

(function(global) {
    global.testhelper = {};
    
    
    global.testhelper.scripts = {
        "core": [
            "src/tmlib.js",

            "src/core/object.js",
            "src/core/array.js",
            "src/core/date.js",
            "src/core/function.js",
            "src/core/math.js",
            "src/core/number.js",
            "src/core/string.js",
            "src/core/list.js",
        ],
        "event": [
            "src/event/event.js",
            "src/event/eventdispatcher.js",
        ],
        "util": [
            "src/util/random.js",
            "src/util/ajax.js",
            "src/util/file.js",
            "src/util/timeline.js",
            "src/util/data.js",
            "src/util/script.js",
            "src/util/querystring.js",
            "src/util/type.js",
            "src/util/flow.js",
        ],
        "geom": [
            "src/geom/vector2.js",
            "src/geom/vector3.js",
            "src/geom/matrix33.js",
            "src/geom/matrix44.js",
            "src/geom/rect.js",
            "src/geom/circle.js",
        ],
        "collision": [
            "src/collision/collision.js",
        ],
        "dom": [
            "src/dom/element.js",
            "src/dom/event.js",
            "src/dom/attr.js",
            "src/dom/style.js",
            "src/dom/anim.js",
            "src/dom/trans.js",
            "src/dom/data.js",
        ],
        "asset": [
            "src/asset/manager.js",
            "src/asset/loader.js",
            "src/asset/texture.js",
            "src/asset/spritesheet.js",
            "src/asset/mapsheet.js",
        ],
        "input": [
            "src/input/keyboard.js",
            "src/input/mouse.js",
            "src/input/touch.js",
            "src/input/accelerometer.js",
        ],
        "graphics": [
            "src/graphics/color.js",
            "src/graphics/canvas.js",
            "src/graphics/bitmap.js",
            "src/graphics/filter.js",
            "src/graphics/gradient.js",
        ],
        "anim": [
            "src/anim/tween.js",
        ],
        "app": [
            "src/app/timer.js",
            "src/app/element.js",
            "src/app/updater.js",
            "src/app/baseapp.js",
            "src/app/object2d.js",
            "src/app/scene.js",
            "src/app/collision.js",
            "src/app/tweener.js",
            "src/app/timeline.js",
        ],
        "display": [
            "src/display/canvasapp.js",
            "src/display/canvaselement.js",
            "src/display/sprite.js",
            "src/display/shape.js",
            "src/display/label.js",
            "src/display/animationsprite.js",
            "src/display/mapsprite.js",
            "src/display/renderer.js",
            "src/display/bitmaplabel.js",
        ],
        "ui": [
            "src/ui/userinterface.js",
            "src/ui/button.js",
            "src/ui/menudialog.js",
            "src/ui/sketch.js",
            "src/ui/gauge.js",
            "src/ui/labelarea.js",
            "src/ui/loadingscene.js",
        ],
        "scene": [
            "src/scene/titlescene.js",
            "src/scene/resultscene.js",
            "src/scene/loadingscene.js",
            "src/scene/countdownscene.js",
            "src/scene/splashscene.js",
            "src/scene/managerscene.js",
            "src/scene/numericalinputscene.js",
        ],
        "three": [
            "src/three/three.js",
        ],
        "sound": [

            "src/sound/sound.js",
            "src/sound/webaudio.js",
        ],
        "twitter": [

            "src/social/twitter.js",
            "src/social/nineleap.js",

        ],
        "google": [
            "src/google/chart.js",
        ],
        // "dirty": [
        //     "src/dirty.js",
        // ],
    };

    global.testhelper.testScripts = [
        "app/baseapp.js",
        "app/scene.js",
        "app/timer.js",
        "app/object2d.js",
        "app/timeline.js",
        "app/tweener.js",
        "app/collision.js",

        "display/sprite.js",
        "display/mapsprite.js",

        "scene/scene.js",

        "input/pointing.js",
    ];
    
    global.testhelper.scripts.all = (function() {
        var scripts = [];
        for (var key in global.testhelper.scripts)
            global.testhelper.scripts[key].forEach(function(elm) {
                scripts.push(elm);
            });
        
        return scripts;
    })();
    
    global.testhelper.loadScript = function(path) {
        var str = '<scrip' + 't src="' + path + '"></scri' + 'pt>';
        document.write(str);
    };
    
    global.testhelper.loadScripts = function(pathes) {
        pathes.forEach(function(path) {
            global.testhelper.loadScript(path);
        });
    };

    global.testhelper.loadtmlib = function(path, namespace) {
        var scripts = testhelper.scripts[namespace];
        scripts.forEach(function(elm) {
            global.testhelper.loadScript(path + elm);
        });
    };
    
    global.testhelper.loadtmlibAll = function(path) {
        this.loadtmlib(path, "all");
    };
    
})(this);
