
tm.define("tests.spine.TestScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var loader = tm.asset.Loader();

        loader.onload = function() {
        	// this.setup2();

        	var spineElement = tm.spine.Element({
	        	frames: "frames_spineboy",
	        	image: "img_spineboy",
	        	anim: "anim_spineboy",
        	}).addChildTo(this).setPosition(320, 400);

			this.onpointingstart = function() {
				spineElement.setAnimationByName(0, "jump", false);
				spineElement.addAnimationByName(0, "walk", true, 0);
			};

			spineElement.setMixByName("walk", "jump", 0.2);
			spineElement.setMixByName("jump", "walk", 0.4);

			spineElement.setAnimationByName(0, "walk", true);
        }.bind(this);

        loader.load({
        	frames_spineboy: "anim/spineboy.json",
        	img_spineboy: "anim/spineboy.png",
        	anim_spineboy: "anim/spineboy.anim",
        });
    },
});
