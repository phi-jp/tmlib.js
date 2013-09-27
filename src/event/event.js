/*
 * event/event.js
 */

tm.event = tm.event || {};

(function() {
    
    /**
     * @class tm.event.Event
     * イベントクラス
     */
    tm.event.Event = tm.createClass({
        
        /**
         * タイプ
         */
        type: null,
        
        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type) {
            this.type = type;
        },
        
    });
    
})();


(function() {
    
    /**
     * @class tm.event.TweenEvent
     * Tween Event
     * @extends tm.event.Event
     */
    tm.event.TweenEvent = tm.createClass({
        
        superClass: tm.event.Event,
        
        /**
         * @constructor
         * コンストラクタ
         */
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
     * @class tm.event.MouseEvent
     * Pointing Event
     * @extends tm.event.Event
     */
    tm.event.MouseEvent = tm.createClass({
        
        superClass: tm.event.Event,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type, app, pointing) {
            this.superInit(type);
            
            this.app = app;
            this.pointing = pointing;
        }
        
    });
    
})();




(function() {
    
    /**
     * @class tm.event.TouchEvent
     * Pointing Event
     * @extends tm.event.Event
     */
    tm.event.TouchEvent = tm.createClass({
        
        superClass: tm.event.Event,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type, app, pointing) {
            this.superInit(type);
            
            this.app = app;
            this.pointing = pointing;
        }
        
    });
    
})();



(function() {
    
    /**
     * @class tm.event.PointingEvent
     * Pointing Event
     * @extends tm.event.Event
     */
    tm.event.PointingEvent = tm.createClass({
        
        superClass: tm.event.Event,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(type, app, pointing) {
            this.superInit(type);
            
            this.app = app;
            this.pointing = pointing;
        }
        
    });
    
    // tm.event.PointingEvent.CHANGE    = "change";
    // tm.event.PointingEvent.FINISH    = "finish";
    // tm.event.PointingEvent.LOOP      = "loop";
    // tm.event.PointingEvent.RESUME    = "resume";
    // tm.event.PointingEvent.START     = "start";
    // tm.event.PointingEvent.STOP      = "stop";
    
})();


