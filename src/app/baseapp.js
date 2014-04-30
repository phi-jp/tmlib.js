/*
 * baseapp.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class tm.app.BaseApp
     * ベースアプリケーション
     */
    tm.app.BaseApp = tm.createClass({

        superClass: tm.event.EventDispatcher,
        
        /** エレメント */
        element       : null,
        /** マウスクラス */
        mouse         : null,
        /** タッチクラス */
        touch         : null,
        /** マウスクラス + タッチクラス */
        pointing      : null,
        /** キーボードクラス */
        keyboard      : null,
        /** 加速度センサー */
        accelerometer : null,
        /** statsライブラリ */
        stats         : null,
        /** タイマー */
        timer         : null,
        /** フレームレート */
        fps           : 30,
        /** 現在更新中か */
        isPlaying     : null,
        /** @private  シーン情報の管理 */
        _scenes       : null,
        /** @private  シーンのインデックス */
        _sceneIndex   : 0,

        /**
         * @constructor
         * @param {Object} elm
         */
        init: function(elm) {
            this.superInit();

            this.element = elm;

            // タイマー
            this.timer = tm.app.Timer();

            // マウスを生成
            this.mouse      = tm.input.Mouse(this.element);
            // タッチを生成
            this.touch      = tm.input.Touch(this.element, 0);
            // キーボードを生成
            this.keyboard   = tm.input.Keyboard();
            
            // ポインティングをセット(PC では Mouse, Mobile では Touch)
            this.pointing   = (tm.isMobile) ? this.touch : this.mouse;
            
            // 加速度センサーを生成
            this.accelerometer = tm.input.Accelerometer();
            
            // 再生フラグ
            this.isPlaying = true;
            
            // シーン周り
            this._scenes = [ tm.app.Scene() ];
            this._sceneIndex = 0;
            
            // 決定時の処理をオフにする(iPhone 時のちらつき対策)
            this.element.addEventListener("touchstart", function(e) { e.stop(); });
            this.element.addEventListener("touchmove", function(e) { e.stop(); });
            
            // ウィンドウフォーカス時イベントリスナを登録
            window.addEventListener("focus", function() {
                this.currentScene.dispatchEvent(tm.event.Event("focus"));
            }.bind(this));
            // ウィンドウブラー時イベントリスナを登録
            window.addEventListener("blur", function() {
                this.currentScene.dispatchEvent(tm.event.Event("blur"));
            }.bind(this));
            // クリック
            this.element.addEventListener((tm.isMobile) ? "touchstart" : "mousedown", this._onclick.bind(this));
        },
        
        /**
         * 実行
         */
        run: function() {
            var self = this;
            
            // // requestAnimationFrame version
            // var fn = function() {
                // self._loop();
                // requestAnimationFrame(fn);
            // }
            // fn();
            
            tm.setLoop(function(){ self._loop(); }, this.timer.frameTime);
            
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
        
        /*
         * ループ処理
         * @private
         */
        _loop: function() {
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
         * @param {Object} scene
         * ## Reference
         * - <http://ameblo.jp/hash-r-1234/entry-10967942550.html>
         */
        replaceScene: function(scene) {
            var e = null;
            if (this.currentScene) {
                e = tm.event.Event("exit");
                e.app = this;
                this.currentScene.dispatchEvent(e);
                this.currentScene.app = null;
            }
            e = tm.event.Event("enter");
            e.app = this;
            this.currentScene = scene;
            this.currentScene.app = this;
            this.currentScene.dispatchEvent(e);

            return this;
        },
        
        /**
         * シーンをプッシュする(ポーズやオブション画面などで使用)
         * @param {Object} scene
         */
        pushScene: function(scene) {
            this.fire(tm.event.Event("push"));

            var e = tm.event.Event("pause");
            e.app = this;
            this.currentScene.dispatchEvent(e);
            
            this._scenes.push(scene);
            ++this._sceneIndex;
            
            this.fire(tm.event.Event("pushed"));

            var e = tm.event.Event("enter");
            e.app = this;
            scene.app = this;
            scene.dispatchEvent(e);


            return this;
        },
        
        /**
         * シーンをポップする(ポーズやオブション画面などで使用)
         */
        popScene: function() {
            this.fire(tm.event.Event("pop"));
            
            var scene = this._scenes.pop();
            --this._sceneIndex;
            
            var e = tm.event.Event("exit");
            e.app = this;
            scene.dispatchEvent(e);
            scene.app = null;

            this.fire(tm.event.Event("poped"));
            
            // 
            var e = tm.event.Event("resume");
            e.app = this;
            this.currentScene.dispatchEvent(e);
            
            return scene;
        },
        
        /**
         * 外部のFPS表示ライブラリ Stats を生成、配置する
         * ## Reference
         * - <https://github.com/mrdoob/stats.js>
         */
        enableStats: function() {
            if (window["Stats"]) {
                // Stats
                this.stats = new Stats();
                // 右上に設定
                this.stats.domElement.style.position = "fixed";
                this.stats.domElement.style.left     = "5px";
                this.stats.domElement.style.top      = "20px";
                document.body.appendChild(this.stats.domElement);
            }
            else {
                console.warn("not defined stats.");
            }

            return this;
        },
        
        /**
         * dat gui を有効化
         */
        enableDatGUI: function() {
            if (window.dat) {
                var gui = new dat.GUI();
                
                return gui;
            }
        },
        
        /**
         * シーンのupdateを実行するようにする
         */
        start: function() {
            this.isPlaying = true;

            return this;
        },
        
        /**
         * シーンのupdateを実行しないようにする
         */
        stop: function() {
            this.isPlaying = false;

            return this;
        },
        
        /**
         * デバイスやシーンのアップデート呼び出し処理
         * @private
         */
        _update: function() {
            // デバイス系 Update
            this.mouse.update();
            this.keyboard._update();
            this.touch.update();
            // this.touches.update();
            
            if (this.isPlaying) {
                this._updateElement(this.currentScene);
                this.timer.update();
            }
        },

        _updateElement: function(elm) {
            if (elm.isUpdate == false) return ;

            elm._update && elm._update(this);

            var len = elm.children.length;
            if (len > 0) {
                var tempChildren = elm.children.slice();
                for (var i=0; i<len; ++i) {
                    this._updateElement(tempChildren[i]);
                }
            }
        },
        
        /**
         * 描画用仮想関数
         * @private
         */
        _draw: function() {},
        
        /**
         * elementの取得
         */
        getElement: function() {
            return this.element;
        },

        /**
         * クリックイベント登録
         * @private
         * @param {Object} e
         */
        _onclick: function(e) {
            var px = e.pointX;
            var py = e.pointY;

            if (this.element.style.width) {
                px *= this.element.width / parseInt(this.element.style.width);
            }
            if (this.element.style.height) {
                py *= this.element.height / parseInt(this.element.style.height);
            }

            var _fn = function(elm) {
                if (elm.children.length > 0) {
                    elm.children.each(function(elm) {
                        if (elm.hasEventListener("click")) {
                            if (elm.isHitPoint && elm.isHitPoint(px, py)) {
                                elm.dispatchEvent(tm.event.Event("click"));
                            }
                        }
                    });
                }
            };
            _fn(this.currentScene);
        },
    });
    
    /**
     * @property currentScene
     * カレントシーン
     */
    tm.app.BaseApp.prototype.accessor("currentScene", {
        "get": function() { return this._scenes[this._sceneIndex]; },
        "set": function(v){ this._scenes[this._sceneIndex] = v; }
    });
    
    /**
     * @property frame
     * フレーム
     */
    tm.app.BaseApp.prototype.accessor("frame", {
        "get": function() {
            return this.timer.frame;
        },
        "set": function(v){
            this.timer.frame = v;
        }
    });
    
    /**
     * @property fps
     * fps
     */
    tm.app.BaseApp.prototype.accessor("fps", {
        "get": function() {
            return this.timer.fps;
        },
        "set": function(v){
            this.timer.fps = v;
        }
    });
    
})();













