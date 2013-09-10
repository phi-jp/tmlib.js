tm.define("tests.collision.test", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();

        var player = tm.display.CircleShape().addChildTo(this);
        player.update = function(app) {
            this.x = app.pointing.x;
            this.y = app.pointing.y;
        };
        player.oncollisionenter =
        player.oncollisionstay =
        player.oncollisionexit = function(e) {
            console.log(e.type);
        };

        for (var i=0; i<10; ++i) {
	        var enemy = tm.display.PolygonShape().addChildTo(this);
            player.collision.add(enemy);
            enemy.x = Math.rand(0, 640);
            enemy.y = Math.rand(0, 480);
        }
        
        player.oncollisionexit = function(e) {
            console.log(e.type);
            // 衝突したオブジェクトを削除
            e.other.remove();
            // ちゃんとプレイヤーに登録していた衝突リストからも削除
            player.collision.remove(e.other);
        };

    }
});
