

tm.define("tests.pointing.touches", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        (5).times(function() {
            tm.display.CircleShape(200, 200).addChildTo(this).hide();
        }, this);
        
    },

    update: function(app) {
        var childs = this.children;
        var p = app.pointing;

        if (p.touches.length) {
            childs.each(function(elm) {elm.hide();});

            p.touches.each(function(p, i) {
                var child = childs[i];
                child.show();
                child.x = p.x;
                child.y = p.y;
            });
        }
    },

    draw: function(c) {
        console.log("hoge");
    },

});