/*
 * event/event.js
 */

tm.event = tm.event || {};

(function() {
    
    /**
     * @class
     * イベントクラス
     */
    tm.event.Event = tm.createClass({
        
        /**
         * タイプ
         */
        type: null,
        
        /**
         * 初期化
         */
        init: function(type) {
            this.type = type;
        },
        
    });
    
})();


(function() {
    
    /**
     * @class
     * Tween Event
     */
    tm.event.TweenEvent = tm.createClass({
        
        superClass: tm.event.Event,
        
        init: function(type, time, now) {
            this.superInit(type);
            
            this.time = time;
            this.now  = now;
        }
        
    });
    
    tm.event.TweenEvent.CHANGE    = "change";
    tm.event.TweenEvent.FINISH    = "finish";
    tm.event.TweenEvent.LOOP      = "loop";
    tm.event.TweenEvent.RESUME    = "resume";
    tm.event.TweenEvent.START     = "start";
    tm.event.TweenEvent.STOP      = "stop";
    
})();


