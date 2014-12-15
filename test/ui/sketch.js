/*
 *
 */



testhelper.describe("tm.ui.Sketch", function() {

    testhelper.it("penColor", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",

            init: function() {
                this.superInit();
                
                this.sketch = tm.ui.Sketch({
                    width: 300,
                    height: 300,
                }).addChildTo(this);
                this.sketch.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
                
                this.sketch.penColor = "red";
            },
        });

    });

    testhelper.it("bgColor", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",

            init: function() {
                this.superInit();
                
                this.sketch = tm.ui.Sketch({
                    width: 300,
                    height: 300,
                }).addChildTo(this);
                this.sketch.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
                
                this.sketch.bgColor = "green";
            },
        });

    });

    testhelper.it("lineWidth", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",

            init: function() {
                this.superInit();
                
                this.sketch = tm.ui.Sketch({
                    width: 300,
                    height: 300,
                }).addChildTo(this);
                this.sketch.setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
                
                this.sketch.lineWidth = 64;
            },
        });

    });

});
