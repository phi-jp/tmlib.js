

(function() {
    
    tm.define("tm.asset.SpriteSheet", {

        superClass: "tm.event.EventDispatcher",

        init: function(src) {
            this.superInit();

            if (typeof src == "string") {
            	this.load(src);
            }
            else {
	            this.parse(src);
    			this.loaded = true;
    			this.dispatchEvent(tm.event.Event("load"));
            }

        },

        load: function(path) {
        	tm.util.Ajax.load({
        		url: path,
        		dataType: "json",
        		success: function(d) {
        			this.parse(d);
        			this.loaded = true;
        			this.dispatchEvent(tm.event.Event("load"));
        		}.bind(this),
        	});
        },

        parse: function(param) {
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
            this.animations = {};
            for (var key in animations) {
                var anim = animations[key];

                if (anim instanceof Array) {
                    this.animations[key] = {
                        frames: [].range(anim[0], anim[1]),
                        next: anim[2],
                        frequency: anim[3] || 1
                    };
                }
                else if (typeof anim == "number") {
                    this.animations[key] = {
                        frames: [anim],
                        next: null,
                        frequency: 1
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
