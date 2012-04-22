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
                this.element = this.canvas = canvas;
                // グラフィックスを生成
                this.graphics   = TM.Graphics.Graphics(this.canvas);
            }
            else {
                this.element = this.canvas = tm.$create("canvas");
                document.body.appendChild(this.canvas);
                // グラフィックスを生成
                this.graphics   = TM.Graphics.Graphics(this.canvas).fitWindowSize();
            }
            // シーンを生成
            this.scene      = TM.App.Scene();
            // マウスを生成
            this.mouse      = TM.$Mouse(this.canvas);
            // タッチを生成
            this.touch      = TM.$Touch(this.canvas);
            // キーボードを生成
            this.keyboard   = TM.$Key();
            
            // ポインティングをセット(PC では Mouse, Mobile では Touch)
            this.pointing   = (TM.isMobile) ? this.touch : this.mouse;
        },
        
        /**
         * 実行
         */
        run: function()
        {
            var self = this;
            TM.setLoop(function(){ self.loop(); }, 1000/self.fps);
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
            this.graphics.fillStyle = this.scene.background;
            this.graphics.strokeStyle = "black";
            this.graphics.fillRect(0, 0, window.innerWidth, window.innerHeight);
            
            this.graphics.fillStyle = "white";
            this.graphics.strokeStyle = "white";
            this.scene._draw(this.graphics);
        },
        
    });
    
})();
