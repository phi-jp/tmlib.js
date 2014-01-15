
tm.define("tests.canvaselement.draw", {
    superClass: "tm.app.Scene",
    
    init: function() {
        this.superInit();
        
        this.elm = tm.display.CanvasElement().addChildTo(this);
        this.elm.draw = function(c) {
            c.fillCircle(100, 100, 100);
        };
    }
})


tm.define("tests.canvaselement.fromJSON", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var loader = tm.asset.Loader();
        loader.onload = function() {
            this.setup();
        }.bind(this);
        loader.load("dummy", "http://dummyimage.com/128x128/0000ff/fff.png&text=dummy.png");
    },

    setup: function() {
        
        this.fromJSON({
            children: [
                {
                    type: "Label",
                    name: "titleLabel",
                    x   : SCREEN_CENTER_X,
                    y   : 100,
                    width: SCREEN_WIDTH,
                    height: 50,
                    text: "Title",
                    align: "center",
                    fontSize: 40,
                },
                {
                    type: "tm.display.Label",
                    name: "titleLabel",
                    x   : SCREEN_CENTER_X,
                    y   : 100,
                    width: SCREEN_WIDTH,
                    height: 50,
                    text: "Title",
                    align: "center",
                    fontSize: 40,
                },
                {
                    type: "tm.ui.LabelButton",
                    name: "button00",
                    x   : SCREEN_CENTER_X,
                    y   : 200,
                    width: 150,
                    height: 50,
                    fillStyle: "red",
                    shadowBlur: 10,
                    shadowColor: "white",
                    text: "Item00",
                    align: "center",
                    fontSize: 20,
                },
                {
                    type: "tm.ui.LabelButton",
                    name: "button01",
                    x   : SCREEN_CENTER_X,
                    y   : 260,
                    width: 150,
                    height: 50,
                    fillStyle: "green",
                    shadowBlur: 10,
                    shadowColor: "white",
                    text: "Item01",
                    align: "center",
                    fontSize: 20,
                },
                {
                    type: "tm.ui.LabelButton",
                    name: "button02",
                    x   : SCREEN_CENTER_X,
                    y   : 320,
                    width: 150,
                    height: 50,
                    fillStyle: "blue",
                    shadowBlur: 10,
                    shadowColor: "white",
                    text: "Item02",
                    align: "center",
                    fontSize: 20,
                },
                {
                    type: "tm.display.Label",
                    name: "textLabel",
                    x   : SCREEN_CENTER_X,
                    y   : 400,
                    width: SCREEN_WIDTH,
                    height: 50,
                    fillStyle: "white",
                    text: "Text Text Text Text Text Text Text Text",
                    align: "center",
                    fontSize: 15,
                },
                {
                    type: "tm.display.Sprite",
                    name: "icon",
                    x   : 560,
                    y   : 400,
                    image: "dummy",
                    width: 100,
                    height: 100,
                },
            ],
        });
    },
});





