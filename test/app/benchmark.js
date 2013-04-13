tm.preload(function() {
	tm.graphics.TextureManager.add("piyo", "piyo.png");
	tm.util.ScriptManager.loadStats();
});

tm.define("tests.benchmark.PiyoScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        app.fps = 60;

        app.enableStats();
        app.stats.domElement.style.zIndex = 1100;

        this.objList = [];
        this.maxCount = 100;
        this._generateObject();

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
            var container = new tm.app.CanvasElement();
            container.x = Math.random() * app.width;
            container.vy = 5 * Math.random();
            container.vr = 5 * Math.random();
            objList[i] = container;
            this.addChild(container);
            for (var j = 0; j < CHILD_NUM; j++) {
                var child = new tm.app.Sprite(32, 32, "piyo");
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
                // 	this.rotation -= 10;
                // };
                // child.draw = function(canvas) {
                // 	canvas.fillCircle(0, 0, 10);
                // };
                container.addChild(child);
            }
        }

//        textNumObj.innerHTML = String(maxCount * CHILD_NUM);    	
    },
});
 