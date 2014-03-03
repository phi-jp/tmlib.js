(function(){
    
    /**
     * @class tm.dom.Trans
     * トランス
     */
    tm.dom.Trans = tm.createClass({
        
        /** エレメント */
        element: null,
        
        /**
         * @constructor
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * 変換開始
         */
        to: function(props, t) {
            this.set(props).duration(t||1000);
            return this;
        },

        /**
         * セット
         */
        set: function(props) {
            var style = this.element.style;
            var names = [];
            
            for (var key in props) {
                var name = _checkStyleProperty(key);
                names.push( name.toDash() );
                style[name] = props[key] + "";
            }
            
            style[tm.dom.Trans.PROPERTY] = names.join(', ');   // none;
            
            return this;
        },

        /**
         * 間関
         */
        duration: function(t) {
            var style = this.element.style;
            if (typeof t == "number") t = t + "ms";
            style[tm.dom.Trans.DURATION] = t;
            return this;
        },

        /**
         * イージング
         */
        easing: function(ease) {
            var style = this.element.style;
            style[tm.dom.Trans.TIMING_FUNCTION] = func;
            return this;
        },

        /**
         * 終了
         */
        end: function(fn) {
            var elm  = tm.dom.Element(this.element);
            elm.event.add(tm.dom.Trans.END_EVENT, fn);
            return this;
        },

        /**
         * リセット
         */
        reset: function() {
            var style = this.element.style;
            style[tm.dom.Trans.PROPERTY] = "none";
            return this;
        },

        /**
         * 移動
         */
        translate: function(x, y, t) {
            this.to({"transform": "translate({0}px,{1}px)".format(x, y)}, t);
            return this;
        },

        /**
         * 移動3D
         */
        translate3d: function(x, y, z, t) {
            this.to({"transform": "translate3d({0}px,{1}px,{2}px)".format(x, y, z)}, t);
            return this;
        },

        /**
         * 回転
         */
        rotate: function(deg, t) {
            this.to({"transform": "rotate({0}deg)".format(deg)}, t);
            return this;
        },

        /**
         * 回転3D
         */
        rotate3d: function(x, y, z, deg, t) {
            this.to({"transform": "rotate3d({0},{1},{2},{3}deg)".format(x, y, z, deg)}, t);
            return this;
        },

        /**
         * スケール
         */
        scale: function(x, y, t) {
            this.to({"transform": "scale({0},{1})".format(x, y)}, t);
            return this;
        },

        /**
         * 行列変換
         */
        transform: function() {
            // TODO: 実装する
        },
        
        // -------------------------------------
        
        /**
         * プロパティをセット
         */
        setProp: function(prop) {
            var style = this.element.style;
            var prop_list = [];
            
            for (var key in prop) {
                var name = _checkStyleProperty(key);
                prop_list.push( name.toDash() );
                style[name] = prop[key];
            }
            
            style[tm.dom.Trans.PROPERTY] = prop_list.join(', ');   // none;
            
            return this;
        },

        /**
         * 間関をセット
         */
        setDuration: function(t) {
            var style = this.element.style;
            style[tm.dom.Trans.DURATION] = t;
            return this;
        },

        /**
         * タイミングファンクをセット
         */
        setTimingFunction: function(func) {
            var style = this.element.style;
            style[tm.dom.Trans.TIMING_FUNCTION] = func;
            return this;
        },

        /**
         * リセット
         */
        resetProp: function() {
            var style = this.element.style;
            style[tm.dom.Trans.PROPERTY] = "none";
            return this;
        },

        /**
         * 終了時関数を登録
         */
        setEndFunction: function(fn) {
            var elm  = tm.dom.Element(this.element);
            elm.event.add(tm.dom.Trans.END_EVENT, fn);
            return this;
        },
    });
    
    /** @static @property */
    tm.dom.Trans.PROPERTY        = tm.VENDER_PREFIX + "TransitionProperty";
    /** @static @property */
    tm.dom.Trans.DURATION        = tm.VENDER_PREFIX + "TransitionDuration";
    /** @static @property */
    tm.dom.Trans.TIMING_FUNCTION = tm.VENDER_PREFIX + "TransitionTimingFunction";
    /** @static @property */
    tm.dom.Trans.DELAY           = tm.VENDER_PREFIX + "TransitionDelay";
    /** @static @method @member tm.dom.Trans */
    tm.dom.Trans.END_EVENT       = (function(){
        return {
            "webkit": "webkitTransitionEnd",
            "moz"   : "transitionend",
            "o"     : "oTransitionEnd",
        }[tm.VENDER_PREFIX];
    })();
    
    /**
     * @property    trans
     */
    tm.dom.Element.prototype.getter("trans", function(){
        return this._trans || ( this._trans = tm.dom.Trans(this.element) );
    });
    
    var _styleList = {
        "transform": true,
    };
    var _checkStyleProperty = function(name) {
        if (_styleList[name] === true) {
            return '-'+tm.VENDER_PREFIX + name.capitalizeFirstLetter();
        }
        return name;
    };
})();