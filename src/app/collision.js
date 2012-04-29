/*
 * collision.js
 */

tm.app = tm.app || {};



(function() {
    
    var _collisionUpdate = function(e)
    {
        for (var i=0,len=this._collideList.length; i<len; ++i) {
            var collide = this._collideList[i];
            if (this.isHitElement(collide.element)) {
                // 最初の衝突だった場合は collisionEnter を呼ぶ
                if (collide.collide === false) {
                    var e = tm.app.Event("collisionEnter");
                    e.other = collide.element;
                    this.dispatchEvent(e);
                }
                // 通常の衝突イベント
                var e = tm.app.Event("collisionStay");
                e.other = collide.element;
                this.dispatchEvent(e);
                
                collide.collide = true;
            }
            else {
                if (collide.collide == true) {
                    var e = tm.app.Event("collisionExit");
                    e.other = collide.element;
                    this.dispatchEvent(e);
                }
                collide.collide = false;
            }
        }
    };
    
    var _addCollisionElement = function(elm)
    {
        this._collideList.push({
            element: elm,
            collide: false,
        });
    };
    
    /**
     * @class
     * 衝突判定を簡単に行えるエレメント
     */
    tm.app.CollisionElement = tm.createClass({
        
        superClass: tm.app.CanvasElement,
        
        /**
         * 初期化
         */
        init: function() {
            this.superInit();
            this._collideList = [];
        },
        
        /**
         * @method
         * 更新
         */
        update: _collisionUpdate,
        
        
        /**
         * @method
         * 衝突の対象となるエレメントを追加
         */
        addCollisionElement: _addCollisionElement,
    });
    
    
    tm.app.Element.prototype.collide = function() {
        this.addEventListener("enterframe", _collisionUpdate);
        this.addCollisionElement = _addCollisionElement;
        this._collideList = [];
    };
    
})();