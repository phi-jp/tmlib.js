
tm.define("tests.titlescene.test", {
    superClass: "tm.scene.TitleScene",
 
    init: function() {
        this.superInit({
            // title: "hoge",
            // width: SCREEN_WIDTH,
            // height: SCREEN_HEIGHT,
            // bgColor: "red",
            // titleColor: "#222",
        });
    },

    onfinish: function() {
        console.log("finish!");
    }
});


