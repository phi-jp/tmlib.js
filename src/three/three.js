/*
 * 
 */

tm.three = tm.three || {};



(function() {

    if (!tm.global.THREE) return ;
    
    /**
     * @class
     * キャンバスアプリケーション
     */
    tm.three.ThreeApp = tm.createClass({

        superClass: tm.app.BaseApp,
        
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

            // 親の初期化
            this.superInit(this.element);

            // レンダラーを生成
//            this.renderer = new THREE.CanvasRenderer({ canvas: this.element });
            this.renderer = new THREE.WebGLRenderer({ canvas: this.element, clearColor: 0x222222, clearAlpha: 1.0 });

            this.renderer.setSize(this.element.width, this.element.height);
            
            // シーン周り
            this._scenes = [ tm.three.Scene() ];
        },
        
        resize: function(width, height) {
            this.width = width;
            this.height= height;
            this.renderer.setSize(this.width, this.height);
            
            return this;
        },
        
        resizeWindow: function() {
            this.width = innerWidth;
            this.height= innerHeight;
            this.renderer.setSize(this.width, this.height);
            
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
        },

        _draw: function()
        {
            // 描画は全てのシーン行う
            for (var i=0, len=this._scenes.length; i<len; ++i) {
                this.renderer.render(this.currentScene, this.currentScene.camera);
            }
        },
        
    });
    
    
    /**
     * @property    width
     * 幅
     */
    tm.three.ThreeApp.prototype.accessor("width", {
        "get": function()   { return this.element.width; },
        "set": function(v)  { this.element.width = v; }
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.three.ThreeApp.prototype.accessor("height", {
        "get": function()   { return this.element.height; },
        "set": function(v)  { this.element.height = v; }
    });
    
})();


(function() {
    
    if (!tm.global.THREE) return ;

    /**
     * @class
     * シーン
     */
    tm.three.Element = tm.createClass({

        superClass: THREE.Object3D,

        /**
         * 初期化
         */
        init: function() {
            // THREE.Object3D の初期化 
            THREE.Object3D.call(this);

            tm.event.EventDispatcher.prototype.init.call(this);
        },
        
        /**
         * 更新処理
         */
        update: function() {},

        _update: function(app) {
            // 更新有効チェック
            if (this.isUpdate == false) return ;
            
            this.update(app);
            
            var e = tm.event.Event("enterframe");
            e.app = app;
            this.dispatchEvent(e);
            // 子供達も実行
            if (this.children.length > 0) {
                var tempChildren = this.children.slice();
                for (var i=0,len=tempChildren.length; i<len; ++i) {
                    var child = tempChildren[i];
                    child._update && child._update(app);
                }
                //this.execChildren(arguments.callee, app);
            }
        },
    });
    
    // tm.event.EventDispatcher を継承
    tm.three.Element.prototype.extendSafe(tm.event.EventDispatcher.prototype);
    
})();

(function() {
    
    if (!tm.global.THREE) return ;

    /**
     * @class
     * Mesh
     */
    tm.three.MeshElement = tm.createClass({
        
        superClass: THREE.Mesh,
        
        /**
         * 初期化
         */
        init: function(geometry, material) {
            material = material || new THREE.MeshNormalMaterial();
            // THREE.Mesh の初期化
            THREE.Mesh.call(this, geometry, material);

            tm.three.Element.prototype.init.call(this);
        },
    });
    
    // tm.three.Element を継承
    tm.three.MeshElement.prototype.extendSafe(tm.three.Element.prototype);

    
    tm.three.CubeElement = tm.createClass({
        superClass: tm.three.MeshElement,

        init: function(width, height, depth) {
            width  = width || 100;
            height = height || 100;
            depth  = depth || 100;

            var geometry = new THREE.CubeGeometry(width, height, depth);
            var material = new THREE.MeshNormalMaterial();

            this.superInit(geometry, material);
        }
    });



    tm.three.SphereElement = tm.createClass({
        superClass: tm.three.MeshElement,

        init: function(radius, widthSegments, heightSegments) {
            radius          = radius || 45;
            widthSegments   = widthSegments || 16;
            heightSegments  = heightSegments || 12;

            var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
            var material = new THREE.MeshNormalMaterial();

            this.superInit(geometry, material);
        }
    });


    tm.three.PlaneElement = tm.createClass({
        superClass: tm.three.MeshElement,

        init: function(width, height) {
            var geometry = new THREE.PlaneGeometry(width, height);
            var material = new THREE.MeshNormalMaterial();

            this.superInit(geometry, material);
        }
    });


    tm.three.FloorElement = tm.createClass({
        superClass: tm.three.MeshElement,

        init: function(width, height) {
            width  = width || 1000;
            height = height || 1000;
            var geometry = new THREE.PlaneGeometry(width, height);
            var material = new THREE.MeshBasicMaterial();

            this.superInit(geometry, material);

            this.rotation.x = -Math.PI/2;
            this._render();
        },

        _render: function() {
            var c = tm.graphics.Canvas();
            c.resize(128, 128);
            c.clearColor("#444");
            c.setFillStyle("white");
            c.fillRect(0, 0, 64, 64);
            c.fillRect(64, 64, 64, 64);

            var texture = new THREE.Texture(c.element);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
            texture.needsUpdate = true;
            this.material.map = texture;
        }
    });


    tm.three.TextElement = tm.createClass({
        superClass: tm.three.MeshElement,

        init: function(text, param) {
            var geometry = new THREE.TextGeometry(text, param);
            var material = new THREE.MeshNormalMaterial();

            this.superInit(geometry, material);
        }
    });


    tm.three.CanvasTexture = tm.createClass({
        superClass: THREE.Texture,

        canvas: null,

        init: function() {
            this.canvas = tm.graphics.Canvas();

            THREE.Texture.call(this, this.canvas.element);
            this.needsUpdate = true;
        }

    });


})();

(function() {
    
    if (!tm.global.THREE) return ;

    /**
     * @class
     * シーン
     */
    tm.three.Scene = tm.createClass({
        
        superClass: THREE.Scene,
        
        /**
         * 初期化
         */
        init: function(fov, aspect) {
            fov = fov || 60;
            aspect = aspect || 640/480;
            // THREE.Scene の初期化
            THREE.Scene.call(this);

            // tm.three.Element を継承
            tm.three.Element.prototype.init.call(this);

            this.camera = new THREE.PerspectiveCamera(fov, aspect, 1, 10000);
            this.camera.position.y = 100;
            this.camera.position.z = 500;

            this.projector = new THREE.Projector();
        },

        intersect: function(objects) {
            objects = objects || this.children;
            var mouseX = this.app.pointing.x;
            var mouseY = this.app.pointing.y;

            mouseX = (mouseX/this.app.width) *2-1;
            mouseY =-(mouseY/this.app.height)*2+1;

            var vector = new THREE.Vector3(mouseX, mouseY, 0.5);
            this.projector.unprojectVector(vector, this.camera);

            var raycaster = new THREE.Raycaster(
                this.camera.position, vector.sub(this.camera.position).normalize()
            );

            return raycaster.intersectObjects(objects);
        }
    });
    
    // tm.three.Element を継承
    tm.three.Scene.prototype.extendSafe(tm.three.Element.prototype);
})();