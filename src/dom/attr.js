/*
 * attr.js
 */

tm.dom = tm.dom || {};

(function(){
    
    /**
     * @class tm.dom.Attr
     * @TODO ?
     */
    tm.dom.Attr = tm.createClass({
        
        /**
         * @property
         * エレメント
         */
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
            this.element.setAttribute(name, value);
            return this;
        },
        
        /**
         * @property
         * 属性を追加
         */
        add: function(name, value) {
            var now = this.get(name);
            value = (now) ? now + ' ' + value : value;
            this.element.setAttribute(name, value);
        },
        
        /**
         * @property
         * 属性を削除
         */
        remove: function(name, value) {
            var now = this.get(name);
            var next= (now) ? now.replace(value, '').replace('  ', ' ') : '';
            this.element.setAttribute(name, next.trim());
//            this.element.removeAttribute(name);
        },
        
        /**
         * @property
         * 属性を取得
         */
        get: function(name) {
            return this.element.getAttribute(name);
        },

        /**
         * @property
         * 属性の存在チェック
         */
        contains: function(name, value) {
            var now = this.get(name);
            if (arguments.length == 1) {
                return now != null;
            }
            else if (arguments.length == 2) {
                return (' '+now+' ').indexOf(' '+value+' ') > -1;
            }

            return false;
        },

        /**
         * @property
         * @TODO ?
         */
        toggle: function(name, value) {
            if (this.contains(name, value)) {
                this.remove(name, value);
            } else {
                this.add(name, value);
            }
            return this;
        }
    });
    
    /**
     * Attr クラス
     * @property    attr
     */
    tm.dom.Element.prototype.getter("attr", function(){
        return this._attr || ( this._attr = tm.dom.Attr(this.element) );
    });
    
})();

