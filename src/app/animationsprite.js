/*
 * animationsprite.js
 */


tm.app = tm.app || {};


(function() {

    /**
     * @class
     * AnimationSprite
     */
    tm.app.AnimationSprite = tm.createClass({

        superClass: tm.app.CanvasElement,

        /**
         * 初期化
         */
        init: function(ss, width, height)
        {
            this.superInit();

            if (typeof ss == "string") {
                var ss = tm.asset.AssetManager.get(ss);
                console.assert(ss, "not found " + ss);
            }

            console.assert(typeof ss == "object", "AnimationSprite の第一引数はスプライトシートもしくはスプライトシート名に変わりました");

            this.ss = ss;

            this.width  = width || ss.frame.width;
            this.height = height|| ss.frame.height;

            this.currentFrame = 0;
            this.currentFrameIndex = 0;
            this.paused = true;

            this.currentAnimation = null;

            this.addEventListener("enterframe", function(e) {
                if (!this.paused && e.app.frame%this.currentAnimation.frequency === 0) {
                    this._updateFrame();
                }
            });
        },

        /**
         * 描画
         */
        draw: function(canvas) {
            var srcRect = this.ss.getFrame(this.currentFrame);
            var element = this.ss.image.element;

            canvas.drawImage(element,
                srcRect.x, srcRect.y, srcRect.width, srcRect.height,
                -this.width*this.originX, -this.height*this.originY, this.width, this.height);
        },

        gotoAndPlay: function(name) {
            name = name || "default";

            this.paused = false;
            this.currentAnimation = this.ss.animations[name];
            this.currentFrame = 0;
            this.currentFrameIndex = 0;
            this._normalizeFrame();

            return this;
        },

        gotoAndStop: function(name) {
            name = name || "default";

            this.paused = true;
            this.currentAnimation = this.ss.animations[name];
            this.currentFrame = 0;
            this.currentFrameIndex = 0;
            this._normalizeFrame();

            return this;
        },

        _updateFrame: function() {
            this.currentFrameIndex += 1;
            this._normalizeFrame();
        },

        _normalizeFrame: function() {
            var anim = this.currentAnimation;
            if (anim) {
                if (this.currentFrameIndex < anim.frames.length) {
                    this.currentFrame = anim.frames[this.currentFrameIndex];
                }
                else {
                    if (anim.next) {
                        this.gotoAndPlay(anim.next);
                    }
                    else {
                        this.currentFrameIndex = anim.frames.length - 1;
                        this.currentFrame = anim.frames[this.currentFrameIndex];
                        this.paused = true;
                    }
                    // dispatch animationend
                    var e = tm.event.Event("animationend");
                    this.dispatchEvent(e);
                }
            }
        },

    });

})();


(function() {

    tm.app.SpriteSheet = tm.createClass({
        superClass: tm.event.EventDispatcher,

        init: function(param) {
            this.superInit();
            this.frame = param.frame;

            if (typeof param.image == "string") {
                if (!tm.asset.AssetManager.contains(param.image)) {
                    tm.asset.AssetManager.load(param.image);
                }
                this.image = tm.asset.AssetManager.get(param.image);
            }
            else {
                this.image = param.image;
            }

            if (this.image.loaded === false) {
                this.image.addEventListener("load", function() {
                    this._calcFrames(param.frame);
                    var e = tm.event.Event("load");
                    this.dispatchEvent(e);
                }.bind(this), false);
            }
            else {
                this._calcFrames(param.frame);
                var e = tm.event.Event("load");
                this.dispatchEvent(e);
            }

            this._calcAnim(param.animations);
        },

        getFrame: function(index) {
            return this.frames[index];
        },

        getAnimation: function(name) {
            return this.animations[name];
        },

        _calcFrames: function(frame) {
            var frames = this.frames = [];

            var w = frame.width;
            var h = frame.height;
            var row = ~~(this.image.width / w);
            var col = ~~(this.image.height/ h);

            if (!frame.count) frame.count = row*col;

            for (var i=0,len=frame.count; i<len; ++i) {
                var x   = i%row;
                var y   = (i/row)|0;
                var rect = {
                    x:x*w,
                    y:y*h,
                    width: w,
                    height: h
                };
                frames.push(rect);
            }
        },

        _calcAnim: function(animations) {
            this.animations = [];
            for (var key in animations) {
                var anim = animations[key];

                if (anim instanceof Array) {
                    this.animations[key] = {
                        frames: [].range(anim[0], anim[1]),
                        next: anim[2],
                        frequency: anim[3] || 1
                    };
                }
                else {
                    this.animations[key] = {
                        frames: anim.frames,
                        next: anim.next,
                        frequency: anim.frequency || 1
                    };
                }
            }

            // デフォルトアニメーション
            this.animations["default"] = {
                frames: [].range(0, this.frame.count),
                next: "default",
                frequency: 1,
            };
        }

    });

})();
