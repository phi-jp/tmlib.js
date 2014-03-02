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
    tm.define("tm.event.EventDispatcher", {

        /** @private @property _listeners */

        /**
         * @constructor
         */
        init: function() {
            this._listeners = {};
        },

        /**
         * イベントリスナー追加
         */
        on: function(type, listener) {
            if (this._listeners[type] === undefined) {
                this._listeners[type] = [];
            }
            listener._removeFlag = false;
            
            this._listeners[type].push(listener);
            return this;
        },
        
        /**
         * リスナーを削除
         */
        off: function(type, listener) {
            var listeners = this._listeners[type];
            var index = listeners.indexOf(listener);
            if (index != -1) {
                listeners[index]._removeFlag = true;
            }
            return this;
        },

        /**
         * イベント起動
         */
        fire: function(e) {
            e.target = this;
            var oldEventName = 'on' + e.type;
            if (this[oldEventName]) this[oldEventName](e);
            
            var listeners = this._listeners[e.type];
            if (listeners) {
                this._sweep(e.type);
                for (var i=0,len=listeners.length; i<len; ++i) {
                    listeners[i].call(this, e);
                }
            }
            
            return this;
        },
        
        _sweep: function(type) {
            var listeners = this._listeners[type];
            if (listeners) {
                for (var i=0,len=listeners.length; i<len; ++i) {
                    if (listeners[i]._removeFlag) {
                        listeners.splice(i, 1);
                        --i;
                        --len;
                    }
                }
            }
        },
        
        one: function(type, listener) {
            var self = this;
            
            var func = function() {
                var result = listener.apply(self, arguments);
                self.off(type, func);
                return result;
            };
            
            this.on(type, func);
            
            return this;
        },
        
        /**
         * type に登録されたイベントがあるかをチェック
         */
        hasEventListener: function(type) {
            if (this._listeners[type] === undefined && !this["on" + type]) {
                return false;
            }

            var listeners = this._listeners[type];
            for (var i=0,len=listeners.length; i<len; ++i) {
                if (!listeners[i]._removeFlag) {
                    return true;
                }
            }
            return false;
        },
        
        /**
         * type に登録されているリスナーを全てクリア
         */
        clearEventListener: function(type) {
            var oldEventName = 'on' + type;
            if (this[oldEventName]) delete this[oldEventName];

            this._listeners[type] = [];
            return this;
        },
    });

    var proto = tm.event.EventDispatcher.prototype;
    
    /**
     * @member  tm.event.EventDispatcher
     * @method  addEventListener
     * on と同じ
     */
    proto.addEventListener      = proto.on;
    
    /**
     * @member  tm.event.EventDispatcher
     * @method  removeEventListener
     * off と同じ
     */
    proto.removeEventListener   = proto.off;
    
    /**
     * @member  tm.event.EventDispatcher
     * @method  dispatchEvent
     * fire と同じ
     */
    proto.dispatchEvent         = proto.fire;
    
})();
