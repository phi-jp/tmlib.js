/*
 * graphics.js
 */

tm.graphics = tm.graphics || {};

(function() {
    var SHADER_TYPE_MAP = null;
    var VS = "\
        attribute vec3 position;\
        attribute vec4 color;\
        \
        uniform mat4 uMVMatrix;\
        uniform mat4 uPMatrix;\
        \
        varying vec4 vColor;\
        \
        void main() {\
            gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);\
            vColor = color;\
        }";
    var FS = "\
        precision mediump float;\
        varying vec4 vColor;\
        void main(void) {\
            gl_FragColor = vColor;\
        }";

    /**
     * グラフィックス
     */
    tm.graphics.Graphics = tm.createClass({

        /**
         * 要素
         */
        element: null,

        /**
         * キャンバス
         */
        canvas: null,

        /**
         * gl
         */
        gl: null,

        /**
         * @constructor
         * 初期化
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
        },

        resize: function(width, height) {
            this.canvas.width  = width;
            this.canvas.height = height;
            this.gl.viewportWidth  = width;
            this.gl.viewportHeight = height;

            this._pMatrix      = tm.geom.Matrix44.perspective(45, this.canvas.width/this.canvas.height, 0.1, 1000.0);
        },

        /**
         *
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
         *
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
         *
         */
        clear: function() {
            var gl = this.gl;
            console.dir(gl.viewportHeight);
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        },

        /**
         *
         */
        drawArrays: function(vbo, colors) {
            var gl = this.gl;
            var program = this.program;
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, colors);
            gl.vertexAttribPointer(program.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

            gl.uniformMatrix4fv(program.pMatrixUniform, false, this._pMatrix.m);
            gl.uniformMatrix4fv(program.mvMatrixUniform, false, this._mvMatrix.m);

            gl.drawArrays(gl.TRIANGLES, 0, vbo._buffer.length/3);
        },

        /**
         *
         */
        beginDraw: function() {
            this._vertices = [];
            this._colors   = [];
        },

        /**
         *
         */
        vertex2: function(x, y) {
            var vertices = this._vertices;
            vertices.push(x, y, 0.0);

            Array.prototype.push.apply(this._colors, this._currentColor);
        },

        /**
         *
         */
        vertex3: function(x, y, z) {
            var vertices = this._vertices;
            vertices.push(x, y, z);

            Array.prototype.push.apply(this._colors, this._currentColor);
        },

        /**
         *
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
         *
         */
        endDraw: function() {
            var vertices = this.createBuffer(this._vertices);
            var colors   = this.createBuffer(this._colors);

            this.drawArrays(vertices, colors);

            this._vertices = null;
            this._colors   = null;
        },

        /**
         *
         */
        drawRectangle: function(x, y, width, height) {
            var gl = this.gl;
            var left    = x;
            var right   = x+width;
            var top     = y;
            var bottom  = y+height;
            
            this.beginDraw();
                this.vertex3(left, top, 0.0);
                this.vertex3(left, bottom, 0.0);
                this.vertex3(right, bottom, 0.0);
                
                this.vertex3(right,  bottom, 0.0);
                this.vertex3(right, top, 0.0);
                this.vertex3(left, top, 0.0);
            this.endDraw();
        },

        /**
         *
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

        _initGL: function() {
            var gl = this.gl;

            var program = this.program = this.createProgram(VS, FS);
            gl.useProgram(this.program);

            program.vertexPositionAttribute = gl.getAttribLocation(this.program, "position");
            gl.enableVertexAttribArray(this.program.vertexPositionAttribute);

            program.vertexColorAttribute = gl.getAttribLocation(program, "color");
            gl.enableVertexAttribArray(program.vertexColorAttribute);

            program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
            program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
        },

    });

})();
