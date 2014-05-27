

tm.define("TestScene", {
    superClass: "tm.app.Scene",

    init: function(param) {
        this.superInit();

        this.name = param.name;

        this.label = tm.display.Label("name: {name}".format(param))
            .setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y)
            .addChildTo(this);
    },

    onpointingstart: function() {
        this.app.popScene();
    },
});


tm.define("tests.managerscene.test", {
    superClass: "tm.scene.ManagerScene",
 
    init: function() {
        this.superInit({
            scenes: [
                {
                    className: "TestScene",
                    arguments: {
                        name: "Title",
                    },
                    label: "title",
                },
                {
                    className: "TestScene",
                    arguments: {
                        name: "Game",
                    },
                    label: "game",
                },
                {
                    className: "TestScene",
                    arguments: {
                        name: "Result",
                    },
                    label: "result",
                    nextLabel: "title",
                },
            ],
        });
    },

    // onstart: function() {
    //     this.gotoScene(0);
    // },

    // onnext: function(e) {
    //     if (this.getCurrentLabel() == "result") {
    //         alert("終わり");
    //     }
    //     else {
    //         this.gotoNext();
    //     }
    // },

    onfinish: function() {
        console.log("finish!");
    }
});
