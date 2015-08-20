/*
 * webgl.js
 */

tm.webgl = tm.webgl || {};

(function() {

    if (!tm.global.GLBoost) return ;


    /**
     * @class tm.webgl.WebGLApp
     * 3Dライブラリ - tmlib.jsによるWebGLサポート
     * @extends tm.app.BaseApp
     */
    tm.webgl.WebGLApp = tm.createClass({
        superClass: tm.app.BaseApp,

        /** canvas */
        canvas      : null,
        _scenes      : null,

        /**
         * @constructor
         */
        init: function(canvas) {
            if (canvas instanceof HTMLCanvasElement) {
                this.element = canvas;
            }
            else if (typeof canvas == "string") {
                this.element = document.querySelector(canvas);
            }
            else {
                this.element = document.createElement("canvas");
                document.body.appendChild(this.element);
            }

            // 親の初期化
            this.superInit(this.element);

            // レンダラーを生成
            this.renderer = new GLBoost.Renderer({ canvas: this.element, clearColor: {red:0, green:1, blue:0, alpha:1}});

            // シーン周り
            this._scenes = [ tm.webgl.Scene() ];

        },

        _draw: function() {
            this.renderer.clearCanvas();

            for (var i=0, len=this._scenes.length; i<len; ++i) {
                this.renderer.draw(this.currentScene);
            }

        },

        /**
         * @TODO ?
         */
        resize: function(width, height) {
            this.width = width;
            this.height= height;

            return this;
        },

        /**
         * @TODO ?
         */
        resizeWindow: function() {
            this.width = innerWidth;
            this.height= innerHeight;

            return this;
        },

        /**
         * 画面にフィットさせる
         */
        fitWindow: function(everFlag) {
            // 画面にフィット
            var _fitFunc = function() {
                everFlag = everFlag === undefined ? true : everFlag;
                var e = this.element;
                var s = e.style;

                s.position = "absolute";
                s.left = "0px";
                s.top  = "0px";

                var rateWidth = e.width/window.innerWidth;
                var rateHeight= e.height/window.innerHeight;
                var rate = e.height/e.width;

                if (rateWidth > rateHeight) {
                    s.width  = innerWidth+"px";
                    s.height = innerWidth*rate+"px";
                }
                else {
                    s.width  = innerHeight/rate+"px";
                    s.height = innerHeight+"px";
                }
            }.bind(this);

            // 一度実行しておく
            _fitFunc();
            // リサイズ時のリスナとして登録しておく
            if (everFlag) {
                window.addEventListener("resize", _fitFunc, false);
            }

            // マウスとタッチの座標更新関数をパワーアップ
            this.mouse._mousemove = this.mouse._mousemoveScale;
            this.touch._touchmove = this.touch._touchmoveScale;
        }

    });
})();

(function() {

    if (!tm.global.GLBoost) return ;

    /**
     * @class tm.webgl.Element
     * @TODO ?
     */
    tm.webgl.Element = tm.createClass({
      superClass: GLBoost.Element,
        /**
         * @constructor
         */
        init: function() {
            GLBoost.Element.prototype.constructor.call(this);

            tm.event.EventDispatcher.prototype.init.call(this);
        },

        /**
         * 更新処理
         */
        update: function() {},

        /**
         * @TODO ?
         * @private
         */
        _update: function(app) {
            // 更新有効チェック
            if (this.awake == false) return ;

            this.update(app);

            var e = tm.event.Event("enterframe");
            e.app = app;
            this.dispatchEvent(e);

        },
    });

    // tm.event.EventDispatcher を継承
    tm.webgl.Element.prototype.$safe(tm.event.EventDispatcher.prototype);

})();


(function() {

    if (!tm.global.GLBoost) return ;

    /**
     * @class tm.webgl.MeshElement
     * @TODO ?
     */
    tm.webgl.MeshElement = tm.createClass({
        superClass: GLBoost.Mesh,

        /**
         * @constructor
         */
        init: function() {
            GLBoost.Mesh.prototype.constructor.call(this);

            tm.webgl.Element.prototype.init.call(this);
        }
    });

    // tm.webgl.Element を継承
    tm.webgl.MeshElement.prototype.$safe(tm.webgl.Element.prototype);

})();

(function() {

    if (!tm.global.GLBoost) return ;

    /**
     * @class tm.webgl.CameraElement
     * @TODO ?
     */
    tm.webgl.CameraElement = tm.createClass({
        superClass: GLBoost.Camera,

        /**
         * @constructor
         */
        init: function(lookAt, perspective) {
            GLBoost.Camera.prototype.constructor.call(this, lookAt, perspective);

            tm.webgl.Element.prototype.init.call(this);
        }
    });

    // tm.webgl.Element を継承
    tm.webgl.CameraElement.prototype.$safe(tm.webgl.Element.prototype);

})();

(function() {

    if (!tm.global.GLBoost) return ;

    /**
     * @class tm.webgl.BlendShapeMeshElement
     * @TODO ?
     */
    tm.webgl.BlendShapeMeshElement = tm.createClass({
        superClass: GLBoost.BlendShapeMesh,

        /**
         * @constructor
         */
        init: function(geometry, material) {
            GLBoost.BlendShapeMesh.prototype.constructor.call(this);

            tm.webgl.MeshElement.prototype.init.call(this);
        }
    });

    // tm.webgl.MeshElement を継承
    tm.webgl.BlendShapeMeshElement.prototype.$safe(tm.webgl.MeshElement.prototype);

})();

(function() {

    if (!tm.global.GLBoost) return ;

    /**
     * @class tm.webgl.Scene
     * シーン
     */
    tm.webgl.Scene = tm.createClass({
        superClass: GLBoost.Scene,

        /** @property camera    カメラ */
        /** @property Projector プロジェクター */

        /**
         * @constructor
         */
        init: function(fov, aspect) {
            // THREE.Scene の初期化
            GLBoost.Scene.prototype.constructor.call(this);

            // tm.three.Element を継承
            tm.webgl.Element.prototype.init.call(this);

        }

    });

    // tm.webgl.Element を継承
    tm.webgl.Scene.prototype.$safe(tm.webgl.Element.prototype);
})();
