module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  var target = [
    "src/tmlib.js",

    "src/core/object.js",
    "src/core/array.js",
    "src/core/date.js",
    "src/core/function.js",
    "src/core/math.js",
    "src/core/number.js",
    "src/core/string.js",
    "src/core/list.js",

    "src/util/random.js",
    "src/util/ajax.js",
    "src/util/file.js",
    "src/util/timeline.js",
    "src/util/data.js",
    "src/util/script.js",
    "src/util/querystring.js",

    "src/geom/vector2.js",
    "src/geom/vector3.js",
    "src/geom/matrix33.js",
    "src/geom/matrix44.js",
    "src/geom/rect.js",
    "src/geom/circle.js",

    "src/collision/collision.js",

    "src/dom/element.js",
    "src/dom/event.js",
    "src/dom/attr.js",
    "src/dom/style.js",
    "src/dom/anim.js",
    "src/dom/trans.js",
    "src/dom/data.js",

    "src/event/event.js",
    "src/event/eventdispatcher.js",

    "src/input/keyboard.js",
    "src/input/mouse.js",
    "src/input/touch.js",
    "src/input/accelerometer.js",

    "src/graphics/color.js",
    "src/graphics/canvas.js",
    "src/graphics/texture.js",
    "src/graphics/bitmap.js",
    "src/graphics/filter.js",
    "src/graphics/gradient.js",

    "src/anim/tween.js",

    "src/app/element.js",
    "src/app/canvaselement.js",
    "src/app/sprite.js",
    "src/app/animationsprite.js",
    "src/app/shape.js",
    "src/app/label.js",
    "src/app/button.js",
    "src/app/scene.js",
    "src/app/canvasapp.js",
    "src/app/interaction.js",
    "src/app/collision.js",
    "src/app/animation.js",
    "src/app/userinterface.js",

    "src/three/three.js",

    "src/sound/sound.js",
    "src/sound/webaudio.js",

    "src/social/twitter.js",
    "src/social/nineleap.js",

    "src/google/chart.js",
  ];

  grunt.initConfig({
    buildDir: "build",

    concat: {
      tmlib: {
        src: target,
        dest: '<%= buildDir %>/tmlib.js',
        options: {
        }
      },
    },
    uglify: {
      tmlib: {
        options: {

        },
        files: {
          '<%= buildDir %>/test.min.js': [ 'js/test.js' ]
        },
      },
    },
  });

  for (var key in pkg.devDependencies) {
    if (/grunt-contrib/.test(key)) {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerTask('default', ['concat', 'uglify']);
}