/*
 * loadingscene.js
 */


;(function() {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
    };
    
    tm.define("tm.ui.LoadingScene", {
        superClass: "tm.app.Scene",
        
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);
            
            this.bg = tm.display.Shape(param.width, param.height).addChildTo(this);
            this.bg.canvas.clearColor("hsla(200, 80%, 70%, 1.0)");
            this.bg.setOrigin(0, 0);
            
            var label = tm.display.Label("Loading");
            label.x = param.width/2;
            label.y = param.height/2;
            label.width = param.width;
            label.align     = "center";
            label.baseline  = "middle";
            label.fontSize = 32;
            label.counter = 0;
            label.update = function(app) {
                if (app.frame % 30 == 0) {
                    this.text += ".";
                    this.counter += 1;
                    if (this.counter > 3) {
                        this.counter = 0;
                        this.text = "Loading";
                    }
                }
            };
            label.addChildTo(this.bg);

            // ひよこさん
            var piyo = tm.display.Shape(84, 84);
            piyo.setPosition(param.width, param.height - 80);
            piyo.canvas.setColorStyle("white", "yellow").fillCircle(42, 42, 32);
            piyo.canvas.setColorStyle("white", "black").fillCircle(27, 27, 2);
            piyo.canvas.setColorStyle("white", "brown").fillRect(40, 70, 4, 15).fillTriangle(0, 40, 11, 35, 11, 45);
            piyo.update = function(app) {
                piyo.x -= 4;
                if (piyo.x < -80) piyo.x = param.width;
                piyo.rotation -= 7;
            };
            piyo.addChildTo(this.bg);

            this.alpha = 0.0;
            this.bg.tweener.clear().fadeIn(100).call(function() {
                if (param.assets) {
                    tm.asset.AssetManager.onload = function() {
                        this.bg.tweener.clear().wait(200).fadeOut(200).call(function() {
                            if (param.nextScene) {
                                this.app.replaceScene(param.nextScene());
                            }
                            var e = tm.event.Event("load");
                            this.fire(e);
                        }.bind(this));
                    }.bind(this);
                    tm.asset.AssetManager.load(param.assets);
                    
                    tm.asset.AssetManager.onprogress = function() {
                        var e = tm.event.Event("progress");
                        e.progress = tm.asset.AssetManager.getProgress();
                        this.fire(e);
                    }.bind(this);
                }
            }.bind(this));
        },
    });
    
})();





