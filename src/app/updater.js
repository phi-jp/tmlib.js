/*
 * updater.js
 */

 
(function() {
    
    /**
     * @class tm.app.Updater
     * 更新管理クラス
     */
    tm.define("tm.app.Updater", {
        app: null,

        init: function(app) {
            this.app = app;
        },

        update: function(root) {
            this._updateElement(root);
        },

        _updateElement: function(elm) {
            var app = this.app;
            
            // 更新するかを判定
            if (elm.awake == false) return ;

            // 更新
            if (elm.update) elm.update(app);

            // エンターフレームイベント
            if (elm.hasEventListener("enterframe")) {
                var e = tm.event.Event("enterframe");
                e.app = app;
                elm.fire(e);
            }
            
            // タッチ判定
            if (elm.interactive) {
                elm._checkPointing(app);
            }

            // 子供を更新
            var len = elm.children.length;
            if (len > 0) {
                var tempChildren = elm.children.slice();
                for (var i=0; i<len; ++i) {
                    this._updateElement(tempChildren[i]);
                }
            }
        },
    });

})();


