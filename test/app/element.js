


testhelper.describe("tm.app.Element", function() {

    testhelper.it("getChildIndex", function() {
        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();
                
                var group = tm.display.CanvasElement().addChildTo(this);
                group.setOrigin(0, 0);
                group.setPosition(100, 100);
                
                var elm1 = tm.display.CanvasElement().addChildTo(group);
                var elm2 = tm.display.CanvasElement().addChildTo(group);
                var elm3 = tm.display.CanvasElement().addChildTo(group);

                console.log(group.getChildIndex(elm1));
                console.log(group.getChildIndex(elm2));
                console.log(group.getChildIndex(elm3));
            },
        });
    });

    testhelper.it("getChildAt", function() {
        tm.define("MainScene", {
            superClass: "tm.app.Scene",
         
            init: function() {
                this.superInit();
                
                var group = tm.display.CanvasElement().addChildTo(this);
                group.setOrigin(0, 0);
                group.setPosition(100, 100);
                
                var elm1 = tm.display.CanvasElement().addChildTo(group);
                elm1.name = 'no.1';
                var elm2 = tm.display.CanvasElement().addChildTo(group);
                elm2.name = 'no.2';
                var elm3 = tm.display.CanvasElement().addChildTo(group);
                elm3.name = 'no.3';

                console.log(group.getChildAt(0).name);
                console.log(group.getChildAt(1).name);
                console.log(group.getChildAt(2).name);
                console.log(group.getChildAt(-1).name);
            },
        });
    });

});
