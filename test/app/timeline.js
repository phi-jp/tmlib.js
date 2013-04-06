tm.namespace("tm.app", function() {
    tm.define("tm.app.Timeline", {
        superClass: "tm.event.EventDispatcher",
        
        init: function(elm) {
            this.superInit();
            
            this.setTarget(elm);
            
            this._tweens  = [];
            this._actions = [];
            this.currentTime = 0;
            this.isPlay = true;
            
            this.stepFrame = 1000/30;
        },
        
        update: function(app) {
            if (!this.isPlay) return ;
            
            this.currentTime += this.stepFrame;
            this._update();
        },
        
        _update: function() {
            var tweens = this._tweens;
            for (var i=0,len=tweens.length; i<len; ++i) {
                var tween = tweens[i];
                
                if (tween.delay > this.currentTime) {
                    continue ;
                }
                
                var time = this.currentTime - tween.delay;
                tween._setTime(time);
                if (tween.time >= tween.duration) {
                }
                else {
                    tween.update();
                }
            }
            
            this._updateAction(this.currentTime-this.stepFrame|0, this.currentTime);
        },
        
        _updateAction: function(startTime, endTime) {
            var actions = this._actions;
            
            for (var i=0,len=actions.length; i<len; ++i) {
                var action = actions[i];
                
                if (startTime <= action.data.delay && action.data.delay <= endTime) {
                    if (action.type == "call") {
                        action.data.func();
                    }
                    else if (action.type == "set") {
                        var props = action.data.props;
                        console.log(props);
                        for (var key in props) {
                            this.element[key] = props[key];
                        }
                    }
                }
            }
        },
        
        to: function(props, duration, delay, fn) {
            delay = delay || 0;
            var tween = tm.anim.Tween();
            tween.to(this.element, props, duration, fn);
            tween.delay = delay;
            
            this._tweens.push(tween);
            
            return this;
        },
        
        call: function(func, delay) {
            delay = delay || 0;
            
            this._actions.push({
                "type": "call",
                "data": {
                    func: func,
                    delay: delay,
                }
            });
        },
        
        set: function(props, delay) {
            delay = delay || 0;
            
            this._actions.push({
                "type": "set",
                "data": {
                    props: props,
                    delay: delay,
                }
            });
            return this;
        },
        
        setTarget: function(target) {
            if (this._fn) {
                this.element.removeEventListener("enterframe", this._fn);
            }
            
            this.element = target;
            this._fn = function(e) { this.update(e.app); }.bind(this);
            this.element.addEventListener("enterframe", this._fn);
        },
        getTarget: function(target) {
            return this.element;
        },
        
        gotoAndPlay: function(time) {
            this.isPlay = true;
            this.currentTime = time;
            this._update();
        },
        
        gotoAndStop: function(time) {
            this.currentTime = time;
            this.isPlay = false;
            this._update();
        },
        
        
    });
    
    
    
    /**
     * @property    animation
     * アニメーション
     */
    tm.app.Element.prototype.getter("timeline", function() {
        if (!this._timeline) {
            this._timeline = tm.app.Timeline(this);
        }
        
        return this._timeline;
    });
    
});