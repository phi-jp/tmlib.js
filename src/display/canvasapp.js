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


            this._bitmapCache = [];
            this.on("push", function() {
                var bitmap = this.canvas.getBitmap();
                this._bitmapCache.push(bitmap);

                bitmap.setPixelIndex(50, 255, 0, 0);
            });

            this.on("pop", function() {
                this._bitmapCache.pop();
                this._draw();
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

            // スタックしたキャンバスを描画
            if (this._bitmapCache.last)
                this.canvas.drawBitmap(this._bitmapCache.last, 0, 0);
            
            // this._bitmapCache.each(function(bitmap, index) {
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


