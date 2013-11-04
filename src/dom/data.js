/*
 * dom/data.js
 */

(function(){
    
    /**
     * @class tm.dom.Data
     */
    tm.define("tm.dom.Data", {

        /** エレメント */
        element: null,
        
        /**
         * @constructor
         */
        init: function(element) {
            this.element = element;
        },
        
        /**
         * 属性をセット
         */
        set: function(name, value) {
        	var key = "data-" + name.toDash();
            this.element.setAttribute(key, value);

            return this;
        },
        
        /**
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