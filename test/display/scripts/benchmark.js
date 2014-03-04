
tm.define("tests.benchmark.PiyoScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        app.fps = 60;

        app.enableStats();
        app.stats.domElement.style.zIndex = 1100;

        this.objList = [];
        this.maxCount = 100;
        
        var loader = tm.asset.Loader();
        loader.onload = function() {
            this._generateObject();
        }.bind(this);
        loader.load("piyo", "../../resource/img/piyo.png");
    },

    onpointingstart: function() {
        this._resetObject();
        app.stop();
    },
 
    update: function(app) {
        var objList = this.objList;
        var len = objList.length;
        for (var i = 0; i < len; i++) {
            var container = objList[i];
            container.y += container.vy;
            container.rotation -= container.vr;
            if (container.y > app.height) container.y = 0;
        }
    },
    _resetObject: function() {
        var objList = this.objList;
        for (var i = 0; i < objList.length; i++) {
            var container = objList[i];
            app.currentScene.removeChild(container);
        }
    },

    _generateObject: function() {
        this._resetObject();

        this.objList = [];

        var objList = this.objList;
        var maxCount = this.maxCount;
        var CHILD_NUM = 10;
        var CHILD_RADIUS = 50;

        var updateFunc = function() {
            this.rotation -= 10;
        };

        for (var i = 0; i < maxCount; i++) {
            var container = new tm.display.CanvasElement();
            container.x = Math.random() * app.width;
            container.vy = 5 * Math.random();
            container.vr = 5 * Math.random();
            objList[i] = container;
            this.addChild(container);
            for (var j = 0; j < CHILD_NUM; j++) {
                var child = new tm.display.Sprite("piyo");
                child.originX = 0.5;
                child.originY = 0.5;
                var rad = j / CHILD_NUM * 360;
                child.x = CHILD_RADIUS * Math.cos(rad * Math.PI / 180);
                child.y = CHILD_RADIUS * Math.sin(rad * Math.PI / 180);
                child.rotation = rad;
                child.scaleX = child.scaleY = j / CHILD_NUM + 0.5;
                child.alpha = j / CHILD_NUM + 0.1;

                child.update = updateFunc;
                // child.hoge = function() {
                //  this.rotation -= 10;
                // };
                // child.draw = function(canvas) {
                //  canvas.fillCircle(0, 0, 10);
                // };
                container.addChild(child);
            }
        }

//        textNumObj.innerHTML = String(maxCount * CHILD_NUM);      
    },
});



/*
 * http://jsdo.it/djankey/testpixijs
 */
tm.define("tests.benchmark.HogeScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        app.fps = 60;

        this.TOTAL = 1000;
        this.particles = [];

        app.enableStats();
        app.stats.domElement.style.zIndex = 1100;

        var gui = app.enableDatGUI();
        gui.add(this, "TOTAL", 500, 10000).step(500).name('Particles').onFinishChange(function() {
            this._addParticle();
        }.bind(this));
        gui.domElement.parentNode.style.zIndex = 20000;
        
        var loader = tm.asset.Loader();
        loader.load("9iIpS", "http://jsrun.it/assets/9/i/I/p/9iIpS.png");
        loader.onload = function() {
            this._addParticle();
        }.bind(this);
    },

    update: function(app) {
        var p = app.pointing;
        var len = this.particles.length;
        for (var i = 0; i < len; i++) {
            var ball = this.particles[i].sprite;
            var dx = ball.position.x - p.x;
            var dy = ball.position.y - p.y;
            var vx = this.particles[i].vx;
            var vy = this.particles[i].vy;     
           
            if (dx * dx + dy * dy <= 10000) {
                vx += dx * 0.01;
                vy += dy * 0.01;
            }
            vx *= 0.95;
            vy *= 0.95;

            vx += Math.random() - 0.5;
            vy += Math.random() - 0.5;

            var x = ball.position.x += vx;
            var y = ball.position.y += vy;

            if (x < 0 || x > app.width || y < 0 || y > app.height) {
                var r = Math.atan2(y - app.height / 2, x - app.width / 2);
                vx = -Math.cos(r);
                vy = -Math.sin(r);
            }

            this.particles[i].vx = vx;
            this.particles[i].vy = vy;      
        }
    },

    _addParticle: function() {
        this._removeAllBall();

        for (i = 0; i < this.TOTAL; i++) {  
            var ball = tm.display.Sprite("9iIpS", 29, 29);
            ball.centerX = 0.5;
            ball.centerY = 0.5;
            ball.vx = 0;
            ball.vy = 0;
            ball.position.x = Math.random() * app.width;
            ball.position.y = Math.random() * app.height;
            this.addChild(ball);       
                
            this.particles.push({sprite:ball, vx:0, vy:0});  
        }
    },

    _removeAllBall: function() {
        var len = this.particles.length;        
        for(i = 0; i<len; i++) {            
            var old = this.particles[i].sprite;           
            this.removeChild(old);    
        }
       
        this.particles = [];
    }
});

tm.define("tests.benchmark.CrashScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        app.fps = 60;
        app.enableStats();
        app.stats.domElement.style.zIndex = 1100;
        
        var loader = tm.asset.Loader();

        loader.onload = function() {
            for (var i=0; i<512; ++i) {
                var crash = tm.display.AnimationSprite(PLAYER_SPRITE_SHEET, 128, 128).addChildTo(this);
                var x = tm.util.Random.randint(0, SCREEN_WIDTH);
                var y = tm.util.Random.randint(0, SCREEN_HEIGHT);
                crash.position.set(x, y);
                crash.blendMode = "lighter";
                crash.timeline.call(function() {
                    this.gotoAndPlay("crash");
                }.bind(crash), i*50);
            }
        }.bind(this);

        loader.load("sample", "../../resource/tmss/crash.tmss");
    },

    onpointingstart: function(e) {
        var p = e.app.pointing;

    }
});