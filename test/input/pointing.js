

tm.define("tests.pointing.touches", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        // 10 個要素を生成 
        (10).times(function() {
            tm.display.CircleShape(200, 200).addChildTo(this).hide();
        }, this);
        
    },

    update: function(app) {
        var childs = this.children;
        var p = app.pointing;

        // マルチタッチ判定
        if (p.touches.length) {
            // 全ての要素を一旦非表示
            childs.each(function(elm) {elm.hide();});

            // タッチしている個数だけ表示 & 位置調整
            p.touches.each(function(p, i) {
                var child = childs[i];
                child.show();
                child.x = p.x;
                child.y = p.y;
            });
        }
    },

});