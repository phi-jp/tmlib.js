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

        },

        _draw: function() {
            this.renderer.clearCanvas();
        }

    });
})();
