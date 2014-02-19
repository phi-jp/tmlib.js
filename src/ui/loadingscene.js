/*
 * loadingscene.js
 */


;(function() {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
        bgColor: "transparent",
    };
    
    tm.define("tm.ui.LoadingScene", {
        superClass: "tm.app.Scene",
        
        init: function(param) {
            this.superInit();
            
            param = {}.$extend(DEFAULT_PARAM, param);


            this.fromJSON({
                children: {
                    stage: {
                        type: "tm.display.CanvasElement",
                    },
                }
            });


            this.stage.fromJSON({
                children: {
                    bg: {
                        type: "tm.display.Shape",
                        init: [param.width, param.height],
                        originX: 0,
                        originY: 0,
                    },
                    label: {
                        type: "tm.display.Label",
                        text: "Loading.",
                        x: param.width/2,
                        y: param.height/2-20,
                        align: "center",
                        baseline: "middle",
                        fontSize: 32,
                    },
                    progressLabel: {
                        type: "tm.display.Label",
                        text: "(0%)",
                        x: param.width/2,
                        y: param.height/2+20,
                        align: "center",
                        baseline: "middle",
                        fontSize: 22,
                    },
                    piyo: {
                        type: "tm.display.Shape",
                        init: [84, 84],
                        x: param.width,
                        y: param.height - 80,
                    },
                }
            });
            
            // bg
            var bg = this.stage.bg;
            bg.canvas.clearColor(param.bgColor);

            // label
            var label = this.stage.label;
            label.counter = 0;
            label.update = function(app) {
                if (app.frame % 30 == 0) {
                    this.text += ".";
                    this.counter += 1;
                    if (this.counter >= 3) {
                        this.counter = 0;
                        this.text = "Loading.";
                    }
                }
            };

            // progress
            var progressLabel = this.stage.progressLabel;

            
            // ひよこさん
            var piyo = this.stage.piyo;
            piyo.canvas.setColorStyle("white", "yellow").fillCircle(42, 42, 32);
            piyo.canvas.setColorStyle("white", "black").fillCircle(27, 27, 2);
            piyo.canvas.setColorStyle("white", "brown").fillRect(40, 70, 4, 15).fillTriangle(0, 40, 11, 35, 11, 45);
            piyo.update = function(app) {
                this.x -= 4;
                if (this.x < -80) this.x = param.width;
                this.rotation -= 7;
            };

            // load
            var stage = this.stage;
            stage.alpha = 0.0;
            stage.tweener.clear().fadeIn(100).call(function() {
                if (param.assets) {
                    var loader = tm.asset.Loader();
                    
                    loader.onload = function() {
                        stage.tweener.clear().wait(200).fadeOut(200).call(function() {
                            if (param.nextScene) {
                                this.app.replaceScene(param.nextScene());
                            }
                            var e = tm.event.Event("load");
                            this.fire(e);
                        }.bind(this));
                    }.bind(this);
                    
                    loader.onprogress = function(e) {
                        progressLabel.text = '({0}%)'.format((e.progress*100)|0);
                        var event = tm.event.Event("progress");
                        event.progress = e.progress;
                        this.fire(event);
                    }.bind(this);
                    
                    loader.load(param.assets);
                }
            }.bind(this));
        },
    });
    
})();





