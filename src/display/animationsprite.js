/*
 * animationsprite.js
 */


tm.display = tm.display || {};


(function() {

    /**
     * @class tm.display.AnimationSprite
     * スプライトアニメーションクラス
     * @extends tm.display.CanvasElement
     */
    tm.display.AnimationSprite = tm.createClass({
        superClass: tm.display.CanvasElement,

        /**
         * @constructor
         * コンストラクタ
         */
        init: function(ss, width, height) {
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
         * @property
         * 描画
         */
        draw: function(canvas) {
            var srcRect = this.ss.getFrame(this.currentFrame);
            var element = this.ss.image.element;

            canvas.drawImage(element,
                srcRect.x, srcRect.y, srcRect.width, srcRect.height,
                -this.width*this.originX, -this.height*this.originY, this.width, this.height);
        },

        /**
         * @property
         * @TODO ?
         */
        gotoAndPlay: function(name) {
            name = (name !== undefined) ? name : "default";

            this.paused = false;
            this.currentAnimation = this.ss.animations[name];
            this.currentFrame = 0;
            this.currentFrameIndex = 0;
            this._normalizeFrame();

            return this;
        },

        /**
         * @property
         * @TODO ?
         */
        gotoAndStop: function(name) {
            name = (name !== undefined) ? name : "default";

            this.paused = true;
            this.currentAnimation = this.ss.animations[name];
            this.currentFrame = 0;
            this.currentFrameIndex = 0;
            this._normalizeFrame();

            return this;
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
        _updateFrame: function() {
            this.currentFrameIndex += 1;
            this._normalizeFrame();
        },

        /**
         * @property
         * @TODO ?
         * @private
         */
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

