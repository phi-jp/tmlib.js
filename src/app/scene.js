/*
 * scene.js
 */

tm.app = tm.app || {};



(function() {
    
    /**
     * @class
     * シーンとして使用するゲームエレメントクラス
     */
    tm.app.Scene = tm.createClass({
        
        superClass: tm.app.CanvasElement,
        
        /**
         * 初期化
         */
        init: function() {
            this.superInit();
        },
        
    });
    
    tm.app.StartScene = tm.createClass({
        
        superClass: tm.app.Scene,
        
        init: function() {
            this.superInit();
            
        },
        
        onenter: function(e) {
            var label = tm.app.Label("Start");
            label.x = e.app.canvas.width/2;
            label.y = e.app.canvas.height/2;
            label.width = e.app.canvas.width;
            label.align     = "center";
            label.baseline  = "middle";
            this.addChild(label);
            
            // タッチに反応させる
            this.width  = e.app.canvas.width;
            this.height = e.app.canvas.height;
            this.interact();
            
            this.app = e.app;
        },
        
        onmousedown: function(e) {
            this.app.popScene();
        },
    });
    
    
    tm.app.EndScene = tm.createClass({
        
        superClass: tm.app.Scene,
        
        init: function() {
            this.superInit();
        },
        
        onenter: function(e) {
            var label = tm.app.Label("end");
            label.x = e.app.canvas.width/2;
            label.y = e.app.canvas.height/2;
            label.width = e.app.canvas.width;
            label.align     = "center";
            label.baseline  = "middle";
            this.addChild(label);
            // タッチに反応させる
            this.width  = e.app.canvas.width;
            this.height = e.app.canvas.height;
            this.interact();
            
            this.app = e.app;
        },
        
        
        onmousedown: function(e) {
            //this.app.popScene();
        },
    });
    
})();
