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
        isPlaying   : null,
        
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
            this.keyboard   = tm.input.Keyboard();
            
            // ポインティングをセット(PC では Mouse, Mobile では Touch)
            this.pointing   = (tm.isMobile) ? this.touch : this.mouse;
            
            // 加速度センサーを生成
            this.accelerometer = tm.input.Accelerometer();
            
            // 再生フラグ
            this.isPlaying = true;
            
            // カラー
            this.background = "black";
            
            // シーン周り
            this._scenes = [ tm.app.Scene() ];
            this._sceneIndex = 0;
            
            // 決定時の処理をオフにする(iPhone 時のちらつき対策)
            this.element.addEventListener("touchstart", function(e) { e.stop(); });
            
            
            // ウィンドウフォーカス時イベントリスナを登録
            window.addEventListener("focus", function() {
                this.currentScene.dispatchEvent(tm.event.Event("focus"));
            }.bind(this));
            // ウィンドウブラー時イベントリスナを登録
            window.addEventListener("blur", function() {
                this.currentScene.dispatchEvent(tm.event.Event("blur"));
            }.bind(this));
        },
        
        resize: function(width, height) {
            this.width = width;
            this.height= height;
            
            return this;
        },
        
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
        },
        
        /**
         * 実行
         */
        run: function()
        {
            var self = this;
            
            // // requestAnimationFrame version
            // var fn = function() {
                // self._loop();
                // requestAnimationFrame(fn);
            // }
            // fn();
            
            tm.setLoop(function(){ self._loop(); }, 1000/this.fps);
            
            return ;
            
            if (true) {
                setTimeout(arguments.callee.bind(this), 1000/this.fps);
                this._loop();
            }
            
            return ;
            
            var self = this;
            // setInterval(function(){ self._loop(); }, 1000/self.fps);
            tm.setLoop(function(){ self._loop(); }, 1000/self.fps);
        },
        
        _loop: function()
        {
            // update
            if (this.update) this.update();
            this._update();
            
            // draw
            if (this.draw) this.draw();
            this._draw();
            
            // stats update
            if (this.stats) this.stats.update();
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
                e = tm.event.Event("exit");
                e.app = this;
                this.currentScene.dispatchEvent(e);
            }
            e = tm.event.Event("enter");
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
            e = tm.event.Event("exit");
            e.app = this;
            this.currentScene.dispatchEvent(e);
            
            this._scenes.push(scene);
            ++this._sceneIndex;
            
            e = tm.event.Event("enter");
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
            
            e = tm.event.Event("exit");
            e.app = this;
            scene.dispatchEvent(e);
            
            // 
            e = tm.event.Event("enter");
            e.app = this;
            this.currentScene.dispatchEvent(e);
            
            return scene;
        },
        
        enableStats: function() {
            if (window["Stats"]) {
                // Stats
                this.stats = new Stats();
                // 右上に設定
                this.stats.domElement.style.position = "fixed";
                this.stats.domElement.style.left     = "5px";
                this.stats.domElement.style.top      = "5px";
                document.body.appendChild(this.stats.domElement);
            }
            else {
                console.warn("not defined stats.");
            }
        },
        
        enableDatGUI: function() {
            if (window.dat) {
                var gui = new dat.GUI();
                
                return gui;
            }
        },
        
        start: function()
        {
            this.isPlaying = true;
        },
        
        stop: function()
        {
            this.isPlaying = false;
        },
        
        _update: function()
        {
            // デバイス系 Update
            this.mouse.update();
            this.keyboard.update();
            this.touch.update();
            
            if (this.isPlaying) {
                this.currentScene._update(this);
                ++this.frame;
            }
        },
        
        _draw: function()
        {
            this.canvas.clearColor(this.background, 0, 0);
            
            this.canvas.fillStyle   = "white";
            this.canvas.strokeStyle = "white";
            
            // 描画は全てのシーン行う
            for (var i=0, len=this._scenes.length; i<len; ++i) {
                this._scenes[i]._draw(this.canvas);
            }
            
            //this.currentScene._draw(this.canvas);
        },
        
        getElement: function() {
            return this.element;
        },
        
    });
    
    
    /**
     * @property    width
     * 幅
     */
    tm.app.CanvasApp.prototype.accessor("width", {
        "get": function()   { return this.canvas.width; },
        "set": function(v)  { this.canvas.width = v; }
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.app.CanvasApp.prototype.accessor("height", {
        "get": function()   { return this.canvas.height; },
        "set": function(v)  { this.canvas.height = v; }
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
