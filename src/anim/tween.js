/*
 * tween.js
 */

tm.anim = tm.anim || {};

(function() {
    
    
    /**
     * @class tm.anim.Tween
     * Tween クラス
     * @extends tm.event.EventDispatcher
     */
    tm.anim.Tween = tm.createClass({
        
        superClass: tm.event.EventDispatcher,
        
        /**
         * @property
         * アニメーションさせる対象
         */
        target      : null,
        /**
         * @property
         * アニメーションの時間
         */
        time        : null,
        /**
         * @property
         * プロパティ 未使用？
         */
        prop        : null,
        /**
         * @property
         * ?
         */
        now         : null,
        /**
         * @property
         * ?
         */
        begin       : null,
        /**
         * @property
         * ?
         */
        finish      : null,
        /**
         * @property
         * アニメーションにかける時間
         */
        duration    : null,
        /**
         * @property
         * ループするかどうか
         */
        isLooping   : null,
        /**
         * @property
         * アニメーション中かどうか
         */
        isPlaying   : null,
        /**
         * @property
         * アニメーション実行関数
         */
        func        : Math.linear,
        
        /**
         * @property
         * フレームレート
         */
        fps     : 30,
        
        /**
         * @property init
         * コンストラクタ
         * @param {Object} target
         * @param {Object} finishProps
         * @param {Object} duration
         * @param {Function} func
         */
        init: function(target, finishProps, duration, func) {
            this.superInit();
            
            this.time = 0;
            this.nowProps = {};
            this.isPlaying = false;

            if (arguments.length > 0) {
                this.to.apply(this, arguments);
            }
        },

        /**
         * @property to
         * 指定した値までアニメーション
         * @param {Object} target
         * @param {Object} finishProps
         * @param {Object} duration
         * @param {Function} func
         */
        to: function(target, finishProps, duration, func) {
            var beginProps = {};

            for (var key in finishProps) {
                beginProps[key] = target[key];
            }

            this.fromTo(target, beginProps, finishProps, duration, func);

            return this;
        },

        /**
         * @property by
         * 指定した値を足した値までアニメーション
         * @param {Object} target
         * @param {Object} props
         * @param {Object} duration
         * @param {Function} func
         */
        by: function(target, props, duration, func) {
            var beginProps = {};
            var finishProps = {};

            for (var key in props) {
                beginProps[key] = target[key];
                finishProps[key] = target[key] + props[key];
            }

            this.fromTo(target, beginProps, finishProps, duration, func);

            return this;
        },

        /**
         * @property fromTo
         * 開始の値から終了の値までアニメーション
         * @param {Object} target
         * @param {Object} beginProps
         * @param {Object} finishProps
         * @param {Object} duration
         * @param {Function} func
         */
        fromTo: function(target, beginProps, finishProps, duration, func) {
            this.target = target;
            this.beginProps  = beginProps;
            this.finishProps = finishProps;
            this.duration = duration;
            
            // setup
            this.changeProps = {};
            for (var key in beginProps) {
                this.changeProps[key] = finishProps[key] - beginProps[key];
            }
            this.setTransition(func);

            return this;
        },

        /**
         * @property from
         * @TODO ?
         * @param {Object} target
         * @param {Object} beginProps
         * @param {Object} duration
         * @param {Function} func
         */
        from: function(target, beginProps, duration, func) {
            var finishProps = {};

            for (var key in beginProps) {
                finishProps[key] = target[key];
            }

            this.fromTo(target, beginProps, finishProps, duration, func);

            return this;
        },
        
        /**
         * @property setTransition
         * easingの指定か、コールバックの指定か調べる
         * @param {Function} func
         */
        setTransition: function(func) {
            if (typeof func == 'function') {
                this.func = func;
            }
            else if (typeof func == 'string'){
                this.func = tm.anim.easing[func];
            }
            else {
                this.func = tm.anim.easing["default"];
            }
            return this;
        },
        
        /**
         * @property resume
         * アニメーションの再開
         */
        resume: function() {
            this.isPlaying = true;
            this._resumeTime();
            this._updateTime();
            this.dispatchEvent(tm.event.TweenEvent("resume", this.time, this.nowProps));
        },
        
        /**
         * @property start
         * アニメーションの開始
         */
        start: function() {
            this.isPlaying = true;
            this._startTime();
            this._updateTime();
            this.dispatchEvent(tm.event.TweenEvent("start", this.time, this.nowProps));
        },
        
        /**
         * @property stop
         * アニメーションのストップ
         */
        stop: function() {
            this.isPlaying = false;
            this.dispatchEvent(tm.event.TweenEvent("stop", this.time, this.nowProps));
        },
        
        /**
         * @property rewind
         * 開始位置まで戻る
         */
        rewind: function() {
            this.time = 0;
            this.update();
        },
        
        /**
         * @property fforward
         * 最後位置まで早送り
         */
        fforward: function() {
            this.time = this.duration;
            this.update();
        },

        /**        
         * @property yoyo
         * ヨーヨーのアニメーション
         */
        yoyo: function() {
            var temp = this.finishProps;
            this.finishProps = this.beginProps;
            this.beginProps  = temp;
            for (var key in this.beginProps) {
                this.changeProps[key] = this.finishProps[key] - this.beginProps[key];
            }
            this.start();
        },
        
        /**
         * @property update
         * 更新
         */
        update: function() {
            for (var key in this.changeProps) {
                this.nowProps[key] = this.func(this.time, this.beginProps[key], this.changeProps[key], this.duration);
                this.target[key] = this.nowProps[key];
            }
            this.dispatchEvent(tm.event.TweenEvent("change", this.time, this.nowProps));
        },
        
        /**
         * @property _resumeTime
         * 時間を巻き戻す
         * @private
         */
        _resumeTime: function() {
            this.startTime = (new Date()).getTime() - this.time;
        },
        
        /**
         * @property _startTime
         * スタート時間を設定
         * @private
         */
        _startTime: function() {
            this.startTime = (new Date()).getTime();
        },
        
        /**
         * @property _updateTime
         * 時間を進める
         * @private
         */
        _updateTime: function() {
            if (this.isPlaying) {
                this._setTime((new Date()).getTime() - this.startTime);
                setTimeout(arguments.callee.bind(this), 1000/this.fps);
            }
        },
        
        /**
         * @property _setTime
         * 時間を設定する
         * @param {Object} t
         * @private
         */
        _setTime: function(t) {
            var time = t;
            // モーション終了
            if (time > this.duration) {
                // ループ
                if (this.isLooping) {
                    this.rewind();
                    // 座標を更新
                    this.update();
                    // イベント開始
                    this.dispatchEvent(tm.event.TweenEvent("loop", this.time, this.nowProps));
                }
                // 終了
                else {
                    this.time = this.duration;
                    // 座標を更新
                    this.update();
                    // 停止
                    this.stop();
                    // イベント
                    this.dispatchEvent(tm.event.TweenEvent("finish", this.time, this.nowProps));
                }
            }
            // 更新
            else {
                this.time = time;
                // 座標を更新
                this.update();
            }
        }
    });
})();


/*
 * easing
 */
(function() {
    
    /**
     * @class tm.anim.easing
     * イージング
     * ### Reference
     * - <http://coderepos.org/share/wiki/JSTweener>
     * - <http://coderepos.org/share/browser/lang/javascript/jstweener/trunk/src/JSTweener.js>
     * - <http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js>
     * - <http://hosted.zeh.com.br/tweener/docs/en-us/misc/transitions.html>
     */
    tm.anim.easing = {
        /**
         * @property
         * default
         */
        "default": function(t, b, c, d) {
            return c*t/d + b;
        },
        
        /**
         * @property
         * linear
         */
        linear: function(t, b, c, d) {
            return c*t/d + b;
        },
        
        /**
         * @property
         * swing
         */
        swing: function(t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        
        /**
         * @property
         * easeInQuad
         */
        easeInQuad: function(t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        
        /**
         * @property
         * easeOutQuad
         */
        easeOutQuad: function(t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        
        /**
         * @property
         * easeInOutQuad
         */
        easeInOutQuad: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 *((--t)*(t-2) - 1) + b;
        },

        /**
         * @property
         * defeInCubic
         */   
        easeInCubic: function(t, b, c, d) {
            return c*(t/=d)*t*t + b;
        },

        /**
         * @property
         * easeOutCubic
         */
        easeOutCubic: function(t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        },

        /**
         * @property
         * easeInOutCubic
         */
        easeInOutCubic: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        },

        /**
         * @property
         * easeOutInCubic
         */
        easeOutInCubic: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutCubic(t*2, b, c/2, d);
            return tm.anim.easing.easeInCubic((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInQuart
         */
        easeInQuart: function(t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        },

        /**
         * @property
         * easeOutQuart
         */
        easeOutQuart: function(t, b, c, d) {
            return -c *((t=t/d-1)*t*t*t - 1) + b;
        },

        /**
         * @property
         * easeInOutQuart
         */
        easeInOutQuart: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 *((t-=2)*t*t*t - 2) + b;
        },

        /**
         * @property
         * easeOutInQuart
         */
        easeOutInQuart: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutQuart(t*2, b, c/2, d);
            return tm.anim.easing.easeInQuart((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInQuint
         */
        easeInQuint: function(t, b, c, d) {
            return c*(t/=d)*t*t*t*t + b;
        },

        /**
         * @property
         * easeOutQuint
         */
        easeOutQuint: function(t, b, c, d) {
            return c*((t=t/d-1)*t*t*t*t + 1) + b;
        },

        /**
         * @property
         * easeInOutQuint
         */
        easeInOutQuint: function(t, b, c, d) {
            if((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
            return c/2*((t-=2)*t*t*t*t + 2) + b;
        },

        /**
         * @property
         * easeOutInQuint
         */
        easeOutInQuint: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutQuint(t*2, b, c/2, d);
            return tm.anim.easing.easeInQuint((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInSine
         */
        easeInSine: function(t, b, c, d) {
            return -c * Math.cos(t/d *(Math.PI/2)) + c + b;
        },

        /**
         * @property
         * easeOutSine
         */
        easeOutSine: function(t, b, c, d) {
            return c * Math.sin(t/d *(Math.PI/2)) + b;
        },

        /**
         * @property
         * easeInOutSine
         */
        easeInOutSine: function(t, b, c, d) {
            return -c/2 *(Math.cos(Math.PI*t/d) - 1) + b;
        },

        /**
         * @property
         * easeOutInSine
         */
        easeOutInSine: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutSine(t*2, b, c/2, d);
            return tm.anim.easing.easeInSine((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInExpo
         */
        easeInExpo: function(t, b, c, d) {
            return(t==0) ? b : c * Math.pow(2, 10 *(t/d - 1)) + b - c * 0.001;
        },

        /**
         * @property
         * easeOutExpo
         */
        easeOutExpo: function(t, b, c, d) {
            return(t==d) ? b+c : c * 1.001 *(-Math.pow(2, -10 * t/d) + 1) + b;
        },

        /**
         * @property
         * easeInOutExpo
         */
        easeInOutExpo: function(t, b, c, d) {
            if(t==0) return b;
            if(t==d) return b+c;
            if((t/=d/2) < 1) return c/2 * Math.pow(2, 10 *(t - 1)) + b - c * 0.0005;
            return c/2 * 1.0005 *(-Math.pow(2, -10 * --t) + 2) + b;
        },

        /**
         * @property
         * easeOutInExpo
         */
        easeOutInExpo: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutExpo(t*2, b, c/2, d);
            return tm.anim.easing.easeInExpo((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInCirc
         */
        easeInCirc: function(t, b, c, d) {
            return -c *(Math.sqrt(1 -(t/=d)*t) - 1) + b;
        },

        /**
         * @property
         * easeOutCirc
         */
        easeOutCirc: function(t, b, c, d) {
            return c * Math.sqrt(1 -(t=t/d-1)*t) + b;
        },

        /**
         * @property
         * easeInOutCirc
         */
        easeInOutCirc: function(t, b, c, d) {
            if((t/=d/2) < 1) return -c/2 *(Math.sqrt(1 - t*t) - 1) + b;
            return c/2 *(Math.sqrt(1 -(t-=2)*t) + 1) + b;
        },

        /**
         * @property
         * easeOutInCirc
         */
        easeOutInCirc: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutCirc(t*2, b, c/2, d);
            return tm.anim.easing.easeInCirc((t*2)-d, b+c/2, c/2, d);
        },

        /**
         * @property
         * easeInElastic
         */
        easeInElastic: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
            if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
        },

        /**
         * @property
         * easeOutElastic
         */
        easeOutElastic: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d)==1) return b+c;  if(!p) p=d*.3;
            if(!a || a < Math.abs(c)) { a=c; s=p/4; } else s = p/(2*Math.PI) * Math.asin(c/a);
            return(a*Math.pow(2,-10*t) * Math.sin((t*d-s)*(2*Math.PI)/p ) + c + b);
        },

        /**
         * @property
         * easeInOutElastic
         */
        easeInOutElastic: function(t, b, c, d, a, p) {
            var s;
            if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
            if(!a || a < Math.abs(c)) { a=c; s=p/4; }       else s = p/(2*Math.PI) * Math.asin(c/a);
            if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },

        /**
         * @property
         * easeOutInElastic
         */
        easeOutInElastic: function(t, b, c, d, a, p) {
            if(t < d/2) return tm.anim.easing.easeOutElastic(t*2, b, c/2, d, a, p);
            return tm.anim.easing.easeInElastic((t*2)-d, b+c/2, c/2, d, a, p);
        },

        /**
         * @property
         * easeInBack
         */
        easeInBack: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },

        /**
         * @property
         * easeOutBack
         */
        easeOutBack: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },

        /**
         * @property
         * easeInOutBack
         */
        easeInOutBack: function(t, b, c, d, s) {
            if(s == undefined) s = 1.70158;
            if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },

        /**
         * @property
         * easeOutInBack
         */
        easeOutInBack: function(t, b, c, d, s) {
            if(t < d/2) return tm.anim.easing.easeOutBack(t*2, b, c/2, d, s);
            return tm.anim.easing.easeInBack((t*2)-d, b+c/2, c/2, d, s);
        },

        /**
         * @property
         * easeInBounce
         */
        easeInBounce: function(t, b, c, d) {
            return c - tm.anim.easing.easeOutBounce(d-t, 0, c, d) + b;
        },

        /**
         * @property
         * easeOutBounce
         */
        easeOutBounce: function(t, b, c, d) {
            if((t/=d) <(1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if(t <(2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if(t <(2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },

        /**
         * @property
         * easeInOutBounce
         */
        easeInOutBounce: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeInBounce(t*2, 0, c, d) * .5 + b;
            else return tm.anim.easing.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
        },

        /**
         * @property
         * easeOutInBounce
         */
        easeOutInBounce: function(t, b, c, d) {
            if(t < d/2) return tm.anim.easing.easeOutBounce(t*2, b, c/2, d);
            return tm.anim.easing.easeInBounce((t*2)-d, b+c/2, c/2, d);
        }
    };
    
})();







