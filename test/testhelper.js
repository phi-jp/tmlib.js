/**
 *
 */

(function(global) {
    global.testhelper = {};
    
    
    global.testhelper.scripts = {
        "core": [
            "src/tmlib.js",
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
            "src/util/querystring.js",
            "src/util/type.js",
            "src/util/flow.js",
            "src/util/gridsystem.js",
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
            "src/asset/font.js",
            "src/asset/script.js",
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
            "src/app/grid.js",
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
        "game": [
            "src/game/game.js",
            "src/game/titlescene.js",
            "src/game/resultscene.js",
            "src/game/loadingscene.js",
            "src/game/splashscene.js",
            "src/game/managerscene.js",
            "src/game/numericalinputscene.js",
            "src/game/countscene.js",
        ],
        "three": [
            "src/three/three.js",
        ],
        "sound": [

            "src/sound/sound.js",
            "src/sound/webaudio.js",
            "src/sound/soundmanager.js",
        ],
        "twitter": [

            "src/social/twitter.js",
            "src/social/nineleap.js",

        ],
        "google": [
            "src/google/chart.js",
        ],
        "dirty": [
            "src/dirty.js",
        ],
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
        "display/shape.js",
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


    testhelper.current = '';
    testhelper.units = {};

    testhelper.describe = function(name, func) {
        testhelper.units[name] = {
            name: name,
            func: func,
            its: {},
        };
    };

    testhelper.it = function(name, func) {
        var unit = this.units[this.current];
        var lines = func.toString().split('\n');

        lines.shift();
        lines.pop();
        lines = lines.map(function(line) {
            return line.replace('        ', '');
        });

        var code = lines.join('\n');

        unit.its[name] = {
            func: func,
            code: code,
        };
    };

    testhelper.run = function(param) {
        this.units.$forIn(function(key, value, i) {
            testhelper.current = key;
            value.func();
        });

        // setup dom
        var sidebar = tm.dom.Element(param.sidebar);
        this.units.$forIn(function(key, value, i) {
            var div = sidebar.create("div");

            // header
            var header = div.create("h2");
            header.html = key;

            // list
            var list = div.create("ul");

            value.its.$forIn(function(key, value, i) {
                var li = list.create("li");
                var a = li.create("a");
                a.html = key;
                a.attr.set("href", "#");
                a.event.add("click", function() {
                    preview(value);
                });
            });

            value.element = div;
        });

        // preview
        var previewElement = tm.dom.Element(param.preview);

        var preview = function(code) {
            var baseURL = "runstant.html#";
            var data = {
                version: '0.0.1',
                current: "script",

                setting: {
                    title: "",
                    detail: "",
                },

                code: {
                    html: {
                        type: "html",
                        value: document.querySelector("#html-template").innerHTML.replace(/__script__/g, 'script'),
                    },
                    style: {
                        type: "css",
                        value: "",
                    },
                    script: {
                        type: "javascript",
                        value: document.querySelector("#script-template").innerHTML.replace("{testcode}", code.code),
                    }
                }
            };

            var url = baseURL + _encode(data);

            previewElement.attr.set("src", url);
        };


        // serach
        var searchElement = tm.dom.Element(param.search);
        var search = localStorage.getItem("search");

        if (search) {
            searchElement.value = search;
            filter(search);
        }

        searchElement.event.add("keyup", function(e) {
            var value = e.target.value;
            filter(value);
        }.bind(this));
    };

    var filter = function(value) {
        testhelper.units.$forIn(function(key, unit, i) {
            var re = new RegExp(value, 'gim');
            if (re.test(unit.name)) {
                unit.element.element.classList.remove("hide");
            }
            else {
                unit.element.element.classList.add("hide");
            }
        });

        localStorage.setItem("search", value);
    };
    
})(this);


var _encode = function(data) {
    data = JSON.stringify(data);
    data = zip(data);
    data = encodeURI(data);

    return data;
};

var zip = function(data) {
    var zip = new JSZip();
    zip.file('data', data);

    return zip.generate({type:"base64"});
};



















