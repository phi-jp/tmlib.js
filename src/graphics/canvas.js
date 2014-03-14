/*
 * canvas.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    /**
     * @class tm.graphics.Canvas
     * キャンバス
     */
    tm.graphics.Canvas = tm.createClass({
        
        /** 要素 */
        element: null,
        
        /** キャンバス */
        canvas: null,
        
        /** コンテキスト */
        context: null,
        
        /**
         * @constructor
         */
        init: function(canvas) {
            this.canvas = null;
            if (typeof canvas == "string") {
                this.canvas = document.querySelector(canvas);
            }
            else {
                this.canvas = canvas || document.createElement("canvas");
            }
            this.element            = this.canvas;
            this.context            = this.canvas.getContext("2d");
            this.context.lineCap    = "round";
            this.context.lineJoin   = "round";
        },
        
        /**
         * リサイズする
         */
        resize: function(width, height) {
            this.canvas.width   = width;
            this.canvas.height  = height;
            return this;
        },
        
        /**
         * リサイズウィンドウ
         */
        resizeWindow: function() {
            this.canvas.style.position  = "fixed";
            this.canvas.style.margin    = "0px";
            this.canvas.style.padding   = "0px";
            this.canvas.style.left      = "0px";
            this.canvas.style.top       = "0px";
            return this.resize(window.innerWidth, window.innerHeight);
        },
        
        /**
         * フィット
         */
        resizeToFitScreen: function() {
            this.canvas.style.position  = "fixed";
            this.canvas.style.margin    = "0px";
            this.canvas.style.padding   = "0px";
            this.canvas.style.left      = "0px";
            this.canvas.style.top       = "0px";
            return this.resize(window.innerWidth, window.innerHeight);
        },
        
        /**
         * 拡縮で画面にフィットさせる
         * 名前は仮. 検討する
         */
        fitWindow: function(everFlag) {
            var _fitFunc = function() {
                everFlag = everFlag === undefined ? true : everFlag;
                var e = this.element;
                var s = e.style;
                
                s.position = "absolute";
                s.margin = "auto";
                s.left = "0px";
                s.top  = "0px";
                s.bottom = "0px";
                s.right = "0px";

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
        },
        
        /**
         * クリア
         */
        clear: function(x, y, width, height) {
            x = x || 0;
            y = y || 0;
            width = width || this.width;
            height= height|| this.height;
            this.context.clearRect(x, y, width, height);
            return this;
        },
        
        
        /**
         * 色指定クリア
         * @param {String}  fillStyle
         * @param {Number}  [x=0]
         * @param {Number}  [y=0]
         * @param {Number}  [width=this.width]
         * @param {Number}  [height=this.height]
         */
        clearColor: function(fillStyle, x, y, width, height) {
            x = x || 0;
            y = y || 0;
            width = width || this.width;
            height= height|| this.height;
            
            this.save();
            this.resetTransform();          // 行列初期化
            this.fillStyle = fillStyle;     // 塗りつぶしスタイルセット
            this.context.fillRect(x, y, width, height);
            this.restore();
            
            return this;
        },
                
        /**
         * パスを開始(リセット)
         */
        beginPath: function() {
            this.context.beginPath();
            return this;
        },
                
        /**
         *  パスを閉じる
         */
        closePath: function() {
            this.context.closePath();
            return this;
        },
        

        /**
         *  新規パス生成
         */
        moveTo: function(x, y) {
            this.context.moveTo(x, y);
            return this;
        },
        
        /**
         * パスに追加
         */
        lineTo: function(x, y) {
            this.context.lineTo(x, y);
            return this;
        },
        
        /**
         * パス内を塗りつぶす
         */
        fill: function() {
            this.context.fill();
            return this;
        },
        
        /**
         * パス上にラインを引く
         */
        stroke: function() {
            this.context.stroke();
            return this;
        },
        
        /**
         * クリップ
         */
        clip: function() {
            this.context.clip();
            return this;
        },
        
        /**
         * 点描画
         */
        drawPoint: function(x, y) {
            return this.strokeRect(x, y, 1, 1);
            // return this.beginPath().moveTo(x-0.5, y-0.5).lineTo(x+0.5, y+0.5).stroke();
        },

        /**
         * ラインパスを作成
         */
        line: function(x0, y0, x1, y1) {
            return this.moveTo(x0, y0).lineTo(x1, y1);
        },
        
        /**
         * ラインを描画
         */
        drawLine: function(x0, y0, x1, y1) {
            return this.beginPath().line(x0, y0, x1, y1).stroke();
        },
        
        /**
         * ダッシュラインを描画
         */
        drawDashLine: function(x0, y0, x1, y1, pattern) {
            var patternTable = null;
            if (typeof(pattern) == "string") {
                patternTable = pattern;
            }
            else {
                pattern = pattern || 0xf0f0;
                patternTable = pattern.toString(2);
            }
            patternTable = patternTable.padding(16, '1');
            
            var vx = x1-x0;
            var vy = y1-y0;
            var len = Math.sqrt(vx*vx + vy*vy);
            vx/=len; vy/=len;
            
            var x = x0;
            var y = y0;
            for (var i=0; i<len; ++i) {
                if (patternTable[i%16] == '1') {
                    this.drawPoint(x, y);
                    // this.fillRect(x, y, this.context.lineWidth, this.context.lineWidth);
                }
                x += vx;
                y += vy;
            }
            
            return this;
        },
        
        /**
         * v0(x0, y0), v1(x1, y1) から角度を求めて矢印を描画
         * http://hakuhin.jp/as/rotation.html
         */
        drawArrow: function(x0, y0, x1, y1, arrowRadius) {
            var vx = x1-x0;
            var vy = y1-y0;
            var angle = Math.atan2(vy, vx)*180/Math.PI;
            
            this.drawLine(x0, y0, x1, y1);
            this.fillPolygon(x1, y1, arrowRadius || 5, 3, angle);
            
            return this;
        },
        
        
        /**
         * lines
         */
        lines: function() {
            this.moveTo(arguments[0], arguments[1]);
            for (var i=1,len=arguments.length/2; i<len; ++i) {
                this.lineTo(arguments[i*2], arguments[i*2+1]);
            }
            return this;
        },

        /**
         * ラインストローク描画
         */
        strokeLines: function() {
            this.beginPath();
            this.lines.apply(this, arguments);
            this.stroke();
            return this;
        },

        /**
         * ライン塗りつぶし描画
         */
        fillLines: function() {
            this.beginPath();
            this.lines.apply(this, arguments);
            this.fill();
            return this;
        },
        
        /**
         * 四角形パスを作成する
         */
        rect: function(x, y, width, height) {
            this.context.rect.apply(this.context, arguments);
            return this;
        },
        
        /**
         * 四角形塗りつぶし描画
         */
        fillRect: function() {
            this.context.fillRect.apply(this.context, arguments);
            return this;
        },
        
        /**
         * 四角形ライン描画
         */
        strokeRect: function() {
            this.context.strokeRect.apply(this.context, arguments);
            return this;
        },
        
        /**
         * 角丸四角形パス
         */
        roundRect: function(x, y, width, height, radius) {
            var l = x + radius;
            var r = x + width - radius;
            var t = y + radius;
            var b = y + height - radius;
            
            /*
            var ctx = this.context;
            ctx.moveTo(l, y);
            ctx.lineTo(r, y);
            ctx.quadraticCurveTo(x+width, y, x+width, t);
            ctx.lineTo(x+width, b);
            ctx.quadraticCurveTo(x+width, y+height, r, y+height);
            ctx.lineTo(l, y+height);
            ctx.quadraticCurveTo(x, y+height, x, b);
            ctx.lineTo(x, t);
            ctx.quadraticCurveTo(x, y, l, y);
            /**/
            
            this.context.arc(l, t, radius,     -Math.PI, -Math.PI*0.5, false);  // 左上
            this.context.arc(r, t, radius, -Math.PI*0.5,            0, false);  // 右上
            this.context.arc(r, b, radius,            0,  Math.PI*0.5, false);  // 右下
            this.context.arc(l, b, radius,  Math.PI*0.5,      Math.PI, false);  // 左下
            this.closePath();
            
            return this;
        },
        /**
         * 角丸四角形塗りつぶし
         */
        fillRoundRect: function(x, y, width, height, radius) {
            return this.beginPath().roundRect(x, y, width, height, radius).fill();
        },
        /**
         * 角丸四角形ストローク描画
         */
        strokeRoundRect: function(x, y, width, height, radius) {
            return this.beginPath().roundRect(x, y, width, height, radius).stroke();
        },
        
        /**
         * ポリゴンパス
         */
        polygon: function(x, y, size, sides, offsetAngle) {
            var radDiv = (Math.PI*2)/sides;
            var radOffset = (offsetAngle!=undefined) ? offsetAngle*Math.PI/180 : -Math.PI/2;
            
            this.moveTo(x + Math.cos(radOffset)*size, y + Math.sin(radOffset)*size);
            for (var i=1; i<sides; ++i) {
                var rad = radDiv*i+radOffset;
                this.lineTo(
                    x + Math.cos(rad)*size,
                    y + Math.sin(rad)*size
                );
            }
            this.closePath();
            return this;
        },
        /**
         * ポリゴン塗りつぶし
         */
        fillPolygon: function(x, y, radius, sides, offsetAngle) {
            return this.beginPath().polygon(x, y, radius, sides, offsetAngle).fill();
        },
        /**
         * ポリゴンストローク描画
         */
        strokePolygon: function(x, y, radius, sides, offsetAngle) {
            return this.beginPath().polygon(x, y, radius, sides, offsetAngle).stroke();
        },
        
        /**
         * star
         */
        star: function(x, y, radius, sides, sideIndent, offsetAngle) {
            var sideIndentRadius = radius * (sideIndent || 0.38);
            var radOffset = (offsetAngle) ? offsetAngle*Math.PI/180 : -Math.PI/2;
            var radDiv = (Math.PI*2)/sides/2;
            
            this.moveTo(
                x + Math.cos(radOffset)*radius,
                y + Math.sin(radOffset)*radius
            );
            for (var i=1; i<sides*2; ++i) {
                var rad = radDiv*i + radOffset;
                var len = (i%2) ? sideIndentRadius : radius;
                this.lineTo(
                    x + Math.cos(rad)*len,
                    y + Math.sin(rad)*len
                );
            }
            this.closePath();
            return this;
        },

        /**
         * 星を塗りつぶし描画
         */
        fillStar: function(x, y, radius, sides, sideIndent, offsetAngle) {
            return this.beginPath().star(x, y, radius, sides, sideIndent, offsetAngle).fill();
        },

        /**
         * 星をストローク描画
         */
        strokeStar: function(x, y, radius, sides, sideIndent, offsetAngle) {
            return this.beginPath().star(x, y, radius, sides, sideIndent, offsetAngle).stroke();
        },

        /*
         * heart
         */
        heart: function(x, y, radius, angle) {
            var half_radius = radius*0.5;
            var rad = (angle === undefined) ? Math.PI/4 : Math.degToRad(angle);

            // 半径 half_radius の角度 angle 上の点との接線を求める
            var p = Math.cos(rad)*half_radius;
            var q = Math.sin(rad)*half_radius;

            // 円の接線の方程式 px + qy = r^2 より y = (r^2-px)/q
            var x2 = -half_radius;
            var y2 = (half_radius*half_radius-p*x2)/q;

            // 中心位置調整
            var height = y2 + half_radius;
            var offsetY = half_radius-height/2;

            // パスをセット
            this.moveTo(0+x, y2+y+offsetY);

            this.arc(-half_radius+x, 0+y+offsetY, half_radius, Math.PI-rad, Math.PI*2);
            this.arc(half_radius+x, 0+y+offsetY, half_radius, Math.PI, rad);
            this.closePath();

            return this;
        },

        /*
         * fill heart
         */
        fillHeart: function(x, y, radius, angle) {
            return this.beginPath().heart(x, y, radius, angle).fill();
        },

        /*
         * stroke heart
         */
        strokeHeart: function(x, y, radius, angle) {
            return this.beginPath().heart(x, y, radius, angle).stroke();
        },
        
        /**
         * 円のパスを設定
         */
        circle: function(x, y, radius) {
            this.context.arc(x, y, radius, 0, Math.PI*2, false);
            return this;
        },
        
        /**
         * 塗りつぶし円を描画
         */
        fillCircle: function(x, y, radius) {
            var c = this.context;
            c.beginPath();
            c.arc(x, y, radius, 0, Math.PI*2, false);
            c.closePath();
            c.fill();
            return this;
            // return this.beginPath().circle(x, y, radius).fill();
        },
        
        /**
         * ストローク円を描画
         */
        strokeCircle: function(x, y, radius) {
            return this.beginPath().circle(x, y, radius).stroke();
        },
        
        
        /**
         * 円弧のパスを設定
         */
        arc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
            this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            return this;
        },
        
        /**
         * 塗りつぶし円弧を描画
         */
        fillArc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
            return this.beginPath().arc(x, y, radius, startAngle, endAngle, anticlockwise).fill();
        },
        
        /**
         * ストローク円弧を描画
         */
        strokeArc: function(x, y, radius, startAngle, endAngle, anticlockwise) {
            return this.beginPath().arc(x, y, radius, startAngle, endAngle, anticlockwise).stroke();
        },
        
        /**
         * 三角形パスを設定
         */
        triangle: function(x0, y0, x1, y1, x2, y2) {
            this.moveTo(x0, y0).lineTo(x1, y1).lineTo(x2, y2);
            this.closePath();
            return this;
        },
        
        /**
         * 塗りつぶし三角形を描画
         */
        fillTriangle: function(x0, y0, x1, y1, x2, y2) {
            return this.beginPath().triangle(x0, y0, x1, y1, x2, y2).fill();
        },
        
        /**
         * ストローク三角形を描画
         */
        strokeTriangle: function(x0, y0, x1, y1, x2, y2) {
            return this.beginPath().triangle(x0, y0, x1, y1, x2, y2).stroke();
        },
        

        /**
         * 塗りつぶしテキストを描画
         */
        fillText: function(text, x, y) {
            return this.context.fillText.apply(this.context, arguments);
        },
        
        /**
         * ストロークテキスト
         */
        strokeText: function(text, x, y) {
            return this.context.strokeText.apply(this.context, arguments);
        },
        
        fillVerticalText: function(text, x, y) {
            this._drawVerticalText("fillText", text, x, y);
        },
        strokeVerticalText: function(text, x, y) {
            this._drawVerticalText("strokeText", text, x, y);
        },
        
        _drawVerticalText: function(func, text, x, y) {
            var ctx = this.context;
            var lines = text.split('\n');
            var charSize = this.context.measureText('あ').width;
            
            ctx.save();
            
            ctx.textAlign = "right";
            ctx.textBaseline = "top";

            Array.prototype.forEach.call(text, function(ch, j) {
                ctx[func](ch, x, y+charSize*j);
            });
            
            ctx.restore();
        },
        
        /**
         * drawLabelBox, drawLabelArea, drawTextBox, 
         */
        _drawLabelArea: function(func, param) {
            var ctx = this.context;
            var text = param.text;
            var charSize = this.context.measureText('あ').width;
            var lines = text.split('\n');
            var lineSpace = (param.lineSpace || 1)*charSize;
            
            ctx.save();
            
            // 横書き
            if (!param.mode || param.mode == "horizon") {
                var maxCharNum = Math.max( (param.width/charSize)|0, 1 );
                var normalLines = [];
                
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                
                
                lines.each(function(line) {
                    for (var i=0,len=line.length; i<len; i+=maxCharNum) {
                        var str = line.substr(i, maxCharNum);
                        normalLines.push(str);
                    }
                });
                
                var funcName = func + "Text";
                normalLines.each(function(line, i) {
                    ctx[funcName](line, param.x, param.y + i*lineSpace + 4);
                });
            }
            // 縦書き
            else {
                var maxCharNum = Math.max( (param.height/charSize)|0, 1 );
                var startX = param.x + param.width;
                var normalLines = [];
                
                lines.each(function(line) {
                    for (var i=0,len=line.length; i<len; i+=maxCharNum) {
                        var str = line.substr(i, maxCharNum);
                        normalLines.push(str);
                    }
                });
                
                var funcName = func + "VerticalText";
                normalLines.each(function(line, i) {
                    // boldになるとフォントサイズが変わるため、マージンとして15pxずらす
                    this[funcName](line, startX-i*lineSpace, param.y+15);
                }.bind(this));
            }
            
            ctx.restore();
        },
        
        fillLabelArea: function(param) {
            this._drawLabelArea("fill", param);
        },
        
        strokeLabelArea: function(param) {
            this._drawLabelArea("stroke", param);
        },
        
        /**
         * 画像描画
         */
        drawImage: function(image, x, y) {
            this.context.drawImage.apply(this.context, arguments);
            return ;
            
            x = x || 0;
            y = y || 0;
            this.context.drawImage(image, x, y);
            return this;
            // ctx.drawImage(this.image.canvas,
                // 0, 0, this.width, this.height,
                // -this.width/2, -this.height/2, this.width, this.height);
        },
        
        /**
         * テクスチャ描画
         */
        drawTexture: function(texture, x, y) {
            arguments[0] = texture.element;
            this.context.drawImage.apply(this.context, arguments);
            
            return this;
        },
        
        /**
         * ビットマップ描画
         */
        drawBitmap: function(bitmap, x, y) {
            arguments[0] = bitmap.imageData;
            this.context.putImageData.apply(this.context, arguments);
            
            return this;
        },
        
        /**
         * dummy
         */
        drawScale9Image: function(image, rect0, rect1) {
            
            var leftWidth   = rect1.x;
            var middleWidth = rect1.width;
            var rightWidth  = image.width - (leftWidth+middleWidth);
            var finalWidth  = rect0.width - (leftWidth+rightWidth);
            var topHeight   = rect1.y;
            
            // left top
            this.drawImage(image,
                0, 0, leftWidth, topHeight,
                rect0.x, rect0.y, leftWidth, topHeight);
            // middle top
            this.drawImage(image,
                leftWidth, 0, middleWidth, topHeight,
                rect0.x + leftWidth, rect0.y, finalWidth, topHeight)
            // right top
            this.drawImage(image,
                leftWidth+middleWidth, 0, rightWidth, topHeight,
                rect0.x + leftWidth + finalWidth, rect0.y, rightWidth, topHeight);
            
            return this;
        },
        
        /**
         * 行列をセット
         */
        setTransform: function(m11, m12, m21, m22, dx, dy) {
            this.context.setTransform(m11, m12, m21, m22, dx, dy);
            return this;
        },
        
        
        /**
         * 行列をリセット
         */
        resetTransform: function() {
            this.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
            return this;
        },
        
        
        /**
         * 中心に移動
         */
        setTransformCenter: function() {
            this.context.setTransform(1, 0, 0, 1, this.width/2, this.height/2);
            return this;
        },
        
        /**
         * 行列を掛ける
         */
        transform: function(m11, m12, m21, m22, dx, dy) {
            this.context.transform(m11, m12, m21, m22, dx, dy);
            return this;
        },
        
        /**
         * 保存
         */
        save: function() {
            this.context.save();
            return this;
        },
        
        /**
         * 復元
         */
        restore: function() {
            this.context.restore();
            return this;
        },
        
        /**
         * 移動
         */
        translate: function(x, y) {
            this.context.translate(x, y);
            return this;
        },
        
        /**
         * 回転
         */
        rotate: function(rotation) {
            this.context.rotate(rotation);
            return this;
        },
        
        /**
         * スケール
         */
        scale: function(scaleX, scaleY) {
            this.context.scale(scaleX, scaleY);
            return this;
        },
        
        /**
         * 画像として保存
         */
        saveAsImage: function(mime_type) {
            mime_type = mime_type || tm.graphics.Canvas.MIME_TYPE_PNG;
            var data_url = this.canvas.toDataURL(mime_type);
            // data_url = data_url.replace(mime_type, "image/octet-stream");
            window.open(data_url, "save");
            
            // toDataURL を使えば下記のようなツールが作れるかも!!
            // TODO: プログラムで絵をかいて保存できるツール
        },

        /**
         * アルファとブレンドモードを同時セット
         * TODO: 未実装
         */
        setCompositing: function(alpha, compositeOperation) {
            // TODO
        },

        /**
         * 塗りつぶしスタイルをセット
         */
        setFillStyle: function(style) {
            this.context.fillStyle = style;
            return this;
        },

        /**
         * ストロークスタイルをセット
         */
        setStrokeStyle: function(style) {
            this.context.strokeStyle = style;
            return this;
        },
        
        /**
         * <a href="http://www.w3.org/TR/2010/WD-2dcontext-20100624/#colors-and-styles">http://www.w3.org/TR/2010/WD-2dcontext-20100624/#colors-and-styles</a>
         */
        setColorStyle: function(stroke, fill) {
            fill = fill || stroke;
            
            this.context.strokeStyle    = stroke;
            this.context.fillStyle      = fill;
            return this;
        },
        
        /**
         * テキストをセット
         */
        setText: function(font, align, baseline) {
            var c = this.context;
            c.font          = font;
            c.textAlign     = align;
            c.textBaseline  = baseline;
        },
        
        /**
         * ラインスタイルを一括セット
         * <a href="http://www.w3.org/TR/2010/WD-2dcontext-20100624/#line-styles">http://www.w3.org/TR/2010/WD-2dcontext-20100624/#line-styles</a>
         */
        setLineStyle: function(width, cap, join, miter) {
            with(this.context) {
                lineWidth   = width || 1;
                lineCap     = cap   || "round";
                lineJoin    = join  || "round";
                miterLimit  = miter || 10.0;
            }
            return this;
        },
        
        /**
         * 影をセット
         * - <http://www.html5.jp/canvas/ref/property/shadowColor.html>
         * - <http://www.w3.org/TR/2010/WD-2dcontext-20100624/#shadows>
         */
        setShadow: function(color, offsetX, offsetY, blur) {
            var ctx = this.context;
            
            ctx.shadowColor     = color     || "black";
            ctx.shadowOffsetX   = offsetX   || 0;
            ctx.shadowOffsetY   = offsetY   || 0;
            ctx.shadowBlur      = blur      || 0;
            
            return this;
        },
        
        /**
         * エレメント取得
         */
        getElement: function() {
            return this.element;
        },
    });
    
    /** @static @property */
    tm.graphics.Canvas.MIME_TYPE_PNG = "image/png";
    /** @static @property */
    tm.graphics.Canvas.MIME_TYPE_JPG = "image/jpeg";
    /** @static @property */
    tm.graphics.Canvas.MIME_TYPE_SVG = "image/svg+xml";
    
    /**
     * @property    width
     * 幅
     */
    tm.graphics.Canvas.prototype.accessor("width", {
        "get": function()   { return this.canvas.width; },
        "set": function(v)  { this.canvas.width = v; }
    });
    
    /**
     * @property    height
     * 高さ
     */
    tm.graphics.Canvas.prototype.accessor("height", {
        "get": function()   { return this.canvas.height; },
        "set": function(v)  { this.canvas.height = v;   }
    });
    
    /**
     * @property    fillStyle
     * 塗りつぶしスタイル
     */
    tm.graphics.Canvas.prototype.accessor("fillStyle", {
        "get": function()   { return this.context.fillStyle; },
        "set": function(v)  { this.context.fillStyle = v;   }
    });
    
    
    /**
     * @property    strokeStyle
     * ストロークスタイル
     */
    tm.graphics.Canvas.prototype.accessor("strokeStyle", {
        "get": function()   { return this.context.strokeStyle; },
        "set": function(v)  { this.context.strokeStyle = v;   }
    });
    
    
    /**
     * @property    globalAlpha
     * アルファ指定
     */
    tm.graphics.Canvas.prototype.accessor("globalAlpha", {
        "get": function()   { return this.context.globalAlpha; },
        "set": function(v)  { this.context.globalAlpha = v;   }
    });
    
    
    /**
     * @property    globalCompositeOperation
     * ブレンド指定
     */
    tm.graphics.Canvas.prototype.accessor("globalCompositeOperation", {
        "get": function()   { return this.context.globalCompositeOperation; },
        "set": function(v)  { this.context.globalCompositeOperation = v;   }
    });

    /**
     * @property    shadowBlur
     * シャドウブラー
     */
    tm.graphics.Canvas.prototype.accessor("shadowBlur", {
        "get": function()   { return this.context.shadowBlur; },
        "set": function(v)  { this.context.shadowBlur = v;   }
    });
    

    /**
     * @property    shadowColor
     * シャドウブラーカラー
     */
    tm.graphics.Canvas.prototype.accessor("shadowColor", {
        "get": function()   { return this.context.shadowColor; },
        "set": function(v)  { this.context.shadowColor = v;   }
    });
    

    /**
     * @property    shadowOffsetX
     * シャドウオフセット X 
     */
    tm.graphics.Canvas.prototype.accessor("shadowOffsetX", {
        "get": function()   { return this.context.shadowOffsetX; },
        "set": function(v)  { this.context.shadowOffsetX = v;   }
    });
    

    /**
     * @property    shadowOffsetY
     * シャドウオフセット Y
     */
    tm.graphics.Canvas.prototype.accessor("shadowOffsetY", {
        "get": function()   { return this.context.shadowOffsetY; },
        "set": function(v)  { this.context.shadowOffsetY = v;   }
    });
    
    /**
     * @property    lineCap
     * ライン終端の描画方法
     */
    tm.graphics.Canvas.prototype.accessor("lineCap", {
        "get": function()   { return this.context.lineCap; },
        "set": function(v)  { this.context.lineCap = v;   }
    });
    
    /**
     * @property    lineJoin
     * ラインつなぎ目の描画方法
     */
    tm.graphics.Canvas.prototype.accessor("lineJoin", {
        "get": function()   { return this.context.lineJoin; },
        "set": function(v)  { this.context.lineJoin = v;   }
    });
    
    /**
     * @property    miterLimit
     * マイターリミット
     */
    tm.graphics.Canvas.prototype.accessor("miterLimit", {
        "get": function()   { return this.context.miterLimit; },
        "set": function(v)  { this.context.miterLimit = v;   }
    });
    
    /**
     * @property    lineWidth
     * ライン幅設定
     */
    tm.graphics.Canvas.prototype.accessor("lineWidth", {
        "get": function()   { return this.context.lineWidth; },
        "set": function(v)  { this.context.lineWidth = v;   }
    });
    
    /**
     * @property    font
     * フォント
     */
    tm.graphics.Canvas.prototype.accessor("font", {
        "get": function()   { return this.context.font; },
        "set": function(v)  { this.context.font = v;   }
    });
    
    /**
     * @property    textAlign
     * テキストのアラインメント
     */
    tm.graphics.Canvas.prototype.accessor("textAlign", {
        "get": function()   { return this.context.textAlign; },
        "set": function(v)  { this.context.textAlign = v;   }
    });
    
    /**
     * @property    textBaseline
     * テキストのベースライン
     */
    tm.graphics.Canvas.prototype.accessor("textBaseline", {
        "get": function()   { return this.context.textBaseline; },
        "set": function(v)  { this.context.textBaseline = v;   }
    });
    
    /**
     * @property    centerX
     * センターX
     */
    tm.graphics.Canvas.prototype.getter("centerX", function() {
        return this.canvas.width/2;
    });
    
    /**
     * @property    centerY
     * センターY
     */
    tm.graphics.Canvas.prototype.getter("centerY", function(){
        return this.canvas.height/2;
    });

    /**
     * @property    imageSmoothingEnabled
     * 画像スムージング設定
     */
    tm.graphics.Canvas.prototype.accessor("imageSmoothingEnabled", {
        "get": function() {
            return this.context.imageSmoothingEnabled;
        },
        "set": function(v) {
            this.context.imageSmoothingEnabled = v;
            this.context.webkitImageSmoothingEnabled = v;
            this.context.mozImageSmoothingEnabled = v;
        }
    });
    
})();



