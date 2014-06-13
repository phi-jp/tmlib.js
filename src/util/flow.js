/*
 * flow.js
 */

    
/**
 * @class tm.util.Flow
 * @extends tm.event.EventDispatcher
 * it is inspire in made flow.js of `@uupaa`
 */
tm.define("tm.util.Flow", {
    superClass: "tm.event.EventDispatcher",
    
    /** waits */
    waits: 0,
    /** counter */
    counter: 0,
    /** args */
    args: null,
    
    /**
     * @constructor
     */
    init: function(waits, callback) {
        this.superInit();
        
        waits = waits || 0;
        callback = callback || null;
        
        this.setup(waits, callback);
    },
    
    /**
     * セットアップ
     */
    setup: function(waits, callback) {
        this.waits = waits;
        this.callback = callback;
        this.counter = 0;
        this.args = {};

        this._check();

        return this;
    },
    
    /**
     * パス
     */
    pass: function(key, value) {
        ++this.counter;
        
        if (arguments.length >= 2) {
            this.args[key] = value;
        }
        
        this._check();
    },
    
    /**
     * 終了チェック
     */
    isFinish: function() {
        return (this.counter === this.waits);
    },
    
    _check: function() {
        if (this.isFinish()) {
            var args = this.args;
            
            if (this.callback) {
                this.callback(args);
                
                this.args = null;
                this.callback = null;
            }
            
            var e = tm.event.Event("flowfinish");
            e.args = args;
            this.fire(e);
        }
    }
});

