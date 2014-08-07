/*
 * object2d.js
 */

(function() {
    
    /**
     * @class tm.app.Object2D
     * Object2D
     * @extends tm.app.Element
     */
    tm.define("tm.app.Object2D", {
        superClass: "tm.app.Element",
        
        /** 位置 */
        position: null,
        /** スケール */
        scale: null,
        /** 回転 */
        rotation: 0,
        /** 起きているフラグ */
        awake: true,
        /** @private  幅 */
        _width:  64,
        /** @private  高さ */
        _height: 64,
        /** @property pointing      ポインティング */
        /** @property origin        中心位置 */
        /** @property _matrix       マトリックス */
        /** @property hitFlags      ヒット判定フラグ */
        /** @property downFlags     ダウンフラグ */
        /** @property _worldMatrix  グローバル行列 */
        /** @property _worldAlpha   グローバルのα値 */
        
        /**
         * @constructor
         * @param {Object} elm
         */
        init: function() {
            this.superInit();
            this.position = tm.geom.Vector2(0, 0);
            this.scale    = tm.geom.Vector2(1, 1);
            this.pointing = tm.geom.Vector2(0, 0);
            this.origin   = tm.geom.Vector2(0.5, 0.5);
            this._matrix  = tm.geom.Matrix33();
            this._matrix.identity();
            
            this.boundingType = "circle";
            this.interactive = false;
            this.hitFlags = [];
            this.downFlags= [];
            this._clickFlag = false;

            this._worldMatrix = tm.geom.Matrix33();
            this._worldMatrix.identity();
            this._worldAlpha = 1.0;
        },
        
        /**
         * 最終的な行列をゲット
         */
        getFinalMatrix: function() {
            var matrix = tm.geom.Matrix33();
 
            if (this.parent) {
                matrix.multiply(this.parent.getFinalMatrix());
            }
            matrix.translate(this.centerX, this.centerY);
            matrix.rotateZ(this.rotation*Math.DEG_TO_RAD);
            matrix.scale(this.scaleX, this.scaleY);
 
            return matrix;
        },
        
        /**
         * 点と衝突しているかを判定
         * @param {Number} x
         * @param {Number} y
         */
        isHitPoint: function(x, y) {
            // 円判定
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            if (((p.x)*(p.x)+(p.y)*(p.y)) < (this.radius*this.radius)) {
                return true;
            }
            return false;
        },
 
        /**
         * 円として点と衝突判定
         * @param {Number} x
         * @param {Number} y
         */
        isHitPointCircle: function(x, y) {
            var lenX = this.x - x;
            var lenY = this.y - y;
            if (((lenX)*(lenX)+(lenY)*(lenY)) < (this.radius*this.radius)) {
                return true;
            }
            return false;
        },
 
        /**
         * 矩形として点と衝突判定
         * @param {Number} x
         * @param {Number} y
         */
        isHitPointRect: function(x, y) {
            // ここから下のバージョンは四角形
            
            var left   = this.x - this.width*this.originX;
            var right  = this.x + this.width*(1-this.originX);
            var top    = this.y - this.height*this.originY;
            var bottom = this.y + this.height*(1-this.originY);
            
            if ( left < x && x < right && top  < y && y < bottom ) { return true; }
            
            return false;
        },
        
        /**
         * 階層を考慮した円衝突判定
         * @param {Number} x
         * @param {Number} y
         */
        isHitPointCircleHierarchy: function(x, y) {
            // 円判定
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            if (((p.x)*(p.x)+(p.y)*(p.y)) < (this.radius*this.radius)) {
                return true;
            }
            return false;
        },
        
        /**
         * 階層を考慮した矩形衝突判定
         * @param {Number} x
         * @param {Number} y
         */
        isHitPointRectHierarchy: function(x, y) {
            var p = this.globalToLocal(tm.geom.Vector2(x, y));
            this.pointing.x = p.x;
            this.pointing.y = p.y;
            
            var left   = -this.width*this.originX;
            var right  = +this.width*(1-this.originX);
            var top    = -this.height*this.originY;
            var bottom = +this.height*(1-this.originY);
            
            if ( left < p.x && p.x < right && top  < p.y && p.y < bottom ) { return true; }
            
            return false;
        },
        
        /**
         * 要素と衝突しているかを判定
         * @param {Object} elm
         */
        isHitElement: function(elm) {
            var selfGlobalPos  = this.parent.localToGlobal(this);
            if (((this.x-elm.x)*(this.x-elm.x)+(this.y-elm.y)*(this.y-elm.y)) < (this.radius+elm.radius)*(this.radius+elm.radius)) {
                return true;
            }
            return false;
        },
 
        /**
         * 円同士の衝突判定
         * @param {Object} elm
         */
        isHitElementCircle: function(elm) {
            return tm.collision.testCircleCircle(this.getBoundingCircle(), elm.getBoundingCircle());
        },
 
        /**
         * 円同士の衝突判定
         * @param {Object} elm
         */
        isHitElementRect: function(elm) {
            return tm.collision.testRectRect(this.getBoundingRect(), elm.getBoundingRect());    
        },
 
        /**
         * バウンディングサークル
         * @param {Object} elm
         */
        getBoundingCircle: function() {
            return tm.geom.Circle(this.centerX, this.centerY, this.radius);
        },
 
        /**
         * バウンディングレクト
         * @param {Object} elm
         */
        getBoundingRect: function() {
            return tm.geom.Rect(this.left, this.top, this.width, this.height);
        },
 
        /**
         * ローカル座標をグローバル座標に変換
         * @param {Object} elm
         */
        localToGlobal: function(p) {
            return this.getFinalMatrix().multiplyVector2(p);
        },
        
        /**
         * グローバル座標をローカル座標に変換
         * @param {Object} elm
         */
        globalToLocal: function(p) {
            // var matrix = this.getFinalMatrix();
            var matrix = this._worldMatrix.clone();
            matrix.invert();
            matrix.transpose();
            
            return matrix.multiplyVector2(p);
        },
        
        /**
         * X 座標値をセット
         * @param {Number} x
         */
        setX: function(x) {
            this.position.x = x;
            return this;
        },
        
        /**
         * Y 座標値をセット
         * @param {Number} y
         */
        setY: function(y) {
            this.position.y = y;
            return this;
        },
        
        /**
         * XY 座標をセット
         * @param {Number} x
         * @param {Number} y
         */
        setPosition: function(x, y) {
            this.position.x = x;
            this.position.y = y;
            return this;
        },

        /**
         * 回転をセット
         * @param {Number} rotation
         */
        setRotation: function(rotation) {
            this.rotation = rotation;
            return this;
        },

        /**
         * スケールをセット
         * @param {Number} x
         * @param {Number} y
         */
        setScale: function(x, y) {
            this.scale.x = x;
            if (arguments.length <= 1) {
                this.scale.y = x;
            } else {
                this.scale.y = y;
            }
            return this;
        },
        
        /**
         * 基準点をセット
         * @param {Number} x
         * @param {Number} y
         */
        setOrigin: function(x, y) {
            this.origin.x = x;
            this.origin.y = y;
            return this;
        },
        
        /**
         * 幅をセット
         * @param {Number} width
         */
        setWidth: function(width) {
            this.width = width;
            return this;
        },
        
        /**
         * 高さをセット
         * @param {Number} height
         */
        setHeight: function(height) {
            this.height = height;
            return this;
        },
        
        /**
         * サイズ(幅, 高さ)をセット
         * @param {Number} width
         * @param {Number} height
         */
        setSize: function(width, height) {
            this.width  = width;
            this.height = height;
            return this;
        },
        
        /**
         * 起動
         */
        wakeUp: function() {
            this.awake = true;
            return this;
        },
        
        /**
         * 停止
         */
        sleep: function() {
            this.awake = false;
            return this;
        },
        
        /**
         * タッチ判定の有効/無効をセット
         * @param {Boolean} flag
         */
        setInteractive: function(flag) {
            this.interactive = flag;
            return this;
        },
        
        /**
         * バウンディングタイプをセット("circle" or "rect")
         * @param {Object} type
         */
        setBoundingType: function(type) {
            this.boundingType = type;
            return this;
        },
        
        /**
         * ポインティングをチェック
         * @private
         * @param {Object} app
         */
        _checkPointing: function(app) {
            console.assert(false);
        },
        
        /**
         * マウスチェック
         * @private
         * @param {Object} app
         */
        _checkMouse: function(app) {
            this.__checkPointing(app, app.pointing, 0);
        },

        /**
         * タッチチェック
         * @private
         * @param {Object} app
         */
        _checkTouch: function(app) {
            var self = this;
            this.__checkPointing(app, app.pointing, 0);
            // app.touches.each(function(touch, i) {
            //     self.__checkPointing(app, touch, i);
            // });
        },
        
        /**
         * チェックポインンティング
         * @private
         * @param {Object} app
         * @param {Object} p
         * @param {Number} index
         */
        __checkPointing: function(app, p, index) {
            var elm = this.element;
            
            var prevHitFlag = this.hitFlags[index];
            this.hitFlags[index]    = this.isHitPoint(p.x, p.y);

            if (!prevHitFlag && this.hitFlags[index]) {
                this._dispatchPointingEvent("mouseover", "touchover", "pointingover", app, p);
            }
            
            if (prevHitFlag && !this.hitFlags[index]) {
                this._dispatchPointingEvent("mouseout", "touchout", "pointingout", app, p);
            }
            
            if (this.hitFlags[index]) {
                if (p.getPointingStart()) {
                    this._dispatchPointingEvent("mousedown", "touchstart", "pointingstart", app, p);
                    this.downFlags[index] = true;
                    this._clickFlag = true;
                }
            }
            
            if (this.downFlags[index]) {
                this._dispatchPointingEvent("mousemove", "touchmove", "pointingmove", app, p);
            }
            
            if (this.downFlags[index]==true && p.getPointingEnd()) {
                this._dispatchPointingEvent("mouseup", "touchend", "pointingend", app, p);
                this.downFlags[index] = false;
            }
        },
        
        /**
         * ポイントイベントを発火する
         * @private
         * @param {Object} mouse
         * @param {Object} touch
         * @param {Object} pointing
         * @param {Object} app
         * @param {Object} p
         */
        _dispatchPointingEvent: function(mouse, touch, pointing, app, p) {
            this.dispatchEvent( tm.event.MouseEvent(mouse, app, p) );
            this.dispatchEvent( tm.event.TouchEvent(touch, app, p) );
            this.dispatchEvent( tm.event.PointingEvent(pointing, app, p) );
        },
        
        /**
         * ワールドマトリックスを計算
         * @private
         */
        _calcWorldMatrix: function() {
            if (!this.parent) {
                return ;
            }

            // 行列
            if(this.rotation != this.rotationCache) {
                this.rotationCache = this.rotation;
                var r = this.rotation*Math.DEG_TO_RAD;
                this._sr =  Math.sin(r);
                this._cr =  Math.cos(r);
            }

            var localTransform = this._matrix.m;
            var parentTransform = this.parent._worldMatrix.m;
            var worldTransform = this._worldMatrix.m;
            //console.log(localTransform)
            localTransform[0] = this._cr * this.scale.x;
            localTransform[1] =-this._sr * this.scale.y
            localTransform[3] = this._sr * this.scale.x;
            localTransform[4] = this._cr * this.scale.y;

            ///AAARR GETTER SETTTER!
            localTransform[2] = this.position.x;
            localTransform[5] = this.position.y;

            // Cache the matrix values (makes for huge speed increases!)
            var a00 = localTransform[0], a01 = localTransform[1], a02 = localTransform[2],
                a10 = localTransform[3], a11 = localTransform[4], a12 = localTransform[5],

                b00 = parentTransform[0], b01 = parentTransform[1], b02 = parentTransform[2],
                b10 = parentTransform[3], b11 = parentTransform[4], b12 = parentTransform[5];

            worldTransform[0] = b00 * a00 + b01 * a10;
            worldTransform[1] = b00 * a01 + b01 * a11;
            worldTransform[2] = b00 * a02 + b01 * a12 + b02;

            worldTransform[3] = b10 * a00 + b11 * a10;
            worldTransform[4] = b10 * a01 + b11 * a11;
            worldTransform[5] = b10 * a02 + b11 * a12 + b12;
        },
        
        /**
         * dirty method
         * @private
         */
        _dirtyCalc: function() {
            this._calcWorldMatrix();
        },
    });
 
    /**
     * @property    x
     * x座標値
     */
    tm.app.Object2D.prototype.accessor("x", {
        "get": function()   { return this.position.x; },
        "set": function(v)  { this.position.x = v; }
    });
    
    /**
     * @property    y
     * y座標値
     */
    tm.app.Object2D.prototype.accessor("y", {
        "get": function()   { return this.position.y; },
        "set": function(v)  { this.position.y = v; }
    });
 
    /**
     * @property    originX
     * x座標値
     */
    tm.app.Object2D.prototype.accessor("originX", {
        "get": function()   { return this.origin.x; },
        "set": function(v)  { this.origin.x = v; }
    });
    
    /**
     * @property    originY
     * y座標値
     */
    tm.app.Object2D.prototype.accessor("originY", {
        "get": function()   { return this.origin.y; },
        "set": function(v)  { this.origin.y = v; }
    });
    
    /**
     * @property    scaleX
     * スケールX値
     */
    tm.app.Object2D.prototype.accessor("scaleX", {
        "get": function()   { return this.scale.x; },
        "set": function(v)  { this.scale.x = v; }
    });
    
    /**
     * @property    scaleY
     * スケールY値
     */
    tm.app.Object2D.prototype.accessor("scaleY", {
        "get": function()   { return this.scale.y; },
        "set": function(v)  { this.scale.y = v; }
    });
    
    
    
    /**
     * @property    width
     * width
     */
    tm.app.Object2D.prototype.accessor("width", {
        "get": function()   { return this._width; },
        "set": function(v)  { this._width = v; }
    });
    
    
    /**
     * @property    height
     * height
     */
    tm.app.Object2D.prototype.accessor("height", {
        "get": function()   { return this._height; },
        "set": function(v)  { this._height = v; }
    });
    
    /**
     * @property    radius
     * 半径
     */
    tm.app.Object2D.prototype.accessor("radius", {
        "get": function()   {
            return (this._radius !== undefined) ? this._radius : (this.width+this.height)/4;
        },
        "set": function(v)  { this._radius = v; }
    });
    
    /**
     * @property    top
     * 左
     */
    tm.app.Object2D.prototype.getter("top", function() {
        return this.y - this.height*this.originY;
    });
 
    /**
     * @property    right
     * 左
     */
    tm.app.Object2D.prototype.getter("right", function() {
        return this.x + this.width*(1-this.originX);
    });
 
    /**
     * @property    bottom
     * 左
     */
    tm.app.Object2D.prototype.getter("bottom", function() {
        return this.y + this.height*(1-this.originY);
    });
 
    /**
     * @property    left
     * 左
     */
    tm.app.Object2D.prototype.getter("left", function() {
        return this.x - this.width*this.originX;
    });
 
    /**
     * @property    centerX
     * centerX
     */
    tm.app.Object2D.prototype.accessor("centerX", {
        "get": function()   { return this.x + this.width/2 - this.width*this.originX; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
 
    /**
     * @property    centerY
     * centerY
     */
    tm.app.Object2D.prototype.accessor("centerY", {
        "get": function()   { return this.y + this.height/2 - this.height*this.originY; },
        "set": function(v)  {
            // TODO: どうしようかな??
        }
    });
 
    /**
     * @property    boundingType
     * boundingType
     */
    tm.app.Object2D.prototype.accessor("boundingType", {
        "get": function() {
            return this._boundingType;
        },
        "set": function(v) {
            this._boundingType = v;
            this._setIsHitFunc();
        },
    });
 
    /**
     * @property    checkHierarchy
     * checkHierarchy
     */
    tm.app.Object2D.prototype.accessor("checkHierarchy", {
        "get": function()   { return this._checkHierarchy; },
        "set": function(v)  {
            this._checkHierarchy = v;
            this._setIsHitFunc();
        }
    });
 
 
    var _isHitFuncMap = {
        "rect": tm.app.Object2D.prototype.isHitPointRect,
        "circle": tm.app.Object2D.prototype.isHitPointCircle,
        "true": function() { return true; },
        "false": function() { return false; },
    };
 
    var _isHitFuncMapHierarchy = {
        "rect": tm.app.Object2D.prototype.isHitPointRectHierarchy,
        "circle": tm.app.Object2D.prototype.isHitPointCircleHierarchy,
        "true": function() { return true; },
        "false": function() { return false; },
    };
 
    var _isHitElementMap = {
        "rect": tm.app.Object2D.prototype.isHitElementRect,
        "circle": tm.app.Object2D.prototype.isHitElementCircle,
        "true": function() { return true; },
        "false": function() { return false; },
    };
 
    /**
     * @member      tm.app.Object2D
     * @property    _setIsHitFunc
     * @private
     */
    tm.app.Object2D.prototype._setIsHitFunc = function() {
        var isHitFuncMap = (this.checkHierarchy) ? _isHitFuncMapHierarchy : _isHitFuncMap;
        var boundingType = this.boundingType;
        var isHitFunc = (isHitFuncMap[boundingType]) ? (isHitFuncMap[boundingType]) : (isHitFuncMap["true"]);
 
        this.isHitPoint   = (isHitFuncMap[boundingType]) ? (isHitFuncMap[boundingType]) : (isHitFuncMap["true"]);
        this.isHitElement = (_isHitElementMap[boundingType]) ? (_isHitElementMap[boundingType]) : (_isHitElementMap["true"]);
    };
    
    /**
     * @member      tm.app.Object2D
     * @property    _checkPointing
     * ポイントをチェック
     * @param {Object} isMobile
     * @private
     */
    tm.app.Object2D.prototype._checkPointing = (tm.isMobile) ?
        tm.app.Object2D.prototype._checkTouch : tm.app.Object2D.prototype._checkMouse;

    
})();
