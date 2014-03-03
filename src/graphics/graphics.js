/*
 * graphics.js
 */

tm.graphics = tm.graphics || {};

(function() {
    var SHADER_TYPE_MAP = null;
    var VS = "\
        attribute vec3 position;\
        attribute vec4 color;\
        attribute vec2 texCoord;\
        \
        uniform mat4 uMVMatrix;\
        uniform mat4 uPMatrix;\
        uniform mat4 uCameraMatrix;\
        \
        varying vec4 vColor;\
        varying vec2 vTextureCoord;\
        \
        void main() {\
            /*vec4 p = uMVMatrix * vec4(position, 1.0);\
            gl_Position = uPMatrix * uCameraMatrix * p;*/\
            gl_Position = uPMatrix * uMVMatrix * uCameraMatrix * vec4(position, 1.0);\
            vColor = color;\
            vTextureCoord = texCoord;\
        }";
    var FS = "\
        precision mediump float;\
        \
        varying vec4 vColor;\
        varying vec2 vTextureCoord;\
        \
        uniform int renderType;\
        uniform sampler2D uSampler;\
        \
        void main(void) {\
            if (renderType == 0) {\
                gl_FragColor = vColor;\
            }\
            else {\
                vec4 texColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\
                gl_FragColor = texColor;\
            }\
        }";


    /**
     * @class tm.graphics.Graphics
     * WebGL を簡単に扱うためのラッパークラス
     */
    tm.graphics.Graphics = tm.createClass({
        /** 要素 */
        element: null,
        /** キャンバス */
        canvas: null,
        /** gl */
        gl: null,

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

            var gl = this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
            if (!this.gl) {
                alert("could not initialized WebGL");
                return ;
            }

            this._currentColor = [1.0, 1.0, 1.0, 1.0];
            this._pMatrix      = tm.geom.Matrix44.perspective(45, this.canvas.width/this.canvas.height, 0.1, 1000.0);
            this._mvMatrix     = tm.geom.Matrix44().identity();
            this._mvMatrix.translate(0, 0, 4);
            this._initGL();
            
            this.camera = tm.graphics.Camera();
        },

        /**
         * リサイズ
         */
        resize: function(width, height) {
            this.canvas.width  = width;
            this.canvas.height = height;
            this.gl.viewportWidth  = width;
            this.gl.viewportHeight = height;

            this.setViewport(0, 0, width, height);
        },

        /**
         * シェーダーを生成
         */
        createShader: function(script, type) {
            var gl = this.gl;

            if (!SHADER_TYPE_MAP) {
                SHADER_TYPE_MAP = {
                    "vs": gl.VERTEX_SHADER,
                    "fs": gl.FRAGMENT_SHADER,
                    "shader-vs": gl.VERTEX_SHADER,
                    "shader-fs": gl.FRAGMENT_SHADER,
                };
                SHADER_TYPE_MAP[gl.VERTEX_SHADER]   = gl.VERTEX_SHADER;
                SHADER_TYPE_MAP[gl.FRAGMENT_SHADER] = gl.FRAGMENT_SHADER;
            }

            var shader = gl.createShader(SHADER_TYPE_MAP[type]);

            gl.shaderSource(shader, script);
            gl.compileShader(shader);

            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return shader;
            }
            else {
                alert(gl.getShaderInfoLog(shader));
            }
        },

        /**
         * シェーダプログラムを生成
         */
        createProgram: function(vs, fs) {
            var gl = this.gl;
            var program = gl.createProgram();

            var vs = this.createShader(vs, "vs");
            var fs = this.createShader(fs, "fs");

            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);

            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                return program;
            }
            else {
                alert(gl.getProgramInfoLog(program));
            }
        },

        /**
         * Vertex Buffer Object
         */
        createBuffer: function(buffer) {
            var gl = this.gl;
            var buf = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            buf._buffer = buffer;

            return buf;
        },

        /**
         * 画面クリア
         */
        clear: function() {
            var gl = this.gl;
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        },
        
        /**
         * ビューポートをセット
         */
        setViewport: function(x, y, width, height) {
            this._viewportX = x !== undefined ? x : 0;
            this._viewportY = y !== undefined ? y : 0;
            this._viewportWidth = width  !== undefined ? width  : this.canvas.width;
            this._viewportHeight= height !== undefined ? height : this.canvas.height;
            
            this.gl.viewport(this._viewportX, this._viewportY, this._viewportWidth, this._viewportHeight);
        },

        /**
         * 配列から描画
         */
        drawArrays: function(vbo, colors, texCoords) {
            var gl = this.gl;
            var program = this.program;
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, colors);
            gl.vertexAttribPointer(program.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

            if (texCoords) {
                gl.uniform1i(program.renderType, 1);
                gl.enableVertexAttribArray(program.textureCoordAttribute);
                gl.bindBuffer(gl.ARRAY_BUFFER, texCoords);
                gl.vertexAttribPointer(program.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
            }
            else {
                gl.uniform1i(program.renderType, 0);
                gl.disableVertexAttribArray(program.textureCoordAttribute);
            }

            gl.uniformMatrix4fv(program.pMatrixUniform, false, this._pMatrix.m);
            gl.uniformMatrix4fv(program.mvMatrixUniform, false, this._mvMatrix.m);
            gl.uniformMatrix4fv(program.cameraMatrixUniform, false, this.camera.getCameraMatrix().m);

            gl.drawArrays(gl.TRIANGLES, 0, vbo._buffer.length/3);
        },

        /**
         * メッシュを秒gあ
         */
        drawMesh: function(mesh) {

        },

        /**
         * 描画開始
         */
        beginDraw: function() {
            this._vertices  = [];
            this._colors    = [];
            this._texCoords = [];
        },

        /**
         * vertex2
         */
        vertex2: function(x, y) {
            var vertices = this._vertices;
            vertices.push(x, y, 0.0);

            Array.prototype.push.apply(this._colors, this._currentColor);
        },

        /**
         * vertex3
         */
        vertex3: function(x, y, z) {
            var vertices = this._vertices;
            vertices.push(x, y, z);

            Array.prototype.push.apply(this._colors, this._currentColor);
        },

        /**
         * color4
         */
        color4: function(r, g, b, a) {
            var currentColor = this._currentColor;
            
            currentColor[0] = r;
            currentColor[1] = g;
            currentColor[2] = b;
            currentColor[3] = a;

            return this;
        },


        /**
         * texCoord2
         */
        texCoord2: function(s, t) {
            this._texCoords.push(s, t);

            return this;
        },

        /**
         * 描画終了
         */
        endDraw: function() {
            var vertices    = this.createBuffer(this._vertices);
            var colors      = this.createBuffer(this._colors);
            var texCoords   = null;

            if (this._texCoords.length > 0) {
                texCoords = this.createBuffer(this._texCoords);
            }

            this.drawArrays(vertices, colors, texCoords);

            this._vertices  = null;
            this._colors    = null;
            this._texCoords = null;
        },

        /**
         * 矩形描画
         */
        drawRectangle: function(x, y, width, height) {
            var gl = this.gl;
            var left    = x;
            var right   = x+width;
            var top     = y;
            var bottom  = y+height;
            
            this.beginDraw();
                this.vertex3(left, top, 0.0);
                this.texCoord2(0.0, 0.0);
                this.vertex3(left, bottom, 0.0);
                this.texCoord2(0.0, 1.0);
                this.vertex3(right, bottom, 0.0);
                this.texCoord2(1.0, 1.0);
                
                this.vertex3(right,  bottom, 0.0);
                this.texCoord2(1.0, 1.0);
                this.vertex3(right, top, 0.0);
                this.texCoord2(1.0, 0.0);
                this.vertex3(left, top, 0.0);
                this.texCoord2(0.0, 0.0);
            this.endDraw();
        },

        /**
         *　サークル描画
         */
        drawCircle: function(x, y, radius) {
            var radDiv = (Math.PI*2)/32;

            this.beginDraw();
            for (var i=0; i<32; ++i) {
                var rad = radDiv*i;
                var rad2= radDiv*(i+1);
                this.vertex2(x, y);
                this.vertex2(
                    x + Math.cos(rad)*radius,
                    y + Math.sin(rad)*radius
                );
                this.vertex2(
                    x + Math.cos(rad2)*radius,
                    y + Math.sin(rad2)*radius
                );
            }
            this.endDraw();
        },

        /**
         *　キューブ描画
         */
        drawCube: function() {
            var vertices = this.createBuffer([
                // Front face
                -1.0, -1.0,  1.0,
                 1.0, -1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0, -1.0,  1.0,

                // Back face
                -1.0, -1.0, -1.0,
                -1.0,  1.0, -1.0,
                 1.0,  1.0, -1.0,
                 1.0,  1.0, -1.0,
                 1.0, -1.0, -1.0,
                -1.0, -1.0, -1.0,

                // Top face
                -1.0,  1.0, -1.0,
                -1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0, -1.0,
                -1.0,  1.0, -1.0,

                // Bottom face
                -1.0, -1.0, -1.0,
                 1.0, -1.0, -1.0,
                 1.0, -1.0,  1.0,
                 1.0, -1.0,  1.0,
                -1.0, -1.0,  1.0,
                -1.0, -1.0, -1.0,

                // Right face
                 1.0, -1.0, -1.0,
                 1.0,  1.0, -1.0,
                 1.0,  1.0,  1.0,
                 1.0,  1.0,  1.0,
                 1.0, -1.0,  1.0,
                 1.0, -1.0, -1.0,

                // Left face
                -1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0,  1.0,  1.0,
                -1.0, -1.0, -1.0,
                -1.0,  1.0, -1.0
            ]);

            var colors = this.createBuffer([
                // Front face
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,

                // Back face
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,

                // Top face
                0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,
                0.0, 0.0, 1.0, 1.0,

                // Bottom face
                1.0, 1.0, 0.0, 1.0,
                1.0, 1.0, 0.0, 1.0,
                1.0, 1.0, 0.0, 1.0,
                1.0, 1.0, 0.0, 1.0,
                1.0, 1.0, 0.0, 1.0,
                1.0, 1.0, 0.0, 1.0,

                // Right face
                1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,
                1.0, 0.0, 1.0, 1.0,

                // Left face
                0.0, 1.0, 1.0, 1.0,
                0.0, 1.0, 1.0, 1.0,
                0.0, 1.0, 1.0, 1.0,
                0.0, 1.0, 1.0, 1.0,
                0.0, 1.0, 1.0, 1.0,
                0.0, 1.0, 1.0, 1.0,
            ]);

            this.drawArrays(vertices, colors);

        },

        /**
         *　ピラミット描画
         */
        drawPyramid: function() {
            var vertices = this.createBuffer([
                // Front face
                0.0,  1.0,  0.0,
                -1.0, -1.0,  1.0,
                1.0, -1.0,  1.0,
                // Right face
                0.0,  1.0,  0.0,
                1.0, -1.0,  1.0,
                1.0, -1.0, -1.0,
                // Back face
                0.0,  1.0,  0.0,
                1.0, -1.0, -1.0,
                -1.0, -1.0, -1.0,
                // Left face
                0.0,  1.0,  0.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0,  1.0
            ]);

            var colors = this.createBuffer([
                // Front face
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0,

                // Right face
                1.0, 0.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0,
                0.0, 1.0, 0.0, 1.0,

                // Back face
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0,

                // Left face
                1.0, 0.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0,
                0.0, 1.0, 0.0, 1.0
            ]);

            this.drawArrays(vertices, colors);
        },

        /**
         *　テクスチャを生成
         */
        createTexture: function(texture) {
            var gl = this.gl;
            var tex = gl.createTexture();
            var element = texture.element;

            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);

            return tex;
        },

        /**
         *　テクスチャを生成
         * @private
         */
        _initGL: function() {
            var gl = this.gl;

            var program = this.program = this.createProgram(VS, FS);
            gl.useProgram(this.program);

            program.vertexPositionAttribute = gl.getAttribLocation(this.program, "position");
            gl.enableVertexAttribArray(this.program.vertexPositionAttribute);

            program.vertexColorAttribute = gl.getAttribLocation(program, "color");
            gl.enableVertexAttribArray(program.vertexColorAttribute);

            program.textureCoordAttribute = gl.getAttribLocation(program, "texCoord");
            gl.enableVertexAttribArray(program.textureCoordAttribute);

            program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
            program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
            program.cameraMatrixUniform = gl.getUniformLocation(program, "uCameraMatrix");
            program.samplerUniform = gl.getUniformLocation(program, "uSampler");

            program.renderType     = gl.getUniformLocation( program, "renderType" );

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        },

    });

})();



(function() {
    
    /**
     * @class tm.graphics.Camera
     * カメラクラス
     */
    tm.graphics.Camera = tm.createClass({
        /**
         * @constructor
         */
        init: function() {
            this.projectionMatrix = tm.geom.Matrix44();
            
            this.eye    = tm.geom.Vector3(0, 2, 4);
            this.target = tm.geom.Vector3(0, 0, 0);
            this.up     = tm.geom.Vector3(0, 1, 0);
            
            this.lookAt();
        },

        /**
         * ルックアット
         */
        lookAt: function() {
            this.cameraMatrix = tm.geom.Matrix44.lookAt(
                this.eye,
                this.target,
                this.up
            );
        },

        /**
         * カメラ行列を取得
         */
        getCameraMatrix: function() {
            return this.cameraMatrix;
        },
    });
    
})();



(function() {
    
    /**
     * @class tm.graphics.PerspectiveCamera
     * 透視投影カメラクラス
     * @extends tm.graphics.Camera
     */
    tm.graphics.PerspectiveCamera = tm.createClass({
        superClass: tm.graphics.Camera,
        
        /**
         * @constructor
         */
        init: function() {
            this.superInit();
            
            this.fovy = 45;
            this.aspect = 640/480;
        }
    });
    
})();













