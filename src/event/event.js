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




(function() {
    
    /**
     * @class
     * Pointing Event
     */
    tm.event.MouseEvent = tm.createClass({
        
        superClass: tm.event.Event,
        
        init: function(type, app) {
            this.superInit(type);
            
            this.app = app;
        }
        
    });
    
})();




(function() {
    
    /**
     * @class
     * Pointing Event
     */
    tm.event.TouchEvent = tm.createClass({
        
        superClass: tm.event.Event,
        
        init: function(type, app) {
            this.superInit(type);
            
            this.app = app;
        }
        
    });
    
})();



(function() {
    
    /**
     * @class
     * Pointing Event
     */
    tm.event.PointingEvent = tm.createClass({
        
        superClass: tm.event.Event,
        
        init: function(type, app) {
            this.superInit(type);
            
            this.app = app;
        }
        
    });
    
    // tm.event.PointingEvent.CHANGE    = "change";
    // tm.event.PointingEvent.FINISH    = "finish";
    // tm.event.PointingEvent.LOOP      = "loop";
    // tm.event.PointingEvent.RESUME    = "resume";
    // tm.event.PointingEvent.START     = "start";
    // tm.event.PointingEvent.STOP      = "stop";
    
})();


