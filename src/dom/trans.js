(function(){
    
    /**
     * @class
     * スタイル
     */
    tm.dom.Trans = tm.createClass({
        
        element: null,
        
        /**
         * 初期化
         */
        init: function(element) {
            this.element = element;
        },
        
        to: function(props, t) {
            this.set(props).duration(t||1000);
            return this;
        },
        
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
        
        duration: function(t) {
            var style = this.element.style;
            if (typeof t == "number") t = t + "ms";
            style[tm.dom.Trans.DURATION] = t;
            return this;
        },
        
        easing: function(ease) {
            var style = this.element.style;
            style[tm.dom.Trans.TIMING_FUNCTION] = func;
            return this;
        },
        
        end: function(fn) {
            var elm  = tm.dom.Element(this.element);
            elm.event.add(tm.dom.Trans.END_EVENT, fn);
            return this;
        },
        
        reset: function() {
            var style = this.element.style;
            style[tm.dom.Trans.PROPERTY] = "none";
            return this;
        },
        
        translate: function(x, y, t) {
            this.to({"transform": "translate({0}px,{1}px)".format(x, y)}, t);
            return this;
        },
        
        translate3d: function(x, y, z, t) {
            this.to({"transform": "translate3d({0}px,{1}px,{2}px)".format(x, y, z)}, t);
            return this;
        },
        
        rotate: function(deg, t) {
            this.to({"transform": "rotate({0}deg)".format(deg)}, t);
            return this;
        },
        
        rotate3d: function(x, y, z, deg, t) {
            this.to({"transform": "rotate3d({0},{1},{2},{3}deg)".format(x, y, z, deg)}, t);
            return this;
        },
        
        scale: function(x, y, t) {
            this.to({"transform": "scale({0},{1})".format(x, y)}, t);
            return this;
        },
        
        transform: function() {
            // TODO: 実装する
        },
        
        // -------------------------------------
        
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
        
        setDuration: function(t) {
            var style = this.element.style;
            style[tm.dom.Trans.DURATION] = t;
            return this;
        },
        
        setTimingFunction: function(func) {
            var style = this.element.style;
            style[tm.dom.Trans.TIMING_FUNCTION] = func;
            return this;
        },
        
        resetProp: function() {
            var style = this.element.style;
            style[tm.dom.Trans.PROPERTY] = "none";
            return this;
        },
        
        setEndFunction: function(fn) {
            var elm  = tm.dom.Element(this.element);
            elm.event.add(tm.dom.Trans.END_EVENT, fn);
            return this;
        },
    });
    
    tm.dom.Trans.PROPERTY        = tm.VENDER_PREFIX + "TransitionProperty";
    tm.dom.Trans.DURATION        = tm.VENDER_PREFIX + "TransitionDuration";
    tm.dom.Trans.TIMING_FUNCTION = tm.VENDER_PREFIX + "TransitionTimingFunction";
    tm.dom.Trans.DELAY           = tm.VENDER_PREFIX + "TransitionDelay";
    tm.dom.Trans.END_EVENT       = (function(){
        return {
            "webkit": "webkitTransitionEnd",
            "moz"   : "transitionend",
            "o"     : "oTransitionEnd",
        }[tm.VENDER_PREFIX];
    })();
    
    /**
     * Trans クラス
     * @property    trans
     */
    tm.dom.Element.prototype.getter("trans", function(){
        return this._trans || ( this._trans = tm.dom.Trans(this.element) );
    });
    
    var _styleList = {
        "transform": true,
    };
    var _checkStyleProperty = function(name)
    {
        if (_styleList[name] === true) {
            return '-'+tm.VENDER_PREFIX + name.capitalizeFirstLetter();
        }
        return name;
    };
})();