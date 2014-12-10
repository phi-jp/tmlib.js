/*
 * 
 */

tm.define("tests.shape.init", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.Shape",
                    init: {
                        width: 640,
                        height: 960,
                        bgColor: "red",
                    },
                    originX: 0,
                    originY: 0,
                }
            }
        });

        this.shape = tm.display.Shape().addChildTo(this).setPosition(100, 100);
        this.shape.autoRender = true;
        this.shape.bgColor = "blue";
    },

    onpointingstart: function() {
        this.shape.bgColor = "yellow";
    },
});

tm.define("tests.shape.circle", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        tm.display.CircleShape().addChildTo(this).setPosition(100, 100);

        this.circle = tm.display.CircleShape({
            width: 200,
            height: 200,
            lineWidth: 16,
        }).addChildTo(this).setPosition(200, 100);
        this.circle.bgColor = "#444";
    },

    onpointingstart: function() {
        this.circle.fillStyle = "blue";
        this.circle.height = 100;
    }
});

    


tm.define("tests.shape.triangle", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.shape = tm.display.TriangleShape({
            width: 300,
            height: 300,
            lineWidth: 4,
        }).addChildTo(this).setPosition(320, 480);
        this.shape.bgColor = "#444";
    },

    onenter: function() {
        this.shape.bgColor = "#444444";
        this.shape.fillStyle = "#00ff00";
        this.shape.strokeStyle = "#ffffff";

        var gui = this.app.enableDatGUI();

        gui.add(this.shape, 'width', 0, 512).step(1).onChange(onchange);
        gui.add(this.shape, 'height', 0, 512).step(1).onChange(onchange);
    },

});


tm.define("tests.shape.rectangle", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.shape = tm.display.RectangleShape({
            width: 300,
            height: 300,
            lineWidth: 16,
        }).addChildTo(this).setPosition(320, 480);
        this.shape.bgColor = "red";
    },

    onpointingstart: function() {
        this.shape.fillStyle = "gold";
    },
});

tm.define("tests.shape.roundrectangle", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.shape = tm.display.RoundRectangleShape({
            width: 300,
            height: 300,
            lineWidth: 16,
        }).addChildTo(this).setPosition(320, 480);
        // this.shape.bgColor = "red";
    },

    onpointingstart: function() {
        this.shape.fillStyle = "gold";
        this.shape.cornerRadius += 10;
    },
});

tm.define("tests.shape.star", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.shape = tm.display.StarShape({
            width: 300,
            height: 300,
            lineWidth: 4,
        }).addChildTo(this).setPosition(320, 480);
        this.shape.bgColor = "#444";
    },

    onpointingstart: function() {
        this.shape.sides += 1;
    }
});


tm.define("tests.shape.polygon", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.shape = tm.display.PolygonShape({
            width: 300,
            height: 300,
            lineWidth: 16,
        }).addChildTo(this).setPosition(320, 480);
    },

    onenter: function() {
        this.shape.bgColor = "#ffffff";
        this.shape.fillStyle = "#444444";
        this.shape.strokeStyle = "#cccccc";

        var gui = this.app.enableDatGUI();

        gui.add(this.shape, 'width', 0, 512).step(1);
        gui.add(this.shape, 'height', 0, 512).step(1);
        gui.addColor(this.shape, 'bgColor');


        gui.addColor(this.shape, 'fillStyle');
        gui.addColor(this.shape, 'strokeStyle');
        gui.add(this.shape, 'lineWidth', 0, 32).step(1);

        gui.add(this.shape, 'sides', -10, 10).step(1);
    },
});


tm.define("tests.shape.heart", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.shape = tm.display.HeartShape({
            width: 300,
            height: 300,
            lineWidth: 8,
        }).addChildTo(this).setPosition(320, 480);
    },

    onenter: function() {
        this.shape.bgColor = "#444444";
        this.shape.fillStyle = "#FFC0CB";
        this.shape.strokeStyle = "#ffffff";

        var gui = this.app.enableDatGUI();

        gui.add(this.shape, 'width', 0, 512).step(1);
        gui.add(this.shape, 'height', 0, 512).step(1);
        gui.addColor(this.shape, 'bgColor');


        gui.addColor(this.shape, 'fillStyle');
        gui.addColor(this.shape, 'strokeStyle');
        gui.add(this.shape, 'lineWidth', 0, 32).step(1);
        gui.add(this.shape, 'cornerAngle', 0, 90).step(1);

    },
});



tm.define("tests.shape.text", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        this.shape = tm.display.TextShape({
            lineWidth: 8,
            shadowBlur: 4,
            shadowColor: "red",
        }).addChildTo(this).setPosition(320, 480);
    },

    onenter: function() {
        this.shape.bgColor = "#444444";
        this.shape.fillStyle = "#000000";
        this.shape.strokeStyle = "#ffffff";

        var gui = this.app.enableDatGUI();
        var onchange = this.shape.fit.bind(this.shape)

        gui.add(this.shape, 'text').onChange(onchange);
        gui.add(this.shape, 'fontSize', 0, 128).step(1).onChange(onchange);
        gui.add(this.shape, 'fontWeight').onChange(onchange);
        gui.add(this.shape, 'fontFamily').onChange(onchange);
    },
});


