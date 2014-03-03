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
         * @private
         */
        _init: function(x, y, width, height) {
            this.gradient = dummyContext.createLinearGradient(x, y, width, height);
        },

        /**
         * カラー点を追加
         */
        addColorStop: function(offset, color) {
            this.gradient.addColorStop(offset, color);
            return this;
        },

        /**
         * カラー点をリストで追加
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
         * スタイル化
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
         * @private
         */
        _init: function(x0, y0, r0, x1, y1, r1) {
            this.gradient = dummyContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
        },
        
        /**
         * カラー点を追加
         */
        addColorStop: function(offset, color) {
            this.gradient.addColorStop(offset, color);
            return this;
        },

        /**
         * カラー点をリストで追加
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
         * スタイル化
         */
        toStyle: function() {
            return this.gradient;
        },
        
    });

    var dummyCanvas = null;
    var dummyContext = null;
    
})();















