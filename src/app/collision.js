/*
 * collision.js
 */

tm.app = tm.app || {};


(function() {
    
    /**
     * @class tm.app.Collision
     * 衝突管理クラス
     */
    tm.app.Collision = tm.createClass({
        
        /** @property */
        element: null,
        /** @property */
        collideList: null,

        /**
         * @constructor
         * @param {Object} elm
         */
        init: function(elm) {
            this.element = elm;
            this.collideList = [];
        },
        
        /**
         * 更新
         * @param {Object} app
         */
        update: function(app) {
            var cl  = this.collideList.clone();
            var elm = this.element;
            
            for (var i=0,len=cl.length; i<len; ++i) {
                var c = cl[i];
                if (elm.isHitElement(c.element)) {
                    // 最初の衝突だった場合は collisionenter を呼ぶ
                    if (c.collide === false) {
                        var e = tm.event.Event("collisionenter");
                        e.other = c.element;
                        elm.dispatchEvent(e);
                    }
                    // 通常の衝突イベント
                    var e = tm.event.Event("collisionstay");
                    e.other = c.element;
                    elm.dispatchEvent(e);
                    
                    c.collide = true;
                }
                else {
                    if (c.collide == true) {
                        var e = tm.event.Event("collisionexit");
                        e.other = c.element;
                        elm.dispatchEvent(e);
                    }
                    c.collide = false;
                }
            }
        },
        
        /**
         * 追加
         * @param {Object} elm
         */
        add: function(elm) {
            this.collideList.push({
                element: elm,
                collide: false,
            });
        },
        
        /**
         * 削除
         * @param {Object} elm
         */
        remove: function(elm) {
            this.collideList.eraseIf(function(v) {
                return v.element == elm;
            });
        },
        
    });
    
    
    /**
     * @member      tm.app.Element
     * @property    collision
     * コリジョン
     */
    tm.app.Element.prototype.getter("collision", function() {
        if (!this._collision) {
            this._collision = tm.app.Collision(this);
            this.addEventListener("enterframe", function(e){
                this._collision.update(e.app);
            });
        }
        
        return this._collision;
    });
    
    
})();