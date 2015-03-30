

testhelper.describe("tm.sound.SoundManager", function() {

    testhelper.it("play", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
            
            init: function() {
                this.superInit();
                var loader = tm.asset.Loader();
                loader.onload = this._init.bind(this);
                loader.load({ "sample": "../resource/se/puu89.mp3", });
            },
            _init: function() {
                var button = tm.ui.FlatButton().addChildTo(this);

                button.x = SCREEN_CENTER_X;
                button.y = SCREEN_CENTER_Y;

                button.onpush = function() {
                    tm.sound.SoundManager.play('sample');
                };
            },
        });
        
    });
});
