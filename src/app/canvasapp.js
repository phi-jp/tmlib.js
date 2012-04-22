/*
 * 
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * キャンバスアプリケーション
     */
    tm.app.CanvasApp = tm.createClass({
        
        element : null,
        canvas  : null,
        graphics: null,
        scene   : null,
        mouse   : null,
        touch   : null,
        pointing: null,
        keyboard: null,
        stats   : null,
        frame   : 0,
        fps     : 30,
        
        /**
         * 初期化
         */
        init: function(canvas)
        {
            if (canvas instanceof HTMLCanvasElement) {
                this.element = canvas;
            }
            else {
                this.element = document.createElement("canvas");
                document.body.appendChild(this.element);
            }
            // グラフィックスを生成
            this.canvas = tm.graphics.Canvas(this.element);
            
            // シーンを生成
            this.scene      = tm.app.Scene();
            // マウスを生成
            this.mouse      = tm.input.Mouse(this.element);
            // タッチを生成
            this.touch      = tm.input.Touch(this.element);
            // キーボードを生成
            this.keyboard   = tm.input.Keyboard(this.element);
            
            // ポインティングをセット(PC では Mouse, Mobile では Touch)
            this.pointing   = (tm.isMobile) ? this.touch : this.mouse;
        },
        
        /**
         * 実行
         */
        run: function()
        {
            var self = this;
            tm.setLoop(function(){ self.loop(); }, 1000/self.fps);
        },
        
        loop: function()
        {
            // stats update
            if (this.stats) this.stats.update();
            
            // update
            if (this.update) this.update();
            this._update();
            ++this.frame;
            
            // draw
            if (this.draw) this.draw();
            this._draw();
        },
        
        _update: function()
        {
            // デバイス系 Update
            this.mouse.update();
            this.keyboard.update();
            this.touch.update();
            
            this.scene._update(this);
        },
        
        _draw: function()
        {
            this.canvas.fillStyle = this.scene.background;
            this.canvas.strokeStyle = "black";
            this.canvas.fillRect(0, 0, window.innerWidth, window.innerHeight);
            
            this.canvas.fillStyle   = "white";
            this.canvas.strokeStyle = "white";
            this.scene._draw(this.canvas);
        },
        
    });
    
})();
