/*
 * canvasapp.js
 */

tm.display = tm.display || {};

(function() {

    /**
     * @class tm.display.CanvasApp
     * キャンバスアプリケーション
     * @extends tm.app.BaseApp
     */
    tm.display.CanvasApp = tm.createClass({
        superClass: tm.app.BaseApp,

        /** @property element */
        /** @property canvas */
        /** @property renderer */
        /** @property background */
        /** @property _scenes */
        /** @property mouse */
        /** @property touch */
        
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
            }

            // 親の初期化
            this.superInit(this.element);

            // グラフィックスを生成
            this.canvas = tm.graphics.Canvas(this.element);
            this.renderer = tm.display.CanvasRenderer(this.canvas);
            
            // カラー
            this.background = "black";
            
            // シーン周り
            this._scenes = [ tm.app.Scene() ];


            this._canvasCache = [];
            this._canvasCacheCache = [];
            this.on("push", function() {
                this._draw();

                var canvas = this._canvasCacheCache.pop();
                if (!canvas) {
                    var element = this.canvas.element.cloneNode();
                    canvas = tm.graphics.Canvas(element);
                }
                canvas.clear();
                canvas.drawTexture(this.canvas, 0, 0);
                this._canvasCache.push(canvas);
            });
            this.on("poped", function() {
                var canvas = this._canvasCache.pop();
                this._draw();

                this._canvasCacheCache.push(canvas);
            });
        },
        
        /**
         * リサイズ
         */
        resize: function(width, height) {
            this.width = width;
            this.height= height;
            
            return this;
        },

        /**
         * ウィンドウのサイズにリサイズ
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
            this.canvas.fitWindow(everFlag);
            
            // マウスとタッチの座標更新関数をパワーアップ
            this.mouse._mousemove = this.mouse._mousemoveScale;
            this.touch._touchmove = this.touch._touchmoveScale;

            return this;
        },

        /**
         * @private
         */
        _draw: function() {
            this.canvas.clear();
            
            this.canvas.fillStyle   = "white";
            this.canvas.strokeStyle = "white";
            this.canvas.context.lineJoin = "round";
            this.canvas.context.lineCap  = "round";

            // スタックしたキャンバスを描画
            if (this._canvasCache.last)
                this.canvas.drawTexture(this._canvasCache.last, 0, 0);
            
            // this._canvasCache.each(function(bitmap, index) {
            //     this.canvas.drawBitmap(bitmap, 0, 0);
            // }, this);

            
            // 描画は全てのシーン行う
            this.canvas.save();

            this.renderer.render(this.currentScene);

            this.canvas.restore();
        },
        
    });
    
    
    /**
     * @property    width
     * 幅
     */
    tm.display.CanvasApp.prototype.accessor("width", {
        "get": function()   { return this.canvas.width; },
        "set": function(v)  { this.canvas.width = v; }
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.display.CanvasApp.prototype.accessor("height", {
        "get": function()   { return this.canvas.height; },
        "set": function(v)  { this.canvas.height = v; }
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.display.CanvasApp.prototype.accessor("background", {
        "get": function()   { return this.canvas._background; },
        "set": function(v)  {
            this._background = v;
            this.element.style.background = v;
        }
    });

})();


