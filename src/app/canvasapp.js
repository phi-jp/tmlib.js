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
        
        element     : null,
        canvas      : null,
        mouse       : null,
        touch       : null,
        pointing    : null,
        keyboard    : null,
        stats       : null,
        frame       : 0,
        fps         : 30,
        background  : null,

        _scenes      : null,
        _sceneIndex  : 0,
        
        /**
         * 初期化
         */
        init: function(canvas)
        {
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
            // グラフィックスを生成
            this.canvas = tm.graphics.Canvas(this.element);
            
            // マウスを生成
            this.mouse      = tm.input.Mouse(this.element);
            // タッチを生成
            this.touch      = tm.input.Touch(this.element);
            // キーボードを生成
            this.keyboard   = tm.input.Keyboard(this.element);
            
            // ポインティングをセット(PC では Mouse, Mobile では Touch)
            this.pointing   = (tm.isMobile) ? this.touch : this.mouse;
            
            // カラー
            this.background = "black";
            
            // シーン周り
            this._scenes = [ tm.app.Scene() ];
            this._sceneIndex = 0;
        },
        
        /**
         * 実行
         */
        run: function()
        {
            var self = this;
            tm.setLoop(function(){ self._loop(); }, 1000/self.fps);
        },
        
        _loop: function()
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
        
        /**
         * シーンを切り替える
         * ## Reference
         * - <http://ameblo.jp/hash-r-1234/entry-10967942550.html>
         */
        replaceScene: function(scene)
        {
            var e = null;
            if (this.currentScene) {
                e = tm.app.Event("exit");
                e.app = this;
                this.currentScene.dispatchEvent(e);
            }
            e = tm.app.Event("enter");
            e.app = this;
            this.currentScene = scene;
            this.currentScene.dispatchEvent(e);
        },
        
        /**
         * シーンをプッシュする
         * ポーズやオブション画面などで使用する
         */
        pushScene: function(scene)
        {
            this._scenes.push(scene);
            ++this._sceneIndex;
            
            e = tm.app.Event("enter");
            e.app = this;
            scene.dispatchEvent(e);
        },
        
        /**
         * シーンをポップする
         * ポーズやオブション画面などで使用する
         */
        popScene: function()
        {
            var scene = this._scenes.pop(scene);
            --this._sceneIndex;
            
            e = tm.app.Event("exit");
            e.app = this;
            scene.dispatchEvent(e);

            return scene;
        },
        
        _update: function()
        {
            // デバイス系 Update
            this.mouse.update();
            this.keyboard.update();
            this.touch.update();
            
            this.currentScene._update(this);
        },
        
        _draw: function()
        {
            this.canvas.clearColor(this.background, 0, 0);
            
            this.canvas.fillStyle   = "white";
            this.canvas.strokeStyle = "white";
            this.currentScene._draw(this.canvas);
        },
        
    });
    
    /**
     * @property    currentScene
     * カレントシーン
     */
    tm.app.CanvasApp.prototype.accessor("currentScene", {
        "get": function() { return this._scenes[this._sceneIndex]; },
        "set": function(v){ this._scenes[this._sceneIndex] = v; }
    });
    
})();
