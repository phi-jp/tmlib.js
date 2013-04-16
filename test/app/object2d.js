tm.define("tests.object2d.OriginTest", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        
        var shape = tm.app.CircleShape().addChildTo(this);
        shape.originX = 0;
    },

});
