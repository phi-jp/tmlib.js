/*
 * gradient.js
 */

tm.graphics = tm.graphics || {};

(function() {
    
    tm.graphics.Canvas.prototype.setGradient = function(gradient) {
        this.context.fillStyle = gradient.gradient;
    };
    
})();

(function() {
    
    /**
     * @class tm.graphics.LinearGradient
     * 線形グラデーション
     */
    tm.graphics.LinearGradient = tm.createClass({

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(x, y, width, height) {
            if (!dummyCanvas) {
                dummyCanvas = document.createElement("canvas");
                dummyContext= dummyCanvas.getContext("2d");
            }
            this._init(x, y, width, height);
            this.init = this._init;
        },

        /**
         * @property
         * 初期化
         * @private
         */
        _init: function(x, y, width, height) {
            this.gradient = dummyContext.createLinearGradient(x, y, width, height);
        },

        /**
         * @property
         * @TODO ?
         */
        addColorStop: function(offset, color) {
            this.gradient.addColorStop(offset, color);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        addColorStopList: function(prop) {
            for (var i=0,len=prop.length; i<len; ++i) {
                var offset  = prop[i].offset;
                var color   = prop[i].color;
                this.addColorStop(offset, color);
            }
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        toStyle: function() {
            return this.gradient;
        },
        
    });

    
    /**
     * @class tm.graphics.RadialGradient
     * 円形グラデーション
     */
    tm.graphics.RadialGradient = tm.createClass({

        /**
         * @constructor
         * コンストラクタ
         */        
        init: function(x0, y0, r0, x1, y1, r1) {
            if (!dummyCanvas) {
                dummyCanvas = document.createElement("canvas");
                dummyContext= dummyCanvas.getContext("2d");
            }
            this._init(x0, y0, r0, x1, y1, r1);
            this.init = this._init;
        },

        /**
         * @property
         * 初期化
         * @private
         */
        _init: function(x0, y0, r0, x1, y1, r1) {
            this.gradient = dummyContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
        },
        
        /**
         * @property
         * @TODO ?
         */
        addColorStop: function(offset, color) {
            this.gradient.addColorStop(offset, color);
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        addColorStopList: function(prop) {
            for (var i=0,len=prop.length; i<len; ++i) {
                var offset  = prop[i].offset;
                var color   = prop[i].color;
                this.addColorStop(offset, color);
            }
            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        toStyle: function() {
            return this.gradient;
        },
        
    });


    
    var dummyCanvas = null;
    var dummyContext = null;
    
})();















