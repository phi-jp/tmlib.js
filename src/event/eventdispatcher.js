/*
 * eventdispatcher.js
 */

tm.event = tm.event || {};

(function() {
    
    /**
     * @class
     * Event Dispatcher
     * ### Reference
     * -(EventDispatcher - ActionScript 3.0 コンポーネントリファレンスガイド)[http://livedocs.adobe.com/flash/9.0_jp/ActionScriptLangRefV3/flash/events/EventDispatcher.html]
     */
    tm.event.EventDispatcher = tm.createClass({
        
        init: function() {
            this._listeners = {};
        },
        
        /**
         * イベントリスナー追加
         */
        addEventListener: function(type, listener) {
            if (this._listeners[type] === undefined) {
                this._listeners[type] = [];
            }
            
            this._listeners[type].push(listener);
        },
        
        /**
         * イベント起動
         */
        dispatchEvent: function(e) {
            var oldEventName = 'on' + e.type;
            if (this[oldEventName]) this[oldEventName](e);
            
            var listeners = this._listeners[e.type];
            if (listeners) {
                for (var i=0,len=listeners.length; i<len; ++i) {
                    listeners[i].call(this, e);
                }
            }
        },
        
        /**
         * 登録されたイベントがあるかをチェック
         */
        hasEventListener: function(type) {
            
        },
        
        /**
         * リスナーを削除
         */
        removeEventListener: function(type, listener) {
            // TODO: 
        },
    });
    
})();
