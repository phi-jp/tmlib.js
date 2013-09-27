/*
 * dom/data.js
 */

(function(){
    
    /**
     * @class tm.dom.Data
     * @TODO ?
     */
    tm.define("tm.dom.Data", {
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
         * 属性をセット
         */
        set: function(name, value) {
        	var key = "data-" + name.toDash();
            this.element.setAttribute(key, value);

            return this;
        },
        
        /**
         * @property
         * 属性をゲット
         */
        get: function(name, value) {
        	var key = "data-" + name.toDash();
        	return this.element.attributes[key].value;
        },
    });
    
    /**
     * Attr クラス
     * @property    data
     */
    tm.dom.Element.prototype.getter("data", function(){
        return this._data || ( this._data = tm.dom.Data(this.element) );
    });

})();