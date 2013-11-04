/*
 * style.js
 */

tm.dom = tm.dom || {};

(function(){
    
    /**
     * @class tm.dom.Style
     * スタイル
     */
    tm.dom.Style = tm.createClass({
        
        /** エレメント */
        element: null,
        
        /**
         * @constructor
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * セット
         */
        set: function(name, value) {
            this.element.style[name] = value;
            return this;
        },
        
        /**
         * 削除
         */
        remove: function(name) {
            this.element.style.removeProperty(name);
            // delete this.element.style[name];
            return this;
        },
        
        /**
         * クリア
         */
        clear: function(name) {
            
            return this;
        },
        
        /**
         * 取得
         */
        get: function(name) {
            return this.element.style[name];
        },
        
        /**
         * CSS の値も考慮した上での値を取得
         */
        getPropValue: function(prop_name) {
            return document.defaultView.getComputedStyle(this.element, '').getPropertyValue(prop_name);
        },
    });
    
    /**
     * スタイルクラス
     * @member      tm.dom.Element
     * @property    style
     */
    tm.dom.Element.prototype.getter("style", function(){
        return this._style || ( this._style = tm.dom.Style(this.element) );
    });
    
})();

