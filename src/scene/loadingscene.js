/*
 * loadingscene.js
 */


;(function() {
    
    var DEFAULT_PARAM = {
        width: 465,
        height: 465,
        bgColor: "transparent",
    };
    
    tm.define("tm.scene.LoadingScene", {
        superClass: "tm.app.Scene",
        
        init: function(param) {
            this.superInit();
            
            this.param = param = {}.$extend(DEFAULT_PARAM, param);

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
                    piyoLayer: {
                        type: "tm.display.CanvasElement",
                    },
                    label: {
                        type: "tm.display.Label",
                        text: "LOADING",
                        x: param.width/2,
                        y: param.height/2-20,
                        align: "center",
                        baseline: "middle",
                        fontSize: 46,
                        shadowBlur: 4,
                        shadowColor: "hsl(190, 100%, 50%)",
                    },
                    // piyo: {
                    //     type: "tm.display.Shape",
                    //     init: [84, 84],
                    // },
                    bar: {
                        type: "tm.ui.Gauge",
                        init: [{
                            width: param.width,
                            height: 10,
                            color: "hsl(200, 100%, 80%)",
                            bgColor: "transparent",
                            borderColor: "transparent",
                            borderWidth: 0,
                        }],
                        x: 0,
                        y: 0,
                    },
                }
            });
            
            // bg
            var bg = this.stage.bg;
            bg.canvas.clearColor(param.bgColor);

            // label
            var label = this.stage.label;
            label.tweener
                .to({alpha:1}, 1000)
                .to({alpha:0.5}, 1000)
                .setLoop(true)

            // bar
            var bar = this.stage.bar;
            bar.animationFlag = false;
            bar.value = 0;
            bar.animationFlag = true;
            bar.animationTime = 100;
            
            // ひよこさん
            this._createHiyoko(param).addChildTo(this.stage.piyoLayer);

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

                            if (param.autopop == true) {
                                this.app.popScene();
                            }
                        }.bind(this));
                    }.bind(this);
                    
                    loader.onprogress = function(e) {
                        // update bar
                        bar.value = e.progress*100;

                        // dispatch event
                        var event = tm.event.Event("progress");
                        event.progress = e.progress;
                        this.fire(event);
                    }.bind(this);
                    
                    loader.load(param.assets);
                }
            }.bind(this));
        },

        onpointingstart: function(app) {
            // ひよこさん生成
            var p = app.pointing;
            var piyo = this._createHiyoko(this.param).addChildTo(this.stage.piyoLayer);
            piyo.x = p.x;
            piyo.y = p.y;
        },

        _createHiyoko: function(param) {
            // ひよこさん
            var piyo = tm.display.Shape(84, 84);
            piyo.x = tm.util.Random.randint(0, param.width);
            piyo.y = tm.util.Random.randint(0, param.height);
            piyo.canvas.setColorStyle("white", "yellow").fillCircle(42, 42, 32);
            piyo.canvas.setColorStyle("white", "black").fillCircle(27, 27, 2);
            piyo.canvas.setColorStyle("white", "brown").fillRect(40, 70, 4, 15).fillTriangle(0, 40, 11, 35, 11, 45);
            piyo.dir = tm.geom.Vector2.random(0, 360, 4);
            var rect = tm.geom.Rect(0, 0, param.width, param.height);
            rect.padding(42);
            piyo.update = function(app) {
                this.position.add(this.dir);

                if (this.x < rect.left) {
                    this.x = rect.left;
                    this.dir.x*=-1;
                }
                else if (this.x > rect.right) {
                    this.x = rect.right;
                    this.dir.x*=-1;
                }
                if (this.y < rect.top) {
                    this.y = rect.top;
                    this.dir.y*=-1;
                }
                else if (this.y > rect.bottom) {
                    this.y = rect.bottom;
                    this.dir.y*=-1;
                }

                if (this.dir.x<0) {
                    this.rotation -= 7;
                    this.scaleX = 1;
                }
                else {
                    this.rotation += 7;
                    this.scaleX = -1;
                }

                // // 向き更新
                // if (app.pointing.getPointingStart()) {
                //     var p = app.pointing.position;
                //     var v = tm.geom.Vector2.sub(p, this.position);
                //     this.dir = v.normalize().mul(4);
                // }

            };

            return piyo;
        },
    });
    
})();





