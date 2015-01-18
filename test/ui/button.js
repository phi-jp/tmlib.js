/*
 *
 */



testhelper.describe("tm.ui.FlatButton", function() {

    testhelper.it("init", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",

            init: function() {
                this.superInit();
                var button = tm.ui.FlatButton().addChildTo(this).setPosition(SCREEN_CENTER_X, SCREEN_CENTER_Y);
                button.onpush = function() {
                	console.log('pushed');
                };
            },
        });

    });

    testhelper.it("fillStyle", function() {

        tm.define("MainScene", {
            superClass: "tm.app.Scene",

            init: function() {
                this.superInit();

                (3).times(function(i) {
                	var x = [SCREEN_CENTER_X-200, SCREEN_CENTER_X, SCREEN_CENTER_X+200][i];
                	var y = SCREEN_CENTER_Y;
                	var color = ['red', 'green', 'blue'][i];
	                var button = tm.ui.FlatButton({
	                	width: 160,
	                	height: 160,
	                	text: color,
	                	fillStyle: color,
	                }).addChildTo(this).setPosition(x, y);

	                button.onpush = function() {
	                	console.log('pushed ' + color);
	                };
                }, this);
            },
        });

    });

});
