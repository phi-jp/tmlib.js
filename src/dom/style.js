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
        
        element: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * @property
         * セット
         */
        set: function(name, value) {
            this.element.style[name] = value;
            return this;
        },
        
        /**
         * @property
         * 削除
         */
        remove: function(name) {
            this.element.style.removeProperty(name);
            // delete this.element.style[name];
            return this;
        },
        
        /**
         * @property
         * クリア
         */
        clear: function(name) {
            
            return this;
        },
        
        /**
         * @property
         * 取得
         */
        get: function(name) {
            return this.element.style[name];
        },
        
        /**
         * @property
         * CSS の値も考慮した上での値を取得
         */
        getPropValue: function(prop_name) {
            return document.defaultView.getComputedStyle(this.element, '').getPropertyValue(prop_name);
        },
    });
    
    /**
     * スタイルクラス
     * @property    style
     */
    tm.dom.Element.prototype.getter("style", function(){
        return this._style || ( this._style = tm.dom.Style(this.element) );
    });
    
})();

