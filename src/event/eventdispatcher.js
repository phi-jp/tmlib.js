/*
 * eventdispatcher.js
 */

tm.event = tm.event || {};

(function() {
    
    /**
     * @class tm.event.EventDispatcher
     * Event Dispatcher
     * ### Reference
     * -(EventDispatcher - ActionScript 3.0 コンポーネントリファレンスガイド)[http://livedocs.adobe.com/flash/9.0_jp/ActionScriptLangRefV3/flash/events/EventDispatcher.html]
     */
    tm.event.EventDispatcher = tm.createClass({

        /**
         * @constructor
         * コンストラクタ
         */
        init: function() {
            this._listeners = {};
        },

        /**
         * @property
         * イベントリスナー追加(addEventListenerと同様)
         */
        on: function(type, listener) {
            if (this._listeners[type] === undefined) {
                this._listeners[type] = [];
            }
            
            this._listeners[type].push(listener);
            return this;
        },
        
        /**
         * @property
         * イベントリスナー追加
         */
        addEventListener: function(type, listener) {
            if (this._listeners[type] === undefined) {
                this._listeners[type] = [];
            }
            
            this._listeners[type].push(listener);
            return this;
        },
        
        /**
         * @property
         * イベント起動
         */
        dispatchEvent: function(e) {
            e.target = this;
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
         * @property
         * 登録されたイベントがあるかをチェック
         */
        hasEventListener: function(type) {
            if (this._listeners[type] === undefined && !this["on" + type]) return false;
            return true;
        },
        
        /**
         * @property
         * リスナーを削除
         */
        removeEventListener: function(type, listener) {
            var listeners = this._listeners[type];
            var index = listeners.indexOf(listener);
            if (index != -1) {
                listeners.splice(index,1);
            }
            return this;
        },
        
        /**
         * @property
         * リスナーを全てクリア
         */
        clearEventListener: function(type) {
            this._listeners[type] = [];
            return this;
        },
    });
    
})();
