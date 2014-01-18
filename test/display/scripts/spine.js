
tm.asset.Loader.register("anim", function(path) {
	return tm.util.File({
		url:path,
		dataType: "json",
	});
})


tm.define("tests.spine.TestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var loader = tm.asset.Loader();

        loader.onload = function() {
        	this.setup2();
        }.bind(this);

        loader.load({
        	frames_spineboy: "anim/spineboy.json",
        	img_spineboy: "anim/spineboy.png",
        	anim_spineboy: "anim/spineboy.anim",
        });
    },

    setup2: function() {
    	var anim = tm.asset.Manager.get("anim_spineboy").data;

    	var spineJsonParser = new spine.SkeletonJson();
    	var skeletonData = spineJsonParser.readSkeletonData(anim);
    	console.dir(skeletonData);

    	this.skeleton = new spine.Skeleton(skeletonData);
    	this.skeleton.updateWorldTransform();

	    this.stateData = new spine.AnimationStateData(skeletonData);
	    this.state = new spine.AnimationState(this.stateData);

	    this.root = tm.display.CanvasElement().addChildTo(this);
	    this.root.setPosition(320, 400);

	    this.slotContainers = [];

	    for (var i = 0, n = this.skeleton.drawOrder.length; i < n; i++) {
	        var slot = this.skeleton.drawOrder[i];
	        var attachment = slot.attachment;
	        var slotContainer = new tm.display.CanvasElement();
	        this.slotContainers.push(slotContainer);
	        this.root.addChild(slotContainer);
	        if (!(attachment instanceof spine.RegionAttachment)) {
	            continue;
	        }
	        var spriteName = attachment.rendererObject.name;
	        var sprite = this.createSprite(slot, attachment.rendererObject);
	        slot.currentSprite = sprite;
	        slot.currentSpriteName = spriteName;
	        slotContainer.addChild(sprite);
	    }


		this.stateData.setMixByName("walk", "jump", 0.2);
		this.stateData.setMixByName("jump", "walk", 0.4);

		this.state.setAnimationByName(0, "walk", true);

		this.onpointingstart = function() {
			this.state.setAnimationByName(0, "jump", false);
			this.state.addAnimationByName(0, "walk", true, 0);
		};

		this.onenterframe = function() {
		    this.updateTransform();

		};
    },

    createSprite: function (slot, descriptor) {
    	var frames = tm.asset.Manager.get("frames_spineboy").data.frames;
	    var frame = frames[descriptor.name].frame;
    	var sprite = tm.display.Sprite("img_spineboy");
	    sprite.scale = descriptor.scale;
	    sprite.rotation = descriptor.rotation*180/Math.PI;

	    console.log(sprite.rotation);

	    sprite.srcRect.x = frame.x;
	    sprite.srcRect.y = frame.y;
	    sprite.srcRect.width = frame.w;
	    sprite.srcRect.height = frame.h;

	    sprite.width =frame.w;
	    sprite.height=frame.h;

	    slot.sprites = slot.sprites || {};
	    slot.sprites[descriptor.name] = sprite;

	    return sprite;
    },

    updateTransform: function() {
	    this.lastTime = this.lastTime || Date.now();
	    var timeDelta = (Date.now() - this.lastTime) * 0.001;
	    this.lastTime = Date.now();
	    this.state.update(timeDelta);
	    this.state.apply(this.skeleton);
	    this.skeleton.updateWorldTransform();

	    var drawOrder = this.skeleton.drawOrder;
	    for (var i = 0, n = drawOrder.length; i < n; i++) {
	        var slot = drawOrder[i];
	        var attachment = slot.attachment;
	        var slotContainer = this.slotContainers[i];
	        if (!(attachment instanceof spine.RegionAttachment)) {
	            slotContainer.visible = false;
	            continue;
	        }

	        if (attachment.rendererObject) {
	            if (!slot.currentSpriteName || slot.currentSpriteName != attachment.name) {
	                var spriteName = attachment.rendererObject.name;
	                if (slot.currentSprite !== undefined) {
	                    slot.currentSprite.visible = false;
	                }
	                slot.sprites = slot.sprites || {};
	                if (slot.sprites[spriteName] !== undefined) {
	                    slot.sprites[spriteName].visible = true;
	                } else {
	                    var sprite = this.createSprite(slot, attachment.rendererObject);
	                    slotContainer.addChild(sprite);
	                }
	                slot.currentSprite = slot.sprites[spriteName];
	                slot.currentSpriteName = spriteName;
	            }
	        }
	        slotContainer.visible = true;

	        var bone = slot.bone;

	        slotContainer.position.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
	        slotContainer.position.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
	        slotContainer.position.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
	        slotContainer.position.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
	        slotContainer.position.y*= -1;
	        slotContainer.scale.x = bone.worldScaleX;
	        slotContainer.scale.y = bone.worldScaleY;

	        slotContainer.rotation = -(slot.bone.worldRotation);
	    }
    },

    setup: function() {
    	var frames = tm.asset.Manager.get("frames_spineboy").data;
    	var anim = tm.asset.Manager.get("anim_spineboy").data;

    	var sprites = {};

    	sprites.hip = tm.display.CanvasElement().addChildTo(this);

    	sprites.hip.setPosition(200, 200);

    	for (var key in frames.frames) {
    		var value = frames.frames[key];
    		var frame = value.frame;

//    		var sprite = tm.display.Sprite("img_spineboy").addChildTo(this);
    		var sprite = tm.display.Sprite("img_spineboy");

    		sprite.width = frame.w;
    		sprite.height = frame.h;

    		// sprite.setOrigin(0, 0);

    		sprite.srcRect.set(frame.x, frame.y, frame.w, frame.h);

    		// sprite.x = Math.rand(0, 300);
    		// sprite.y = Math.rand(0, 300);

    		sprites[ key.replace(/-/g, ' ') ] = sprite;

//    		sprite.hide();
    	}

    	sprites.head.visible = true;
    	sprites.torso.visible = true;
    	sprites.neck.visible = true;

    	anim.bones.each(function(bone) {
    		if (!bone.parent) {
    			return ;
    		}

    		var parent = sprites[bone.parent];
    		var child = sprites[bone.name];

    		if (!parent) return ;
    		if (!child) return ;

    		var v = tm.geom.Vector2();

    		v.setAngle(-bone.rotation, bone.length);
    		child.x = v.x;
    		child.y = v.y;

    		if (child.visible == false) return ;

    		console.dir(bone);

    		child.x = bone.x;
    		child.y = bone.y;
    		// child.rotation = bone.rotation+90;

    		console.log(child.rotation);

    		parent.addChild(child);
    	}.bind(this));

    	for (var key in anim.skins.default) {
    		var value = anim.skins.default[key];
    		var info  = value[key.replace(/ /g, '-')];
    		var sprite = sprites[key];

    		console.dir(info);

    		// sprite.x = info.x;
    		// sprite.y = info.y;
    		sprite.width = info.width;
    		sprite.height = info.height;
    		sprite.rotation = -info.rotation * Math.PI / 180
    	}

    },
});
