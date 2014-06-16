


/*
 * titlescene
 */

tm.define("tests.titlescene.test", {
    superClass: "tm.scene.TitleScene",
 
    init: function() {
        this.superInit({
            title: "hoge",
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            // bgColor: "red",
            // fontColor: "#222",
        });
    },

    onfinish: function() {
        console.log("finish!");
    }
});




/*
 * resultscene
 */

tm.define("tests.resultscene.test", {
    superClass: "tm.scene.ResultScene",
 
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





/*
 * numericalinputscene
 */

tm.define("tests.numericalinputscene.test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

    },

    onenter: function() {
        var scene = tm.scene.NumericalInputScene();
        scene.ondecided = function(e) {
            alert(e.value);
        };
        this.app.pushScene(scene);
    },

});






/*
 * managerscene.js
 */
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
                    className: "tm.scene.ResultScene",
                    arguments: {
                        name: "Result",
                    },
                    label: "result",
                    nextLabel: "title",
                },
            ],
        });
    },

    ongoto: function(e) {
        console.log(this.currentScene.name);
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
