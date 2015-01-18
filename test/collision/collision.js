/*
 *
 */



testhelper.describe("tm.collision", function() {

    testhelper.it("testCircleRect", function() {

		// シーンを定義
		tm.define("MainScene", {
		    superClass: "tm.app.Scene",
		    
		    init: function() {
		        this.superInit();
		        
		        // rect
		        this.rect = tm.display.RectangleShape({
		            width: 400,
		            height: 160,
		            fillStyle: "transparent",
		        }).addChildTo(this);
		        this.rect.x = 320;
		        this.rect.y = 300;
		        
		        // cicle
		        this.circle = tm.display.CircleShape({
		            width: 100,
		            height: 100,
		            fillStyle: "transparent",
		        }).addChildTo(this);
		        // 真ん中にセット
		        this.circle.setPosition(320, 480);
		    },
		    
		    update: function(app) {
		        // タッチした位置に移動させる
		        var pointing = app.pointing;
		        // タッチしているかを判定
		        if (pointing.getPointing()) {
		            // タッチした位置に徐々に近づける
		            this.circle.x = pointing.x;
		            this.circle.y = pointing.y;
		        }
		        
		        // 円と矩形の衝突判定
		        if (tm.collision.testCircleRect(this.circle, this.rect)) {
		            this.circle.fillStyle = "red";
		        }
		        else {
		            this.circle.fillStyle = "transparent";
		        }
		    }
		});

    });
});
