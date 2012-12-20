/*
 * attr.js
 */

tm.dom = tm.dom || {};



(function(){
    
    /**
     * @class
     * スタイル
     */
    tm.dom.Attr = tm.createClass({
        
        element: null,
        
        /**
         * 初期化
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * 属性をセット
         */
        set: function(name, value) {
            this.element.setAttribute(name, value);
            return this;
        },
        
        /**
         * 属性を追加
         */
        add: function(name, value) {
            var now = this.get(name);
            value = (now) ? now + ' ' + value : value;
            this.element.setAttribute(name, value);
        },
        
        /**
         * 属性を削除
         */
        remove: function(name) {
            this.element.removeAttribute(name);
        },
        
        /**
         * 属性を取得
         */
        get: function(name) {
            return this.element.getAttribute(name);
        }
    });
    
    /**
     * Attr クラス
     * @property    attr
     */
    tm.dom.Element.prototype.getter("attr", function(){
        return this._trans || ( this._attr = tm.dom.Attr(this.element) );
    });
    
})();

