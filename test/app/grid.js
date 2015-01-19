


testhelper.describe("tm.app.Grid", function() {

    testhelper.it("reposition", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();

                var grid = tm.app.Grid().addChildTo(this);

                grid.x = 100;
                grid.y = 100;

                grid.maxPerLine = 12;
                grid.arrangement = "vertical";

                (36).times(function(i) {
                    var color = "hsl({0}, 80%, 50%)".format(360/36*i)
                    var shape = tm.display.CircleShape({
                        fillStyle: color,
                    }).addChildTo(grid);
                });

                grid.reposition();
            },

        });


    });
});